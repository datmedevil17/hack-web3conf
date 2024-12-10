// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DAOToken.sol";

contract StudyDAO {
    address public admin;  // Admin address for upgrading to teacher role

    struct Member {
        uint reputation;
        bool isTeacher;
        bool isStudent;
        string profileURI;
    }

    struct Proposal {
        uint id;
        string description;
        uint256 votes;
        uint256 fundsRaised;
        uint256 goal;
        address proposer;
        bool approved;
        bool fundingCompleted;
        mapping(address => uint256) funders;
        mapping(address => bool) voters;  // Track who voted
    }

    mapping(address => Member) public members;
    mapping(uint => Proposal) public proposals;
    uint public proposalCount;
    mapping(address => uint[]) public funderProposals;

    DAOToken public daoToken;

    uint256 public rewardOnTeacherUpgrade = 200 * 10**18;  // Mint reward when upgraded to teacher
    uint256 public rewardOnApproval = 200 * 10**18;
    uint256 public fundingRewardMultiplier = 2;

    event MemberRegistered(address indexed member, bool isTeacher);
    event TeacherUpgraded(address indexed member);
    event ProposalCreated(uint indexed proposalId, address indexed proposer, string description, uint256 goal);
    event Voted(uint indexed proposalId, address indexed voter, uint256 votes);
    event ProposalFunded(uint indexed proposalId, address indexed funder, uint256 amount);
    event FundingCompleted(uint indexed proposalId, uint256 totalFundsRaised);

    constructor(address _daoToken) {
        daoToken = DAOToken(_daoToken);
        admin = msg.sender;  // Set the deployer as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function registerMember(bool isTeacher, string memory profile) public {
        require(members[msg.sender].reputation == 0, "Member is already registered.");

        members[msg.sender] = Member({
            reputation: 1,
            isTeacher: isTeacher,
            isStudent: !isTeacher,
            profileURI: profile
        });

        // No reward is minted here anymore

        emit MemberRegistered(msg.sender, isTeacher);
    }

    function upgradeToTeacher(address member) public onlyAdmin {
        require(members[member].reputation > 0, "Member must be registered first.");
        require(!members[member].isTeacher, "Member is already a teacher.");

        members[member].isTeacher = true;
        members[member].isStudent = false;  // A teacher can't be a student

        // Mint reward when upgraded to teacher
        daoToken.mint(member, rewardOnTeacherUpgrade);

        emit TeacherUpgraded(member);
    }

    function proposeContent(string memory _description, uint256 _goal) public {
        require(members[msg.sender].isTeacher, "Only teachers can propose content.");

        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.description = _description;
        newProposal.votes = 0;
        newProposal.fundsRaised = 0;
        newProposal.goal = _goal;
        newProposal.proposer = msg.sender;
        newProposal.approved = false;
        newProposal.fundingCompleted = false;

        emit ProposalCreated(proposalCount, msg.sender, _description, _goal);

        proposalCount++;
    }

    function voteForProposal(uint _proposalId) public {
        require(proposals[_proposalId].id == _proposalId, "Invalid proposal ID.");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.approved, "Proposal already approved.");
        require(!proposal.voters[msg.sender], "You have already voted on this proposal.");

        // Vote with reputation
        proposal.votes += members[msg.sender].reputation;
        proposal.voters[msg.sender] = true;  // Mark this user as voted

        emit Voted(_proposalId, msg.sender, members[msg.sender].reputation);

        if (proposal.votes > 3) {
            proposal.approved = true;
            daoToken.mint(proposal.proposer, rewardOnApproval);
        }
    }

    function fundProposal(uint _proposalId) public payable {
        require(proposals[_proposalId].id == _proposalId, "Invalid proposal ID.");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.approved, "Proposal not approved yet.");
        require(!proposal.fundingCompleted, "Funding already completed for this proposal.");

        if (proposal.funders[msg.sender] == 0) {
            funderProposals[msg.sender].push(_proposalId);
        }
        proposal.fundsRaised += msg.value;
        proposal.funders[msg.sender] += msg.value;
        emit ProposalFunded(_proposalId, msg.sender, msg.value);

        if (proposal.fundsRaised >= proposal.goal) {
            proposal.fundingCompleted = true;
            uint256 amount = proposal.fundsRaised;
            proposal.fundsRaised = 0;
            payable(proposal.proposer).transfer(amount);
            distributeRewards(_proposalId);
            emit FundingCompleted(_proposalId, amount);
        }
    }

    function distributeRewards(uint _proposalId) internal {
        Proposal storage proposal = proposals[_proposalId];
        uint256 totalFunds = proposal.goal;

        for (uint i = 0; i < funderProposals[msg.sender].length; i++) {
            uint proposalId = funderProposals[msg.sender][i];
            if (proposalId == _proposalId) {
                uint256 contribution = proposal.funders[msg.sender];

                if (contribution > 0) {
                    uint256 reward = (contribution * fundingRewardMultiplier * 10**18) / totalFunds;
                    daoToken.mint(msg.sender, reward);
                }
            }
        }
    }

    function getFunderContribution(uint _proposalId, address funder) public view returns (uint256) {
        require(proposals[_proposalId].id == _proposalId, "Invalid proposal ID.");
        Proposal storage proposal = proposals[_proposalId];
        return proposal.funders[funder];
    }

    function getProposal(uint _proposalId) public view returns (
        uint id,
        string memory description,
        uint256 votes,
        uint256 fundsRaised,
        uint256 goal,
        address proposer,
        bool approved,
        bool fundingCompleted
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.description,
            proposal.votes,
            proposal.fundsRaised,
            proposal.goal,
            proposal.proposer,
            proposal.approved,
            proposal.fundingCompleted
        );
    }

    function getUserTokenBalance(address user) public view returns (uint256) {
        return daoToken.balanceOf(user);
    }
}

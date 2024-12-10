// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./STDToken.sol";

contract KnowledgeVault {
    enum ResourceCategory { EBOOK, VIDEO, PODCAST, ARTICLE }
    struct Resource {
        uint256 id;
        string title;
        string url;
        string description;
        string[] tags;
        ResourceCategory category;
        address contributor;
        uint256 upvotes;
        uint256 downvotes;
        bool approved;
    }

    struct UserProfile {
        uint256 totalContributions;
        uint256 totalTokensEarned;
    }

    struct Event {
        uint256 id;
        string title;
        string description;
        string date;
        string link;
        uint256 cost; // Event cost in tokens
    }

    uint256 public resourceCount;
    uint256 public eventCount;
    address public admin;
    address public tokenContract;

    uint256 public rewardPerUpvote = 10;

    mapping(uint256 => Resource) public resources;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) public userBookedEvents; // Mapping to track user's booked events

    // Mapping to track whether a user has voted on a specific resource
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ResourceSubmitted(uint256 indexed id, address indexed contributor, string title, ResourceCategory category);
    event ResourceApproved(uint256 indexed id, bool status);
    event TokensRewarded(address indexed contributor, uint256 amount);
    event EventCreated(uint256 indexed eventId, string title, string date, uint256 cost);
    event EventBooked(address indexed user, uint256 indexed eventId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor(address _tokenContract) {
        admin = msg.sender;
        tokenContract = _tokenContract;
    }

    function submitResource(
        string memory _title,
        string memory _url,
        string memory _description,
        string[] memory _tags,
        ResourceCategory _category
    ) external {
        resourceCount++;
        resources[resourceCount] = Resource({
            id: resourceCount,
            title: _title,
            url: _url,
            description: _description,
            tags: _tags,
            category: _category,
            contributor: msg.sender,
            upvotes: 0,
            downvotes: 0,
            approved: false
        });

        userProfiles[msg.sender].totalContributions++;
        emit ResourceSubmitted(resourceCount, msg.sender, _title, _category);
    }

    function getProfile(address _user) external view returns (uint256, uint256) {
        return (
            userProfiles[_user].totalContributions,
            userProfiles[_user].totalTokensEarned
        );
    }

    function createEvent(
        string memory _title,
        string memory _description,
        string memory _date,
        string memory _link,
        uint256 _cost // Event cost in tokens
    ) external onlyAdmin {
        eventCount++;
        events[eventCount] = Event({
            id: eventCount,
            title: _title,
            description: _description,
            date: _date,
            link: _link,
            cost: _cost
        });

        emit EventCreated(eventCount, _title, _date, _cost);
    }

    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    function setRewardPerUpvote(uint256 _reward) external onlyAdmin {
        rewardPerUpvote = _reward;
    }

    function upvoteResource(uint256 _resourceId) external {
        Resource storage resource = resources[_resourceId];
        require(resource.id != 0, "Resource not found");
        require(resource.contributor != msg.sender, "Contributor cannot upvote their own resource");
        require(!hasVoted[_resourceId][msg.sender], "You have already voted on this resource");

        resource.upvotes++;
        uint256 rewardAmount = 10 * 10 ** 18; // Example: reward 10 tokens per upvote
        STDToken(tokenContract).mint(resource.contributor, rewardAmount);

        userProfiles[resource.contributor].totalTokensEarned += rewardAmount;
        hasVoted[_resourceId][msg.sender] = true; // Mark the user as having voted

        emit TokensRewarded(resource.contributor, rewardAmount);
        emit ResourceApproved(_resourceId, true);
    }

    function downvoteResource(uint256 _resourceId) external {
        Resource storage resource = resources[_resourceId];
        require(resource.contributor != msg.sender, "Contributor cannot downvote their own resource");
        require(!hasVoted[_resourceId][msg.sender], "You have already voted on this resource");

        resource.downvotes++;
        hasVoted[_resourceId][msg.sender] = true; // Mark the user as having voted

        emit ResourceApproved(_resourceId, false);
    }

    function bookEvent(uint256 _eventId) external {
        Event storage eventInfo = events[_eventId];
        require(eventInfo.id != 0, "Event not found");

        uint256 eventTicketCost = eventInfo.cost;

        uint256 userBalance = STDToken(tokenContract).balanceOf(msg.sender);
        require(userBalance >= eventTicketCost, "Insufficient tokens");

        STDToken(tokenContract).transferFrom(msg.sender, admin, eventTicketCost);

        // Store the event ID in the user's booked events list
        userBookedEvents[msg.sender].push(_eventId);

        emit EventBooked(msg.sender, eventInfo.id);
    }

    function getBookedEvents(address _user) external view returns (uint256[] memory) {
        return userBookedEvents[_user];
    }
}

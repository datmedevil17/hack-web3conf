const { expect } = require("chai");

describe("StudyDAO Contract", function () {
    let StudyDAO;
    let studyDAO;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function () {
        StudyDAO = await ethers.getContractFactory("StudyDAO");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        studyDAO = await StudyDAO.deploy();
    });

    describe("Member Registration", function () {
        it("Should register a teacher successfully", async function () {
            await expect(studyDAO.connect(addr1).registerMember(true))
                .to.emit(studyDAO, "MemberRegistered")
                .withArgs(addr1.address, true);
            const member = await studyDAO.members(addr1.address);
            expect(member.isTeacher).to.equal(true);
            expect(member.isStudent).to.equal(false);
        });

        it("Should register a student successfully", async function () {
            await expect(studyDAO.connect(addr2).registerMember(false))
                .to.emit(studyDAO, "MemberRegistered")
                .withArgs(addr2.address, false);
            const member = await studyDAO.members(addr2.address);
            expect(member.isStudent).to.equal(true);
            expect(member.isTeacher).to.equal(false);
        });

        it("Should not allow re-registration of the same member", async function () {
            await studyDAO.connect(addr1).registerMember(true);
            await expect(studyDAO.connect(addr1).registerMember(true)).to.be.revertedWith("Member is already registered.");
        });
    });

    describe("Content Proposal Creation", function () {
        beforeEach(async function () {
            await studyDAO.connect(addr1).registerMember(true); // addr1 is a teacher
        });

        it("Should allow a teacher to propose content", async function () {
            await expect(studyDAO.connect(addr1).proposeContent("New Course", 100))
                .to.emit(studyDAO, "ProposalCreated")
                .withArgs(0, addr1.address, "New Course", 100);
            const proposal = await studyDAO.proposals(0);
            expect(proposal.description).to.equal("New Course");
            expect(proposal.goal).to.equal(100);
            expect(proposal.approved).to.equal(false);
        });

        it("Should prevent students from proposing content", async function () {
            await studyDAO.connect(addr2).registerMember(false); // addr2 is a student
            await expect(studyDAO.connect(addr2).proposeContent("Student Proposal", 50)).to.be.revertedWith("Only teachers can propose content.");
        });
    });

    describe("Voting on Proposals", function () {
        beforeEach(async function () {
            await studyDAO.connect(addr1).registerMember(true); // addr1 is a teacher
            await studyDAO.connect(addr1).proposeContent("New Course", 100);
            await studyDAO.connect(addr2).registerMember(false); // addr2 is a student
            await studyDAO.connect(addr3).registerMember(false); // addr3 is a student
        });

        it("Should allow members to vote on proposals", async function () {
            await expect(studyDAO.connect(addr2).voteForProposal(0))
                .to.emit(studyDAO, "Voted")
                .withArgs(0, addr2.address, 1);
            const proposal = await studyDAO.proposals(0);
            expect(proposal.votes).to.equal(1);
        });

        it("Should approve proposal when enough votes are cast", async function () {
            await studyDAO.connect(addr2).voteForProposal(0);
            await studyDAO.connect(addr3).voteForProposal(0);
            const proposal = await studyDAO.proposals(0);
            expect(proposal.approved).to.equal(true);
        });
    });

    describe("Funding Proposals", function () {
        beforeEach(async function () {
            await studyDAO.connect(addr1).registerMember(true); // addr1 is a teacher
            await studyDAO.connect(addr1).proposeContent("New Course", ethers.parseEther("1"));
            await studyDAO.connect(addr2).registerMember(false);
            await studyDAO.connect(addr3).registerMember(false);
            await studyDAO.connect(addr2).voteForProposal(0);
            await studyDAO.connect(addr3).voteForProposal(0); // Proposal is approved
        });

        it("Should allow funding of an approved proposal", async function () {
            await expect(
                studyDAO.connect(addr2).fundProposal(0, { value: ethers.parseEther("0.5") })
            ).to.emit(studyDAO, "ProposalFunded").withArgs(0, addr2.address, ethers.parseEther("0.5"));
            const proposal = await studyDAO.proposals(0);
            expect(proposal.fundsRaised).to.equal(ethers.parseEther("0.5"));
        });

        it("Should complete funding when goal is reached and transfer funds", async function () {
            const initialBalance = await ethers.provider.getBalance(addr1.address);
            await studyDAO.connect(addr2).fundProposal(0, { value: ethers.parseEther("1") });
            const finalBalance = await ethers.provider.getBalance(addr1.address);
            expect(finalBalance).to.be.above(initialBalance);
            const proposal = await studyDAO.proposals(0);
            expect(proposal.fundingCompleted).to.equal(true);
        });
    });

    describe("Student Resources", function () {
        beforeEach(async function () {
            await studyDAO.connect(addr2).registerMember(false); // addr2 is a student
        });

        it("Should allow students to save resources", async function () {
            await studyDAO.connect(addr2).saveResource("ipfs://resource1");
            const resources = await studyDAO.getResources();
            expect(resources[0].resourceURI).to.equal("ipfs://resource1");
        });

        it("Should only allow students to save resources", async function () {
            await studyDAO.connect(addr1).registerMember(true); // addr1 is a teacher
            await expect(studyDAO.connect(addr1).saveResource("ipfs://resource2")).to.be.revertedWith("Only students can save resources.");
        });
    });

    describe("Course Completion and Rewards", function () {
        beforeEach(async function () {
            await studyDAO.connect(addr2).registerMember(false); // addr2 is a student
        });

        it("Should allow students to complete a course and earn tokens", async function () {
            await studyDAO.connect(addr2).completeCourse();
            const tokensEarned = await studyDAO.getTokensEarned();
            expect(tokensEarned).to.equal(10); // courseCompletionReward is 10
        });

        it("Should not allow teachers to complete courses", async function () {
            await studyDAO.connect(addr1).registerMember(true); // addr1 is a teacher
            await expect(studyDAO.connect(addr1).completeCourse()).to.be.revertedWith("Only students can complete courses.");
        });
    });
});

import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrowdFunding = () => {
    const { state, account } = useContext(WalletContext);
    const { contract } = state;
    const [proposals, setProposals] = useState([]);
    const [donationAmounts, setDonationAmounts] = useState({});

    const handleDonationChange = (e, proposalId) => {
        setDonationAmounts({
            ...donationAmounts,
            [proposalId]: e.target.value,
        });
    };

    const donateToProposal = async (proposalId) => {
        const donationAmount = donationAmounts[proposalId];
        if (donationAmount && donationAmount > 0) {
            try {
                const donationInWei = ethers.parseEther(donationAmount.toString());

                const tx = await contract.fundProposal(proposalId, {
                    value: donationInWei,
                });

                await tx.wait(); // Wait for transaction confirmation

                toast.success("Funds added successfully!");
                console.log("Funds added successfully.");
                fetchProposals(); // Refresh proposals to show updated data
            } catch (error) {
                console.log(error)
            }
        } else {
        }
    };

    const fetchProposals = async () => {
        try {
            const proposalCount = await contract.proposalCount();
            const proposals = [];

            for (let index = 0; index < proposalCount; index++) {
                const proposalData = await contract.getProposal(index);

                // Destructuring proposalData
                const [
                    proposalId,
                    detailsUri,
                    votes,
                    fundsRaised,
                    goal,
                    proposer,
                    approved,
                    fundingCompleted
                ] = proposalData;

                // Fetching details from IPFS
                const response = await fetch(detailsUri);
                const details = await response.json();
                const { title, description, timeRequired, researchDocs } = details;

                const proposal = {
                    id: proposalId.toString(),
                    title,
                    description,
                    timeRequired,
                    researchDocs,
                    proposer: `${proposer.slice(0, 6)}...${proposer.slice(-4)}`, // Sliced address
                    proposerFull: proposer, // Full address for tooltip
                    votes: votes.toString(),
                    fundsRaised: ethers.formatEther(fundsRaised),
                    goal: ethers.formatEther(goal),
                    approved,
                    fundingCompleted,
                };

                proposals.push(proposal);
            }

            setProposals(proposals);
            console.log(proposals);
        } catch (error) {
            console.error('Error fetching proposals:', error);
        }
    };

    useEffect(() => {
        if (contract) {
            fetchProposals();
        }
    }, [contract]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">CrowdFunding</h1>

            {account ? (
                <div>
                    <p className="text-green-600 font-semibold">
                        Wallet Connected: <span className="text-gray-800">{account}</span>
                    </p>
                    <div className="proposals mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proposals.length === 0 ? (
                            <p className="text-gray-600 text-center col-span-full">No proposals available</p>
                        ) : (
                            proposals
                                .filter((proposal) => proposal.approved) // Show only approved proposals
                                .map((proposal) => (
                                    <div
                                        key={proposal.id}
                                        className="relative shadow-md rounded-lg p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{proposal.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            <strong>Description:</strong> {proposal.description}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Time Required:</strong> {proposal.timeRequired} hours
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Goal:</strong> {proposal.goal} ETH
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Funds Raised:</strong> {proposal.fundsRaised} ETH
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Proposer:</strong>{' '}
                                            <span
                                                title={proposal.proposerFull} // Tooltip for full address
                                                className="cursor-pointer"
                                            >
                                                {proposal.proposer}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <strong>Research Documents:</strong>
                                            <a
                                                href={proposal.researchDocs}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </a>
                                        </p>

                                        {/* Donation Progress */}
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Donate to this Proposal:</strong>
                                            </p>

                                            {/* Donation Input and Button */}
                                            <div className="flex items-center space-x-2 mb-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="Amount (ETH)"
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    value={donationAmounts[proposal.id] || ''}
                                                    onChange={(e) => handleDonationChange(e, proposal.id)}
                                                />
                                                <button
                                                    onClick={() => donateToProposal(proposal.id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                                                >
                                                    Donate
                                                </button>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="h-2.5 rounded-full bg-blue-600"
                                                    style={{
                                                        width: `${(proposal.fundsRaised / proposal.goal) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                <strong>{((proposal.fundsRaised / proposal.goal) * 100).toFixed(2)}%</strong> of the goal raised
                                            </p>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-red-600 font-semibold">
                    Please connect your wallet to access CrowdFunding features.
                </p>
            )}

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default CrowdFunding;

import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
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
        if (donationAmount > 0) {
            try {
                const donationInWei = ethers.parseEther(donationAmount.toString());

                const tx = await contract.fundProposal(proposalId, {
                    value: donationInWei,
                });

                // Toast success message
                toast.success("Funds added successfully!");
                console.log("Funds added successfully.");
            } catch (error) {
                // Toast error message
                toast.error("Error processing donation: " + error.message);
                console.error("Error processing donation:", error);
            }
        } else {
            // Toast error message if no donation amount is entered
            toast.error("Please enter a valid donation amount.");
            console.log("Please enter a valid donation amount.");
        }
    };

    const fetchProposals = async () => {
        try {
            const proposalsData = await contract.getProposals();
            const parsedProposals = await Promise.all(
                proposalsData.map(async (proposal) => {
                    const id = proposal[0].toString();
                    const metadataUri = proposal[1];
                    const votes = proposal[2].toString();
                    const fundsRaised = ethers.formatEther(proposal[3]);
                    const goal = ethers.formatEther(proposal[4]);
                    const proposer = proposal[5];
                    const approved = proposal[6];
                    const fundingCompleted = proposal[7];

                    let title = '';
                    let details = '';
                    let hours = '';
                    let docs = '';

                    try {
                        const response = await axios.get(metadataUri);
                        const metadata = response.data;
                        title = metadata.title || 'No Title';
                        details = metadata.description || 'No Details';
                        hours = metadata.timeRequired || '0';
                        docs = metadata.researchDocs || 'No Docs';
                    } catch (error) {
                        console.error(`Error fetching metadata for proposal ${id}:`, error);
                        toast.error(`Error fetching metadata for proposal ${id}`);
                    }

                    return {
                        id,
                        metadataUri,
                        votes,
                        fundsRaised,
                        goal,
                        proposer,
                        approved,
                        fundingCompleted,
                        title,
                        details,
                        hours,
                        docs,
                    };
                })
            );

            setProposals(parsedProposals);
            console.log(parsedProposals);
        } catch (error) {
            console.error('Error fetching proposals:', error);
            toast.error("Error fetching proposals: " + error.message);
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
                                .filter((proposal) => proposal.approved) // Only show approved proposals
                                .map((proposal) => (
                                    <div
                                        key={proposal.id}
                                        className="relative shadow-md rounded-lg p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{proposal.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            <strong>Description:</strong> {proposal.details}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Time Required:</strong> {proposal.hours} hours
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Goal:</strong> {proposal.goal} ETH
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Funds Raised:</strong> {proposal.fundsRaised} ETH
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Proposer:</strong> {proposal.proposer}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <strong>Research Documents:</strong>
                                            <a
                                                href={proposal.docs}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                title="View Research Document"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 9V3.75a.75.75 0 00-.75-.75h-6a.75.75 0 00-.75.75V9M12 15v6m0 0l-3-3m3 3l3-3"
                                                    />
                                                </svg>
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
                    {/* Add additional logic for crowdfunding functionalities */}
                </div>
            ) : (
                <p className="text-red-600 font-semibold">
                    Please connect your wallet to access CrowdFunding features.
                </p>
            )}

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default CrowdFunding;

import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ethers, formatEther } from 'ethers';
import nodp from "../assets/no-dp.jpeg";
import STD from "../assets/STDToken.png"; // Token Image

const Profile = () => {
  const { state, account } = useContext(WalletContext);
  const { contract, kcontract } = state;

  const [profile, setProfile] = useState(null); // Initialize as null to handle loading state
  const [tokens, setTokens] = useState(0); // Initialize tokens to 0
  const [contributions, setContributions] = useState([]); // State for storing contributions
  const [contribution, setContribution] = useState(null); // Individual contribution for a proposal
  const [STD, setSTD] = useState(null); // Tokens earned (Total)
  const [reputation, setReputation] = useState("1"); // Initialize reputation state

  // Fetch Profile Data
  const getProfile = async () => {
    try {
      if (!account || !kcontract) return;

      // Fetch total contributions and total tokens earned
      const [totalContributions, totalTokensEarned, userReputation] = await kcontract.getProfile(account);
      setProfile({
        totalContributions: totalContributions.toString(),
        totalTokensEarned: totalTokensEarned.toString()
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch User Tokens (from DAO contract)
  const getTokens = async () => {
    try {
      if (!account || !contract) return;

      // Fetch the token balance for the user
      const tokenBalance = await contract.getUserTokenBalance(account);
      setTokens(formatEther(tokenBalance)); // Format token balance to Ether
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  // Fetch Contributions Made (from DAO contract)
  const getContributions = async () => {
    try {
      if (!account || !kcontract || !contract) return;

      // Get the events the user has registered for
      const events = await kcontract.getBookedEvents(account);

      let contributionsData = [];

      for (let i = 0; i < events.length; i++) {
        const proposalId = events[i];

        // Fetch the amount the user contributed to the proposal
        const contributionAmount = await contract.getFunderContribution(proposalId, account);

        // Add the contribution data to the contributions list
        contributionsData.push({
          proposalId: proposalId,
          amount: formatEther(contributionAmount), // Format to Ether for readability
          title: `Proposal ${proposalId}`, // You would replace this with actual proposal data
          totalRaised: 100, // Replace with actual data if you have it in the contract
          targetAmount: 150, // Replace with actual data if you have it in the contract
        });
      }

      setContributions(contributionsData); // Set the contributions state
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };

  // Fetch Profile Data (additional details)
  const fetchProfile = async () => {
    try {
      if (!account) return;

      // Set some placeholder data for demonstration
      setSTD("2500"); // Replace with actual token data from contract
      setContribution(25); // Replace with actual contribution data
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  // Run Fetch Functions on Component Mount
  useEffect(() => {
    if (contract && kcontract && account) {
      getProfile();
      getTokens();
      getContributions();
      fetchProfile();
    }
  }, [contract, kcontract, account]);

  // Handle Loading State
  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Handle Reputation: If reputation is 1, show "Registered"
  const displayReputation = reputation === "1" ? "Registered" : "Need to Register";

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center">
        {/* Profile Picture */}
        <img
          src={profile.imageURI || nodp} // Provide fallback image
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md"
        />
        <div className="ml-6">
          {/* Name and Job Title */}
          <h1 className="text-2xl font-semibold">{profile.name}</h1>
          <p className="text-gray-600">
            {profile.isTeacher ? 'Teacher' : profile.isStudent ? 'Student' : 'Web3 Enthusiast'}
          </p>
        </div>
      </div>

      {/* Rankings and Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">Reputation</p>
          <span className="text-2xl font-semibold">{displayReputation}</span>
        </div>
        <div className="space-x-3">
          <button className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-100">
            Send Message
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Contacts
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-300">
        <ul className="flex">
          <li className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">About</li>
          <li className="px-4 py-2 text-gray-500 hover:text-blue-500 cursor-pointer">Timeline</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Contact Information</h2>
        <ul className="text-gray-600 space-y-2">
          <li className="flex items-center">
            <img src={STD} alt="Token" className="w-6 h-6 mr-2" /> {/* Token Image */}
            <strong>Tokens:</strong> {tokens}
          </li>
          <li>
            <strong>STD Tokens</strong>{' '}
            {STD}
          </li>
          <li>
            <strong>Contributed to Vaults</strong>{' '}
            {contribution}
          </li>
        </ul>
      </div>

      {/* Events Registered For */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Events Registered For</h2>
        <ul className="text-gray-600 space-y-2">
          {contributions.length > 0 ? (
            contributions.map((event) => (
              <li key={event.proposalId} className="flex justify-between items-center">
                <span>{event.title}</span>
                <span className="text-gray-500 text-sm">{event.totalRaised}/{event.targetAmount} Tokens</span>
              </li>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </ul>
      </div>

      {/* Contributions Section */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Contributions Made</h2>
        <ul className="text-gray-600 space-y-2">
          {contributions.map((contribution) => (
            <li key={contribution.proposalId} className="flex justify-between items-center">
              <span>{contribution.title}</span>
              <span>{contribution.amount} Tokens</span>
              <span className="text-gray-500 text-sm">
                Raised: {contribution.totalRaised}/{contribution.targetAmount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

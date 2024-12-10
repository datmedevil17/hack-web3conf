import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import { ethers } from 'ethers';
import nodp from "../assets/no-dp.jpeg";
import STD from "../assets/STDToken.png"; // Token Image

const Profile = () => {
  const { state, account } = useContext(WalletContext);
  const { contract, kcontract } = state;
  const [profile, setProfile] = useState(null); // Initialize as null to handle loading state
  const [tokens, setTokens] = useState(0); // Initialize tokens to 0
  const [contributions, setContributions] = useState([]); // State for storing contributions
  const [contribution,setContribution] = useState(null)
  const [STD,setSTD] = useState(null)

  // Fetch Profile Data
  const getProfile = async () => {
    try {
      const profileData = await contract.members(account);
      const [reputation, isTeacher, isStudent, profileURI] = profileData;

      // Fetch Profile Details from URI
      const response = await fetch(profileURI);
      const details = await response.json();
      const { name, imageURI } = details;

      const pf = {
        name: name,
        imageURI: imageURI,
        isTeacher: isTeacher,
        isStudent: isStudent,
        reputation: reputation.toString(),
      };

      setProfile(pf); // Update profile state
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch User Tokens
  const getTokens = async () => {
    try {
      const DAOTokens = await contract.getUserTokenBalance(account);
      setTokens(DAOTokens.toString());
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  // Fetch Contributions (Funder Contributions)
  const getContributions = async () => {
    try {
      const _proposalId = 1; // Replace with actual proposal ID logic
      const contribution = await contract.getFunderContribution(_proposalId, account);

      // Get proposal details like title and total raised funds
      const proposalDetails = await contract.getProposal(_proposalId);
      const { title, totalRaised, targetAmount } = proposalDetails;

      setContributions([
        {
          proposalId: _proposalId,
          amount: contribution,
          title: title,
          totalRaised: totalRaised,
          targetAmount: targetAmount
        }
      ]);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };


  const fetchProfile = async () => {
    try {
      const role = await kcontract.getProfile(account); // Fetch profile
      console.log(role);

      // Destructure the properties from the returned object
      const { contributions, tokens } = role;
      setContribution(contributions.toString())
      setSTD(tokens.toString())


    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };


  // Run Fetch Functions on Component Mount
  useEffect(() => {
    if (contract && account) {
      getProfile();
      getTokens();
      getContributions();
      fetchProfile();
    }
  }, );

  // Handle Loading State
  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <p>Loading profile...</p>
      </div>
    );
  }

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
          <span className="text-2xl font-semibold">{profile.reputation ? "Registered Member" : "Need to Register"}</span>
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
            <strong>Tokens:</strong> {ethers.formatEther(tokens)}
          </li>
          <li>
            <strong>STD Tokens</strong>{' '}
            <a href="mailto:hello@example.com" className="text-blue-500 hover:underline">
              {STD}
            </a>
          </li>
          <li>
            <strong>Contributed to Vaults</strong>{' '}
            <a href="https://example.com" className="text-blue-500 hover:underline">
              {contribution}
            </a>
          </li>
        </ul>
      </div>

      {/* Contributions Section */}

    </div>
  );
};

export default Profile;

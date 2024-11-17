// context/WalletContext.js

import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../../../smart_contract/artifacts/contracts/StudyDAO.sol/StudyDAO.json';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    address: null,
    contract: null,
  });

  const connectWallet = async () => {
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    const contractAddress = '0xfb7292450E805b3Fd6AeE5E5bb626A4b02bE2cd1';
    const contractABI = abi.abi;

    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask is not installed');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        console.log('No account found');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      setAccount(address);

      setState({ provider, signer, address, contract });
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ state, account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

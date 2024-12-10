// context/WalletContext.js

import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../abi/StudyDAO.json';
import kabi from '../abi/KnowledgeVault.json'

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    address: null,
    contract: null,
    kcontract:null
  });

  const connectWallet = async () => {
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    const contractAddress = '0x828BcC0895Be26F23296A97C79890046e3020A90';
    const contractABI = abi.abi;
    const kcontractAddress = '0xb19e7037aA19b7aF11D4fD11b85F96018F2366dA'
    const kcontractABI = kabi.abi;

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
      const kcontract = new ethers.Contract(kcontractAddress,kcontractABI,signer)
      setAccount(address);

      setState({ provider, signer, address, contract,kcontract });
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

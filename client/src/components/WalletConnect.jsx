// components/WalletConnect.js

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext';
import background from "../assets/background.jpg"

function WalletConnect() {
  const navigate = useNavigate();
  const { account, connectWallet } = useContext(WalletContext);

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Black Blur Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Centered Content */}
      <div className="relative z-10 text-center text-white p-6 max-w-md">
        <h1 className="text-4xl font-bold mb-6">Welcome to Student DAO</h1>
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard/home')}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-lg transition-all"
          >
            Enter Student DAO
          </button>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;

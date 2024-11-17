import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext'; // Import the context
import logo from '../assets/logo.png'

function Dashboard() {
    // Access the state and connectWallet function from WalletContext
    const { account, connectWallet } = useContext(WalletContext);

    // Function to slice the account address for display
    const slicedAccount = account
        ? `${account.slice(0, 5)}...${account.slice(-4)}`
        : '';

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="StudyDAO Logo"
                        className="h-16 w-24 rounded-lg border-2 border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                    <p className="text-gray-800 font-bold text-xl sm:text-2xl md:text-3xl leading-tight hover:text-blue-500 transition-all duration-300">
                        StudyDAO
                    </p>
                </div>

                <div className="flex gap-6">
                    <Link
                        to="/dashboard/home"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
                    >
                        Home
                    </Link>

                    <Link
                        to="/dashboard/proposals"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
                    >
                        Proposals
                    </Link>
                    <Link
                        to="/dashboard/crowdfunding"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
                    >
                        CrowdFunding
                    </Link>
                </div>
                {/* Connect Wallet Button or Display Sliced Account */}
                <div>
                    {account ? (
                        <span className="text-gray-900 font-medium text-lg">{slicedAccount}</span>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </nav>
            <div className="p-6 bg-white shadow-md rounded-lg mt-6 mx-4 max-w-7xl mx-auto">
                <Outlet /> {/* Renders the nested routes */}
            </div>
        </div>
    );
}

export default Dashboard;

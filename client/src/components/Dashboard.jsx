import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { WalletContext } from '../context/WalletContext'; // Import the context
import logo from '../assets/logo.png';
import { FaWallet } from 'react-icons/fa'; // Icon for the wallet button

function Dashboard() {
    // Access the state and connectWallet function from WalletContext
    const { account, connectWallet } = useContext(WalletContext);

    // State for toggling the hamburger menu
    const [menuOpen, setMenuOpen] = useState(false);

    // Function to slice the account address for display
    const slicedAccount = account
        ? `${account.slice(0, 5)}...${account.slice(-4)}`
        : '';

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50 relative">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="StudyDAO Logo"
                        className="h-12 w-20 rounded-lg border-2 border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                    {/* Hide text on small screens and show only logo */}
                    <p className="hidden sm:block text-gray-800 font-bold text-xl leading-tight hover:text-blue-500 transition-all duration-300">
                        StudyDAO
                    </p>
                </div>

                {/* Hamburger Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="block md:hidden focus:outline-none"
                >
                    <svg
                        className="w-8 h-8 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="4" y="4" width="16" height="4" stroke="currentColor" fill="currentColor"></rect>
                        <rect x="4" y="10" width="16" height="4" stroke="currentColor" fill="currentColor"></rect>
                        <rect x="4" y="16" width="16" height="4" stroke="currentColor" fill="currentColor"></rect>
                    </svg>
                </button>

                {/* Navigation Links */}
                <div
                    className={`${
                        menuOpen ? 'block' : 'hidden'
                    } absolute top-full left-0 w-full bg-white md:static md:w-auto md:flex md:items-center md:gap-1 md:bg-transparent`}
                >
                    <Link
                        to="/dashboard/home"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        Home
                    </Link>
                    <Link
                        to="/dashboard/proposals"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        Proposals
                    </Link>
                    <Link
                        to="/dashboard/crowdfunding"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        CrowdFunding
                    </Link>
                    <Link
                        to="/dashboard/profile"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/dashboard/knowledgeVault"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        KnowledgeVault
                    </Link>
                    <Link
                        to="/dashboard/events"
                        className="block md:inline-block px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-sm md:text-base"
                    >
                        Events
                    </Link>
                </div>

                {/* Wallet Section */}
                <div>
                    {account ? (
                        <span className="hidden md:inline-block text-gray-900 font-medium text-sm md:text-base">
                            {slicedAccount}
                        </span>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile Wallet Button */}
                <div className="md:hidden">
                    <button
                        onClick={connectWallet}
                        className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                        <FaWallet className="text-white w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Wallet Button and Account Address */}
            {menuOpen && (
                <div className="block md:hidden p-4 bg-white">
                    {account && (
                        <span className="text-gray-900 font-medium text-sm block mb-4">
                            {slicedAccount}
                        </span>
                    )}
                </div>
            )}

            {/* Main Content */}
            <div className="p-6 bg-white shadow-md rounded-lg mt-6 mx-4 max-w-7xl mx-auto">
                <Outlet /> {/* Renders the nested routes */}
            </div>
        </div>

    );
}

export default Dashboard;

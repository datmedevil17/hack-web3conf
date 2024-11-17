// App.js

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Proposals from './components/Proposals';
import WalletConnect from './components/WalletConnect';
import CrowdFunding from './components/CrowdFunding';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WalletConnect />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path='/dashboard/home' index element={<Home />} />
            <Route path="/dashboard/proposals" element={<Proposals />} />
            <Route path="/dashboard/crowdfunding" element={<CrowdFunding />} />
          </Route>
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;

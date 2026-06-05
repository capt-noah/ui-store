import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Marketplace from './pages/Marketplace';
import ComponentDetail from './pages/ComponentDetail';
import CommunityContribute from './pages/CommunityContribute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/component/:id" element={<ComponentDetail />} />
        <Route path="/contribute" element={<CommunityContribute />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const confirmLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            setShowLogoutModal(false);
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoggingOut(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        
        fetch(`${import.meta.env.VITE_API_URL}/purchases/me`, {
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPurchases(data);
                }
            })
            .catch(err => console.error("Failed to fetch purchases", err))
            .finally(() => setIsLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-12"
                >
                    <div className="w-32 h-32 bg-black text-white rounded-full flex items-center justify-center text-5xl font-black shadow-xl">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black tracking-tight mb-2">{user.name}</h1>
                        <p className="text-gray-500 font-medium mb-6">{user.email}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Balance</div>
                                    <div className="font-black text-lg">{user.credits} Credits</div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Purchases</div>
                                    <div className="font-black text-lg">{purchases.length} Items</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Link to="/pricing" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-center">
                            Buy Credits
                        </Link>
                        <Link to="/marketplace" className="bg-gray-100 text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-center">
                            Browse Market
                        </Link>
                        <button 
                            onClick={() => setShowLogoutModal(true)} 
                            className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors text-center"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Purchased Components Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-2xl font-black tracking-tight mb-8">My Library</h2>
                    
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader />
                        </div>
                    ) : purchases.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {purchases.map(({ component }) => {
                                if (!component) return null;
                                return (
                                    <Link 
                                        key={component._id}
                                        to={`/component/${component._id}`} 
                                        className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        <div className="aspect-video bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs border border-gray-100">
                                            {component.name}
                                        </div>
                                        <h3 className="font-black text-lg mb-1 group-hover:text-indigo-600 transition-colors">{component.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                {component.category}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black mb-3">No components yet</h3>
                            <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                                You haven't added any components to your library yet. Explore the marketplace to find premium UI elements.
                            </p>
                            <Link to="/marketplace" className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Explore Marketplace
                            </Link>
                        </div>
                    )}
                </motion.div>

                <AnimatePresence>
                    {showLogoutModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={!loggingOut ? () => setShowLogoutModal(false) : undefined}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Logout</h2>
                                <p className="text-gray-500 font-medium mb-8">
                                    Are you sure you want to log out of your account?
                                </p>
                                
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowLogoutModal(false)}
                                        disabled={loggingOut}
                                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmLogout}
                                        disabled={loggingOut}
                                        className="flex-1 h-14 flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20 disabled:opacity-50"
                                    >
                                        {loggingOut ? <Loader color="white" /> : "Logout"}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Profile;

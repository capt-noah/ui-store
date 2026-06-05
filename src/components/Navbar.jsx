import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';

const Navbar = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // We no longer return null here so the Navbar frame stays visible

    return (
        <nav className="glass sticky top-0 z-50 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white rounded-md"></div>
                    </div>
                    UIStore
                </Link>
                <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <Link to="/marketplace" className="hover:text-black transition-colors">Components</Link>
                    <Link to="/contribute" className="hover:text-black transition-colors">Contribute</Link>
                    <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {loading ? (
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="hidden sm:block w-28 h-10 bg-gray-100 rounded-xl border border-gray-200"></div>
                        <div className="w-10 h-10 bg-gray-100 rounded-2xl border border-gray-200"></div>
                    </div>
                ) : user ? (
                    <div className="flex items-center gap-4">
                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                            >
                                Admin
                            </Link>
                        )}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Credits</span>
                            <span className="text-sm font-black">{user.credits || 0}</span>
                        </div>
                        <Link to="/profile" className="w-10 h-10 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors" title={user.name}>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link to="/auth" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Login</Link>
                        <Link to="/auth?mode=signup" className="btn-primary text-sm">Get Started</Link>
                    </div>
                )}
            </div>

        </nav>
    );
};

export default Navbar;
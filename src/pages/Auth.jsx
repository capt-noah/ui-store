import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col">
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Left Side: Form */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-md"
                    >
                        <h2 className="text-5xl font-bold tracking-tighter mb-4">
                            {mode === 'login' ? 'Welcome back.' : 'Create account.'}
                        </h2>
                        <p className="text-lg text-gray-500 mb-12 font-medium">
                            {mode === 'login' ? 'Enter your details to access your gallery.' : 'Start building faster with UIStore today.'}
                        </p>

                        {error && (
                            <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {mode === 'signup' && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="alex@uistore.com"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 flex items-center justify-center bg-black text-white rounded-[24px] font-bold text-lg hover:scale-[1.02] transition-all shadow-2xl shadow-black/20 mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {loading ? <Loader color="white" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <p className="text-gray-500 font-medium">
                                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                                    className="ml-2 text-black font-bold hover:underline"
                                >
                                    {mode === 'login' ? 'Sign up for free' : 'Log in here'}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Visual/Branding */}
                <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-50"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 p-16 bg-white border border-gray-100 rounded-[60px] shadow-2xl max-w-lg text-center"
                    >
                        <div className="w-20 h-20 bg-black rounded-3xl mx-auto mb-10 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-white rounded-xl"></div>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight mb-4">Build Faster. Ship Sooner.</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            "UIStore has cut our development time in half. The components are beautiful and incredibly easy to integrate."
                        </p>
                        <div className="mt-8 font-black text-[10px] uppercase tracking-widest text-indigo-600">
                            Used by 50,000+ Developers
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Auth;

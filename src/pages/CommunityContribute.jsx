import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';

const CommunityContribute = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', category: '', description: '', code: '' });
    const [status, setStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const initiateSubmit = (e) => {
        e.preventDefault();
        if (!user) { navigate('/auth'); return; }
        setShowModal(true);
        setStatus('');
    };

    const confirmSubmit = async () => {
        setSubmitting(true);
        setStatus('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/components`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...formData, isFree: true, credits: 0 }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setShowModal(false);
                setFormData({ name: '', category: '', description: '', code: '' });
            } else {
                setStatus(`error:${data.message || 'Submission failed'}`);
                setShowModal(false);
            }
        } catch {
            setStatus('error:Could not reach the server. Is the backend running?');
            setShowModal(false);
        } finally {
            setSubmitting(false);
        }
    };

    const closeDialog = () => {
        setShowModal(false);
        setStatus('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-black uppercase tracking-widest mb-5">
                        Community
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Contribute a Component</h1>
                    <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                        Share your custom UI components with 50,000+ developers. All community submissions are permanently <strong>free</strong> for everyone and reviewed by our team before publishing.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-white rounded-[32px] border border-gray-100 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-3">Submitted for Review!</h2>
                        <p className="text-gray-500 font-medium mb-8">
                            Thanks for contributing! Our admin team will review your component and publish it once approved.
                        </p>
                        <button
                            onClick={() => setStatus('')}
                            className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90"
                        >
                            Submit Another
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                        {!user && (
                            <div className="mb-6 px-5 py-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-sm font-semibold text-yellow-800">
                                You need to <a href="/auth" className="underline font-black">log in</a> to submit a component.
                            </div>
                        )}
                        {status.startsWith('error:') && (
                            <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600">
                                {status.replace('error:', '')}
                            </div>
                        )}

                        <form onSubmit={initiateSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Component Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-semibold outline-none focus:border-gray-400 focus:bg-white transition-colors"
                                    placeholder="e.g. Animated Navbar"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold outline-none focus:border-gray-400 text-gray-700"
                                >
                                    <option value="">Select a Category...</option>
                                    <option value="UI Elements">UI Elements</option>
                                    <option value="Forms">Forms</option>
                                    <option value="Cards">Cards</option>
                                    <option value="Navigation">Navigation</option>
                                    <option value="Charts">Charts</option>
                                    <option value="Tables">Tables</option>
                                    <option value="Loaders">Loaders</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full h-28 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-gray-400 focus:bg-white transition-colors resize-none"
                                    placeholder="Describe your component — what it does, how to use it..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Component Code</label>
                                <textarea
                                    required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full h-56 bg-gray-950 text-green-400 border border-gray-800 rounded-2xl p-4 text-xs font-mono outline-none focus:border-gray-600 transition-colors resize-y"
                                    placeholder={`// Paste your JSX, HTML, or CSS here\n// Example:\nexport default function MyComponent() {\n  return <button className="...">Click me</button>;\n}`}
                                />
                                <p className="text-[10px] font-bold text-gray-400 mt-2">Accepted: JSX, HTML, CSS, plain JavaScript</p>
                            </div>

                            <button
                                type="submit"
                                disabled={!user}
                                className="w-full h-14 bg-black text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                Submit for Review →
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={!submitting ? closeDialog : undefined}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Submit Component</h2>
                            <p className="text-gray-500 font-medium mb-8">
                                Are you sure you want to submit <strong className="text-black">{formData.name || 'this component'}</strong> for review?
                            </p>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={closeDialog}
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmSubmit}
                                    disabled={submitting}
                                    className="flex-1 h-14 flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20 disabled:opacity-50"
                                >
                                    {submitting ? <Loader color="white" /> : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityContribute;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [components, setComponents] = useState([]);
    const [pending, setPending] = useState([]);
    const [formData, setFormData] = useState({ name: '', category: '', isFree: false, credits: 0, description: '', code: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [deleting, setDeleting] = useState(false);
    const [approving, setApproving] = useState(null);
    const [editTarget, setEditTarget] = useState(null); // The component being edited
    const [editData, setEditData] = useState(null); // The modified data for the edit
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin') navigate('/profile');
    }, [user, navigate]);

    useEffect(() => {
        fetchComponents();
        fetchPending();
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

    const fetchComponents = async () => {
        try {
            const res = await fetch(`${API}/components`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) setComponents(data);
        } catch { /* ignore */ }
    };

    const fetchPending = async () => {
        try {
            const res = await fetch(`${API}/components/pending`, { credentials: 'include' });
            const data = await res.json();
            if (Array.isArray(data)) setPending(data);
        } catch { /* ignore */ }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API}/components`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                showToast('✓ Component added successfully!');
                setFormData({ name: '', category: '', isFree: false, credits: 0, description: '', code: '' });
                setActiveTab('overview');
                fetchComponents();
            } else {
                const err = await res.json();
                showToast(`✗ ${err.message}`);
            }
        } catch { showToast('✗ Server error'); }
        finally { setSaving(false); }
    };

    const handleApprove = async (id) => {
        setApproving(id);
        try {
            const res = await fetch(`${API}/components/${id}/approve`, { method: 'PUT', credentials: 'include' });
            if (res.ok) { showToast('✓ Component approved!'); fetchPending(); fetchComponents(); }
            else showToast('✗ Approval failed');
        } catch { showToast('✗ Server error'); }
        finally { setApproving(null); }
    };

    const initiateDelete = (comp) => {
        setDeleteTarget({ id: comp._id, name: comp.name });
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API}/components/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                showToast('✓ Component deleted');
                fetchComponents();
            } else {
                showToast('✗ Delete failed');
            }
        } catch { showToast('✗ Server error'); }
        finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch(`${API}/components/${editTarget._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(editData),
            });
            if (res.ok) {
                showToast('✓ Component updated successfully!');
                setEditTarget(null);
                fetchComponents();
            } else {
                const err = await res.json();
                showToast(`✗ ${err.message}`);
            }
        } catch { showToast('✗ Server error'); }
        finally { setUpdating(false); }
    };

    const openEditModal = (comp) => {
        setEditTarget(comp);
        setEditData({
            name: comp.name,
            category: comp.category,
            isFree: comp.isFree,
            credits: comp.credits,
            description: comp.description,
            code: comp.code,
            status: comp.status
        });
    };

    const Sidebar = () => (
        <aside className="bg-white border-r border-gray-200 w-[260px] h-full flex flex-col p-4 shrink-0">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold">AD</div>
                <span className="text-lg font-bold tracking-tight">UIStore Admin</span>
            </div>
            <nav className="flex-1 space-y-1">
                {[
                    { label: 'Overview', tab: 'overview' },
                    { label: `Pending Review ${pending.length > 0 ? `(${pending.length})` : ''}`, tab: 'pending' },
                    { label: 'Add Component', tab: 'new-component' },
                ].map(({ label, tab }) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                        {label}
                    </button>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-100 px-2">
                <div className="text-xs font-bold truncate">{user?.name}</div>
                <div className="text-[10px] text-gray-400">Super Admin</div>
            </div>
        </aside>
    );

    return (
        <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto bg-gray-50/50 p-8 relative">
                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            className="fixed top-6 right-6 z-50 bg-black text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl"
                        >
                            {toast}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <>
                        <header className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold">Admin Overview</h1>
                                <p className="text-sm text-gray-500">System-wide metrics and management.</p>
                            </div>
                            <button onClick={() => setActiveTab('new-component')} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
                                + New Component
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Approved Components', value: components.length },
                                { label: 'Pending Review', value: pending.length },
                                { label: 'Active Users', value: '—' },
                                { label: 'Credits Sold', value: '—' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-sm">All Components</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Component</th>
                                            <th className="px-6 py-3 text-left">Category</th>
                                            <th className="px-6 py-3 text-left">Price</th>
                                            <th className="px-6 py-3 text-left">Source</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {components.length === 0 ? (
                                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No components yet. Add one!</td></tr>
                                        ) : components.map((comp) => (
                                            <tr key={comp._id} onClick={() => openEditModal(comp)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                                                <td className="px-6 py-4 font-semibold">{comp.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{comp.category}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{comp.isFree ? 'Free' : `${comp.credits} Cr`}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${comp.source === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                                        {comp.source}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); initiateDelete(comp); }}
                                                        className="text-red-400 hover:text-red-600 font-semibold text-xs transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* PENDING REVIEW */}
                {activeTab === 'pending' && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Pending Review</h1>
                        <p className="text-sm text-gray-500 mb-8">Community-submitted components waiting for approval.</p>
                        {pending.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400 shadow-sm">
                                🎉 No pending submissions — all caught up!
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pending.map(comp => (
                                    <div key={comp._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <div className="font-bold text-base">{comp.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">Category: {comp.category} · Submitted by: {comp.submittedBy?.name || 'Unknown'}</div>
                                            </div>
                                            <button
                                                onClick={() => handleApprove(comp._id)}
                                                disabled={approving === comp._id}
                                                className="shrink-0 h-9 min-w-[100px] flex items-center justify-center bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                                            >
                                                {approving === comp._id ? <Loader size="w-1.5 h-1.5" color="white" /> : '✓ Approve'}
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{comp.description}</p>
                                        <details className="text-xs">
                                            <summary className="cursor-pointer font-bold text-gray-400 hover:text-black">View Code</summary>
                                            <pre className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words">{comp.code}</pre>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ADD COMPONENT FORM */}
                {activeTab === 'new-component' && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Add New Component</h1>
                        <p className="text-sm text-gray-500 mb-8">Components added here are immediately approved and visible in the Marketplace.</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-sm max-w-3xl">
                            <form onSubmit={handleCreate} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black" placeholder="e.g. Animated Button" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                                        <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black" placeholder="e.g. UI Elements" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black resize-none h-20" placeholder="What does this component do?" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Component Code</label>
                                    <textarea required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-black resize-y h-48" placeholder="// Paste your JSX / HTML / CSS here..." />
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                                        <input type="checkbox" checked={formData.isFree} onChange={e => setFormData({ ...formData, isFree: e.target.checked, credits: e.target.checked ? 0 : formData.credits })} className="w-4 h-4 rounded" />
                                        Free component
                                    </label>
                                    {!formData.isFree && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Credits</label>
                                            <input type="number" min={1} value={formData.credits} onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })} className="w-24 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="h-11 min-w-[140px] flex items-center justify-center bg-black text-white px-6 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                    >
                                        {saving ? <Loader color="white" size="w-1.5 h-1.5" /> : 'Save Component'}
                                    </button>
                                    <button type="button" onClick={() => setActiveTab('overview')} className="border border-gray-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={!deleting ? () => setDeleteTarget(null) : undefined}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Delete Component</h2>
                            <p className="text-gray-500 font-medium mb-8">
                                Are you sure you want to permanently delete <strong className="text-black">{deleteTarget.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 h-14 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 font-bold rounded-2xl transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                                >
                                    {deleting ? <Loader color="white" /> : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Component Modal */}
            <AnimatePresence>
                {editTarget && editData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={!updating ? () => setEditTarget(null) : undefined}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[40px] p-8 max-w-3xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Edit Component</h3>
                                <button onClick={() => setEditTarget(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name</label>
                                        <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                        <input type="text" value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                                        <select value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all">
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pricing</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                                <input type="checkbox" checked={editData.isFree} onChange={e => setEditData({...editData, isFree: e.target.checked})} className="w-4 h-4 rounded text-black focus:ring-black accent-black" />
                                                Free
                                            </label>
                                            {!editData.isFree && (
                                                <input type="number" value={editData.credits} onChange={e => setEditData({...editData, credits: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none" min="0" placeholder="Credits" required />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-y min-h-[100px]" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Source Code</label>
                                    <textarea value={editData.code} onChange={e => setEditData({...editData, code: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-y min-h-[150px]" required />
                                </div>
                                
                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setEditTarget(null)} disabled={updating} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50">Cancel</button>
                                    <button type="submit" disabled={updating} className="flex-1 h-14 flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20 disabled:opacity-50">
                                        {updating ? <Loader color="white" /> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

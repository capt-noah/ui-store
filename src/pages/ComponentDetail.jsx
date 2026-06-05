import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Skeletons from "../components/Skeletons";

const generatePreviewHtml = (code) => {
  if (!code) return "";
  
  const cleanCode = code
    .replace(/import\s+.*?['"].*?['"];?/g, '')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+/g, '');

  const match = code.match(/function\s+([A-Z][a-zA-Z0-9_]*)/) || code.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=/);
  const compName = match ? match[1] : null;

  if (!compName) return "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://unpkg.com/framer-motion@11.0.0/dist/framer-motion.js"></script>
        <style>
          body { margin: 0; padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: transparent; overflow-x: hidden; }
        </style>
      </head>
      <body>
        <div id="root" style="width: 100%; display: flex; justify-content: center;"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          const { motion, AnimatePresence } = window.Motion || {};
          
          ${cleanCode}

          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(${compName}));
        </script>
      </body>
    </html>
  `;
};

const Sandbox = ({ code }) => {
  const [view, setView] = useState("desktop");
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const frames = {
    desktop: "w-full h-[500px]",
    tablet:
      "w-[768px] h-[600px] border-x-8 border-t-8 border-gray-800 rounded-t-3xl mx-auto",
    mobile: "w-[375px] h-[667px] border-8 border-gray-800 rounded-[3rem] mx-auto",
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex bg-gray-100 p-1 rounded-xl mb-12 shadow-inner">
        {["desktop", "tablet", "mobile"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === v ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div
        className={`transition-all duration-700 bg-white shadow-2xl flex items-center justify-center overflow-hidden relative border border-gray-100 ${frames[view]}`}
      >
        {!isIframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader />
          </div>
        )}
        <iframe
          srcDoc={generatePreviewHtml(code)}
          title="Component Sandbox"
          onLoad={() => setIsIframeLoaded(true)}
          className={`w-full h-full border-none bg-transparent transition-opacity duration-300 ${isIframeLoaded ? "opacity-100" : "opacity-0"}`}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

const CodeEditor = ({ code }) => {
  const lines = code.split("\n");

  const highlight = (str) => {
    if (!str) return "";
    let escaped = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    const tokens = [];
    const pushToken = (content, cls) => {
      tokens.push(`<span class="${cls}">${content}</span>`);
      return `___TOKEN${tokens.length - 1}___`;
    };

    return escaped
      .replace(/\/\/.*/g, (m) => pushToken(m, "text-[#8b949e]"))
      .replace(/('|")(\\.|[^\1])*?\1/g, (m) => pushToken(m, "text-[#a5d6ff]"))
      .replace(/\b(const|let|var|function|return|if|else|import|from|export|default|class|extends|new|try|catch|finally|await|async)\b/g, (m) => pushToken(m, "text-[#ff7b72]"))
      .replace(/\b(useState|useEffect|useMemo|useCallback|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|useDeferredValue|useTransition|useId)\b/g, (m) => pushToken(m, "text-[#d2a8ff]"))
      .replace(/&lt;([a-zA-Z0-9]+)/g, (m, p1) => `&lt;${pushToken(p1, "text-[#7ee787]")}`)
      .replace(/&lt;\/([a-zA-Z0-9]+)&gt;/g, (m, p1) => `&lt;/${pushToken(p1, "text-[#7ee787]")}&gt;`)
      .replace(/([a-zA-Z0-9]+)=/g, (m, p1) => `${pushToken(p1, "text-[#79c0ff]")}=`)
      .replace(/___TOKEN(\d+)___/g, (m, i) => tokens[i]);
  };

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] overflow-hidden">
      <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          index.jsx — React
        </div>
      </div>
      <div className="overflow-auto p-6">
        <div className="flex font-mono text-sm leading-relaxed text-[#c9d1d9]">
          <div className="text-[#484f58] pr-6 text-right select-none flex flex-col">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <code
            className="block whitespace-pre"
            dangerouslySetInnerHTML={{
              __html: highlight(
                code || "// Source implementation arriving soon...",
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};



// ... (keep Sandbox and CodeEditor components above this)

const ComponentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [component, setComponent] = useState(null);
  const [activeTab, setActiveTab] = useState("sandbox");
  const [unlocked, setUnlocked] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy Code");

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const API = import.meta.env.VITE_API_URL;
        
        // 1. Fetch component details
        const compRes = await fetch(`${API}/components/${id}`);
        let compData = null;

        if (compRes.ok) {
          compData = await compRes.json();
        } else {
          throw new Error("Component not found");
        }

        setComponent(compData);

        // 2. Determine unlock status
        if (compData.isFree) {
          setUnlocked(true);
        }

        if (user) {
          const purRes = await fetch(`${API}/purchases/me`, { credentials: 'include' });
          if (purRes.ok) {
            const purchases = await purRes.json();
            const hasPurchased = purchases.some(p => p.component?._id === compData._id);
            if (hasPurchased) {
              setUnlocked(true);
              setInLibrary(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load component:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComponentData();
    }
  }, [id, user]);

  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const initiateUnlock = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowModal(true);
    setPurchaseSuccess(false);
  };

  const confirmUnlock = async () => {
    setPurchasing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ componentId: component._id })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUnlocked(true);
        setInLibrary(true);
        refreshUser();
        setPurchaseSuccess(true);
      } else {
        alert(data.message || "Purchase failed");
        setShowModal(false);
      }
    } catch (err) {
      alert("An error occurred during purchase");
      setShowModal(false);
    } finally {
      setPurchasing(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) { navigate('/auth'); return; }

    // If already in library → remove it
    if (inLibrary) {
      setBookmarking(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/purchases/${component._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) setInLibrary(false);
      } catch (err) {
        console.error('Remove from library failed', err);
      } finally {
        setBookmarking(false);
      }
      return;
    }

    // If premium and not yet purchased, open purchase modal
    if (!component.isFree && !unlocked) { initiateUnlock(); return; }

    // Free or already unlocked — save directly
    setBookmarking(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ componentId: component._id })
      });
      if (res.ok) setInLibrary(true);
    } catch (err) {
      console.error('Bookmark failed', err);
    } finally {
      setBookmarking(false);
    }
  };

  const closeDialog = () => {
    setShowModal(false);
    setPurchaseSuccess(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(component.code || '// No source available');
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Code"), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea');
      el.value = component.code || '';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Code"), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([component.code || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name.replace(/\s+/g, '-').toLowerCase()}.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !component)
    return (
      <div className="p-24 flex flex-col items-center justify-center font-black text-gray-300 tracking-widest uppercase gap-4 min-h-[50vh]">
        <Loader size="w-3 h-3" color="black" />
        <span className="mt-4">Loading component...</span>
      </div>
    );

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-8 py-5 font-bold text-sm uppercase tracking-widest border-b-4 transition-all ${activeTab === id ? "text-black border-black" : "text-gray-400 border-transparent hover:text-gray-600"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Top Section: Header & Stats */}
      <header className="px-8 pt-20 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start justify-between">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-black text-white rounded-xl text-[10px] font-black tracking-widest uppercase">
                  {component.category}
                </span>
                <div className="flex items-center gap-1.5 text-yellow-600 font-black text-sm">
                  <span>★</span>
                  <span>{component.rating} RATING</span>
                </div>
              </div>
              <h1 className="text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                {component.name}
              </h1>
              <p className="text-2xl text-gray-500 font-medium leading-relaxed">
                {component.description}
              </p>
            </div>

            <div className="w-full lg:w-[400px] grid grid-cols-2 gap-4">
              {[
                {
                  label: "Downloads",
                  val: component.downloads,
                  color: "text-black",
                },
                {
                  label: "Credits",
                  val: component.isFree ? "FREE" : component.credits,
                  color: component.isFree ? "text-green-600" : "text-black",
                },
                { label: "Version", val: "1.2.4", color: "text-gray-400" },
                { label: "Author", val: "UIStore", color: "text-gray-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 border border-gray-100 p-6 rounded-3xl"
                >
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </div>
                  <div
                    className={`text-xl font-black tracking-tight ${stat.color}`}
                  >
                    {stat.val}
                  </div>
                </div>
              ))}
              <div className="col-span-2 flex gap-3 mt-4">
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  title={inLibrary ? 'In your library' : 'Add to library'}
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all disabled:opacity-50 ${
                    inLibrary
                      ? 'bg-black border-black text-white'
                      : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {bookmarking ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  ) : inLibrary ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
                  )}
                </button>
                {!component.isFree && !unlocked && (
                  <button
                    onClick={initiateUnlock}
                    className="flex-1 py-3.5 bg-black text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Purchase · {component.credits} Cr
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Section: Tabs & Interactive Area */}
      <main className="max-w-7xl mx-auto px-8 mt-20">
        <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-2xl">
          <div className="flex border-b border-gray-100 bg-gray-50/50 justify-center">
            <TabButton id="sandbox" label="Interactive Sandbox" />
            <TabButton id="code" label="Source Code" />
            <TabButton id="docs" label="Documentation" />
          </div>

          <div className="p-16 min-h-[700px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === "sandbox" && <Sandbox code={component.code} />}

                {activeTab === "code" && (
                  <div className="w-full">
                    {!unlocked ? (
                      <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8">
                          <svg
                            className="w-10 h-10 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-4xl font-bold mb-4 tracking-tight">
                          Purchase Required
                        </h3>
                        <p className="text-gray-500 mb-10 max-w-sm text-lg font-medium leading-relaxed">
                          This component's source code is exclusive to premium
                          members. Unlock it to access the full JSX and Tailwind
                          logic.
                        </p>
                        <button
                          onClick={initiateUnlock}
                          className="bg-black text-white px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all"
                        >
                          Unlock for {component.credits} Credits
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        <div className="flex justify-between items-center px-4">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight">
                              Source Implementation
                            </h3>
                            <p className="text-gray-400 font-medium">
                              Production-ready React code with Tailwind CSS.
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={handleCopyCode}
                              className={`px-8 py-4 rounded-2xl text-sm font-bold transition-all ${
                                copyLabel === 'Copied!'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              {copyLabel}
                            </button>
                            <button
                              onClick={handleDownload}
                              className="px-8 py-4 bg-black text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
                            >
                              Download .jsx
                            </button>
                          </div>
                        </div>
                        <CodeEditor
                          code={
                            component.code ||
                            "// Source implementation arriving soon..."
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "docs" && (
                  <div className="py-12">
                    {component.hasDocs ? (
                      <div className="max-w-4xl mx-auto space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                          <div className="space-y-6">
                            <h4 className="text-xl font-bold tracking-tight border-b border-gray-100 pb-4 uppercase text-[10px] text-gray-400 tracking-widest">
                              Technical Features
                            </h4>
                            <ul className="space-y-4">
                              {component.features?.map((f) => (
                                <li
                                  key={f}
                                  className="flex items-center gap-3 text-lg font-medium"
                                >
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-6">
                            <h4 className="text-xl font-bold tracking-tight border-b border-gray-100 pb-4 uppercase text-[10px] text-gray-400 tracking-widest">
                              Dependencies
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {component.dependencies?.map((d) => (
                                <span
                                  key={d}
                                  className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-600"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-xl font-bold tracking-tight border-b border-gray-100 pb-4 uppercase text-[10px] text-gray-400 tracking-widest">
                            Installation Guide
                          </h4>
                          <div className="bg-gray-50 p-10 rounded-[32px] border border-gray-100 font-mono text-lg text-gray-600">
                            {component.installation}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8">
                          <svg
                            className="w-10 h-10 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-400 tracking-tight">
                          Documentation Unavailable
                        </h3>
                        <p className="text-gray-400 text-lg font-medium mt-4 max-w-sm">
                          This component is community-contributed or follows
                          standard React patterns.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={!purchasing && !purchaseSuccess ? closeDialog : undefined}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-gray-100 text-center"
            >
              {!purchaseSuccess ? (
                <>
                  <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Unlock Component</h2>
                  <p className="text-gray-500 font-medium mb-8">
                    You are about to spend <strong className="text-black">{component.credits} credits</strong> to unlock the source code for <strong className="text-black">{component.name}</strong>.
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-medium">Your Balance</span>
                      <span className="font-bold">{user.credits} CR</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-500 font-medium">Cost</span>
                      <span className="font-bold text-red-500">-{component.credits} CR</span>
                    </div>
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Remaining</span>
                      <span className="font-black text-xl">{user.credits - component.credits} CR</span>
                    </div>
                  </div>

                  {user.credits < component.credits ? (
                    <div className="space-y-4">
                      <div className="text-red-500 font-bold text-sm bg-red-50 p-4 rounded-xl">
                        Insufficient credits for this purchase.
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={closeDialog}
                          className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => navigate('/pricing')}
                          className="flex-1 py-4 bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20"
                        >
                          Buy Credits
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={closeDialog}
                        disabled={purchasing}
                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={confirmUnlock}
                        disabled={purchasing}
                        className="flex-1 h-14 flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20 disabled:opacity-50"
                      >
                        {purchasing ? <Loader color="white" /> : "Confirm"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <motion.svg 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Unlocked!</h2>
                  <p className="text-gray-500 font-medium mb-8">
                    You now have full access to the source code for <strong className="text-black">{component.name}</strong>.
                  </p>
                  <button 
                    onClick={() => {
                      closeDialog();
                      setActiveTab("code");
                    }}
                    className="w-full py-4 bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20"
                  >
                    View Source Code
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentDetail;

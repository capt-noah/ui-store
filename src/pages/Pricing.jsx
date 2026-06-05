import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');

  const initiatePurchase = (pkg) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedPackage(pkg);
    setPurchaseSuccess(false);
    setPurchaseError('');
  };

  const confirmPurchase = async () => {
    if (!selectedPackage) return;
    setPurchasing(true);
    setPurchaseError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          packageId: selectedPackage.name, 
          credits: selectedPackage.credits + selectedPackage.bonus, 
          priceETB: selectedPackage.price 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Show success immediately, refresh credits in background
        setPurchaseSuccess(true);
        refreshUser().catch(() => {}); 
      } else {
        setPurchaseError(data.message || 'Purchase failed. Please try again.');
      }
    } catch (err) {
      setPurchaseError('Could not reach the server. Please check your connection.');
    } finally {
      setPurchasing(false);
    }
  };


  const closeDialog = () => {
    setSelectedPackage(null);
    setPurchaseSuccess(false);
  };

  const packages = [
    {
      name: "Starter",
      credits: 100,
      price: 150,
      bonus: 0,
      desc: "Perfect for single projects.",
    },
    {
      name: "Developer",
      credits: 250,
      price: 350,
      bonus: 25,
      desc: "Our most popular choice.",
      popular: true,
    },
    {
      name: "Pro",
      credits: 500,
      price: 590,
      bonus: 75,
      desc: "For professional creators.",
    },
    {
      name: "Agency",
      credits: 1000,
      price: 1050,
      bonus: 200,
      desc: "Full power for teams.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-8 py-32 w-full">
        <div className="text-center mb-24">
          <h1 className="text-7xl font-bold tracking-tighter mb-8 leading-none">
            Simple, <br />
            <span className="text-gray-200">Credit-based Pricing.</span>
          </h1>
          <p className="text-2xl text-gray-500 font-medium max-w-2xl mx-auto">
            No subscriptions. Buy credits when you need them, use them on any
            premium component in the gallery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`price-card relative flex flex-col bg-white border border-gray-200 rounded-[40px] p-12 transition-all duration-500 hover:-translate-y-2 hover:border-gray-400 hover:shadow-2xl ${pkg.popular ? "border-black ring-4 ring-gray-50 shadow-2xl shadow-black/10" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                  {pkg.name}
                </h3>
                <div className="text-6xl font-bold tracking-tighter mb-2">
                  {pkg.credits}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Credits
                </div>
              </div>

              <p className="text-gray-500 font-medium mb-12 h-12">{pkg.desc}</p>

              <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold tracking-tight">
                    {pkg.price.toLocaleString()} Birr
                  </span>
                  <span className="text-sm font-bold text-gray-400 uppercase">
                    One-time
                  </span>
                </div>

                {pkg.bonus > 0 && (
                  <div className="bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.12 11.2a1 1 0 111.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707z" />
                    </svg>
                    +{pkg.bonus} Bonus Credits Included
                  </div>
                )}

                <button
                  onClick={() => initiatePurchase(pkg)}
                  className={`w-full py-5 rounded-[24px] font-bold text-sm uppercase tracking-widest transition-all ${pkg.popular ? "bg-black text-white hover:scale-[1.02] shadow-xl shadow-black/20" : "bg-gray-100 text-black hover:opacity-90"}`}
                >
                  Purchase
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedPackage && (
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
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Confirm Purchase</h2>
                  <p className="text-gray-500 font-medium mb-8">
                    You are about to purchase the <strong className="text-black">{selectedPackage.name}</strong> package for <strong className="text-black">{selectedPackage.price.toLocaleString()} Birr</strong>.
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-medium">Credits</span>
                      <span className="font-bold">{selectedPackage.credits}</span>
                    </div>
                    {selectedPackage.bonus > 0 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-600 font-medium">Bonus Credits</span>
                        <span className="font-bold text-green-600">+{selectedPackage.bonus}</span>
                      </div>
                    )}
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Received</span>
                      <span className="font-black text-xl">{selectedPackage.credits + selectedPackage.bonus}</span>
                    </div>
                  </div>

                  {purchaseError && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600 text-left">
                      {purchaseError}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={closeDialog}
                      disabled={purchasing}
                      className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-2xl transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmPurchase}
                      disabled={purchasing}
                      className="flex-1 h-14 flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20 disabled:opacity-50"
                    >
                      {purchasing ? <Loader color="white" /> : "Confirm"}
                    </button>
                  </div>
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
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Payment Successful!</h2>
                  <p className="text-gray-500 font-medium mb-8">
                    Your account has been credited with <strong className="text-black">{selectedPackage.credits + selectedPackage.bonus} credits</strong>. Happy building!
                  </p>
                  <button 
                    onClick={closeDialog}
                    className="w-full py-4 bg-black text-white hover:bg-gray-900 font-bold rounded-2xl transition-colors shadow-lg shadow-black/20"
                  >
                    Back to UIStore
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <footer className="px-8 py-24 bg-white border-t border-gray-100 text-center mt-auto">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">
          © 2026 UIStore. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Pricing;

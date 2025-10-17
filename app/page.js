"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && !isLoading) {
      setIsLoading(true);
      // Simulate scanning process then redirect
      setTimeout(() => {
        const encodedEmail = encodeURIComponent(email);
        router.push(`/persona/${encodedEmail}`);
      }, 2000); // 2-second delay for the "scanning" effect
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-[#2A2A3D]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 md:p-10 text-center bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white">
          ✨ Discover Your Innovator Blueprint
        </h1>
        
        <p className="text-base text-gray-300 mt-4 mb-8">
          Enter your AIM email to unlock your Innovator Profile.
          <br />
          <span className="opacity-80">It only takes a moment — your journey starts here.</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-halo rounded-2xl transition-all duration-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@aim.edu"
              required
              className="w-full px-5 py-4 text-lg text-white placeholder-gray-400 bg-black/20 border-2 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 shadow-inner"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full px-6 py-4 text-lg font-bold text-white bg-[linear-gradient(90deg,#34A853,#5DE07A)] rounded-xl shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(52, 168, 83, 0.6)" 
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isLoading ? 'loading' : 'ready'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? 'Scanning Innovation DNA...' : 'Reveal My Blueprint 🔮'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}


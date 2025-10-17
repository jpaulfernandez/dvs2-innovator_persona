// components/persona-story/Screen5_InnovationMode.js

"use client";

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InnovationRadarChart from '../visualizations/InnovationRadarChart';

// Helper to calculate the scores
const getInnovationScores = (currentUser) => {
    let scores = { Thinker: 5, Builder: 5, Tinkerer: 5, Empath: 5 }; // Base score for all
    if (currentUser.Primary_Archetype) {
        scores[currentUser.Primary_Archetype] += 30;
    }
    if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
        scores[currentUser.Secondary_Archetype] += 15;
    }
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return {
        Thinker: (scores.Thinker / totalScore) * 100,
        Builder: (scores.Builder / totalScore) * 100,
        Tinkerer: (scores.Tinkerer / totalScore) * 100,
        Empath: (scores.Empath / totalScore) * 100,
    };
};

export default function Screen5_InnovationMode({ userData, onComplete }) {
  const innovationScores = useMemo(() => getInnovationScores(userData), [userData]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 90000); // 9-second duration for the scene
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="innovation-mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50"
      >
        <motion.p
          className="text-xl text-gray-600 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }}
        >
          Behind every idea is a mix of minds…
        </motion.p>
        
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.8 } }}
        >
          Your Innovation Energy Profile
        </motion.h1>

        {/* Radar Chart */}
        <InnovationRadarChart scores={innovationScores} />

        <motion.p
          className="text-lg text-gray-700 mt-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 4.0, duration: 1.0 } }}
        >
          A curious builder of ideas who balances logic with play.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
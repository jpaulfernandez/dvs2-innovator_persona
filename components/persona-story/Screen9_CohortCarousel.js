// components/persona-story/Screen9_CohortCarousel.js (or Screen9_CohortInsights.js)

"use client";

import { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { FaHammer, FaBrain, FaWrench, FaHeart } from 'react-icons/fa';

// Details for styling and icons
const tribeDetails = {
  Builder: { color: '#3b82f6', Icon: FaHammer, name: 'Builders' },
  Thinker: { color: '#8b5cf6', Icon: FaBrain, name: 'Thinkers' },
  Tinkerer: { color: '#14b8a6', Icon: FaWrench, name: 'Tinkerers' },
  Empath: { color: '#f97316', Icon: FaHeart, name: 'Empaths' },
};

// Animation variants for the grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 1.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Screen9_CohortCarousel({ cohortData, onComplete }) {
  // Calculate all insights at once
  const insights = useMemo(() => {
    const archetypeCounts = d3.rollup(cohortData, v => v.length, d => d.Primary_Archetype);
    const sortedArchetypes = Array.from(archetypeCounts.entries()).sort((a, b) => b[1] - a[1]);
    const dominantTribe = sortedArchetypes[0] || ['None', 0];
    const rareTribe = sortedArchetypes[sortedArchetypes.length - 1] || ['None', 0];

    return {
      dominant: { name: dominantTribe[0], count: dominantTribe[1] },
      rare: { name: rareTribe[0], count: rareTribe[1] },
    };
  }, [cohortData]);

  useEffect(() => {
    // Auto-advance after showing the insights for a set time
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="cohort-insights-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#0a0a2a] text-white"
    >
      <motion.h1
        className="text-3xl font-light text-white/90 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } }}
      >
        Zooming out, patterns emerge in our constellation.
      </motion.h1>

      <motion.div
        className="grid grid-cols-2 gap-6 w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dominant Tribe Card */}
        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="font-bold text-lg mb-2" style={{ color: tribeDetails[insights.dominant.name]?.color }}>Dominant Tribe</h2>
          <p className="text-4xl font-bold">{tribeDetails[insights.dominant.name]?.name}</p>
          <p className="text-white/70 mt-1">{Math.round((insights.dominant.count / cohortData.length) * 100)}% of the cohort leads with this energy.</p>
        </motion.div>

        {/* Rare Tribe Card */}
        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="font-bold text-lg mb-2" style={{ color: tribeDetails[insights.rare.name]?.color }}>The Rare Type</h2>
          <p className="text-4xl font-bold">{tribeDetails[insights.rare.name]?.name}</p>
          <p className="text-white/70 mt-1">Only {Math.round((insights.rare.count / cohortData.length) * 100)}% are the quiet strategists framing the logic.</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="font-bold text-lg mb-2 text-green-400">Balance of Innovation</h2>
          <p className="text-white/70">Tinkerers and Empaths form our creative backbone, while Builders and Thinkers provide the strategic foundation.</p>
        </motion.div>

        {/* Collective Flow Card */}
        <motion.div variants={itemVariants} className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="font-bold text-lg mb-2 text-cyan-400">The Collective Flow</h2>
          <p className="text-white/70">Our cohort&#39;s energy is a dynamic equilibrium, blending momentum with reflection.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
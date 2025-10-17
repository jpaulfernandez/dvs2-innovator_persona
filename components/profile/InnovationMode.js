// components/profile/InnovationMode.js

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getInnovationScores, getArchetypeDetails } from './profileHelpers';

const barColors = { Analysis: '#345B9C', Execution: '#E57C23', Iteration: '#7E57C2', Empathy: '#E97B7B' };

export default function InnovationMode({ userData }) {
  const scores = useMemo(() => getInnovationScores(userData), [userData]);
  const archetypeDetails = getArchetypeDetails(userData.Primary_Archetype);
  
  // Find the dominant score
  const dominantScore = useMemo(() => {
      return Object.entries(scores).reduce((max, entry) => entry[1] > max[1] ? entry : max, ["", 0])[0];
  }, [scores]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2" style={{ color: archetypeDetails.color }}>Innovation Mode</h2>
      <div className="space-y-3">
        {Object.entries(scores).map(([name, score]) => (
          <div key={name} className="flex items-center gap-3">
            <p className="w-20 text-sm font-medium text-gray-700">{name}</p>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <motion.div
                className="h-4 rounded-full"
                style={{ 
                    backgroundColor: barColors[name],
                    boxShadow: name === dominantScore ? `0 0 12px ${barColors[name]}` : 'none'
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <p className="w-12 text-sm font-bold text-gray-800">{Math.round(score)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
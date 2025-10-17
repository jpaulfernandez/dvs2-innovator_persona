// components/persona-story/Screen8_Compatibility.js

"use client";

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tribeColors = {
  Builder: '#3b82f6',
  Thinker: '#8b5cf6',
  Tinkerer: '#14b8a6',
  Empath: '#f97316',
};

const compatibilityMatrix = {
  'Thinker-Builder': { label: 'Strategic Execution', score: 92 },
  'Tinkerer-Empath': { label: 'Human-Centered Innovation', score: 88 },
  'Thinker-Tinkerer': { label: 'Ideation Engine', score: 78 },
  'Builder-Tinkerer': { label: 'Agile Making', score: 75 },
  'Thinker-Empath': { label: 'Insightful Connection', score: 72 },
  'Builder-Empath': { label: 'Grounded Harmony', score: 65 },
};

const getCompatibilityDetails = (currentUser, cohortData) => {
  const userArchetype = currentUser.Primary_Archetype;
  const availableArchetypes = [...new Set(cohortData.map(p => p.Primary_Archetype))].filter(name => name && name !== userArchetype);

  let bestMatch = { score: -1, target: null, label: '' };
  
  availableArchetypes.forEach(other => {
    const key1 = `${userArchetype}-${other}`;
    const key2 = `${other}-${userArchetype}`;
    const match = compatibilityMatrix[key1] || compatibilityMatrix[key2];
    if (match && match.score > bestMatch.score) {
      bestMatch = { ...match, target: other };
    }
  });

  const compatiblePeople = cohortData
    .filter(person => person.Primary_Archetype === bestMatch.target)
    .slice(0, 3).map(p => p.Nickname);

  const orbitingNodes = availableArchetypes.map((archetype, i) => ({
    name: archetype,
    angle: (i / availableArchetypes.length) * 2 * Math.PI - (Math.PI / 2),
  }));

  return { orbitingNodes, bestMatch, compatiblePeople };
};

export default function Screen8_Compatibility({ userData, cohortData, onComplete }) {
  const details = useMemo(() => getCompatibilityDetails(userData, cohortData), [userData, cohortData]);

  useEffect(() => {
    const timer = setTimeout(() => { if (onComplete) onComplete(); }, 12000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const radius = 200;
  
  // Find the specific node that is the best match for dedicated rendering
  const bestMatchNode = details.orbitingNodes.find(node => node.name === details.bestMatch.target);
  const otherNodes = details.orbitingNodes.filter(node => node.name !== details.bestMatch.target);

  return (
    <AnimatePresence>
      <motion.div
        key="compatibility-final-fixed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#0a0a2a] text-white"
      >
        <motion.p className="text-2xl font-light text-white/80 absolute top-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5, duration: 1.5 } }}>
          Some sparks align stronger than others. Let’s see how your energy connects.
        </motion.p>
        
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Central and Orbiting Nodes */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 1, duration: 1 } }} className="z-10 w-40 h-40 rounded-full flex items-center justify-center font-bold text-xl text-white" style={{ backgroundColor: tribeColors[userData.Primary_Archetype], boxShadow: `0 0 40px ${tribeColors[userData.Primary_Archetype]}` }}>
            {userData.Primary_Archetype}
          </motion.div>
          {details.orbitingNodes.map(node => (
            <motion.div key={node.name} className="absolute w-28 h-28 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: tribeColors[node.name] }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{ x: radius * Math.cos(node.angle), y: radius * Math.sin(node.angle), scale: 1, transition: { delay: 1.5, duration: 1.5, type: 'spring' } }}
            >
              {node.name}
            </motion.div>
          ))}

          {/* SVG Overlay for Connections */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="8" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            
            {/* Render faint lines for OTHER connections */}
            {/* {otherNodes.map(node => (
              <motion.line key={`line-${node.name}`} x1="50%" y1="50%"
                x2={`${50 + (radius / 500 * 100) * Math.cos(node.angle)}%`}
                y2={`${50 + (radius / 500 * 100) * Math.sin(node.angle)}%`}
                stroke="rgba(255,255,255,0.2)" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1, transition: { delay: 3, duration: 1.5 } }}
              />
            ))} */}
            
            {/* Render a dedicated, highlighted line for the BEST MATCH */}
            {bestMatchNode && (
             <motion.line key={`line-${bestMatchNode.name}`} x1="50%" y1="50%"
                x2={`${50 + (radius / 500 * 100) * Math.cos(bestMatchNode.angle)}%`}
                y2={`${50 + (radius / 500 * 100) * Math.sin(bestMatchNode.angle)}%`}
                stroke="rgba(255,255,255,0.2)" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1, transition: { delay: 3, duration: 1.5 } }}
              />
            )}
          </svg>
        </div>

        {details.bestMatch.target && (
          <motion.div className="text-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 5, duration: 1 } }}>
            <p className="text-xl text-white/80">Your strongest synergy is with the <span className="font-bold" style={{ color: tribeColors[details.bestMatch.target] }}>{details.bestMatch.target}</span> tribe.</p>
            <p className="text-3xl font-bold text-white mt-2">{details.bestMatch.label}</p>
            {details.compatiblePeople.length > 0 && (
              <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}>
                <p className="text-lg text-white/70">Consider collaborating with:</p>
                <p className="text-2xl font-semibold text-white mt-1">{details.compatiblePeople.join('  •  ')}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
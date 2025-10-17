// components/persona-story/Screen7_MeetYourTribe.js

"use client";

import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

const tribeColors = {
  Thinker: '#8b5cf6',
  Tinkerer: '#14b8a6',
  Empath: '#f97316',
  Builder: '#3b82f6',
};

const legendContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 2.5, staggerChildren: 0.2 } },
};
const legendItemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
};

export default function Screen7_MeetYourTribe({ userData, cohortData, onComplete }) {
  const [constellationData, setConstellationData] = useState({}); // Stores organized data for rendering
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimationControls();
  const userArchetype = userData.Primary_Archetype;

  // Effect to detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Effect to run D3 simulation (re-runs if screen size or cohortData changes)
  useEffect(() => {
    let isMounted = true;
    const width = isMobile ? 380 : 800; // Adjusted for mobile screen size
    const height = isMobile ? 800 : 600; // Adjusted for mobile screen size

    // Define layout based on screen size
    const clusterCenters = isMobile ? {
        Thinker: { x: width / 2, y: height * 0.25 },
        Tinkerer: { x: width / 2, y: height * 0.45 },
        Empath: { x: width / 2, y: height * 0.65 },
        Builder: { x: width / 2, y: height * 0.85 },
    } : {
        Thinker: { x: width * 0.75, y: height * 0.35 },
        Tinkerer: { x: width * 0.25, y: height * 0.65 },
        Empath: { x: width * 0.75, y: height * 0.65 },
        Builder: { x: width * 0.25, y: height * 0.35 },
    };

    let newConstellationData = {};

    Object.keys(clusterCenters).forEach(archetype => {
      // Filter members for the current archetype
      const members = cohortData.filter(d => d.Primary_Archetype === archetype);
      if (members.length === 0) return;

      // 1. Position Nodes: Use a simple force simulation to pack nodes into a tight cluster
      // Clone members to avoid modifying original cohortData in simulation
      const simulationNodes = members.map(d => ({ ...d, id: d.Email }));
      
      const nodeSimulation = d3.forceSimulation(simulationNodes)
        .force("center", d3.forceCenter(clusterCenters[archetype].x, clusterCenters[archetype].y).strength(0.8))
        .force("collide", d3.forceCollide(12)) // Node radius for collision
        .stop();

      for (let i = 0; i < 150; i++) nodeSimulation.tick();

      // 2. Position Labels: Calculate positions in a circular fashion around the cluster's centroid
      const clusterCentroid = {
        x: d3.mean(simulationNodes, d => d.x),
        y: d3.mean(simulationNodes, d => d.y),
      };
      
      const labelRadius = isMobile ? 50 : (50 + (members.length > 5 ? (members.length - 5) * 6 : 0)); // Smaller radius for mobile
      const angleStep = (2 * Math.PI) / members.length;

      const memberRenderData = simulationNodes.map((node, i) => {
        const angle = angleStep * i - (Math.PI / 2) + (angleStep / 2); // Start from top, offset for spacing
        return {
          node: { x: node.x, y: node.y },
          label: {
            x: clusterCentroid.x + labelRadius * Math.cos(angle),
            y: clusterCentroid.y + labelRadius * Math.sin(angle),
            name: node.Nickname,
          },
          archetype: node.Primary_Archetype, // Pass archetype for highlighting
        };
      });
      newConstellationData[archetype] = memberRenderData;
    });

    if (isMounted) {
      setConstellationData(newConstellationData);
    }
    
    // Animation Sequence
    const sequence = async () => {
      if (!isMounted) return;
      await controls.start("visible");
      await new Promise(res => setTimeout(res, 2500));
      if (!isMounted) return;
      await controls.start("highlightUserTribe");
    };
    sequence();

    const timer = setTimeout(() => { if (isMounted && onComplete) onComplete(); }, 12000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };

  }, [cohortData, controls, userArchetype, onComplete, isMobile]); // Re-run effect when isMobile changes

  return (
    <AnimatePresence>
      <motion.div
        key="meet-your-tribe"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 bg-[#0a0a2a] text-white"
      >
        <motion.p className="text-xl md:text-2xl font-light text-white/80 absolute top-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1, duration: 1.5 } }}>
          Every innovator belongs to a tribe—each different, but all part of one constellation.
        </motion.p>
        
        {/* --- RESPONSIVE Legend Box --- */}
        <motion.div
          className={`absolute p-3 md:p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 ${isMobile ? 'bottom-8 left-1/2 -translate-x-1/2 flex flex-row space-x-4' : 'top-24 right-16 space-y-3'}`}
          variants={legendContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(tribeColors).map(([archetype, color]) => (
            <motion.div key={archetype} className="flex items-center gap-2 md:gap-3" variants={legendItemVariants}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs md:text-sm text-white/80 whitespace-nowrap">{archetype}s</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* SVG container for the constellation */}
        <svg viewBox={isMobile ? "0 0 380 800" : "0 0 800 600"} className="w-full h-full overflow-visible">
          {Object.entries(constellationData).map(([archetype, members]) => (
            <g key={archetype}>
              {members.map((person, i) => (
                <motion.g
                  key={person.label.name}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { delay: 1 + i * 0.05 } },
                    highlightUserTribe: { opacity: archetype === userArchetype ? 1 : 0.2, transition: { duration: 1 } }
                  }}
                  initial="hidden"
                  animate={controls}
                >
                  <line x1={person.node.x} y1={person.node.y} x2={person.label.x} y2={person.label.y} stroke="rgba(255, 255, 255, 0.2)" />
                  <circle cx={person.node.x} cy={person.node.y} r={9} fill={tribeColors[archetype]} />
                  <text x={person.label.x} y={person.label.y} dy="0.35em" dx={person.label.x > person.node.x ? 5 : -5} textAnchor={person.label.x > person.node.x ? 'start' : 'end'} className="text-xs font-light" fill="white">{person.label.name}</text>
                </motion.g>
              ))}
            </g>
          ))}
        </svg>

        <motion.p className="text-base md:text-lg font-light text-white/70 absolute bottom-24 md:bottom-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 4 } }}>
          Your tribe&#39;s color glows brightest in this constellation.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
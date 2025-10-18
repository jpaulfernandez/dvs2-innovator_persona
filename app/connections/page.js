'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { csvData } from '../../data/cohortData';
import ForceGraph from '../../components/visualizations/ForceGraph';

// **UPDATED: New high-contrast color palette**
const ARCHETYPE_COLORS = {
    "Thinker": "#60A5FA", // A clear, accessible blue
    "Empath":  "#FBBF24", // A warm, vibrant amber
    "Tinkerer":"#A78BFA", // A distinct, creative purple
    "Builder": "#F97316", // A strong, grounded orange
};

// The rules can remain the same
const RELATIONSHIP_RULES = {
    harmony: [
        (p1, p2) => p1.archetype === 'Thinker' && p2.archetype === 'Builder',
        (p1, p2) => p1.archetype === 'Empath' && p2.archetype === 'Tinkerer',
        (p1, p2) => p1.descriptor === p2.descriptor,
    ],
    tension: [
        (p1, p2) => p1.descriptor === 'Still Current' && p2.descriptor === 'Momentum Seeker',
        (p1, p2) => p1.archetype === 'Thinker' && p2.archetype === 'Tinkerer',
        (p1, p2) => p1.archetype === 'Builder' && p2.archetype === 'Flow Hacker',
    ]
};

// **UPDATED: Legend now includes all archetypes**
const Legend = () => (
    <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center items-center mt-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
            <div className="w-10 h-1 rounded-full" style={{backgroundColor: '#38bdf8'}}></div>
            <span className="text-sm text-gray-300">Harmony Link</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-10 h-1 rounded-full" style={{backgroundColor: '#f472b6'}}></div>
            <span className="text-sm text-gray-300">Tension Link</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: ARCHETYPE_COLORS.Thinker}}></div>
            <span className="text-sm text-gray-300">Thinker</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: ARCHETYPE_COLORS.Empath}}></div>
            <span className="text-sm text-gray-300">Empath</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: ARCHETYPE_COLORS.Tinkerer}}></div>
            <span className="text-sm text-gray-300">Tinkerer</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: ARCHETYPE_COLORS.Builder}}></div>
            <span className="text-sm text-gray-300">Builder</span>
        </div>
    </div>
);


export default function ConnectionsPage() {
    // ... rest of the component remains exactly the same
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    useEffect(() => {
        const cohort = d3.csvParse(csvData).map(p => ({
            id: p.Nickname,
            archetype: p.Primary_Archetype,
            descriptor: p.Primary_Descriptor,
        }));

        const links = [];
        const addedLinks = new Set(); 

        for (let i = 0; i < cohort.length; i++) {
            for (let j = i + 1; j < cohort.length; j++) {
                const p1 = cohort[i];
                const p2 = cohort[j];
                const linkKey1 = `${p1.id}-${p2.id}`;
                const linkKey2 = `${p2.id}-${p1.id}`;

                if (addedLinks.has(linkKey1) || addedLinks.has(linkKey2)) continue;

                let relationship = null;
                for (const rule of RELATIONSHIP_RULES.tension) {
                    if (rule(p1, p2) || rule(p2, p1)) {
                        relationship = 'tension';
                        break;
                    }
                }
                if (!relationship) {
                    for (const rule of RELATIONSHIP_RULES.harmony) {
                         if (rule(p1, p2) || rule(p2, p1)) {
                            relationship = 'harmony';
                            break;
                        }
                    }
                }

                if (relationship) {
                    links.push({ source: p1.id, target: p2.id, type: relationship });
                    addedLinks.add(linkKey1);
                }
            }
        }

        setGraphData({ nodes: cohort, links });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8"
        >
            <div className="w-full max-w-6xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        Tribe Connections
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        Innovation thrives in the dance between harmony and friction. Each tribe balances, challenges, and completes the other.
                    </p>
                </header>
                <main className="bg-gray-900/50 rounded-xl shadow-2xl backdrop-blur-sm">
                    <ForceGraph
                        nodes={graphData.nodes}
                        links={graphData.links}
                        archetypeColorMap={ARCHETYPE_COLORS}
                    />
                </main>
                <Legend />
            </div>
        </motion.div>
    );
}
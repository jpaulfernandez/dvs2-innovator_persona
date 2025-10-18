'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { csvData } from '../../data/cohortData';
import BubbleGrid from '../../components/visualizations/BubbleGrid';

// Reuse the archetype color map
const ARCHETYPE_COLORS = {
    "Thinker": "#E0E7FF",
    "Empath": "#FEF3C7",
    "Tinkerer": "#F3E8FF",
    "Builder": "#FEFCE8",
};

// Reuse the descriptor map with emojis
const DESCRIPTOR_MAP = {
    "Still Current": "🌿 Still Current",
    "Momentum Seeker": "⚡ Momentum Seeker",
    "Flow Hacker": "🌀 Flow Hacker",
    "Empathic Pulse": "💫 Empathic Pulse",
};

export default function DnaPage() {
    const [gridData, setGridData] = useState([]);
    const [archetypes, setArchetypes] = useState([]);
    const [descriptors, setDescriptors] = useState([]);

    useEffect(() => {
        const parsedData = d3.csvParse(csvData);

        // Define the explicit order for axes
        const archetypeOrder = ["Thinker", "Empath", "Tinkerer", "Builder"];
        const descriptorOrder = ["Still Current", "Momentum Seeker", "Flow Hacker", "Empathic Pulse"];

        setArchetypes(archetypeOrder);
        setDescriptors(descriptorOrder);

        // Create a map of combinations with their counts and persona
        const combinations = parsedData.reduce((acc, row) => {
            const archetype = row.Primary_Archetype;
            const descriptor = row.Primary_Descriptor;
            const key = `${archetype}-${descriptor}`;

            // Ensure we have valid data before processing
            if (archetype && descriptor && archetype !== 'NaN' && descriptor !== 'NaN') {
                if (!acc[key]) {
                    acc[key] = {
                        archetype: archetype,
                        descriptor: descriptor,
                        persona: row.Primary_Persona,
                        count: 0
                    };
                }
                acc[key].count++;
            }
            return acc;
        }, {});

        setGridData(Object.values(combinations));

    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8"
        >
            <div className="w-full max-w-6xl mx-auto">
                <header className="text-center mb-12">
                    <motion.h1
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                    >
                        Archetype x Descriptor Map
                    </motion.h1>
                    <motion.p
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        Each of us carries a unique code—how we think meets how we move. Together, these intersections create our <span className="font-bold text-white">collective DNA.</span>
                    </motion.p>
                </header>

                <main className="bg-gray-900/50 p-2 sm:p-6 rounded-xl shadow-2xl backdrop-blur-sm">
                    <BubbleGrid
                        data={gridData}
                        archetypes={archetypes}
                        descriptors={descriptors}
                        colorMap={ARCHETYPE_COLORS}
                        descriptorMap={DESCRIPTOR_MAP}
                    />
                </main>
            </div>
        </motion.div>
    );
}
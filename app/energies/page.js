'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { csvData } from '../../data/cohortData';
import DescriptorChart from '../../components/visualizations/DescriptorChart';

// 1. Define a color map for the Descriptors based on the narrative
const DESCRIPTOR_COLORS = {
    "🌿 Still Current": "#A7F3D0",   // A calm mint green
    "⚡ Momentum Seeker": "#FDE047", // An energetic yellow
    "🌀 Flow Hacker": "#C4B5FD",      // An adaptive lavender
    "💫 Empathic Pulse": "#F9A8D4",  // A connective pink
};

// Map the raw descriptor names to the ones with emojis for display
const DESCRIPTOR_MAP = {
    "Still Current": "🌿 Still Current",
    "Momentum Seeker": "⚡ Momentum Seeker",
    "Flow Hacker": "🌀 Flow Hacker",
    "Empathic Pulse": "💫 Empathic Pulse",
}

export default function EnergiesPage() {
    const [descriptorData, setDescriptorData] = useState([]);

    useEffect(() => {
        const parsedData = d3.csvParse(csvData);

        // 2. Process data for Primary_Descriptor counts
        const counts = parsedData.reduce((acc, row) => {
            const descriptor = row.Primary_Descriptor;
            if (descriptor && descriptor !== 'NaN') {
                const mappedDescriptor = DESCRIPTOR_MAP[descriptor] || descriptor;
                acc[mappedDescriptor] = (acc[mappedDescriptor] || 0) + 1;
            }
            return acc;
        }, {});

        // 3. Format the data for the chart component
        const dataForChart = Object.entries(counts)
            .map(([descriptor, count]) => ({ descriptor, count }))
            .sort((a, b) => b.count - a.count); // Sort by count

        setDescriptorData(dataForChart);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8"
            // 4. Add the requested gradient background
            style={{
                background: 'radial-gradient(circle, #374151, #111827)'
            }}
        >
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <motion.h1
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
                    >
                        The Four Energies
                    </motion.h1>
                    <motion.p
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Beyond who we are lies <span className="font-bold text-gray-200">how we move</span> — calm, dynamic, adaptive, or connective. These energies define our rhythm.
                    </motion.p>
                </header>

                <main>
                    <div className="bg-gray-900/50 p-4 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                       <DescriptorChart data={descriptorData} colorMap={DESCRIPTOR_COLORS} />
                    </div>
                </main>
            </div>
        </motion.div>
    );
}
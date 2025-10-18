'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { csvData } from '../../data/cohortData';
import RadialChart from '../../components/visualizations/RadialChart';
import ArchetypeLegend from '../../components/visualizations/ArchetypeLegend';

// Central place for color configuration
const COLOR_MAP = {
    "Thinker": "#E0E7FF",
    "Empath": "#FEF3C7",
    "Tinkerer": "#F3E8FF",
    "Builder": "#FEFCE8",
};

export default function SummaryPage() {
    const [archetypeData, setArchetypeData] = useState([]);

    useEffect(() => {
        const parsedData = d3.csvParse(csvData);

        const counts = parsedData.reduce((acc, row) => {
            const archetype = row.Primary_Archetype;
            if (archetype && archetype !== 'NaN') {
                acc[archetype] = (acc[archetype] || 0) + 1;
            }
            return acc;
        }, {});

        const dataForChart = Object.entries(counts)
            .map(([archetype, count]) => ({ archetype, count }))
            .sort((a, b) => b.count - a.count);

        setArchetypeData(dataForChart);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8"
        >
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        Who We Are: The Blueprint of MIB 2026B
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                        Behind every innovation journey is a blend of minds—thinkers, feelers, builders, and experimenters. Together, we form the human blueprint of MIB 2026B.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Radial Chart Visualization */}
                    <motion.div
                        className="w-full max-w-md mx-auto"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 120 }}
                    >
                        <RadialChart data={archetypeData} colorMap={COLOR_MAP} />
                    </motion.div>

                    {/* Legend and Avatars */}
                    <ArchetypeLegend data={archetypeData} colorMap={COLOR_MAP} />
                </main>
            </div>
        </motion.div>
    );
}
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
// **NEW: Import from modern libraries**
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';

import { csvData } from '../../data/cohortData';
import ClusteredForceGraph from '../../components/visualizations/ClusteredForceGraph';

const ARCHETYPE_COLORS = {
    "Thinker": "#60A5FA",
    "Empath":  "#FBBF24",
    "Tinkerer":"#A78BFA",
    "Builder": "#F97316",
};

const RELATIONSHIP_RULES = {
    harmony: [
        (p1, p2) => p1.archetype === 'Thinker' && p2.archetype === 'Builder',
        (p1, p2) => p1.archetype === 'Empath' && p2.archetype === 'Tinkerer',
        (p1, p2) => p1.descriptor === p2.descriptor,
    ],
    tension: [
        (p1, p2) => p1.descriptor === 'Still Current' && p2.descriptor === 'Momentum Seeker',
        (p1, p2) => p1.archetype === 'Thinker' && p2.archetype === 'Tinkerer',
    ]
};

const GraphLegend = () => {
    // We need to generate the shape paths using D3
    const symbol = d3.symbol().size(100);
    const shapes = {
        Thinker: symbol.type(d3.symbolCircle)(),
        Empath: symbol.type(d3.symbolDiamond)(),
        Tinkerer: symbol.type(d3.symbolTriangle)(),
        Builder: symbol.type(d3.symbolSquare)(),
    };

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center items-center mt-4 p-4 bg-gray-800/50 rounded-lg">
            {Object.keys(shapes).map(archetype => (
                <div key={archetype} className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="-10 -10 20 20">
                        <path d={shapes[archetype]} fill={ARCHETYPE_COLORS[archetype]} />
                    </svg>
                    <span className="text-sm text-gray-300">{archetype}</span>
                </div>
            ))}
        </div>
    );
};

export default function Scene1() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [viewMode, setViewMode] = useState('archetype');

    const processedData = useMemo(() => {
        const cohort = d3.csvParse(csvData).map(p => ({
            id: p.Nickname,
            archetype: p.Primary_Archetype,
            descriptor: p.Primary_Descriptor,
        }));

        // **NEW: Graphology implementation**
        const graph = new Graph();

        // 1. Add nodes to the graph
        cohort.forEach(person => {
            graph.addNode(person.id, { ...person });
        });

        // 2. Add edges to the graph
        for (let i = 0; i < cohort.length; i++) {
            for (let j = i + 1; j < cohort.length; j++) {
                const p1 = cohort[i];
                const p2 = cohort[j];

                // Prevent adding duplicate edges if they already exist
                if (graph.hasEdge(p1.id, p2.id)) continue;

                let isTension = RELATIONSHIP_RULES.tension.some(rule => rule(p1, p2) || rule(p2, p1));
                let isHarmony = RELATIONSHIP_RULES.harmony.some(rule => rule(p1, p2) || rule(p2, p1));
                
                if (isTension) {
                    graph.addEdge(p1.id, p2.id, { type: 'tension', weight: 0.5 });
                } else if (isHarmony) {
                    graph.addEdge(p1.id, p2.id, { type: 'harmony', weight: 1.0 });
                }
            }
        }
        
        // 3. **Run Louvain community detection**
        // This directly modifies the graph, adding a 'community' attribute to each node.
        louvain.assign(graph);

        // 4. Extract nodes and links for D3
        const finalNodes = graph.mapNodes((node, attributes) => ({ ...attributes }));
        const finalLinks = graph.mapEdges((edge, attributes, source, target) => ({
            ...attributes,
            source,
            target
        }));

        return { nodes: finalNodes, links: finalLinks };

    }, []);

    useEffect(() => {
        setGraphData(processedData);
    }, [processedData]);
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8"
        >
            <div className="w-full max-w-6xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">From Connections to Constellations</h1>
                <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                    In our initial network, every Thinker, Empath, and Tinkerer is connected by harmony and friction. But when we let relationships self-organize, distinct constellations emerge.
                </p>

                <motion.div layout className="my-8">
                    <button
                        onClick={() => setViewMode(viewMode === 'archetype' ? 'cluster' : 'archetype')}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {viewMode === 'archetype' ? '✨ Reveal Constellations' : '↩️ Show Archetypes'}
                    </button>
                </motion.div>

                <main className="bg-gray-900/50 rounded-xl shadow-2xl backdrop-blur-sm p-2">
                    <ClusteredForceGraph
                        nodes={graphData.nodes}
                        links={graphData.links}
                        archetypeColorMap={ARCHETYPE_COLORS}
                        viewMode={viewMode}
                    />
                </main>

                {/* NEW: Add the legend below the graph */}
                <GraphLegend />
            </div>
        </motion.div>
    );
}
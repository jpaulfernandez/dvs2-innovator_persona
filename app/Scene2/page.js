'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';

import { csvData } from '../../data/cohortData';
import ClusteredForceGraph from '../../components/visualizations/ClusteredForceGraph';
import TribeProfileCard from '../../components/visualizations/TribeProfileCard';

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

// Helper function to create a narrative name for a tribe
const getTribeName = (composition) => {
    const sorted = Object.entries(composition).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0]?.[0];
    const secondary = sorted[1]?.[0];

    if (primary === 'Thinker' && secondary === 'Builder') return "The Strategic Architects";
    if (primary === 'Tinkerer' && secondary === 'Empath') return "The Human-Centered Innovators";
    if (primary === 'Thinker') return "The Analytical Core";
    if (primary === 'Tinkerer') return "The Creative Catalysts";
    if (primary === 'Empath') return "The Community Heart";
    if (primary === 'Builder') return "The Foundation Builders";
    return "The Diverse Connectors";
};

export default function Scene2() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [tribeProfiles, setTribeProfiles] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    
    const clusterColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const processedData = useMemo(() => {
        const cohort = d3.csvParse(csvData).map(p => ({
            id: p.Nickname,
            archetype: p.Primary_Archetype,
            descriptor: p.Primary_Descriptor,
        }));
        
        const graph = new Graph();
        cohort.forEach(person => {
            graph.addNode(person.id, { ...person });
        });
        
        for (let i = 0; i < cohort.length; i++) {
            for (let j = i + 1; j < cohort.length; j++) {
                const p1 = cohort[i];
                const p2 = cohort[j];
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
        
        louvain.assign(graph);

        const finalNodes = graph.mapNodes((node, attributes) => ({ ...attributes }));
        const finalLinks = graph.mapEdges((edge, attributes, source, target) => ({
            ...attributes,
            source,
            target
        }));

        return { nodes: finalNodes, links: finalLinks };
    }, []);

    useEffect(() => {
        // **HERE IS THE FIX:** Check if processedData exists before using it.
        if (!processedData || !processedData.nodes) return; 

        // Analyze and create Tribe Profiles
        const communities = {};
        processedData.nodes.forEach(node => {
            if (!communities[node.community]) {
                communities[node.community] = [];
            }
            communities[node.community].push(node);
        });

        const profiles = Object.entries(communities).map(([id, members]) => {
            const composition = members.reduce((acc, member) => {
                acc[member.archetype] = (acc[member.archetype] || 0) + 1;
                return acc;
            }, {});

            return {
                id: parseInt(id),
                name: getTribeName(composition),
                description: `A cluster of ${members.length} individuals, defined by its unique blend of energies.`,
                composition,
                color: clusterColorScale(id),
                members,
            };
        }).sort((a,b) => b.members.length - a.members.length);

        setGraphData(processedData);
        setTribeProfiles(profiles);

    }, [processedData]);
    
    const selectedTribe = tribeProfiles.find(t => t.id === selectedCommunity);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 relative"
        >
            <div className="w-full max-w-6xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Decoding the Constellations</h1>
                <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                    Select a tribe to see its unique identity. These clusters represent the natural, gravitational pull within our cohort.
                </p>

                <div className="my-6 flex flex-wrap justify-center gap-2">
                    {tribeProfiles.map(tribe => (
                        <button
                            key={tribe.id}
                            onClick={() => setSelectedCommunity(tribe.id)}
                            className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300"
                            style={{ 
                                backgroundColor: selectedCommunity === tribe.id ? tribe.color : '#374151',
                                color: selectedCommunity === tribe.id ? '#111827' : 'white',
                                border: `2px solid ${tribe.color}`
                             }}
                        >
                            {tribe.name} ({tribe.members.length})
                        </button>
                    ))}
                     {selectedCommunity !== null && (
                        <button onClick={() => setSelectedCommunity(null)} className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                            Show All
                        </button>
                    )}
                </div>

                <main className="bg-gray-900/50 rounded-xl shadow-2xl relative">
                    <ClusteredForceGraph
                        nodes={graphData.nodes}
                        links={graphData.links}
                        archetypeColorMap={ARCHETYPE_COLORS}
                        viewMode={'cluster'}
                        highlightedCommunity={selectedCommunity}
                    />
                </main>
            </div>
            
            <AnimatePresence>
                {selectedTribe && (
                    <TribeProfileCard 
                        tribe={selectedTribe} 
                        onClose={() => setSelectedCommunity(null)} 
                        archetypeColors={ARCHETYPE_COLORS}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
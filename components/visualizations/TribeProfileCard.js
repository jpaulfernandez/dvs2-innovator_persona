'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TribeProfileCard = ({ tribe, onClose, archetypeColors }) => {
    if (!tribe) return null;

    // Create a simple bar chart for archetype distribution
    const maxCount = Math.max(...Object.values(tribe.composition));

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-gray-700"
        >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">&times;</button>
            <h2 className="text-2xl font-bold" style={{ color: tribe.color }}>{tribe.name}</h2>
            <p className="text-gray-300 mt-1">{tribe.description}</p>

            <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Composition</h3>
                <div className="space-y-2">
                    {Object.entries(tribe.composition).map(([archetype, count]) => (
                        <div key={archetype} className="flex items-center gap-2">
                            <span className="w-20 text-xs text-gray-300">{archetype}</span>
                            <div className="flex-grow bg-gray-700 rounded-full h-4">
                                <motion.div
                                    className="h-4 rounded-full"
                                    style={{ backgroundColor: archetypeColors[archetype] }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / maxCount) * 100}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                />
                            </div>
                            <span className="w-6 text-xs font-mono text-gray-200">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default TribeProfileCard;
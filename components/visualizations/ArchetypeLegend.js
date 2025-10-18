'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Renders a legend for the archetype data.
 * @param {{ data: {archetype: string, count: number}[], colorMap: Record<string, string> }} props
 */
const ArchetypeLegend = ({ data, colorMap }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Primary Archetype Distribution
            </h3>
            {data.map((item, index) => {
                const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0;
                const hexColor = colorMap[item.archetype]?.substring(1) || 'F3F4F6';

                return (
                    <motion.div
                        key={item.archetype}
                        className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    >
                        <img
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${item.archetype}&backgroundColor=${hexColor}&textColor=111827&fontSize=40`}
                            alt={`${item.archetype} avatar`}
                            className="w-16 h-16 rounded-full border-2"
                            style={{ borderColor: colorMap[item.archetype] }}
                        />
                        <div className="flex-grow">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-xl" style={{ color: colorMap[item.archetype] }}>
                                    {item.archetype}
                                </span>
                                <span className="font-mono text-gray-400 text-lg">{percentage}%</span>
                            </div>
                            <p className="text-gray-300">{item.count} members</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ArchetypeLegend;
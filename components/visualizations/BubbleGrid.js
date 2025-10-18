'client-side';

import React from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

/**
 * A Bubble Grid to show the intersection of Archetypes and Descriptors.
 * @param {{
 * data: {archetype: string, descriptor: string, count: number, persona: string}[],
 * archetypes: string[],
 * descriptors: string[],
 * colorMap: Record<string, string>,
 * descriptorMap: Record<string, string>
 * }} props
 */
const BubbleGrid = ({ data, archetypes, descriptors, colorMap, descriptorMap }) => {
    // Find the max count to create a scale for the bubble sizes
    const maxCount = d3.max(data, d => d.count) || 0;

    // Use a square root scale for sizing bubbles by area, which is better for perception.
    const sizeScale = d3.scaleSqrt()
        .domain([0, maxCount])
        .range([0, 100]); // Max bubble size in pixels (width/height)

    const gridData = descriptors.map(descriptor => {
        return {
            descriptor: descriptor,
            values: archetypes.map(archetype => {
                return data.find(d => d.descriptor === descriptor && d.archetype === archetype) || null;
            })
        };
    });

    const getEmoji = (persona) => {
        if (!persona || typeof persona !== 'string') return '';
        const match = persona.match(/(\p{Emoji})/u);
        return match ? match[0] : '';
    };

    return (
        <div className="w-full">
            {/* Header Row */}
            <div className="flex">
                <div className="w-1/4 flex-shrink-0"></div> {/* Spacer for descriptor column */}
                {archetypes.map(archetype => (
                    <div key={archetype} className="w-1/4 flex-shrink-0 text-center p-2">
                        <h4 className="font-bold text-sm sm:text-lg" style={{ color: colorMap[archetype] }}>{archetype}</h4>
                    </div>
                ))}
            </div>

            {/* Grid Rows */}
            {gridData.map(({ descriptor, values }, rowIndex) => (
                <div key={descriptor} className="flex border-t border-gray-700">
                    {/* Descriptor Label Column */}
                    <div className="w-1/4 flex-shrink-0 flex items-center justify-center p-2 border-r border-gray-700">
                        <h5 className="font-semibold text-center text-sm sm:text-base text-gray-300">
                            {descriptorMap[descriptor]}
                        </h5>
                    </div>
                    {/* Data Cells */}
                    {values.map((cellData, colIndex) => (
                        <div key={colIndex} className="w-1/4 flex-shrink-0 flex items-center justify-center min-h-[120px] sm:min-h-[160px] p-2">
                            {cellData && cellData.count > 0 && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: (rowIndex + colIndex) * 0.1, type: 'spring' }}
                                    className="rounded-full flex flex-col items-center justify-center text-center p-1"
                                    style={{
                                        width: `${sizeScale(cellData.count)}px`,
                                        height: `${sizeScale(cellData.count)}px`,
                                        backgroundColor: colorMap[cellData.archetype],
                                        color: '#111827', // Dark text for contrast
                                    }}
                                >
                                    <span className="text-2xl sm:text-3xl">{getEmoji(cellData.persona)}</span>
                                    <span className="text-sm sm:text-base font-bold">{cellData.count}</span>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BubbleGrid;
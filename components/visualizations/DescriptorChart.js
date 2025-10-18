'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

/**
 * Renders a horizontal bar chart for cohort descriptors.
 * @param {{ data: {descriptor: string, count: number}[], colorMap: Record<string, string> }} props
 */
const DescriptorChart = ({ data, colorMap }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.offsetWidth;
        const height = data.length * 60; // Dynamic height based on number of bars
        const margin = { top: 20, right: 30, bottom: 20, left: 150 }; // Increased left margin for labels

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .html(''); // Clear previous renders

        // X scale (for the counts)
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([margin.left, width - margin.right]);

        // Y scale (for the descriptor names)
        const y = d3.scaleBand()
            .domain(data.map(d => d.descriptor))
            .range([margin.top, height - margin.bottom])
            .padding(0.2);

        // Add Y axis labels
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll('text')
            .attr('class', 'text-sm sm:text-base text-gray-300 font-sans')
            .attr('x', -10); // Move text slightly left

        // Remove the axis line, keep the text
        svg.selectAll('.domain').remove();
        svg.selectAll('.tick line').remove();

        // Create a group for each bar and its label
        const groups = svg.selectAll('.bar-group')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'bar-group');

        // Draw the bars
        groups.append('rect')
            .attr('y', d => y(d.descriptor))
            .attr('x', margin.left)
            .attr('width', 0) // Start at 0 for animation
            .attr('height', y.bandwidth())
            .attr('fill', d => colorMap[d.descriptor] || '#ccc')
            .transition()
            .duration(800)
            .delay((d, i) => i * 150)
            .attr('width', d => x(d.count) - margin.left);

        // Add count labels inside the bars
        groups.append('text')
            .attr('y', d => y(d.descriptor) + y.bandwidth() / 2)
            .attr('x', d => x(d.count) - 10) // Position inside the end of the bar
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('class', 'text-base font-bold fill-gray-900')
            .style('opacity', 0)
            .text(d => d.count)
            .transition()
            .duration(800)
            .delay((d, i) => 200 + i * 150)
            .style('opacity', 1);

    }, [data, colorMap]);

    if (!data || data.length === 0) return null;

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} style={{ height: `${data.length * 60}px` }}></svg>
        </div>
    );
};

export default DescriptorChart;
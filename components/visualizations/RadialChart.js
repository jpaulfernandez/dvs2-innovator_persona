'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * A D3-powered radial chart component for React.
 * @param {{ data: {archetype: string, count: number}[], colorMap: Record<string, string> }} props
 */
const RadialChart = ({ data, colorMap }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.offsetWidth;
        const height = container.offsetWidth;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.archetype))
            .range(data.map(d => colorMap[d.archetype] || '#F3F4F6'));

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        // This is the key change for a radial/donut chart
        const arc = d3.arc()
            .innerRadius(radius * 0.5) // Creates the hole in the center
            .outerRadius(radius * 0.9); // A little padding from the edge

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .html(''); // Clear previous renders

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcs = pie(data);

        g.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.archetype))
            .attr('stroke', '#111827')
            .style('stroke-width', '2px');

    }, [data, colorMap]);

    return (
        <div ref={containerRef} className="w-full h-full flex justify-center items-center">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default RadialChart;
'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LINK_COLORS = {
    harmony: '#38bdf8',
    tension: '#f472b6',
};

const ForceGraph = ({ nodes, links, archetypeColorMap }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!nodes || nodes.length === 0 || !svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.offsetWidth;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height])
            .html(''); // Clear previous renders

        // **NEW: Create a container for all graph elements to apply zoom to**
        const g = svg.append('g');

        // **UPDATED: Stronger forces to declutter the graph**
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.type === 'harmony' ? 120 : 200)) // Increased distance
            .force('charge', d3.forceManyBody().strength(-250)) // Stronger repulsion
            .force('collide', d3.forceCollide().radius(30)) // Increased collision radius
            .force('center', d3.forceCenter(0, 0));

        // Draw links into the 'g' container
        const link = g.append('g')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', d => LINK_COLORS[d.type])
            .attr('stroke-width', 2);

        // Draw nodes into the 'g' container
        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g');

        node.append('circle')
            .attr('r', 12)
            .attr('fill', d => archetypeColorMap[d.archetype] || '#ccc')
            .attr('stroke', '#111827')
            .attr('stroke-width', 2);

        node.append('text')
            .attr('x', 15)
            .attr('y', '0.31em')
            .text(d => d.id)
            .attr('fill', '#e5e7eb')
            .attr('font-size', '12px')
            .style('pointer-events', 'none'); // Prevent text from blocking drag

        const drag = (simulation) => {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }
            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
            return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
        }
        node.call(drag(simulation));
        
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
        // **NEW: Implement zoom and pan**
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4]) // Min and max zoom levels
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
            
        svg.call(zoom);

    }, [nodes, links, archetypeColorMap]);

    return (
        <div ref={containerRef} className="w-full cursor-grab">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default ForceGraph;
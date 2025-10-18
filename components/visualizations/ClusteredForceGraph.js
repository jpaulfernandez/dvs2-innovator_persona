'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LINK_COLORS = {
    harmony: 'rgba(56, 189, 248, 0.3)', 
    tension: 'rgba(244, 114, 182, 0.3)',
};

const ClusteredForceGraph = ({ nodes, links, archetypeColorMap, viewMode }) => {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const simulationRef = useRef();

    const shapeScale = d3.scaleOrdinal()
        .domain(["Thinker", "Empath", "Tinkerer", "Builder"])
        .range([d3.symbolCircle, d3.symbolDiamond, d3.symbolTriangle, d3.symbolSquare]);

    const symbol = d3.symbol().size(250);
    const clusterColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // **HERE IS THE MISSING DRAG FUNCTION**
    // It needs to be defined within the component.
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
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    useEffect(() => {
        if (!nodes || nodes.length === 0 || !svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.offsetWidth;
        const height = 650;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height]);
        
        const g = svg.selectAll('.zoom-container').data([null]).join('g').attr('class', 'zoom-container');

        if (!simulationRef.current) {
            simulationRef.current = d3.forceSimulation()
                .force('link', d3.forceLink().id(d => d.id).distance(120).strength(0.4))
                .force('charge', d3.forceManyBody().strength(-400))
                .force('center', d3.forceCenter(0, 0).strength(0.1))
                .force('collide', d3.forceCollide().radius(40));
        }
        const simulation = simulationRef.current;

        simulation.nodes(nodes);
        simulation.force('link').links(links);
        
        const link = g.selectAll('.links').data([null]).join('g').attr('class', 'links')
            .selectAll('line')
            .data(links, d => `${d.source.id}-${d.target.id}`)
            .join('line')
            .attr('stroke', d => LINK_COLORS[d.type])
            .attr('stroke-width', 1.5);

        const node = g.selectAll('.nodes').data([null]).join('g').attr('class', 'nodes')
            .selectAll('path')
            .data(nodes, d => d.id)
            .join(
                enter => enter.append('path')
                    .attr('d', d => symbol.type(shapeScale(d.archetype))())
                    .call(drag(simulation)) // This will now work correctly
            );

        node.transition()
            .duration(750)
            .attr('fill', d => viewMode === 'cluster' ? clusterColorScale(d.community) : archetypeColorMap[d.archetype]);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        const zoom = d3.zoom()
            .scaleExtent([0.2, 5])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
            
        svg.call(zoom);
        simulation.alpha(1).restart();

    }, [nodes, links, archetypeColorMap, shapeScale, viewMode]);

    return (
        <div ref={containerRef} className="w-full h-[650px] cursor-grab bg-black/20 rounded-lg">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default ClusteredForceGraph;
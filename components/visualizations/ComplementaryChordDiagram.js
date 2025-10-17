// components/visualizations/ComplementaryChordDiagram.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function ComplementaryChordDiagram({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- 1. Data Processing: Create a Connection Matrix ---
    const archetypes = ["Thinker", "Tinkerer", "Empath", "Builder"];
    const matrix = Array(archetypes.length).fill(0).map(() => Array(archetypes.length).fill(0));

    data.forEach(d => {
      const primaryIndex = archetypes.indexOf(d.Primary_Archetype);
      const secondaryIndex = archetypes.indexOf(d.Secondary_Archetype);
      if (primaryIndex !== -1 && secondaryIndex !== -1) {
        matrix[primaryIndex][secondaryIndex]++;
      }
    });

    // --- 2. Chart Dimensions ---
    const width = 700; // Slightly wider for labels
    const height = 700; // Slightly taller
    const outerRadius = Math.min(width, height) * 0.5 - 80; // More space for labels
    const innerRadius = outerRadius - 20; // Thicker arcs

    // --- 3. D3 Setup for Chord Diagram ---
    const chord = d3.chord()
      .padAngle(0.02) // Reduced padding for a tighter circle
      .sortSubgroups(d3.descending);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
      .radius(innerRadius);

    // NEW: Using the distinct color palette
    const color = d3.scaleOrdinal(archetypes, ["#345B9C", "#7E57C2", "#E97B7B", "#E57C23"]); // Deep Blue, Violet, Coral, Amber

    // --- 4. SVG Setup ---
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove();

    // --- 5. Drawing the Diagram ---
    const chords = chord(matrix);

    // Add the outer groups (arcs)
    const group = svg.append("g")
      .selectAll("g")
      .data(chords.groups)
      .join("g")
      .attr("class", d => `group-${archetypes[d.index].replace(/\s/g, '')}`); // Add class for selection

    group.append("path")
      .attr("fill", d => color(archetypes[d.index]))
      .attr("stroke", d => d3.rgb(color(archetypes[d.index])).darker(0.5)) // Darker stroke for definition
      .attr("d", arc);
    
    // NEW: Improved horizontal labels
    group.append("text")
      .each(d => {
        d.angle = (d.startAngle + d.endAngle) / 2;
        d.centroid = arc.centroid(d); // Calculate centroid for arc
      })
      .attr("transform", d => {
        const x = d.centroid[0] * 1.2; // Move label further out
        const y = d.centroid[1] * 1.2;
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle") // Center the text
      .attr("class", "text-sm fill-gray-800 font-semibold")
      .text(d => archetypes[d.index]);

    // Add the ribbons (chords)
    const ribbons = svg.append("g")
      .attr("fill-opacity", 0.8) // Increased opacity for better visibility
      .selectAll("path")
      .data(chords)
      .join("path")
        .attr("class", d => `ribbon from-${archetypes[d.source.index].replace(/\s/g, '')} to-${archetypes[d.target.index].replace(/\s/g, '')}`) // Classes for interaction
        .attr("d", ribbon)
        .attr("fill", d => color(archetypes[d.target.index])) // Fill based on target archetype
        .attr("stroke", d => d3.rgb(color(archetypes[d.target.index])).darker(0.5));

    // --- 6. Interactivity (Hover Effects) ---
    group.on("mouseover", function(event, d) {
      const selectedArchetype = archetypes[d.index].replace(/\s/g, '');
      
      // Dim all ribbons
      ribbons.transition().style("opacity", 0.1);
      
      // Highlight ribbons originating from or targeting the selected group
      svg.selectAll(`.ribbon.from-${selectedArchetype}, .ribbon.to-${selectedArchetype}`)
         .transition().style("opacity", 1);
      
      // Dim other groups
      group.transition().style("opacity", 0.3);
      d3.select(this).transition().style("opacity", 1); // Keep selected group visible
    });

    svg.on("mouseout", function() {
      // Restore all ribbons and groups to full opacity
      ribbons.transition().style("opacity", 0.8);
      group.transition().style("opacity", 1);
    });

  }, [data]);

  return (
    <div className="flex justify-center bg-white rounded-md p-4">
      <svg ref={ref}></svg>
    </div>
  );
}
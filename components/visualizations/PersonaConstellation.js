// components/visualizations/PersonaConstellation.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function PersonaConstellation({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // We need to create a copy so the simulation doesn't mutate the original prop data
    const nodes = data.map(d => ({ ...d }));

    // 1. Chart Dimensions
    const width = 600;
    const height = 450;

    // 2. SVG Setup
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove();

    // 3. Color Scale for Archetypes
    const colorScale = d3.scaleOrdinal()
      .domain(["Thinker", "Tinkerer", "Empath"])
      .range(["#AECBFA", "#FFFFFF", "#F5D6E4"]); // Blue, White, Pink

    // 4. Force Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.1)) // Pulls nodes to the center
      .force("charge", d3.forceManyBody().strength(-50)) // Pushes nodes apart
      .force("collide", d3.forceCollide().radius(25)) // Prevents nodes from overlapping
      // This is the key force for clustering by persona
      .force("x", d3.forceX().strength(0.05).x(d => clusterXPosition(d.Primary_Persona)))
      .force("y", d3.forceY().strength(0.05).y(height / 2));

    // Helper function to map personas to a horizontal position
    function clusterXPosition(persona) {
        if (persona.includes('🌊')) return width * 0.2;
        if (persona.includes('🚀')) return width * 0.4;
        if (persona.includes('💞')) return width * 0.6;
        if (persona.includes('🧩')) return width * 0.8;
        return width / 2;
    }

    // 5. Draw Elements (Nodes and Labels)
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g");
      
    node.append("circle")
      .attr("r", 8)
      .attr("fill", d => colorScale(d.Primary_Archetype))
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1.5);
    
    node.append("text")
      .text(d => d.Nickname)
      .attr("x", 12)
      .attr("y", 4)
      .attr("class", "text-xs fill-text-light opacity-80");

    // 6. Ticker Function
    // On each "tick" of the simulation, update the positions of the nodes and labels
    simulation.on("tick", () => {
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

  }, [data]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={ref}></svg>
    </div>
  );
}
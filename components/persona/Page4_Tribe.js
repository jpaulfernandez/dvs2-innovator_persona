// components/persona/Page4_Tribe.js (REVISED)

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Page4_Tribe({ userData, cohortData }) {
  const ref = useRef();

  useEffect(() => {
    if (!userData || !cohortData) return;

    // 1. Filter for members of the user's tribe
    const tribeMembers = cohortData
      .filter(d => d.Primary_Persona === userData.Primary_Persona)
      .map(d => ({ ...d })); // Create copies for the simulation

    // --- D3 Setup ---
    const width = 500;
    const height = 400;
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);
    
    svg.selectAll("*").remove();

    const color = "#345B9C"; // Using a consistent color for the tribe

    // 2. Create Force Simulation
    const simulation = d3.forceSimulation(tribeMembers)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(45))
      .stop();

    // Run simulation for a few iterations to position nodes
    for (let i = 0; i < 150; ++i) simulation.tick();

    // 3. Draw Nodes (Tribe Members)
    const node = svg.append("g")
      .selectAll("g")
      .data(tribeMembers)
      .join("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    node.append("circle")
      .attr("r", 35)
      .attr("fill", d => d.Email.toLowerCase() === userData.Email.toLowerCase() ? color : "#f3f4f6") // Highlight user
      .attr("stroke", color)
      .attr("stroke-width", 3);

    node.append("text")
      .text(d => d.Email.toLowerCase() === userData.Email.toLowerCase() ? "You" : d.Nickname)
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("class", d => d.Email.toLowerCase() === userData.Email.toLowerCase() ? "fill-white font-bold" : "fill-gray-700 font-medium")
      .style("font-size", "12px");

  }, [userData, cohortData]);

  return (
    <div className="text-center text-gray-800 animate-fade-in w-full">
      <h2 className="text-2xl font-light opacity-80 mb-6 max-w-2xl mx-auto">
        Youre not alone. Here is your tribe—the other members who share your unique persona.
      </h2>
      
      <div className="w-full flex justify-center">
        <svg ref={ref}></svg>
      </div>
    </div>
  );
}
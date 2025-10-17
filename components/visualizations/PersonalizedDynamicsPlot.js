// components/visualizations/PersonalizedDynamicsPlot.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

// This component is an adaptation of DynamicsScatterPlot
export default function PersonalizedDynamicsPlot({ cohortData, currentUserEmail }) {
  const ref = useRef();

  useEffect(() => {
    if (!cohortData || cohortData.length === 0 || !currentUserEmail) return;

    const currentUser = cohortData.find(d => d.Email.toLowerCase() === currentUserEmail.toLowerCase());
    if (!currentUser) return;

    // --- Data Processing (same as before) ---
    const yMapping = { 'Thinker': 1, 'Tinkerer': 0.2, 'Empath': -1 };
    const xMapping = { 'Momentum Seeker': 1, 'Flow Hacker': 0.8, 'Still Current': -1, 'Empathic Pulse': -0.8 };

    const processedData = cohortData.map(d => {
      const jitter = 0.12;
      return {
        ...d,
        x: (xMapping[d.Primary_Descriptor] || 0) + (Math.random() * jitter - jitter / 2),
        y: (yMapping[d.Primary_Archetype] || 0) + (Math.random() * jitter - jitter / 2),
      };
    });

    // --- Chart Dimensions and Scales (same as before) ---
    const width = 800;
    const height = 550;
    const margin = { top: 60, right: 10, bottom: 60, left: 10 };
    const xScale = d3.scaleLinear().domain([-1.5, 1.5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-1.5, 1.5]).range([height - margin.bottom, margin.top]);
    const colorScale = d3.scaleOrdinal().domain(["Thinker", "Tinkerer", "Empath"]).range(["#345B9C", "#7E57C2", "#E97B7B"]);

    // --- SVG Setup ---
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-width", "100%").style("height", "auto");

    svg.selectAll("*").remove();

    // --- Drawing the Chart ---
    const nodeRadius = 8;
    const nodeGroup = svg.append("g");

    processedData.forEach(d => {
      const isCurrentUser = d.Email.toLowerCase() === currentUserEmail.toLowerCase();
      const isInTribe = d.Primary_Persona === currentUser.Primary_Persona;
      
      const node = nodeGroup.append("g")
        .attr("opacity", isInTribe ? 1 : 0.2)
        .style("transition", "opacity 0.5s");

      // Glowing effect for the current user
      if (isCurrentUser) {
        node.append("circle")
          .attr("cx", xScale(d.x))
          .attr("cy", yScale(d.y))
          .attr("r", nodeRadius + 4)
          .attr("fill", colorScale(d.Primary_Archetype))
          .attr("filter", "url(#glow)");
      }
      
      // Main circle
      node.append("circle")
        .attr("cx", xScale(d.x))
        .attr("cy", yScale(d.y))
        .attr("r", nodeRadius)
        .attr("fill", colorScale(d.Primary_Archetype))
        .attr("stroke", "#000000")
        .attr("stroke-width", 1.5);
      
      // Label
      if (isInTribe) {
        node.append("text")
          .attr("x", xScale(d.x) + nodeRadius + 5)
          .attr("y", yScale(d.y) + 4)
          .text(isCurrentUser ? "You" : d.Nickname)
          .attr("class", "text-xs font-bold")
          .style("fill", isCurrentUser ? "#000000" : "#4b5563");
      }
    });

    // --- SVG Filters for Glow Effect ---
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  }, [cohortData, currentUserEmail]);

  return <svg ref={ref}></svg>;
}
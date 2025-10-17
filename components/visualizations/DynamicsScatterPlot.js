// components/visualizations/DynamicsScatterPlot.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function DynamicsScatterPlot({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- 1. Data Processing ---
    const yMapping = { 'Thinker': 1, 'Tinkerer': 0.2, 'Empath': -1 };
    const xMapping = { 'Momentum Seeker': 1, 'Flow Hacker': 0.8, 'Still Current': -1, 'Empathic Pulse': -0.8 };

    const processedData = data.map((d, i) => {
      const jitter = 0.12;
      return {
        id: i,
        ...d,
        x: (xMapping[d.Primary_Descriptor] || 0) + (Math.random() * jitter - jitter / 2),
        y: (yMapping[d.Primary_Archetype] || 0) + (Math.random() * jitter - jitter / 2),
      };
    });

    const centerX = d3.mean(processedData, d => d.x);
    const centerY = d3.mean(processedData, d => d.y);

    // --- 2. Chart Dimensions ---
    const width = 900;
    const height = 600;
    const margin = { top: 80, right: 160, bottom: 80, left: 120 };

    // --- 3. D3 Scales (UPDATED COLORS) ---
    const xScale = d3.scaleLinear().domain([-1.5, 1.5]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([-1.5, 1.5]).range([height - margin.bottom, margin.top]);
    
    // Using the new, darker colors from your design language for better readability.
    const colorScale = d3.scaleOrdinal()
      .domain(["Thinker", "Tinkerer", "Empath"])
      .range(["#345B9C", "#7E57C2", "#E97B7B"]); // Deep Blue, Violet, Coral

    // --- 4. SVG Setup ---
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove();

    // Clean white background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#ffffff");

    // --- 5. Axes with Grid ---
    // Subtle grid lines
    [-1, -0.5, 0.5, 1].forEach(val => {
      svg.append("line").attr("x1", xScale(val)).attr("x2", xScale(val)).attr("y1", margin.top).attr("y2", height - margin.bottom).attr("stroke", "#e5e7eb").attr("stroke-width", 1);
      svg.append("line").attr("x1", margin.left).attr("x2", width - margin.right).attr("y1", yScale(val)).attr("y2", yScale(val)).attr("stroke", "#e5e7eb").attr("stroke-width", 1);
    });

    // Axis lines
    svg.append("line").attr("x1", xScale(0)).attr("x2", xScale(0)).attr("y1", margin.top).attr("y2", height - margin.bottom).attr("stroke", "#9ca3af").attr("stroke-width", 2);
    svg.append("line").attr("x1", margin.left).attr("x2", width - margin.right).attr("y1", yScale(0)).attr("y2", yScale(0)).attr("stroke", "#9ca3af").attr("stroke-width", 2);

    // Axis labels
    svg.append("text").text("Logic & Ideas Focus").attr("x", width/2).attr("y", margin.top - 35).attr("text-anchor", "middle").attr("class", "fill-gray-700 font-semibold text-sm");
    svg.append("text").text("People & Process Focus").attr("x", width/2).attr("y", height - margin.bottom + 50).attr("text-anchor", "middle").attr("class", "fill-gray-700 font-semibold text-sm");
    svg.append("text").text("Reflective Energy").attr("x", margin.left - 60).attr("y", height/2).attr("transform", `rotate(-90, ${margin.left - 60}, ${height/2})`).attr("text-anchor", "middle").attr("class", "fill-gray-700 font-semibold text-sm");
    svg.append("text").text("Action-Oriented Energy").attr("x", width - margin.right + 60).attr("y", height/2).attr("transform", `rotate(90, ${width - margin.right + 60}, ${height/2})`).attr("text-anchor", "middle").attr("class", "fill-gray-700 font-semibold text-sm");

    // --- 6. Center of Gravity ---
    svg.append("circle").attr("cx", xScale(centerX)).attr("cy", yScale(centerY)).attr("r", 75).attr("fill", "none").attr("stroke", "#FF6B6B").attr("stroke-width", 2).attr("stroke-dasharray", "6,6");
    svg.append("text").text("Cohort Center").attr("x", xScale(centerX)).attr("y", yScale(centerY) - 8).attr("text-anchor", "middle").attr("class", "fill-[#FF6B6B] font-bold text-sm");
    svg.append("text").text("of Gravity").attr("x", xScale(centerX)).attr("y", yScale(centerY) + 10).attr("text-anchor", "middle").attr("class", "fill-[#FF6B6B] font-bold text-sm");

    // --- 7. Data Points ---
    const nodeRadius = 8;
    const nodeGroup = svg.append("g");
    
    processedData.forEach(d => {
      const isThinker = d.Primary_Archetype === 'Thinker';
      nodeGroup.append("circle")
        .attr("cx", xScale(d.x))
        .attr("cy", yScale(d.y))
        .attr("r", nodeRadius)
        .attr("fill", colorScale(d.Primary_Archetype))
        .attr("stroke", "#000000")
        .attr("stroke-width", 1.5)
        .attr("fill-opacity", isThinker ? 0.8 : 1) // Slightly adjusted opacity for darker color
        .style("cursor", "pointer");
    });

    // --- 8. Smart Labels with Forces ---
    const labelNodes = processedData.map(d => ({ 
      id: `label-${d.id}`, dataId: d.id, name: d.Nickname, targetX: xScale(d.x), targetY: yScale(d.y),
      x: xScale(d.x) + (Math.random() - 0.5) * 20, y: yScale(d.y) + (Math.random() - 0.5) * 20, radius: 25
    }));
    const links = labelNodes.map(d => ({ source: d.dataId, target: d.id }));
    const allNodes = [ ...processedData.map(d => ({ id: d.id, x: xScale(d.x), y: yScale(d.y), fx: xScale(d.x), fy: yScale(d.y), radius: nodeRadius + 10 })), ...labelNodes ];
    const labelGroup = svg.append("g");
    const simulation = d3.forceSimulation(allNodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(25).strength(0.5))
      .force("collide", d3.forceCollide().radius(d => d.radius).strength(0.9))
      .force("x", d3.forceX(d => d.targetX || d.x).strength(d => d.targetX ? 0.2 : 0))
      .force("y", d3.forceY(d => d.targetY || d.y).strength(d => d.targetY ? 0.2 : 0))
      .force("charge", d3.forceManyBody().strength(-80))
      .force("bounds", () => {
        labelNodes.forEach(d => {
          d.x = Math.max(margin.left + 30, Math.min(width - margin.right - 30, d.x));
          d.y = Math.max(margin.top + 20, Math.min(height - margin.bottom - 20, d.y));
        });
      })
      .stop();
    for (let i = 0; i < 300; i++) { simulation.tick(); }
    labelNodes.forEach(d => {
      const dataPoint = processedData[d.dataId];
      const dx = d.x - xScale(dataPoint.x); const dy = d.y - yScale(dataPoint.y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 15) {
        labelGroup.append("line").attr("x1", xScale(dataPoint.x)).attr("y1", yScale(dataPoint.y)).attr("x2", d.x).attr("y2", d.y).attr("stroke", "#d1d5db").attr("stroke-width", 1).attr("opacity", 0.5);
      }
    });
    labelNodes.forEach(d => {
      const textEl = labelGroup.append("text").attr("x", d.x).attr("y", d.y).attr("text-anchor", "middle").attr("dominant-baseline", "middle").attr("class", "text-xs fill-gray-800 font-medium").style("pointer-events", "none").text(d.name);
    });

    // --- 9. Legend ---
    const legend = svg.append("g").attr("transform", `translate(${width - margin.right + 30}, ${margin.top})`);
    const legendItems = colorScale.domain();
    legend.append("text").text("Archetypes").attr("class", "fill-gray-800 font-bold text-sm").attr("x", 0).attr("y", -15);
    legendItems.forEach((d, i) => {
      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * 35})`);
      const isThinker = d === 'Thinker';
      legendItem.append("circle").attr("r", 7).attr("fill", colorScale(d)).attr("stroke", "#000000").attr("stroke-width", 1.5).attr("fill-opacity", isThinker ? 0.8 : 1);
      legendItem.append("text").text(d).attr("x", 18).attr("y", 5).attr("class", "text-sm fill-gray-800 font-medium");
    });

  }, [data]);

  return (
    <div className="flex justify-center items-center w-full p-4 bg-white">
      <svg ref={ref}></svg>
    </div>
  );
}
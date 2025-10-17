// components/visualizations/ArchetypeBarChart.js (Updated for minimalist style)

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function ArchetypeBarChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- Data Processing (same as before) ---
    const archetypeCounts = d3.rollup(data, v => v.length, d => d.Primary_Archetype);
    const processedData = Array.from(archetypeCounts, ([key, value]) => ({ archetype: key, count: value }))
                              .sort((a, b) => b.count - a.count);

    // --- Chart Dimensions ---
    const width = 500;
    const height = 300;
    const marginTop = 20;
    const marginRight = 0; // No right margin
    const marginBottom = 30;
    const marginLeft = 30; // A bit of left margin for axis labels

    // --- D3 Scales (same as before) ---
    const x = d3.scaleBand()
      .domain(processedData.map(d => d.archetype))
      .range([marginLeft, width - marginRight])
      .padding(0.3); // Increased padding for a more spacious look

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.count)]).nice()
      .range([height - marginBottom, marginTop]);

    // --- SVG Setup ---
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove(); // Clear previous renders

    // --- Draw Bars (Updated Style) ---
    svg.append("g")
      .selectAll("rect")
      .data(processedData)
      .join("rect")
        .attr("x", d => x(d.archetype))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth())
        .attr("fill", "#AECBFA") // Using our single, elegant accent-blue
        .attr("class", "hover:opacity-80 transition-opacity");

    // --- Draw Axes (Updated Style) ---
    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSize(0)) // No tick marks
        .call(g => g.select(".domain").remove()) // No axis line
        .selectAll("text")
          .attr("class", "text-xs fill-text-light opacity-70");

    // Y-axis with horizontal grid lines
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickSize(-(width - marginLeft - marginRight))) // Create grid lines
        .call(g => g.select(".domain").remove()) // No axis line
        .call(g => g.selectAll(".tick line") // Style the grid lines
            .attr("stroke-opacity", 0.1)
            .attr("stroke-dasharray", "2,2")) // Dashed lines
        .call(g => g.selectAll(".tick text") // Style the axis labels
            .attr("class", "text-xs fill-text-light opacity-70")
            .attr("x", -4));

  }, [data]);

  return (
    <div>
      <svg ref={ref}></svg>
    </div>
  );
}
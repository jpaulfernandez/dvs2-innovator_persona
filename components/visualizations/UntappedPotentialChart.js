// components/visualizations/UntappedPotentialChart.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function UntappedPotentialChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- 1. Data Processing ---
    // Filter out invalid "NaN" entries and count secondary archetypes
    const secondaryCounts = d3.rollup(
      data.filter(d => d.Secondary_Archetype && d.Secondary_Archetype !== 'NaN'),
      v => v.length,
      d => d.Secondary_Archetype
    );

    const processedData = Array.from(secondaryCounts, ([key, value]) => ({
      archetype: key,
      count: value
    })).sort((a, b) => a.count - b.count); // Sort ascending to highlight the lowest

    // --- 2. Chart Dimensions ---
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 40, left: 100 };

    // --- 3. D3 Scales ---
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.count)]).nice()
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(processedData.map(d => d.archetype))
      .range([margin.top, height - margin.bottom])
      .padding(1);

    const color = d3.scaleOrdinal()
      .domain(["Builder", "Empath", "Tinkerer", "Thinker"])
      .range(["#E57C23", "#E97B7B", "#7E57C2", "#345B9C"]); // Amber, Coral, Violet, Deep Blue

    // --- 4. SVG Setup ---
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove();

    // --- 5. Drawing the Chart ---
    // Lines
    svg.selectAll("myline")
      .data(processedData)
      .join("line")
      .attr("x1", xScale(0))
      .attr("x2", d => xScale(d.count))
      .attr("y1", d => yScale(d.archetype))
      .attr("y2", d => yScale(d.archetype))
      .attr("stroke", "#9ca3af") // Gray line
      .attr("stroke-width", "2px");

    // Circles
    svg.selectAll("mycircle")
      .data(processedData)
      .join("circle")
      .attr("cx", d => xScale(d.count))
      .attr("cy", d => yScale(d.archetype))
      .attr("r", "8")
      .style("fill", d => color(d.archetype))
      .attr("stroke", d => d3.rgb(color(d.archetype)).darker(0.7))
      .attr("stroke-width", 2);

    // --- 6. Axes & Labels ---
    // Y-axis labels (Archetypes)
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickSize(0))
      .call(g => g.select(".domain").remove()) // Remove axis line
      .selectAll("text")
      .attr("class", "text-base fill-gray-800 font-medium")
      .attr("transform", "translate(-10,0)"); // Move labels left

    // X-axis (Count)
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(d3.max(processedData, d => d.count)))
      .call(g => g.select(".domain").remove()) // Remove axis line
      .selectAll("text")
      .attr("class", "text-sm fill-gray-600");

  }, [data]);

  return (
    <div className="flex justify-center">
      <svg ref={ref}></svg>
    </div>
  );
}
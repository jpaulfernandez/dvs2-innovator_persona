// components/visualizations/DescriptorTreemap.js

"use client";

import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

export default function DescriptorTreemap({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 1. Data Processing: Count descriptors
    const descriptorCounts = d3.rollup(data, v => v.length, d => d.Primary_Descriptor);
    
    // Format data for d3.hierarchy: { name: 'root', children: [...] }
    const root = {
      name: "root",
      children: Array.from(descriptorCounts, ([key, value]) => ({ name: key, value: value }))
    };

    // 2. Chart Dimensions
    const width = 600;
    const height = 350;

    // 3. Create a D3 hierarchy from the data
    const hierarchy = d3.hierarchy(root).sum(d => d.value).sort((a, b) => b.value - a.value);

    // 4. Create the Treemap Layout function
    const treemapLayout = d3.treemap()
      .size([width, height])
      .padding(2); // Padding between the rectangles

    // 5. Apply the layout to the hierarchy
    treemapLayout(hierarchy);

    // 6. SVG Setup
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto; font-family: 'Inter', sans-serif;");

    svg.selectAll("*").remove();

    // Color palette for the treemap cells
    const colors = ["#AECBFA", "#F5D6E4", "#FFFFFF"]; // accent-blue, accent-pink, and white

    // 7. Draw the Treemap rectangles (leaves)
    const cell = svg.selectAll("g")
      .data(hierarchy.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

    // Add rectangles
    cell.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", (d, i) => colors[i % colors.length]) // Cycle through our colors
      .attr("fill-opacity", 0.15)
      .attr("stroke", (d, i) => colors[i % colors.length]);

    // Add text labels
    cell.append("text")
      .attr("x", 8)
      .attr("y", 20)
      .text(d => d.data.name)
      .attr("class", "text-sm fill-text-light font-semibold");

    // Add count labels
    cell.append("text")
      .attr("x", 8)
      .attr("y", 38)
      .text(d => `${d.data.value} members`)
      .attr("class", "text-xs fill-text-light opacity-70");

  }, [data]);

  return (
    <div>
      <svg ref={ref}></svg>
    </div>
  );
}
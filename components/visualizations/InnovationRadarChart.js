"use client";

import { useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const archetypes = [
  { name: 'Empathy', axis: 'Empath', color: '#E97B7B' },
  { name: 'Execution', axis: 'Builder', color: '#E57C23' },
  { name: 'Analysis', axis: 'Thinker', color: '#345B9C' },
  { name: 'Iteration', axis: 'Tinkerer', color: '#7E57C2' },
];

export default function InnovationRadarChart({ scores }) {
  const chartSize = 620;
  const radius = chartSize / 3; // Adjusted radius to make space for labels
  const angleSlice = (Math.PI * 2) / archetypes.length;

  // D3 scale to map scores (0-100) to a radius length
  const rScale = useMemo(() => d3.scaleLinear().range([0, radius]).domain([0, 100]), [radius]);

  // Calculate the points for the data polygon
  const dataPoints = useMemo(() => {
    return archetypes.map((d, i) => {
      const score = scores[d.axis] || 0;
      const angle = angleSlice * i - Math.PI / 2; // Start at the top
      return {
        x: radius + rScale(score) * Math.cos(angle),
        y: radius + rScale(score) * Math.sin(angle),
      };
    });
  }, [scores, rScale, radius, angleSlice]);

  const pathData = useMemo(() => {
    let path = "M";
    dataPoints.forEach((p, i) => {
      path += ` ${p.x},${p.y} `;
      if (i < dataPoints.length - 1) path += "L";
    });
    return path + "Z";
  }, [dataPoints]);

  return (
    <div className="relative" style={{ width: chartSize, height: chartSize }}>
      <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
        <g transform={`translate(${chartSize / 2 - radius}, ${chartSize / 2 - radius})`}>
          {/* Grid Lines */}
          {[...Array(4)].map((_, i) => (
            <motion.line
              key={i}
              x1={radius} y1={radius}
              x2={radius + radius * Math.cos(angleSlice * i - Math.PI / 2)}
              y2={radius + radius * Math.sin(angleSlice * i - Math.PI / 2)}
              stroke="#e5e7eb"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
            />
          ))}

          {/* Polygon Fill */}
          <motion.path
            d={pathData}
            fill="#A78BFA"
            fillOpacity={0.3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 3, duration: 1 } }}
          />

          {/* Polygon Stroke */}
          <motion.path
            d={pathData}
            stroke="#A78BFA"
            strokeWidth={3}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, transition: { delay: 1.8, duration: 1.2, ease: 'easeInOut' } }}
          />

          {/* --- LABELS --- */}
          {archetypes.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return (
              <g key={d.name}>
                {/* 1. Archetype Name Label (NEW) */}
                <motion.text
                  x={radius + (radius + 70) * Math.cos(angle)}
                  y={radius + (radius + 50) * Math.sin(angle)}
                  textAnchor="middle"
                  dy="0.35em"
                  className="font-semibold text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 3.4, duration: 1 } }} // Animates with grid lines
                >
                  {d.name}
                </motion.text>
                
                {/* 2. Percentage Label (existing) */}
                <motion.text
                  x={radius + (radius + 25) * Math.cos(angle)}
                  y={radius + (radius + 25) * Math.sin(angle)}
                  textAnchor="middle"
                  dy="0.35em"
                  className="font-bold text-sm"
                  fill={d.color}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: 3.4, duration: 0.6 } }}
                >
                  {`${Math.round(scores[d.axis] || 0)}%`}
                </motion.text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
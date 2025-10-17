// components/visualizations/InnovationModeChart.js

"use client";

import React from 'react';

export default function InnovationModeChart({ scores }) {
  // Gracefully handle cases where scores are missing or not an object
  if (!scores || typeof scores !== 'object') {
    return <div className="text-sm text-gray-500">Innovation scores are being calculated...</div>;
  }

  const archetypes = [
    { name: "Analysis", score: scores.Thinker || 0, color: "bg-blue-500" },
    { name: "Execution", score: scores.Builder || 0, color: "bg-amber-500" },
    { name: "Iteration", score: scores.Tinkerer || 0, color: "bg-purple-500" },
    { name: "Empathy", score: scores.Empath || 0, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      {archetypes.map(arc => (
        <div key={arc.name} className="flex items-center gap-3">
          <p className="w-20 text-sm font-medium text-gray-600">{arc.name}</p>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className={`${arc.color} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${Math.round(arc.score)}%` }} // Ensure score is a whole number
            ></div>
          </div>
          <p className="w-10 text-sm font-bold text-gray-800">{Math.round(arc.score)}%</p>
        </div>
      ))}
    </div>
  );
}
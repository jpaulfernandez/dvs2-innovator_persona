// app/summary/page.js (Updated for new Act 3)

import * as d3 from 'd3';
import { csvData } from '../../data/cohortData';
import ArchetypeBarChart from '../../components/visualizations/ArchetypeBarChart';
import DescriptorTreemap from '../../components/visualizations/DescriptorTreemap';
import DynamicsScatterPlot from '../../components/visualizations/DynamicsScatterPlot';
import ComplementaryChordDiagram from '../../components/visualizations/ComplementaryChordDiagram'; 
import UntappedPotentialChart from '../../components/visualizations/UntappedPotentialChart';

export default function SummaryPage() {
  const cohortData = d3.csvParse(csvData);

  return (
    <main className="min-h-screen bg-background-dark text-text-light p-8 font-sans">
      <header className="text-left mb-20 max-w-4xl mx-auto">
        <span className="text-2xl font-bold border border-text-light px-2 py-1">MIB2026B</span>
        <h1 className="text-6xl font-bold mt-8">
          The Collaborative Blueprint.
        </h1>
      </header>
      
      {/* Acts 1 and 2 remain the same... */}
      <section className="max-w-4xl mx-auto mb-20 p-8 rounded-lg border border-border-light">
        <h2 className="text-sm uppercase tracking-widest opacity-70 mb-2">Act 1: Our Collective Pulse</h2>
        <p className="text-lg text-text-light opacity-80 mb-8 max-w-2xl">
          This is our foundational energy, revealing the core archetypes that define our cohorts approach to problem-solving and collaboration.
        </p>
        <div className="mt-4">
          <ArchetypeBarChart data={cohortData} />
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-20 p-8 rounded-lg border border-border-light">
        <h2 className="text-sm uppercase tracking-widest opacity-70 mb-2">Act 2: The Driving Current</h2>
        <p className="text-lg text-text-light opacity-80 mb-8 max-w-2xl">
          Beyond *who* we are, *how* do we operate? This map reveals our prevailing styles of engagement, showing which energies—from Momentum Seeking to Still Current—propel us forward.
        </p>
        <div className="mt-4 flex justify-center">
          <DescriptorTreemap data={cohortData} />
        </div>
      </section>

      {/* --- ACT 3 --- (REVISED) */}
      <section className="max-w-4xl mx-auto mb-20 p-8 rounded-lg border border-border-light">
        <h2 className="text-sm uppercase tracking-widest opacity-70 mb-2">Act 3: The Cohort Dynamics Map</h2>
        <p className="text-lg text-text-light opacity-80 mb-8 max-w-2xl">
          This map plots our cohorts natural tendencies. The Center of Gravity reveals our collective comfort zone—predominantly reflective and logic-focused. Our greatest growth opportunities lie in bridging the gap and collaborating with those in other quadrants.
        </p>
        <div className="mt-4 flex justify-center">
          <DynamicsScatterPlot data={cohortData} /> {/* <-- USE NEW CHART */}
        </div>
      </section>
{/* --- ACT 4 --- (NEW SECTION) */}
      <section className="max-w-4xl mx-auto mb-20 p-8 rounded-lg border border-border-light">
        <h2 className="text-sm uppercase tracking-widest opacity-70 mb-2">Act 4: The Complementary Weave</h2>
        <p className="text-lg text-text-light opacity-80 mb-8 max-w-2xl">
          Our greatest strength lies in our versatility. This diagram reveals the connections between our primary roles and our secondary strengths. The ribbons show the flow of skills, highlighting our blueprint for building well-rounded, unstoppable teams.
        </p>
        <div className="mt-4 flex justify-center bg-white rounded-md p-4"> {/* White background for visibility */}
          <ComplementaryChordDiagram data={cohortData} />
        </div>
      </section>

      <section className="max-w-5xl mx-auto mb-24 p-8 rounded-lg border border-gray-200 bg-white">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-2">Act 5: Unlocking Potential</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Every cohort has areas for growth. This chart shows our least common secondary archetypes—our untapped rivers. By consciously developing these skills, we can become an even more robust and well-rounded team.
        </p>
        <div className="mt-4 flex justify-center">
          <UntappedPotentialChart data={cohortData} />
        </div>
      </section>
    </main>
  );
}
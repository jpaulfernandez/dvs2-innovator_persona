import * as d3 from 'd3';
import { csvData } from '../data/cohortData';
import ArchetypeBarChart from '../components/visualizations/ArchetypeBarChart'; // <-- IMPORT

export async function getStaticProps() {
  const data = d3.csvParse(csvData);
  return {
    props: {
      cohortData: data,
    },
  };
}

export default function SummaryPage({ cohortData }) {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-cyan-400 mb-2">The MIB2026B Collaborative Blueprint</h1>
        <p className="text-xl text-gray-300">An Interactive Data Story</p>
      </header>

      {/* --- ACT 1 --- */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-4">Act 1: Our Collective Pulse</h2>
        <p className="text-lg text-gray-400 mb-8">
          Every cohort has a beating heart, a prevailing mindset that guides its actions. This is our foundational energy, revealing our core strengths and where our collective focus tends to lie.
        </p>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* RENDER THE CHART and pass the data */}
          <ArchetypeBarChart data={cohortData} />
        </div>
      </section>

    </main>
  );
}
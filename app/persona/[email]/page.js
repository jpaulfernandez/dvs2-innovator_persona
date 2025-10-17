// app/persona/[email]/page.js

import { csvData } from '../../../data/cohortData';
import * as d3 from 'd3';
import PersonaStoryClient from '../../../components/persona/PersonaStoryClient';

// This is the simplest and most correct pattern. No 'async' needed.
export default function PersonaPage({ params }) {
  // Directly access params.email. The Next.js framework handles the rest.
  const userEmail = decodeURIComponent(params.email).toLowerCase();
  
  const cohortData = d3.csvParse(csvData);
  const userData = cohortData.find(d => d.Email.toLowerCase() === userEmail);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl">Sorry, we couldnt find data for that email.</h1>
      </div>
    );
  }

  return <PersonaStoryClient userData={userData} cohortData={cohortData} />;
}
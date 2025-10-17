// components/profile/RelationshipInsights.js

import { useMemo } from 'react';
import { FaHandshake, FaSeedling } from 'react-icons/fa';
import { findPartners, getArchetypeDetails } from './profileHelpers';

export default function RelationshipInsights({ userData, cohortData }) {
  const { synergyPartners, growthPartners } = useMemo(() => findPartners(userData, cohortData), [userData, cohortData]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">🪄 Your Collaboration Blueprint</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-bold text-md text-green-800 mb-3 flex items-center"><FaHandshake className="mr-2"/>Synergy Partners</h3>
          <div className="space-y-3">
            {synergyPartners.map(p => {
              const partnerDetails = getArchetypeDetails(p.Primary_Archetype);
              return (
                <div key={p.Email}>
                  <p className="font-bold text-gray-900 text-sm flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: partnerDetails.color}}></span>
                    {p.Nickname}
                  </p>
                  <p className="text-xs text-gray-600 pl-4">{p.Primary_Persona}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h3 className="font-bold text-md text-purple-800 mb-3 flex items-center"><FaSeedling className="mr-2"/>Growth Partners</h3>
          <div className="space-y-3">
            {growthPartners.map(p => {
                 const partnerDetails = getArchetypeDetails(p.Primary_Archetype);
                 return (
                    <div key={p.Email}>
                      <p className="font-bold text-gray-900 text-sm flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: partnerDetails.color}}></span>
                        {p.Nickname}
                      </p>
                      <p className="text-xs text-gray-600 pl-4">{p.Primary_Persona}</p>
                    </div>
                 );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
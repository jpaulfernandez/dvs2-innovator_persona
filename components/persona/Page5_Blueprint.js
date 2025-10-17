// components/persona/Page5_Blueprint.js

import { useMemo } from 'react';
import { FaHandshake, FaPuzzlePiece } from 'react-icons/fa';

// This helper function now finds two partners for each category
const findPartners = (currentUser, cohortData) => {
  // --- Setup & Filtering ---
  const yMapping = { 'Thinker': 1, 'Tinkerer': 0.2, 'Empath': -1 };
  const xMapping = { 'Momentum Seeker': 1, 'Flow Hacker': 0.8, 'Still Current': -1, 'Empathic Pulse': -0.8 };

  const currentUserCoords = {
    x: xMapping[currentUser.Primary_Descriptor],
    y: yMapping[currentUser.Primary_Archetype]
  };

  // Exclude the current user from all calculations
  const otherMembers = cohortData.filter(p => p.Email.toLowerCase() !== currentUser.Email.toLowerCase());

  // --- 1. Find Top 2 Complementary Partners ---
  const membersWithDistance = otherMembers.map(person => {
    const personCoords = {
      x: xMapping[person.Primary_Descriptor],
      y: yMapping[person.Primary_Archetype]
    };
    const distance = Math.sqrt(
      Math.pow(currentUserCoords.x - personCoords.x, 2) +
      Math.pow(currentUserCoords.y - personCoords.y, 2)
    );
    return { ...person, distance };
  });

  const complementaryPartners = membersWithDistance
    .sort((a, b) => b.distance - a.distance) // Sort by most distant first
    .slice(0, 2); // Take the top two

  // --- 2. Find Top 2 Aspirational Partners ---
  let aspirationalPartners = [];
  if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
    aspirationalPartners = otherMembers.filter(
      p => p.Primary_Archetype === currentUser.Secondary_Archetype
    );
  }
  
  // --- 3. Fallback Logic ---
  // If we don't have two aspirational partners, fill the spots with other valuable connections
  if (aspirationalPartners.length < 2) {
    const chosenEmails = new Set([
      ...complementaryPartners.map(p => p.Email.toLowerCase()),
      ...aspirationalPartners.map(p => p.Email.toLowerCase())
    ]);

    const fallbackCandidates = otherMembers.filter(
      p => !chosenEmails.has(p.Email.toLowerCase()) && p.Primary_Archetype !== currentUser.Primary_Archetype
    );
    
    aspirationalPartners.push(...fallbackCandidates.slice(0, 2 - aspirationalPartners.length));
  }

  return { 
    complementaryPartners, 
    aspirationalPartners: aspirationalPartners.slice(0, 2) // Ensure we only return two
  };
};


export default function Page5_Blueprint({ userData, cohortData }) {
  const { complementaryPartners, aspirationalPartners } = useMemo(
    () => findPartners(userData, cohortData),
    [userData, cohortData]
  );
  
  const secondaryArchetypeText = userData.Secondary_Archetype && userData.Secondary_Archetype !== 'NaN' 
    ? `To grow your inner ${userData.Secondary_Archetype}` 
    : "To explore a new perspective";

  return (
    <div className="text-center text-gray-800 animate-fade-in w-full">
      <h2 className="text-2xl font-light opacity-80 mb-8 max-w-2xl mx-auto">
        Your position on the map is the key to unlocking powerful collaborations. Heres your blueprint.
      </h2>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Complementary Partners Card */}
        <div className="border border-gray-200 rounded-xl p-6 flex-1 bg-white shadow-lg text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <FaHandshake className="text-2xl text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-green-700">Your Complementary Partners</h3>
          <p className="text-gray-500 text-sm mb-4">For a perfectly balanced team</p>
          <div className="space-y-3 mt-4">
            {complementaryPartners.map(partner => (
              <div key={partner.Email}>
                <p className="text-2xl font-bold">{partner.Nickname}</p>
                <p className="text-gray-600 text-sm">{partner.Primary_Persona}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aspirational Partners Card */}
        <div className="border border-gray-200 rounded-xl p-6 flex-1 bg-white shadow-lg text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <FaPuzzlePiece className="text-2xl text-purple-600" />
          </div>
          <h3 className="font-bold text-lg text-purple-700">Your Aspirational Partners</h3>
          <p className="text-gray-500 text-sm mb-4">{secondaryArchetypeText}</p>
          <div className="space-y-3 mt-4">
            {aspirationalPartners.map(partner => (
              <div key={partner.Email}>
                <p className="text-2xl font-bold">{partner.Nickname}</p>
                <p className="text-gray-600 text-sm">{partner.Primary_Persona}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
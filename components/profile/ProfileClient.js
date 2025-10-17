// components/profile/ProfileClient.js

"use client";

import { useRef } from 'react';
import { toPng } from 'html-to-image';

import HeroCard from './HeroCard';
import WorkStyleInsights from './WorkStyleInsights';
import RelationshipInsights from './RelationshipInsights';
import ActionButtons from './ActionButtons';
import InnovationMode from './InnovationMode';
import InnovationSeason from './InnovationSeason';

export default function ProfileClient({ userData, cohortData }) {
  const profileRef = useRef(null);

  const handleDownload = () => {
    if (profileRef.current === null) {
      return;
    }

    const element = profileRef.current;

    toPng(element, { 
        cacheBust: true,
        backgroundColor: '#f1f5f9',
        pixelRatio: 2,
        // --- THE FIX ---
        // This style override tells the library to ignore the centering margin during capture.
        style: {
          margin: '0', // Resets the 'mx-auto'
        }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${userData.Nickname}_Innovator_Profile.png`;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div 
        ref={profileRef} 
        className="relative w-full max-w-[calc(100vh*9/16)] mx-auto aspect-[9/16] bg-white rounded-2xl shadow-2xl p-6 flex flex-col space-y-4 overflow-y-auto"
      >
        <HeroCard userData={userData} />
        <InnovationMode userData={userData} />
        <InnovationSeason userData={userData} />
        <WorkStyleInsights userData={userData} />
        <RelationshipInsights userData={userData} cohortData={cohortData} />
        
        {/* Footer Badge */}
        <div className="pt-4 mt-auto text-center">
            <p className="text-xs text-gray-400">MIB Innovators Tribe · 2026 Cohort</p>
        </div>
      </div>
      
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <ActionButtons onDownload={handleDownload} />
      </div>
    </main>
  );
}
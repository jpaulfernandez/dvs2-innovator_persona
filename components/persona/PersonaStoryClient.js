// components/persona/PersonaStoryClient.js

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Screen1_OpeningPortal from '../persona-story/Screen1_OpeningPortal';
import Screen2_WhatsYourSpark from '../persona-story/Screen2_WhatsYourSpark';
import Screen3_CoreArchetypeReveal from '../persona-story/Screen3_CoreArchetypeReveal';
import Screen4_AuraReveal from '../persona-story/Screen4_AuraReveal';
import Screen5_InnovationMode from '../persona-story/Screen5_InnovationMode';
import Screen6_WhenInFlow from '../persona-story/Screen6_WhenInFlow';
import Screen7_MeetYourTribe from '../persona-story/Screen7_MeetYourTribe';
import Screen8_Compatibility from '../persona-story/Screen8_Compatibility';
import Screen9_CohortCarousel from '../persona-story/Screen9_CohortCarousel';
import Screen10_YourSpark from '../persona-story/Screen10_YourSpark';

const TOTAL_SCREENS = 10; // Update this as you add more screens

export default function PersonaStoryClient({ userData, cohortData }) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false); // To prevent rapid clicks

  const handleNavigation = (direction) => {
    if (isNavigating) return; // Ignore clicks if a transition is in progress

    setIsNavigating(true);
    if (direction === 'next') {
      setCurrentScreen(prev => Math.min(prev + 1, TOTAL_SCREENS));
    } else {
      setCurrentScreen(prev => Math.max(prev - 1, 1));
    }
    // Allow navigation again after a short delay
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Some screens auto-advance, so we pass a function they can call
  const handleAutoComplete = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setCurrentScreen(prev => Math.min(prev + 1, TOTAL_SCREENS));
    setTimeout(() => setIsNavigating(false), 500);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <Screen1_OpeningPortal onComplete={handleAutoComplete} />;
      case 2: return <Screen2_WhatsYourSpark userData={userData} onComplete={handleAutoComplete} />;
      case 3: return <Screen3_CoreArchetypeReveal userData={userData} onComplete={handleAutoComplete} />;
      case 4: return <Screen4_AuraReveal userData={userData} onComplete={handleAutoComplete} />;
      case 5: return <Screen5_InnovationMode userData={userData} onComplete={handleAutoComplete} />;
      case 6: return <Screen6_WhenInFlow userData={userData} onComplete={handleAutoComplete} />;
      case 7: return <Screen7_MeetYourTribe userData={userData} cohortData={cohortData} onComplete={handleAutoComplete} />;
      case 8: return <Screen8_Compatibility userData={userData} cohortData={cohortData} onComplete={handleAutoComplete} />;
      case 9: return <Screen9_CohortCarousel cohortData={cohortData} onComplete={handleAutoComplete} />;
      case 10: return <Screen10_YourSpark userData={userData} onComplete={handleAutoComplete} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen text-white/80 bg-black">
            <p>End of Phase 3.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Click Handlers for Navigation */}
      {currentScreen < TOTAL_SCREENS && (
        <>
          <div 
            className="absolute left-0 top-0 h-full w-1/3 z-50 cursor-pointer"
            onClick={() => handleNavigation('prev')}
          />
          <div 
            className="absolute right-0 top-0 h-full w-2/3 z-50 cursor-pointer"
            onClick={() => handleNavigation('next')}
          />
        </>
      )}
      
      {/* Render the current screen */}
      {/* --- NEW: Progress Indicator --- */}
      {/* It will be visible on all screens except the very first one */}
      <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-50">
        {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: i < currentScreen - 1 ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        ))}
      </div>
      {renderScreen()}
    </div>
  );
}
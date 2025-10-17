// components/profile/profileHelpers.js

import { FaSun, FaMoon, FaWind, FaHeart } from 'react-icons/fa';

export const getArchetypeDetails = (archetype) => {
  const details = {
    Thinker: { name: 'Thinker', symbol: '🧠', color: '#8b5cf6', tagline: "The strategic mind—seeing patterns, defining clarity, and shaping the future." },
    Tinkerer: { name: 'Tinkerer', symbol: '🧩', color: '#14b8a6', tagline: "The hands-on innovator—always tweaking, improving, and making ideas real." },
    Empath: { name: 'Empath', symbol: '💞', color: '#f97316', tagline: "The heart of collaboration—connecting people, nurturing ideas, and building trust." },
    Builder: { name: 'Builder', symbol: '🧱', color: '#3b82f6', tagline: "The engine of creation—turning plans into structure and bringing ideas to life." },
  };
  return details[archetype] || details.Thinker;
};

export const getDescriptorDetails = (descriptor) => {
  const details = {
    'Momentum Seeker': { Icon: FaSun, name: "Morning Season", text: "You bring optimism and forward motion—your energy sets the pace for others.", color: "#f59e0b" },
    'Still Current': { Icon: FaMoon, name: "Midnight Season", text: "You think deeply and move intentionally, balancing chaos with calm.", color: "#4f46e5" },
    'Flow Hacker': { Icon: FaWind, name: "Flow Season", text: "You thrive in motion and adapt with ease; discovery energizes you.", color: "#0ea5e9" },
    'Empathic Pulse': { Icon: FaHeart, name: "Heart Season", text: "You lead with intuition and a deep connection to people.", color: "#e11d48" },
  };
  return details[descriptor] || details['Flow Hacker'];
};

export const getWorkStyleDetails = (userData) => {
  let howIWork = "I prefer a flexible approach, adapting as new information comes to light.";
  let whatMotivatesMe = "Seeing tangible progress and making a real impact.";
  let growthTip = "Remember to balance your natural tendencies by seeking out different perspectives.";

  switch (userData.Primary_Archetype) {
    case "Thinker":
      howIWork = "I work best when I have time to analyze the problem from all angles, creating a clear strategy before execution.";
      whatMotivatesMe = "Achieving a deep understanding of a complex problem and finding an elegant, logical solution.";
      growthTip = "Your strength is analysis, but don't forget that imperfect action is better than perfect inaction. Test your ideas early.";
      break;
    case "Tinkerer":
      howIWork = "I learn by doing. I prefer to build a quick prototype, test it, and iterate based on what I discover.";
      whatMotivatesMe = "The thrill of experimentation, the freedom to explore new ideas, and the spark of a new discovery.";
      growthTip = "Your curiosity is a gift. Channel it by focusing on finishing one key project to maximize its impact.";
      break;
    case "Empath":
      howIWork = "I thrive in collaborative environments where I can listen to different perspectives and build consensus.";
      whatMotivatesMe = "Knowing that my work is helping others, fostering a sense of community, and creating a positive impact.";
      growthTip = "Your empathy is your superpower. Remember that data and logic can be powerful tools to channel that empathy effectively.";
      break;

    case "Builder":
      howIWork = "I work best with a clear goal and a structured plan, breaking down big projects into manageable, sequential steps.";
      whatMotivatesMe = "Bringing a complex plan to life, creating order from chaos, and delivering a high-quality, finished product.";
      growthTip = "Your ability to execute is unmatched. Take time to connect with the 'why' to ensure your efforts are aligned with the bigger vision.";
      break;
  }
  return { howIWork, whatMotivatesMe, growthTip };
};

export const findPartners = (currentUser, cohortData) => {
  const yMapping = { Thinker: 1, Tinkerer: 0.2, Empath: -1, Builder: 0.1 };
  const xMapping = { 'Momentum Seeker': 1, 'Flow Hacker': 0.8, 'Still Current': -1, 'Empathic Pulse': -0.8 };
  
  const currentUserCoords = { x: xMapping[currentUser.Primary_Descriptor], y: yMapping[currentUser.Primary_Archetype] };
  const otherMembers = cohortData.filter(p => p.Email.toLowerCase() !== currentUser.Email.toLowerCase());

  // 1. Find Synergy Partners (most different on the map)
  const membersWithDistance = otherMembers.map(person => {
    const personCoords = { x: xMapping[person.Primary_Descriptor], y: yMapping[person.Primary_Archetype] };
    const distance = Math.sqrt(Math.pow(currentUserCoords.x - personCoords.x, 2) + Math.pow(currentUserCoords.y - personCoords.y, 2));
    return { ...person, distance };
  });
  const synergyPartners = membersWithDistance.sort((a, b) => b.distance - a.distance).slice(0, 2);

  // 2. Find Growth Partners using the new priority system
  let growthPartners = [];
  const existingPartners = new Set(synergyPartners.map(p => p.Email));

  // Priority 1: Aspirational Mentors
  if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
    const mentors = otherMembers.filter(p => 
      p.Primary_Archetype === currentUser.Secondary_Archetype && !existingPartners.has(p.Email)
    );
    growthPartners.push(...mentors);
  }

  // Priority 2: Creative Challengers (if we still need more partners)
  if (growthPartners.length < 2) {
    const challengers = otherMembers.filter(p => 
      !existingPartners.has(p.Email) &&
      !growthPartners.some(gp => gp.Email === p.Email) && // Avoid duplicates
      Math.abs(xMapping[p.Primary_Descriptor] - currentUserCoords.x) < 1.0 && 
      Math.abs(yMapping[p.Primary_Archetype] - currentUserCoords.y) > 1.5
    );
    growthPartners.push(...challengers);
  }

  // Priority 3: Fallback (guarantees two partners)
  if (growthPartners.length < 2) {
    const currentPartnerEmails = new Set([...existingPartners, ...growthPartners.map(p => p.Email)]);
    const fallbackCandidates = otherMembers
      .filter(p => !currentPartnerEmails.has(p.Email) && p.Primary_Archetype !== currentUser.Primary_Archetype)
      .sort((a, b) => a.Nickname.localeCompare(b.Nickname)); // Stable sort
      
    growthPartners.push(...fallbackCandidates.slice(0, 2 - growthPartners.length));
  }
    
  return { synergyPartners, growthPartners: growthPartners.slice(0, 2) }; // Ensure we only return two
};

export const getInnovationScores = (currentUser) => {
    let scores = { Thinker: 5, Builder: 5, Tinkerer: 5, Empath: 5 };
    if (currentUser.Primary_Archetype) scores[currentUser.Primary_Archetype] += 30;
    if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
        scores[currentUser.Secondary_Archetype] += 15;
    }
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
    return {
        Analysis: (scores.Thinker / totalScore) * 100,
        Execution: (scores.Builder / totalScore) * 100,
        Iteration: (scores.Tinkerer / totalScore) * 100,
        Empathy: (scores.Empath / totalScore) * 100,
    };
};

export const getDiceBearAvatarUrl = (nickname, archetype) => {
  // Guard against missing data to prevent invalid URLs
  if (!nickname || !archetype) {
    return null; // Return null to prevent an error
  }

  const styleMap = {
    Thinker: 'avataaars-neutral',
    Tinkerer: 'pixel-art-neutral',
    Empath: 'bottts-neutral',
    Builder: 'adventurer-neutral',
  };
  const style = styleMap[archetype] || 'bottts-neutral';
  
  return `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(nickname)}`;
};
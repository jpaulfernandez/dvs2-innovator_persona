// components/persona/PersonaSummary.js

import { useMemo } from 'react';
import Image from 'next/image';
import { FaHandshake, FaPuzzlePiece, FaLightbulb, FaMoon, FaTachometerAlt, FaHeart } from 'react-icons/fa';
import InnovationModeChart from '../visualizations/InnovationModeChart';

// --- HELPER FUNCTIONS ---

// This function now contains all the logic for generating the new insights
const getPersonaInsights = (currentUser, cohortData) => {
    // 1. Innovation Mode Scores
    let scores = { Thinker: 0.5, Builder: 0.5, Tinkerer: 0.5, Empath: 0.5 };
    scores[currentUser.Primary_Archetype] = (scores[currentUser.Primary_Archetype] || 0) + 3;
    if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
        scores[currentUser.Secondary_Archetype] = (scores[currentUser.Secondary_Archetype] || 0) + 1.5;
    }
    const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const innovationScores = {
        Thinker: (scores.Thinker / totalScore) * 100,
        Builder: (scores.Builder / totalScore) * 100,
        Tinkerer: (scores.Tinkerer / totalScore) * 100,
        Empath: (scores.Empath / totalScore) * 100,
    };

    // 2. Innovation Season
    let innovationSeason = { name: "Flow Season", description: "You thrive in motion; discovery energizes you.", Icon: FaTachometerAlt };
    switch (currentUser.Primary_Descriptor) {
        case 'Momentum Seeker': innovationSeason = { name: "Morning Season", description: "You bring energy and optimism that sparks teams into motion.", Icon: FaLightbulb }; break;
        case 'Still Current': innovationSeason = { name: "Midnight Season", description: "You think deeply and move intentionally, balancing chaos with calm.", Icon: FaMoon }; break;
        case 'Empathic Pulse': innovationSeason = { name: "Heart Season", description: "You lead with intuition and people connection.", Icon: FaHeart }; break;
    }

    // 3. Flow Insight (Generated)
    let flowInsight = "You enter flow when you can connect dots across ideas and people.";
    if (currentUser.Primary_Persona.includes("Builder") || currentUser.Primary_Persona.includes("Prototyper")) {
        flowInsight = "You hit flow when the challenge feels slightly beyond reach—that’s when your execution energy wakes up.";
    }

    // 4. Growth Edge (Generated)
    let growthEdge = "Your empathy can make you hesitate in tough calls—learning to detach in analysis will balance your instincts.";
    switch(currentUser.Primary_Archetype) {
        case 'Thinker': growthEdge = "You sometimes overthink before acting. Try testing your ideas faster to unlock new patterns."; break;
        case 'Builder': growthEdge = "Your focus on execution can sometimes overlook the 'why'. Pause to reconnect with the bigger picture."; break;
        case 'Tinkerer': growthEdge = "Your love for novelty can lead to many started projects. Focus on finishing one to maximize impact."; break;
    }

    // 5. Tribe Context
    const archetypeCount = cohortData.filter(p => p.Primary_Archetype === currentUser.Primary_Archetype).length;
    const tribeContext = `Among your peers, you’re one of ${archetypeCount} ${currentUser.Primary_Archetype}s—often balancing teams with your unique blend of skills.`;

    // 6. Signature Quote
    let signatureQuote = "Every insight begins with listening.";
    switch(currentUser.Primary_Archetype) {
        case 'Builder': signatureQuote = "Structure sets me free."; break;
        case 'Thinker': signatureQuote = "Meaning before motion."; break;
        case 'Tinkerer': signatureQuote = "Let’s see what happens."; break;
    }

    return { innovationScores, innovationSeason, flowInsight, growthEdge, tribeContext, signatureQuote };
};

const findPartners = (currentUser, cohortData) => {
    const yMapping = { 'Thinker': 1, 'Tinkerer': 0.2, 'Empath': -1 };
    const xMapping = { 'Momentum Seeker': 1, 'Flow Hacker': 0.8, 'Still Current': -1, 'Empathic Pulse': -0.8 };
    const currentUserCoords = { x: xMapping[currentUser.Primary_Descriptor], y: yMapping[currentUser.Primary_Archetype] };
    const otherMembers = cohortData.filter(p => p.Email.toLowerCase() !== currentUser.Email.toLowerCase());
    const membersWithDistance = otherMembers.map(person => {
        const personCoords = { x: xMapping[person.Primary_Descriptor], y: yMapping[person.Primary_Archetype] };
        const distance = Math.sqrt(Math.pow(currentUserCoords.x - personCoords.x, 2) + Math.pow(currentUserCoords.y - personCoords.y, 2));
        return { ...person, distance };
    });
    const complementaryPartners = membersWithDistance.sort((a, b) => b.distance - a.distance).slice(0, 2);
    let aspirationalPartners = [];
    if (currentUser.Secondary_Archetype && currentUser.Secondary_Archetype !== 'NaN') {
        aspirationalPartners = otherMembers.filter(p => p.Primary_Archetype === currentUser.Secondary_Archetype);
    }
    if (aspirationalPartners.length < 2) {
        const chosenEmails = new Set([...complementaryPartners.map(p => p.Email.toLowerCase()), ...aspirationalPartners.map(p => p.Email.toLowerCase())]);
        const fallbackCandidates = otherMembers.filter(p => !chosenEmails.has(p.Email.toLowerCase()) && p.Primary_Archetype !== currentUser.Primary_Archetype);
        aspirationalPartners.push(...fallbackCandidates.slice(0, 2 - aspirationalPartners.length));
    }
    return { complementaryPartners, aspirationalPartners: aspirationalPartners.slice(0, 2) };
};

const getDiceBearAvatarUrl = (userData) => {
    const seed = encodeURIComponent(userData.Nickname);
    let style = 'bottts-neutral';
    let options = '';
    const archetype = userData.Primary_Archetype;
    const descriptor = userData.Primary_Descriptor;
    const sanitizeHex = (hex) => hex.substring(1);

    switch (archetype) {
        case "Builder": style = 'adventurer-neutral'; options = descriptor === 'Momentum Seeker' ? `backgroundColor=${sanitizeHex('#F4C46B')}` : `backgroundColor=${sanitizeHex('#E57C23')}`; break;
        case "Thinker": style = 'avataaars-neutral'; options = descriptor === 'Momentum Seeker' ? `backgroundColor=${sanitizeHex('#A1C4FD')}&accessoriesColor=${sanitizeHex('#FFD466')}` : `backgroundColor=${sanitizeHex('#345B9C')}`; break;
        case "Tinkerer": style = 'pixel-art-neutral'; options = descriptor === 'Momentum Seeker' ? `backgroundColor=${sanitizeHex('#B388FF')}` : `backgroundColor=${sanitizeHex('#7E57C2')}`; break;
        case "Empath": style = 'bottts-neutral'; options = descriptor === 'Momentum Seeker' ? `primaryColor=${sanitizeHex('#FFC1A1')}` : `primaryColor=${sanitizeHex('#E97B7B')}`; break;
    }
    return `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}&${options}`;
};


// --- MAIN COMPONENT ---
export default function PersonaSummary({ userData, cohortData }) {
  const { complementaryPartners, aspirationalPartners } = useMemo(() => findPartners(userData, cohortData), [userData, cohortData]);
  const { innovationScores, innovationSeason, flowInsight, growthEdge, tribeContext, signatureQuote } = useMemo(() => getPersonaInsights(userData, cohortData), [userData, cohortData]);
  
  const avatarUrl = getDiceBearAvatarUrl(userData);
  const emoji = userData.Primary_Persona.split(' ')[0];
  const title = userData.Primary_Persona.substring(emoji.length).trim();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-fade-in text-gray-800 space-y-8">
        <header className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-100 overflow-hidden border-4 border-white shadow-md">
                <Image src={avatarUrl} alt={`${userData.Nickname}'s Avatar`} width={96} height={96} unoptimized />
            </div>
            <h1 className="text-4xl font-bold">{userData.Nickname}'s Blueprint</h1>
            <p className="text-lg text-gray-600 mt-2">{emoji} {title}</p>
            <blockquote className="mt-4 text-gray-500 italic">"{signatureQuote}"</blockquote>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-bold text-lg mb-2">Innovation Mode</h2>
                <InnovationModeChart scores={innovationScores} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-bold text-lg mb-2">Your Innovation Season</h2>
                <div className="flex items-center gap-4">
                    <innovationSeason.Icon className="text-4xl text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-800">{innovationSeason.name}</p>
                        <p className="text-sm text-gray-600">{innovationSeason.description}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-bold text-lg mb-2">When You're in Flow...</h2>
                <p className="text-sm text-gray-600 italic">"{flowInsight}"</p>
            </div>
             <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-bold text-lg mb-2">Your Growth Edge</h2>
                <p className="text-sm text-gray-600">"{growthEdge}"</p>
            </div>
        </div>
        
        <div>
            <h2 className="font-bold text-lg mb-2 text-center">You in the Tribe</h2>
            <p className="text-center text-gray-600 mb-6">{tribeContext}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-2 flex items-center"><FaHandshake className="text-green-500 mr-2" /> Complementary Partners</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        {complementaryPartners.map(p => <p key={p.Email} className="text-sm text-green-800"><span className="font-bold">{p.Nickname}</span> - {p.Primary_Persona}</p>)}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 flex items-center"><FaPuzzlePiece className="text-purple-500 mr-2" /> Aspirational Partners</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
                        {aspirationalPartners.map(p => <p key={p.Email} className="text-sm text-purple-800"><span className="font-bold">{p.Nickname}</span> - {p.Primary_Persona}</p>)}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
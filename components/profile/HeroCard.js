// components/profile/HeroCard.js

import Image from 'next/image';
import { getArchetypeDetails, getDescriptorDetails, getDiceBearAvatarUrl } from './profileHelpers'; // Import the new helper

export default function HeroCard({ userData }) {
  if (!userData || !userData.Nickname) return null;

  // --- DEBUGGING STEP ---
  const avatarUrl = getDiceBearAvatarUrl(userData.Nickname, userData.Primary_Archetype);
  console.log("Generated Avatar URL:", avatarUrl); // This will show the URL in your browser's console (F12)
  // --- END DEBUGGING STEP ---

  const archetypeDetails = getArchetypeDetails(userData.Primary_Archetype);
  const descriptorDetails = getDescriptorDetails(userData.Primary_Descriptor);

  return (
    <div className="text-center">
      <div className="relative inline-block mb-3">
        <div className="absolute -inset-2 rounded-full" style={{ background: `radial-gradient(circle, ${descriptorDetails.color}40, transparent 70%)` }} />
        
        {/* Only render the Image component if the URL is valid */}
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Your Avatar"
            width={96}
            height={96}
            className="rounded-full bg-gray-100 p-1" // Use a solid background color
            unoptimized
          />
        )}
      </div>
      
      <h1 className="text-4xl font-bold" style={{ color: archetypeDetails.color }}>{userData.Nickname}</h1>
      <p className="text-lg text-gray-800 font-medium mt-1">
        {archetypeDetails.symbol} {userData.Primary_Persona}
      </p>
      <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">
        Member of the {archetypeDetails.name} Tribe | {descriptorDetails.name} Energy
      </p>
    </div>
  );
}
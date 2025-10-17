// components/persona/Page2_Aura.js

import { FaBrain, FaHeart, FaWrench, FaHammer } from 'react-icons/fa';

// Helper to get consistent icon/color details, now with gradients
const getArchetypeDetails = (archetype) => {
  switch (archetype) {
    case "Thinker":
      return {
        Icon: FaBrain,
        // UPDATED: Using a deep blue gradient
        bgColor: "bg-gradient-to-br from-[#345B9C] to-[#A1C4FD]",
        color: "text-white", // White icon for better contrast
        brandColor: "#345B9C"
      };
    case "Empath":
      return {
        Icon: FaHeart,
        // UPDATED: Using a warm coral/peach gradient
        bgColor: "bg-gradient-to-br from-[#E97B7B] to-[#FFC1A1]",
        color: "text-white",
        brandColor: "#E97B7B"
      };
    case "Tinkerer":
      return {
        Icon: FaWrench,
        // UPDATED: Using a vibrant violet/magenta gradient
        bgColor: "bg-gradient-to-br from-[#7E57C2] to-[#B388FF]",
        color: "text-white",
        brandColor: "#7E57C2"
      };
    case "Builder":
      return {
        Icon: FaHammer,
        // UPDATED: Using a rich terracotta/amber gradient
        bgColor: "bg-gradient-to-br from-[#E57C23] to-[#F4C46B]",
        color: "text-white",
        brandColor: "#E57C23"
      };
    default:
      return {
        Icon: FaBrain,
        bgColor: "bg-gray-800",
        color: "text-gray-400",
        brandColor: "#A0A0A0"
      };
  }
};

// Helper to get aura text and the outer ring animation class
const getAuraDetails = (descriptor) => {
  switch (descriptor) {
    case "Still Current": 
      return { text: "a calm, reflective energy.", animationClass: "aura-still-current" };
    case "Momentum Seeker": 
      return { text: "an action-oriented, forward drive.", animationClass: "aura-momentum" };
    case "Flow Hacker": 
      return { text: "a fluid, adaptive current.", animationClass: "aura-flow-hacker" };
    case "Empathic Pulse": 
      return { text: "a warm, connective pulse.", animationClass: "aura-empathic" };
    default: 
      return { text: "a unique energy.", animationClass: "" };
  }
};

export default function Page2_Aura({ userData }) {
  const { Icon, color, bgColor, brandColor } = getArchetypeDetails(userData.Primary_Archetype);
  const { text, animationClass } = getAuraDetails(userData.Primary_Descriptor);

  return (
    <div className="text-center text-gray-800 animate-fade-in">
      <h2 className="text-2xl font-light opacity-80 mb-10">
        But a superpower is just the beginning. Its *how* you wield it that makes you unique.
      </h2>

      {/* The Aura Visualizer */}
      <div 
        className={`relative w-48 h-48 rounded-full mx-auto flex items-center justify-center mb-8 shadow-lg ${bgColor} ${animationClass}`}
        style={{ '--aura-brand-color': brandColor }} // Passes color to the outer ring animation
      >
        <Icon className={`text-8xl z-10 ${color}`} />
      </div>

      <p className="text-xl mb-4">You bring...</p>
      <h1 className="text-5xl font-bold" style={{ color: brandColor }}>
        {text}
      </h1>
    </div>
  );
}
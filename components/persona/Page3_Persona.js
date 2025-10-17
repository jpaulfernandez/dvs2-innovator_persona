// components/persona/Page3_Persona.js

// A helper to provide descriptions for each persona
const getPersonaDetails = (persona) => {
  switch (persona) {
    case "🌊 Reflective Strategist":
      return "You see the long game, navigating complexity with a calm, analytical mind.";
    case "💞 Heart of the Tribe":
      return "You are the cohesive force, nurturing connections and building community.";
    case "🚀 Energized Catalyst":
      return "You ignite action and bring a dynamic, forward-moving energy to any project.";
    case "🌊 Quiet Healer":
      return "You bring a calming presence, creating harmony and supporting others from the heart.";
    case "🧩 Infinite Tinkerer":
      return "Your curiosity is boundless, leading you to constantly experiment and innovate.";
    case "💞 Thoughtful Connector":
        return "You bridge gaps between people and ideas, building understanding with intention.";
    case "🌊 Patient Innovator":
        return "You believe in the process, slowly and steadily crafting brilliant new ideas.";
    case "🚀 Rapid Prototyper":
        return "You turn ideas into reality at lightning speed, learning by doing.";
    case "🧩 Idea Alchemist":
        return "You transmute raw concepts into strategic gold through logic and creativity.";
    default:
      return "You bring a unique and valuable perspective to the cohort.";
  }
};


export default function Page3_Persona({ userData }) {
  // Split the emoji from the title for separate styling
  const emoji = userData.Primary_Persona.split(' ')[0];
  const title = userData.Primary_Persona.substring(emoji.length).trim();
  const description = getPersonaDetails(userData.Primary_Persona);

  return (
    <div className="text-center text-gray-800 animate-fade-in">
      <h2 className="text-2xl font-light opacity-80 mb-10 max-w-2xl mx-auto">
        When your {userData.Primary_Archetype} mind combines with your {userData.Primary_Descriptor} energy, a unique identity emerges.
      </h2>

      {/* The Persona Card */}
      <div className="border border-gray-200 rounded-xl p-8 max-w-md mx-auto bg-white shadow-lg">
        <div className="text-7xl mb-4">{emoji}</div>
        <p className="text-lg mb-2">You are the...</p>
        <h1 className="text-4xl font-bold text-black mb-4">
          {title}
        </h1>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
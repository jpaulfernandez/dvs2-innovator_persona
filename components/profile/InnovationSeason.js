// components/profile/InnovationSeason.js

import { FaSun, FaMoon, FaWind, FaHeart } from 'react-icons/fa';

const getSeasonDetails = (descriptor) => {
  switch (descriptor) {
    case 'Momentum Seeker': return { Icon: FaSun, name: "Morning Season", text: "You bring energy and optimism that sparks teams into motion.", color: "text-yellow-500" };
    case 'Still Current': return { Icon: FaMoon, name: "Midnight Season", text: "You think deeply and move intentionally, balancing chaos with calm.", color: "text-indigo-500" };
    case 'Flow Hacker': return { Icon: FaWind, name: "Flow Season", text: "You thrive in motion and adapt with ease; discovery energizes you.", color: "text-sky-500" };
    case 'Empathic Pulse': return { Icon: FaHeart, name: "Heart Season", text: "You lead with intuition and a deep connection to people.", color: "text-rose-500" };
    default: return { Icon: FaSun, name: "Unique Season", text: "You have a distinct creative rhythm." };
  }
};

export default function InnovationSeason({ userData }) {
  const { Icon, name, text, color } = getSeasonDetails(userData.Primary_Descriptor);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Innovation Season</h2>
      <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}>
        <Icon className={`text-3xl flex-shrink-0 ${color}`} />
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

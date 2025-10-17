import { motion } from 'framer-motion';

const tribeColors = { Builder: '#3b82f6', Thinker: '#8b5cf6', Tinkerer: '#14b8a6', Empath: '#f97316' };
const compatibility = {
  'Thinker-Builder': '88%', 'Tinkerer-Empath': '85%', 'Builder-Empath': '74%',
  'Thinker-Tinkerer': '69%', 'Builder-Tinkerer': '63%', 'Thinker-Empath': '58%',
};

export default function CompatibilityWheel({ userArchetype }) {
  const otherArchetypes = Object.keys(tribeColors).filter(name => name !== userArchetype);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Synergy Map</h2>
      <div className="space-y-3">
        {otherArchetypes.map(other => {
          const key1 = `${userArchetype}-${other}`;
          const key2 = `${other}-${userArchetype}`;
          const score = compatibility[key1] || compatibility[key2] || 'N/A';
          return (
            <div key={other} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-32">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tribeColors[userArchetype] }} />
                <span>+</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tribeColors[other] }} />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-5">
                <motion.div
                  className="h-5 rounded-full"
                  style={{ backgroundColor: tribeColors[other] }}
                  initial={{ width: '0%' }}
                  animate={{ width: score }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              <p className="w-12 font-semibold">{score}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
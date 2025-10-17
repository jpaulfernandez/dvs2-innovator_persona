// components/persona-story/Screen2_WhatsYourSpark.js

"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';

const getArchetypeHue = (archetype) => {
  switch (archetype) {
    case "Thinker": return "#E0E7FF";
    case "Empath": return "#FBECD7";
    case "Tinkerer": return "#E9D5FF";
    case "Builder": return "#F2E3C6";
    default: return "#F3F4F6";
  }
};

export default function Screen2_WhatsYourSpark({ userData, onComplete }) {
  const visualsControls = useAnimationControls();
  const backgroundControls = useAnimationControls();
  const [visibleTextIndex, setVisibleTextIndex] = useState(0);

  const archetypeHue = useMemo(() => getArchetypeHue(userData.Primary_Archetype), [userData.Primary_Archetype]);

  const texts = [
    "Among the constellation of innovators…",
    "…one spark shines differently.",
    "Let’s discover the energy that drives you."
  ];

  useEffect(() => {
    // This flag tracks if the component is still mounted
    let isMounted = true;

    const sequence = async () => {
      // Frame 1
      if (!isMounted) return;
      visualsControls.start("pulse");
      await new Promise(res => setTimeout(res, 1500));

      // Frame 2
      if (!isMounted) return;
      visualsControls.start("scan");
      setVisibleTextIndex(1);
      await new Promise(res => setTimeout(res, 2000));

      // Frame 3
      if (!isMounted) return;
      visualsControls.start("spotlight");
      setVisibleTextIndex(2);
      await new Promise(res => setTimeout(res, 2000));

      // Frame 4
      if (!isMounted) return;
      setVisibleTextIndex(3);
      await new Promise(res => setTimeout(res, 2500));

      // Frame 5
      if (!isMounted) return;
      setVisibleTextIndex(4);
      await backgroundControls.start("transitionOut");
      
      if (isMounted && onComplete) {
        onComplete();
      }
    };

    sequence();

    // The cleanup function will run when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [visualsControls, backgroundControls, onComplete]);

  return (
    <motion.div
      key="whats-your-spark"
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `radial-gradient(circle, #f0eef3, #ddd6fe)` }}
      animate={backgroundControls}
      variants={{ transitionOut: { backgroundColor: archetypeHue, transition: { duration: 1.5 } } }}
    >
      {/* Central Particle */}
      <motion.div
        className="absolute z-20 w-5 h-5 bg-white rounded-full"
        variants={{
          initial: { scale: 1, opacity: 0.8, boxShadow: '0 0 20px 5px #ffffff' },
          pulse: { scale: [1, 1.2, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
          spotlight: { boxShadow: '0 0 60px 25px #ffffff', transition: { duration: 1.5 } },
          transitionOut: { scale: 50, opacity: 0, transition: { duration: 1 } },
        }}
        initial="initial"
        animate={visualsControls}
      />
      
      {/* Radiating Scan Lines */}
      {[1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute z-10 w-px h-px border border-white/70 rounded-full"
          variants={{
            initial: { scale: 0, opacity: 0 },
            scan: { scale: 400, opacity: [0.6, 0], transition: { duration: 4, delay: i * 1.5, repeat: Infinity, ease: 'easeOut' } },
            transitionOut: { opacity: 0 }
          }}
          initial="initial"
          animate={visualsControls}
        />
      ))}

      {/* Text Container */}
      <div className="absolute z-30 text-center text-gray-800 font-light text-2xl md:text-3xl tracking-wide">
        <AnimatePresence>
          {visibleTextIndex > 0 && visibleTextIndex <= texts.length && (
            <motion.p
              key={visibleTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              {texts[visibleTextIndex - 1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
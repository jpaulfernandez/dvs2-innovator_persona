'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TitlePage() {
    const title = "🎬 Narrative Arc";
    const narrative = "While our archetypes connect through both harmony and tension, true insight emerges when we see where gravity pulls us — who we naturally orbit, what energy binds us, and how balance forms from difference.";

    // A "container" variant for orchestrating the word animations
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04, // Makes the words cascade in quickly
            },
        },
    };

    // A "child" variant for each word, making them fall from above
    const wordVariants = {
        hidden: {
            opacity: 0,
            y: -30, // Start 30px above their final position
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="text-center max-w-4xl">
                {/* A more impactful animation for the main title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, type: 'spring' }}
                    className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-8"
                >
                    {title}
                </motion.h1>

                {/* The narrative paragraph with the new falling word effect */}
                <motion.p
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-xl sm:text-2xl text-gray-300 leading-relaxed"
                >
                    {narrative.split(" ").map((word, index) => (
                        <motion.span
                            key={word + "-" + index}
                            variants={wordVariants}
                            className="inline-block mr-[0.25em]" // Use margin instead of &nbsp; for better line breaks
                            // Add a fun hover effect!
                            whileHover={{ scale: 1.15, y: -5, color: '#facc15', cursor: 'pointer' }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.p>
            </div>
        </div>
    );
}
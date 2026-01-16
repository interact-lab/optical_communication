import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MZMDiagram = () => {
    const [phase, setPhase] = useState(0);

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl my-10">
            <h3 className="text-xl font-serif text-center mb-8 text-white">Mach-Zehnder Modulator (MZM)</h3>

            <div className="relative h-48 max-w-2xl mx-auto flex items-center justify-center">
                <div className="absolute left-0 w-12 h-1 bg-primary/40"></div>

                <svg className="absolute left-12 w-16 h-24" viewBox="0 0 100 100">
                    <path d="M 0 50 Q 50 50 100 0 M 0 50 Q 50 50 100 100" fill="none" stroke="#74C0E3" strokeWidth="4" />
                </svg>

                <div className="absolute left-[112px] top-[48px] w-64 h-1 bg-primary"></div>
                <div className="absolute left-[112px] bottom-[48px] w-64 h-1 bg-primary"></div>

                <motion.div
                    className="absolute left-[150px] top-[30px] w-32 h-10 border-2 border-accent rounded flex items-center justify-center bg-accent/10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="text-[10px] text-accent font-bold">V(t)</span>
                </motion.div>

                <svg className="absolute left-[368px] w-16 h-24" viewBox="0 0 100 100">
                    <path d="M 0 0 Q 50 50 100 50 M 0 100 Q 50 50 100 50" fill="none" stroke="#74C0E3" strokeWidth="4" />
                </svg>

                <div className="absolute left-[112px] top-[48px] w-64 overflow-hidden h-6">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -40] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <svg width="120" height="24">
                            <path d="M0 12 Q15 0, 30 12 T60 12 T90 12 T120 12" fill="none" stroke="#74C0E3" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </div>

                <div className="absolute left-[112px] bottom-[48px] w-64 overflow-hidden h-6">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -40] }}
                        style={{ marginLeft: `${(phase / 180) * 40}px` }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <svg width="120" height="24">
                            <path d="M0 12 Q15 0, 30 12 T60 12 T90 12 T120 12" fill="none" stroke="#74C0E3" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </div>

                <div className="absolute right-0 w-12 h-1 bg-primary/40"></div>

                <div className="absolute right-0 top-1/2 -mt-4 w-12 h-8 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: Math.max(0, 1 - phase / 180) }}
                        className="flex h-full items-center"
                    >
                        <svg width="40" height="24">
                            <path d="M0 12 Q10 0, 20 12 T40 12" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
                <input
                    type="range" min="0" max="180" value={phase}
                    onChange={(e) => setPhase(Number(e.target.value))}
                    className="w-full max-w-sm accent-accent"
                />
                <div className="mt-2 text-sm text-gray-500">
                    Phase Shift: <span className="text-accent font-bold">{phase}°</span>
                    ({phase === 180 ? 'Destructive Interference' : 'Constructive Interference'})
                </div>
            </div>
        </div>
    );
};

export default MZMDiagram;

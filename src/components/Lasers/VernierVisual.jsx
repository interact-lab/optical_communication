import React, { useState } from 'react';
import { motion } from 'framer-motion';

const VernierVisual = () => {
    const [mirror1Pos, setMirror1Pos] = useState(0);
    const [mirror2Pos, setMirror2Pos] = useState(0);

    const comb1 = Array.from({ length: 8 }).map((_, i) => i * 60 + mirror1Pos);
    const comb2 = Array.from({ length: 8 }).map((_, i) => i * 65 + mirror2Pos);

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl my-10 relative overflow-hidden">
            <h3 className="text-xl font-serif text-center mb-8 text-white">Vernier Effect Visualization</h3>

            <div className="relative h-48 border-y border-white/5 flex flex-col justify-around">
                <div className="relative h-12">
                    <div className="absolute top-0 left-0 text-[10px] text-primary uppercase font-bold">Mirror A Reflectivity</div>
                    {comb1.map((x, i) => (
                        <motion.div
                            key={`c1-${i}`}
                            className="absolute bottom-0 w-1 bg-primary/60"
                            style={{ left: `${x}px`, height: '70%', borderRadius: '1px 1px 0 0' }}
                        />
                    ))}
                    <div className="absolute bottom-0 w-full h-px bg-primary/20"></div>
                </div>

                <div className="relative h-12">
                    <div className="absolute top-0 left-0 text-[10px] text-secondary uppercase font-bold">Mirror B Reflectivity</div>
                    {comb2.map((x, i) => (
                        <motion.div
                            key={`c2-${i}`}
                            className="absolute bottom-0 w-1 bg-secondary/60"
                            style={{ left: `${x}px`, height: '70%', borderRadius: '1px 1px 0 0' }}
                        />
                    ))}
                    <div className="absolute bottom-0 w-full h-px bg-secondary/20"></div>
                </div>

                {comb1.slice(0, 7).some(x1 => comb2.some(x2 => Math.abs(x1 - x2) < 5)) && (
                    <motion.div
                        className="absolute inset-0 bg-white/5 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <div className="w-10 h-full border-x border-accent bg-accent/10 flex items-center justify-center">
                            <div className="w-1 h-full bg-accent animate-pulse"></div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase tracking-widest block">Mirror A Shift (Δλ₁)</label>
                    <input
                        type="range" min="-30" max="30" value={mirror1Pos}
                        onChange={(e) => setMirror1Pos(Number(e.target.value))}
                        className="w-full accent-primary"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-xs text-gray-500 uppercase tracking-widest block">Mirror B Shift (Δλ₂)</label>
                    <input
                        type="range" min="-30" max="30" value={mirror2Pos}
                        onChange={(e) => setMirror2Pos(Number(e.target.value))}
                        className="w-full accent-secondary"
                    />
                </div>
            </div>
        </div>
    );
};

export default VernierVisual;

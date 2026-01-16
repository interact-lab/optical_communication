import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MathText from '../../components/MathText';

const VernierVisual = () => {
    const [mirror1Pos, setMirror1Pos] = useState(0);
    const [mirror2Pos, setMirror2Pos] = useState(0);

    const comb1 = Array.from({ length: 8 }).map((_, i) => i * 60 + mirror1Pos);
    const comb2 = Array.from({ length: 8 }).map((_, i) => i * 65 + mirror2Pos);

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl my-10 relative overflow-hidden">
            <h3 className="text-xl font-serif text-center mb-8 text-white">Vernier Effect Visualization</h3>

            <div className="relative h-48 border-y border-white/5 flex flex-col justify-around">
                {/* Mirror 1 Comb */}
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

                {/* Mirror 2 Comb */}
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

                {/* Overlap Marker */}
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

            <p className="mt-6 text-center text-xs text-gray-400">
                Move the sliders to align different reflection peaks. <br />
                Small shifts in individual mirrors lead to <strong className="text-accent underline">large jumps</strong> in the overlap frequency.
            </p>
        </div>
    );
};

const Tunable = () => {
    return (
        <div className="max-w-4xl mx-auto pb-24">
            <header className="mb-16">
                <h1 className="text-5xl font-serif font-bold text-white mb-4">
                    Tunable Lasers
                </h1>
                <p className="text-xl text-gray-400 font-light max-w-2xl">
                    Agility across the spectrum: frequency selection in modern networks.
                </p>
            </header>

            {/* SECTION: TEMPERATURE */}
            <section id="temperature" className="mb-20">
                <h2 className="text-3xl font-serif text-primary mb-6">Temperature as a Knob</h2>
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 leading-relaxed">
                    <div className="space-y-4">
                        <p>
                            The most basic way to tune a laser is by changing its temperature (using a Peltier thermo-electric cooler).
                        </p>
                        <p>
                            Both the bandgap and the refractive index are temperature-dependent. In typical InP lasers, this gives a tuning rate of about <strong className="text-white">0.1 nm/°C</strong>.
                        </p>
                        <div className="p-4 bg-orange-950/20 border border-orange-700/30 rounded-lg">
                            <h4 className="text-orange-400 font-bold text-sm mb-2">Limit: Slow & Narrow</h4>
                            <p className="text-xs">Thermal tuning is slow (milliseconds) and limited to ~3-4 nm before the laser gets too hot.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                        <MathText block>{String.raw`$\frac{d\lambda}{dT} = \lambda \left( \frac{1}{n_e} \frac{dn_e}{dT} + \alpha_{therm} \right)$`}</MathText>
                    </div>
                </div>
            </section>

            {/* SECTION: VERNIER */}
            <section id="vernier" className="mb-20">
                <h2 className="text-3xl font-serif text-primary mb-6">The Vernier Effect</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                Wide tunability (>40 nm) is achieved using two mirrors with different reflection peak spacings (combs). Only one pair of peaks aligns at a time, selecting a single frequency.
                </p>

                <VernierVisual />

                <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                    <h4 className="text-primary font-bold mb-4">The Advantage</h4>
                    <p className="text-sm text-gray-300">
                        A small fractional change in the index of one mirror shifts its comb relative to the other. Because the comb spacings are slightly different, the "alignment point" jumps to the next set of peaks, enabling tuning across the entire C-band with tiny physical adjustments.
                    </p>
                </div>
            </section>

            {/* SECTION: CMA-DMA */}
            <section id="cma-dma" className="mb-20">
                <h2 className="text-3xl font-serif text-primary mb-6">CMA and DMA Control</h2>
                <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <h3 className="text-xl font-bold text-accent mb-3">CMA: Continuous Modal Alignment</h3>
                            <p className="text-sm">
                                Changing the currents of both mirrors in the <strong className="text-white">same</strong> direction. This shifts the entire Vernier alignment point continuously across the spectrum without jumping modes.
                            </p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <h3 className="text-xl font-bold text-accent mb-3">DMA: Differential Modal Alignment</h3>
                            <p className="text-sm">
                                Changing mirror currents in <strong className="text-white">opposite</strong> directions. This forces the Vernier peaks to "misalign" and "realign" with a different neighbor, causing a discrete mode jump.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-black/40 border border-white/5 rounded-2xl italic text-center text-sm font-serif">
                        "Mastering the Vernier laser is like playing a musical instrument with two tuning slides - one for the chords (DMA) and one for the vibrato (CMA)."
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Tunable;

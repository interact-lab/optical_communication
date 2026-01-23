import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Activity, Info, Zap, Target, Sliders, RefreshCw, Box } from "lucide-react";
import MathText from "../../../components/MathText";
import PageNavigation from "../../../components/PageNavigation";

// Reusable UI Components
const Card = ({ title, children, className = "" }) => (
    <div className={`p-8 bg-secondary/[0.03] backdrop-blur-3xl border border-secondary/10 rounded-[2.5rem] shadow-xl ${className}`}>
        {title && (
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-secondary/30 mb-8 flex items-center gap-2">
                {title}
            </h3>
        )}
        {children}
    </div>
);

const CustomSlider = ({ label, value, min, max, step, onChange, unit = "" }) => (
    <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/40">
            <span>{label}</span>
            <span className="text-emerald-500 font-mono">{value.toFixed(2)}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-secondary/5 rounded-full appearance-none cursor-pointer"
        />
    </div>
);

export default function VernierEffect() {
    const [spacing1, setSpacing1] = useState(1.0);
    const [spacing2, setSpacing2] = useState(1.05);
    const [offset, setOffset] = useState(0.0);
    const [showTheory, setShowTheory] = useState(false);

    const lines = useMemo(() => {
        const count = 60;
        const comb1 = [];
        const comb2 = [];

        for (let i = -count; i <= count; i++) {
            comb1.push(i * spacing1);
            comb2.push(i * spacing2 + offset);
        }

        return { comb1, comb2 };
    }, [spacing1, spacing2, offset]);

    const coincidences = useMemo(() => {
        const eps = 0.05;
        const matches = [];
        lines.comb1.forEach((f1) => {
            lines.comb2.forEach((f2) => {
                if (Math.abs(f1 - f2) < eps) {
                    matches.push((f1 + f2) / 2);
                }
            });
        });
        return matches;
    }, [lines]);

    const scale = 50; // px per frequency unit

    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        Vernier <br /><span className="text-secondary/20">Frequency Effect</span>
                    </h1>
                    <button
                        onClick={() => setShowTheory(!showTheory)}
                        className="p-4 rounded-full hover:bg-secondary/5 transition-all text-secondary/20 hover:text-secondary mt-4 border border-secondary/5"
                        title="Toggle Theory"
                    >
                        <ChevronDown size={40} className={`transition-transform duration-500 ${showTheory ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <AnimatePresence>
                    {showTheory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-16"
                        >
                            <div className="p-12 bg-secondary/[0.03] rounded-[3rem] border border-secondary/10 space-y-12 text-secondary/60 leading-relaxed font-light">
                                <section className="space-y-6">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-emerald-500/50">01.</span> Principles of Vernier
                                    </h2>
                                    <p className="text-xl">
                                        The Vernier effect occurs when two frequency combs with slightly different periodicities overlap. This is used in **Widely Tunable Lasers** (like SG-DBR or MG-Y lasers) to extend the tuning range far beyond what a single mirror period allows.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/40 p-10 rounded-3xl border border-white/5">
                                        <div>
                                            <h4 className="text-white font-bold mb-4">Effective FSR</h4>
                                            <MathText block>{String.raw`$FSR_{eff} = \frac{FSR_1 \cdot FSR_2}{|FSR_1 - FSR_2|}$`}</MathText>
                                            <p className="text-xs mt-4 opacity-70 italic text-emerald-200/50">
                                                A small difference in mirror spacings leads to a massive effective Free Spectral Range.
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-white font-bold text-sm uppercase tracking-widest text-emerald-400">Applications</h4>
                                            <ul className="text-sm space-y-3 opacity-80">
                                                <li className="flex gap-2">
                                                    <span className="text-emerald-500">•</span>
                                                    <span>**Widely Tunable DBRs:** Selects a single longitudinal mode from multiple candidates.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-emerald-500">•</span>
                                                    <span>**Mode Hopping:** Small index shifts cause large "jumps" in selection.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-emerald-500">•</span>
                                                    <span>**Full C-Band Tuning:** Enables lasers to cover 40nm+ range (~5 THz).</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-12 border-t border-white/10 mt-12 text-center max-w-3xl mx-auto">
                                    <MathText className="text-sm opacity-40 italic font-medium">
                                        "By aligning two slightly offset combs, we transform tiny physical changes into massive optical agility."
                                    </MathText>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Comb Visualization */}
                    <Card title="Sliding Resonance Combs">
                        <div className="bg-slate-950 rounded-[2.5rem] border border-white/10 h-80 relative overflow-hidden shadow-2xl group">
                            {/* Grid Line Center */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-secondary/20 z-0" />

                            <div className="absolute inset-0 flex flex-col items-stretch p-0">
                                {/* Comb 1 */}
                                <div className="flex-1 relative border-b border-white/5 group-hover:bg-blue-500/5 transition-colors">
                                    <div className="absolute left-8 top-4 text-[8px] font-black uppercase tracking-[0.3em] text-blue-400 opacity-50">Rear Mirror Comb</div>
                                    {lines.comb1.map((f, i) => (
                                        <motion.div
                                            key={`c1-${i}`}
                                            layout
                                            className="absolute top-10 bottom-0 w-px bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                            style={{ left: `calc(50% + ${f * scale}px)` }}
                                        />
                                    ))}
                                </div>

                                {/* Comb 2 */}
                                <div className="flex-1 relative group-hover:bg-emerald-500/5 transition-colors">
                                    <div className="absolute left-8 top-4 text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400 opacity-50">Front Mirror Comb</div>
                                    {lines.comb2.map((f, i) => (
                                        <motion.div
                                            key={`c2-${i}`}
                                            layout
                                            className="absolute top-0 bottom-10 w-px bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                            style={{ left: `calc(50% + ${f * scale}px)` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Coincidences Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {coincidences.map((f, i) => (
                                    <motion.div
                                        key={`v-${i}`}
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10 shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                                        style={{ left: `calc(50% + ${f * scale}px - 2px)` }}
                                    >
                                        <div className="absolute top-4 -left-8 right-0 text-center text-[10px] font-black text-amber-400 uppercase tracking-widest bg-black/80 px-2 py-1 rounded">MATCH</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Explanation">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Zap size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Comb 1</span>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed font-light italic">Typically represents the rear mirror resonances with spacing FSR1.</p>
                            </div>
                            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Activity size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Comb 2</span>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed font-light italic">Typically represents the front mirror resonances with spacing FSR2.</p>
                            </div>
                            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <Target size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Vernier Mode</span>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed font-light italic">The resulting mode selected for oscillation. Only one survives at a time.</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Tuning Controls">
                        <div className="space-y-10">
                            <CustomSlider
                                label="Rear Mirror FSR (Λ1)"
                                value={spacing1}
                                min={0.8}
                                max={1.2}
                                step={0.01}
                                onChange={setSpacing1}
                            />

                            <CustomSlider
                                label="Front Mirror FSR (Λ2)"
                                value={spacing2}
                                min={0.8}
                                max={1.2}
                                step={0.01}
                                onChange={setSpacing2}
                            />

                            <CustomSlider
                                label="Relative Phase Shift"
                                value={offset}
                                min={-1}
                                max={1}
                                step={0.01}
                                onChange={setOffset}
                            />

                            <div className="pt-8 border-t border-white/5">
                                <button
                                    onClick={() => { setSpacing1(1.0); setSpacing2(1.05); setOffset(0); }}
                                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={14} /> Reset Combs
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Observation">
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Efficiency</span>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    Notice how a small change in <strong>Relative Phase Shift</strong> causes the "MATCH" point to jump across the entire spectrum. This is the mechanism that allows a 3nm index tuning to cover a 40nm wavelength range.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-20 p-12 bg-white/[0.02] border border-white/10 rounded-[4rem] flex flex-col items-center text-center gap-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400">
                    <Box size={32} />
                </div>
                <div className="max-w-2xl space-y-4">
                    <h3 className="text-2xl font-serif font-bold italic">Wavelength Agility</h3>
                    <p className="text-white/40 font-light leading-relaxed">
                        The Vernier effect is the "superpower" of tunable lasers. It allows for discrete but wide tuning, making it possible for a single laser component to replace an entire array of fixed-wavelength sources in modern optical network nodes.
                    </p>
                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/tunable/thermal"
                prevLabel="Temperature Tuning"
                nextTo="/lasers/tunable/cma-dma"
                nextLabel="CMA/DMA Tuning"
            />
        </div>
    );
}

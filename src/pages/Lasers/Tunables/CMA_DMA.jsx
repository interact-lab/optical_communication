import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Zap, Activity, Target, Sliders, RefreshCw, Box, ArrowRight } from 'lucide-react';
import MathText from '../../../components/MathText';
import PageNavigation from '../../../components/PageNavigation';

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
            <span className="text-blue-500 font-mono">{value.toFixed(1)}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-secondary/5 rounded-full appearance-none cursor-pointer"
        />
    </div>
);

// --- Physics Constants ---
const LAMBDA_START = 1530;
const LAMBDA_END = 1570;
const LAMBDA_POINTS = 400;
const PEAK_SPACING_A = 4.0; // nm
const PEAK_SPACING_B = 4.4; // nm
const PEAK_WIDTH = 0.6; // nm
const REFLECTIVITY_BASE = 0.1;
const REFLECTIVITY_PEAK = 0.9;

export default function CMA_DMA() {
    const [currentA, setCurrentA] = useState(50);
    const [currentB, setCurrentB] = useState(50);
    const [phase, setPhase] = useState(50);
    const [showTheory, setShowTheory] = useState(false);

    // --- Physics Logic ---
    const { wavelengths, spectrumA, spectrumB, productSpectrum, maxPeakWavelength, modeMapData } = useMemo(() => {
        const wl = [];
        const step = (LAMBDA_END - LAMBDA_START) / LAMBDA_POINTS;
        for (let i = 0; i < LAMBDA_POINTS; i++) {
            wl.push(LAMBDA_START + i * step);
        }

        const shiftA = (currentA / 100) * PEAK_SPACING_A;
        const shiftB = (currentB / 100) * PEAK_SPACING_B;
        const phaseShift = (phase / 100) * 0.5;

        const calcReflectivity = (lambda, spacing, shift) => {
            const relativeLambda = lambda - 1530 - shift;
            const peakIndex = Math.round(relativeLambda / spacing);
            const center = 1530 + shift + peakIndex * spacing;
            const diff = lambda - center - phaseShift;
            const val = Math.exp(-(diff * diff) / (2 * (PEAK_WIDTH / 2.355) ** 2));
            return REFLECTIVITY_BASE + (REFLECTIVITY_PEAK - REFLECTIVITY_BASE) * val;
        };

        const specA = wl.map(l => calcReflectivity(l, PEAK_SPACING_A, shiftA));
        const specB = wl.map(l => calcReflectivity(l, PEAK_SPACING_B, shiftB));
        const prod = wl.map((l, i) => specA[i] * specB[i]);

        let maxVal = -1;
        let maxIdx = -1;
        for (let i = 0; i < wl.length; i++) {
            if (prod[i] > maxVal) {
                maxVal = prod[i];
                maxIdx = i;
            }
        }
        const maxPeakWavelength = wl[maxIdx];

        const islands = [];
        for (let m = -2; m < 12; m++) {
            for (let n = -2; n < 12; n++) {
                const cA = (m * 20) + (n * 5);
                const cB = (n * 20) + (m * 5);
                if (cA > -20 && cA < 120 && cB > -20 && cB < 120) {
                    islands.push({ x: cA, y: cB, id: `${m},${n}` });
                }
            }
        }

        return { wavelengths: wl, spectrumA: specA, spectrumB: specB, productSpectrum: prod, maxPeakWavelength, modeMapData: islands };
    }, [currentA, currentB, phase]);

    // --- Mode Hop Detection ---
    const [isHopping, setIsHopping] = useState(false);
    const lastModeRef = useRef("0,0");

    useEffect(() => {
        const m = Math.round((20 * currentA - 5 * currentB) / 375);
        const n = Math.round((-5 * currentA + 20 * currentB) / 375);
        const currentMode = `${m},${n}`;

        if (currentMode !== lastModeRef.current) {
            setIsHopping(true);
            setTimeout(() => setIsHopping(false), 200);
            lastModeRef.current = currentMode;
        }
    }, [currentA, currentB]);

    // --- Handlers ---
    const handleCMA = (val) => {
        const delta = val - ((currentA + currentB) / 2);
        let newA = currentA + delta;
        let newB = currentB + delta;
        if (newA < 0) newA = 0; if (newA > 100) newA = 100;
        if (newB < 0) newB = 0; if (newB > 100) newB = 100;
        setCurrentA(newA);
        setCurrentB(newB);
    };

    const handleDMA = (val) => {
        const currentDiff = currentA - currentB;
        const delta = val - currentDiff;
        let newA = currentA + delta / 2;
        let newB = currentB - delta / 2;
        if (newA < 0) newA = 0; if (newA > 100) newA = 100;
        if (newB < 0) newB = 0; if (newB > 100) newB = 100;
        setCurrentA(newA);
        setCurrentB(newB);
    };

    const getPath = (data, height = 150, width = 600) => {
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (val * height);
            return `${x},${y}`;
        });
        return `M ${points.join(' L ')}`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        CMA & DMA <br /><span className="text-secondary/20">Control Logic</span>
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
                                        <span className="text-blue-500/50">01.</span> Modal Alignment Logic
                                    </h2>
                                    <p className="text-xl">
                                        Managing a multi-section Vernier laser requires decoupling the two mirror currents. We use **Common Mode (CMA)** and **Differential Mode (DMA)** to navigate the tuning map.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/40 p-10 rounded-3xl border border-white/5">
                                        <div className="space-y-4">
                                            <h4 className="text-white font-bold text-sm uppercase tracking-widest text-blue-400">CMA (Continuous)</h4>
                                            <p className="text-sm">
                                                By moving both mirror currents in tandem, we shift the reflection peaks together. This allows for **smooth, continuous tuning** of the selected mode without causing mode hops.
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-white font-bold text-sm uppercase tracking-widest text-red-400">DMA (Differential)</h4>
                                            <p className="text-sm">
                                                Moving currents in opposite directions shifts the relative alignment of the two combs. This forces a **Vernier Jump**, selecting a completely different supermode for coarse tuning.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                                <section className="space-y-6 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-orange-500/50">02.</span> Stability Mapping
                                    </h2>
                                    <p className="text-sm">
                                        The 2D current space $(I_A, I_B)$ forms a series of stability "islands". Centering the operating point within an island ensures stable single-mode operation with a high side-mode suppression ratio (SMSR).
                                    </p>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Cavity Schematic */}
            <Card title="Laser Cavity Schematic" className="mb-16">
                <div className="relative h-48 bg-slate-950 rounded-3xl flex items-center justify-center overflow-hidden border border-white/10">
                    <div className="absolute w-full h-1 bg-red-500/20 blur-sm top-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-4 z-10 px-8 w-full">
                        <div className="flex-1 h-32 border-2 border-blue-500/30 bg-blue-500/5 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md relative">
                            <span className="text-[10px] font-black uppercase text-blue-400 mb-2">Mirror A</span>
                            <div className="w-16 h-8 overflow-hidden opacity-50">
                                <svg viewBox="0 0 100 50" className="w-full h-full">
                                    <path d={getPath(spectrumA.slice(150, 250), 50, 100)} fill="none" stroke="#3b82f6" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="absolute bottom-2 font-mono text-[8px] text-blue-500/40">I_A = {currentA.toFixed(0)}%</div>
                        </div>
                        <div className="w-40 h-32 border-2 border-yellow-500/30 bg-yellow-500/5 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md">
                            <span className="text-[10px] font-black uppercase text-yellow-500">Gain & Phase</span>
                            <div className="w-20 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                <motion.div animate={{ width: `${phase}%` }} className="h-full bg-yellow-500" />
                            </div>
                        </div>
                        <div className="flex-1 h-32 border-2 border-red-500/30 bg-red-500/5 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md relative">
                            <span className="text-[10px] font-black uppercase text-red-400 mb-2">Mirror B</span>
                            <div className="w-16 h-8 overflow-hidden opacity-50">
                                <svg viewBox="0 0 100 50" className="w-full h-full">
                                    <path d={getPath(spectrumB.slice(150, 250), 50, 100)} fill="none" stroke="#ef4444" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="absolute bottom-2 font-mono text-[8px] text-red-500/40">I_B = {currentB.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Spectral Response */}
                    <Card title="Spectral Overlap (Vernier Interaction)">
                        <div className="h-80 bg-slate-950 rounded-3xl border border-white/10 p-8 relative overflow-hidden">
                            <div className="absolute top-4 left-8 flex flex-col">
                                <span className="text-[10px] font-black text-secondary/20 uppercase tracking-widest">Selected Wavelength</span>
                                <span className="text-3xl font-bold font-serif text-blue-400 select-none">
                                    {maxPeakWavelength.toFixed(2)} <span className="text-sm font-light text-secondary/20">nm</span>
                                </span>
                            </div>

                            <svg viewBox="0 0 600 180" className="w-full h-full mt-10 overflow-visible" preserveAspectRatio="none">
                                <line x1="0" y1="140" x2="600" y2="140" stroke="white" strokeOpacity="0.05" />

                                {/* Spectral Paths */}
                                <motion.path d={getPath(spectrumA, 140, 600)} fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
                                <motion.path d={getPath(spectrumB, 140, 600)} fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.3" />
                                <motion.path
                                    layout
                                    d={getPath(productSpectrum, 140, 600)}
                                    fill="#22c55e" fillOpacity="0.1"
                                    stroke="#22c55e" strokeWidth="2"
                                />

                                {/* Wavelength Axis */}
                                {[1530, 1540, 1550, 1560, 1570].map((wl, i) => (
                                    <g key={wl} transform={`translate(${(wl - 1530) * 15}, 140)`}>
                                        <line y1="0" y2="5" stroke="white" strokeOpacity="0.2" />
                                        <text y="20" textAnchor="middle" className="text-[8px] fill-white/20 font-mono">{wl}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </Card>

                    {/* Mode Stability Map */}
                    <Card title="Mode Stability Map (I_A vs I_B)">
                        <div className="h-80 bg-slate-950 rounded-3xl border border-white/10 p-8 flex gap-8 items-center">
                            <div className="flex-1 aspect-square max-h-full border border-white/5 rounded-xl bg-black/40 p-4 relative">
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                    {/* Islands */}
                                    {modeMapData.map((island) => (
                                        <polygon
                                            key={island.id}
                                            points={`${island.x},${100 - island.y - 8} ${island.x + 8},${100 - island.y} ${island.x},${100 - island.y + 8} ${island.x - 8},${100 - island.y}`}
                                            className="fill-white/5 stroke-white/10"
                                            strokeWidth="0.5"
                                        />
                                    ))}

                                    {/* Trail (Visual effect) */}
                                    <circle cx={currentA} cy={100 - currentB} r="10" fill="url(#point-glow)" className="transition-all duration-200" />
                                    <defs>
                                        <radialGradient id="point-glow">
                                            <stop offset="0%" stopColor={isHopping ? "#ef4444" : "#3b82f6"} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>

                                    {/* Active Point */}
                                    <motion.circle
                                        cx={currentA}
                                        cy={100 - currentB}
                                        r={isHopping ? "5" : "3"}
                                        initial={false}
                                        className={`${isHopping ? 'fill-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'fill-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'} shadow-lg`}
                                    />

                                    {/* Axes */}
                                    <line x1="0" y1="100" x2="105" y2="100" stroke="white" strokeOpacity="0.1" />
                                    <line x1="0" y1="100" x2="0" y2="-5" stroke="white" strokeOpacity="0.1" />
                                    <text x="105" y="105" textAnchor="end" className="fill-white/20 text-[6px] font-mono">Current A</text>
                                    <text x="-5" y="-5" textAnchor="start" className="fill-white/20 text-[6px] font-mono" transform="rotate(-90 -5 -5)">Current B</text>
                                </svg>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className={`p-6 rounded-3xl border transition-all duration-500 ${isHopping ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/5 border-white/5'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity size={18} className={isHopping ? 'text-red-500' : 'text-blue-500'} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
                                    </div>
                                    <h4 className={`text-xl font-bold font-serif ${isHopping ? 'text-red-400' : 'text-blue-400'}`}>
                                        {isHopping ? "MODE HOP DETECTED" : "STABLE LOCK"}
                                    </h4>
                                    <p className="text-xs text-white/40 mt-2 italic">
                                        {isHopping ? "Carrier density fluctuation forced a supermode jump." : "Operating point centered within stable Vernier island."}
                                    </p>
                                </div>
                                <div className="text-[10px] text-white/20 font-mono space-y-1">
                                    <div>[A, B]: [{currentA.toFixed(1)}, {currentB.toFixed(1)}]</div>
                                    <div>MODE: {lastModeRef.current}</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Management Interface">
                        <div className="space-y-10">
                            <CustomSlider
                                label="Common Mode (CMA)"
                                value={(currentA + currentB) / 2}
                                min={0} max={100} step={0.5}
                                onChange={handleCMA}
                                unit="%"
                            />
                            <p className="text-[9px] text-white/20 -mt-6 italic">Tunes both mirrors together for fine wavelength control.</p>

                            <CustomSlider
                                label="Differential Mode (DMA)"
                                value={currentA - currentB}
                                min={-100} max={100} step={0.5}
                                onChange={handleDMA}
                                unit="%"
                            />
                            <p className="text-[9px] text-white/20 -mt-6 italic">Changes the relative peak alignment to force mode jumps.</p>

                            <CustomSlider
                                label="Phase Fine Tune"
                                value={phase}
                                min={0} max={100} step={1}
                                onChange={setPhase}
                                unit="%"
                            />

                            <div className="pt-8 border-t border-white/5">
                                <button
                                    onClick={() => { setCurrentA(50); setCurrentB(50); setPhase(50); }}
                                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={14} /> Reset Tuning
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Observation">
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-2">Hint</span>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    Use **DMA** for coarse tuning across the 40nm range, then use **CMA** to lock onto the precise frequency grid.
                                </p>
                            </div>
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Mode Mapping</span>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    The "islands" in the stability map represent current pairs where rear and front mirrors align perfectly.
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
                    <h3 className="text-2xl font-serif font-bold italic">Intelligent Agility</h3>
                    <p className="text-white/40 font-light leading-relaxed">
                        CMA/DMA control transforms the complex multi-dimensional problem of laser tuning into a simple, intuitive interface, enabling software-defined networks to manage wavelength resources with ease.
                    </p>
                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/tunable/vernier"
                prevLabel="Vernier Effect"
            />
        </div>
    );
}

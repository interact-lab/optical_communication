import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Thermometer, Sliders, Info, Zap, Target, Activity, RefreshCw } from "lucide-react";
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
            <span className="text-orange-500 font-mono">{value.toFixed(1)}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-orange-500 h-1.5 bg-secondary/5 rounded-full appearance-none cursor-pointer"
        />
    </div>
);

export default function TemperatureTuning() {
    const [temperature, setTemperature] = useState(25);
    const [domain, setDomain] = useState("frequency"); // frequency | wavelength
    const [showTheory, setShowTheory] = useState(false);

    // Physical logic
    const baseFrequencies = [192.7, 192.9, 193.1, 193.3, 193.5, 193.7, 193.9]; // THz
    const tempCoefficient = -0.013; // THz / °C

    const shiftedFrequencies = baseFrequencies.map(
        (f) => f + tempCoefficient * (temperature - 25)
    );

    const getWavelength = (f) => (299792.458 / f).toFixed(2);

    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-orange-500/20 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        Temperature <br /><span className="text-secondary/20">as a Knob</span>
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
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-orange-500/50">01.</span> Thermal Interactions
                                    </h2>
                                    <p className="text-xl">
                                        Changing the temperature of a semiconductor laser cavity alters its physical dimensions and, more significantly, its **Refractive Index**. These changes shift the resonance condition of the cavity.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950 p-10 rounded-3xl border border-secondary/10">
                                        <div>
                                            <h4 className="text-secondary font-bold mb-4 text-white">The Resonance Shift</h4>
                                            <MathText block>{String.raw`$\frac{d\lambda}{dT} = \lambda \left( \frac{1}{n_e} \frac{dn_e}{dT} + \alpha_{\text{exp}} \right)$`}</MathText>
                                            <MathText className="text-xs mt-4 opacity-70 italic text-orange-200/50">
                                                {String.raw`$dn_e/dT$ is the thermo-optic coefficient, which dominates over the thermal expansion $\alpha_{\text{exp}}$ in semiconductors.`}
                                            </MathText>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-secondary font-bold text-sm uppercase tracking-widest text-orange-400">Typical Values</h4>
                                            <ul className="text-sm space-y-3 opacity-80">
                                                <li className="flex gap-2">
                                                    <span className="text-orange-500">•</span>
                                                    <span>**Tuning Rate:** ~0.1 nm / °C (~12-13 GHz/°C)</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-orange-500">•</span>
                                                    <span>**Response Time:** Milliseconds (due to thermal mass)</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-orange-500">•</span>
                                                    <span>**Stability:** Regulated by TEC (Thermo-Electric Cooler)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-secondary/10">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-blue-500/50">02.</span> Optical Path Length
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-secondary text-white">Thermo-Optic Effect</h3>
                                            <p className="text-sm">
                                                In semiconductors, the refractive index increases as temperature rises. This increases the <strong>Optical Path Length</strong> ($n \cdot L$), making the cavity appear "electrically longer" to the light.
                                            </p>
                                        </div>
                                        <div className="p-8 bg-orange-500/5 border border-orange-500/20 rounded-3xl space-y-4">
                                            <div className="flex items-center gap-2 text-orange-400">
                                                <Info size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest font-bold">Design Note</span>
                                            </div>
                                            <p className="text-sm text-secondary/40 leading-relaxed italic">
                                                Thermal tuning is the primary method for wavelength locking in DWDM systems, ensuring each laser stays on its ITU grid channel with GHz precision.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-12 border-t border-white/10 mt-12 text-center max-w-3xl mx-auto">
                                    <MathText className="text-sm opacity-40 italic font-medium">
                                        "Temperature control provides the precision but current injection provides the speed—together they define the limits of laser agility."
                                    </MathText>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Cavity Visualization */}
                    <Card title="Laser Cavity (Physical Domain)">
                        <div className="bg-slate-950 rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                            <svg viewBox="0 0 600 120" className="w-full h-32 overflow-visible">
                                {(() => {
                                    const baseLeft = 100;
                                    const baseLength = 400;
                                    const deltaL = (temperature - 25) * 0.4;
                                    const leftMirrorX = baseLeft - deltaL / 2;
                                    const rightMirrorX = baseLeft + baseLength + deltaL / 2;
                                    const effLength = baseLength + deltaL;

                                    const points = [];
                                    const samples = 120;
                                    for (let i = 0; i <= samples; i++) {
                                        const x = leftMirrorX + (i / samples) * effLength;
                                        const phase = (i / samples) * Math.PI * 8;
                                        const y = 60 + 15 * Math.sin(phase);
                                        points.push(`${x},${y}`);
                                    }

                                    return (
                                        <>
                                            {/* Glow */}
                                            <defs>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            {/* Medium */}
                                            <rect x={leftMirrorX} y="35" width={effLength} height="50" fill="url(#laser-gradient)" opacity="0.1" />
                                            <linearGradient id="laser-gradient" x1="0" y1="0.5" x2="1" y2="0.5">
                                                <stop offset="0" stopColor="#f97316" stopOpacity="0" />
                                                <stop offset="0.5" stopColor="#f97316" stopOpacity="0.3" />
                                                <stop offset="1" stopColor="#f97316" stopOpacity="0" />
                                            </linearGradient>

                                            {/* Standing Wave */}
                                            <polyline
                                                points={points.join(" ")}
                                                fill="none"
                                                stroke="#f97316"
                                                strokeWidth="2"
                                                filter="url(#glow)"
                                            />

                                            {/* Mirrors */}
                                            {[leftMirrorX, rightMirrorX].map((x, i) => (
                                                <g key={i}>
                                                    <rect x={x - 4} y="20" width="8" height="80" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                                                    <rect x={x - 1} y="25" width="2" height="70" fill="#fff" opacity="0.1" />
                                                </g>
                                            ))}

                                            {/* Annotations */}
                                            <motion.text
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                x="300" y="15" textAnchor="middle" className="fill-orange-400/40 text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                Resonance: m · λ = 2 · n(T) · L(T)
                                            </motion.text>
                                        </>
                                    );
                                })()}
                            </svg>
                        </div>
                    </Card>

                    {/* Spectral Response */}
                    <Card title={`Resonance Spectra (${domain.toUpperCase()})`}>
                        <div className="bg-slate-950 rounded-3xl p-10 border border-white/10 h-64 relative overflow-hidden">
                            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                                {/* Frequency/Wavelength Grid Lines */}
                                {[100, 200, 300, 400, 500].map(x => (
                                    <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                                ))}
                                <line x1="40" y1="160" x2="560" y2="160" stroke="white" strokeOpacity="0.2" strokeWidth="1" />

                                {shiftedFrequencies.map((f, i) => {
                                    const x = 70 + i * 75 + (domain === "frequency" ? -1.5 : 2.5) * (temperature - 25);
                                    const color = "#fff";
                                    return (
                                        <motion.g key={i} layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                                            {/* Spectral Line (Thick White) */}
                                            <line x1={x} y1="45" x2={x} y2="160" stroke={color} strokeWidth="5" strokeLinecap="round" />

                                            {/* Dashed line below axis */}
                                            <line x1={x} y1="160" x2={x} y2="200" stroke={color} strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />

                                            {/* Label box */}
                                            <rect x={x - 28} y="15" width="56" height="14" rx="4" fill="black" />
                                            <text x={x} y="25" textAnchor="middle" className="fill-white font-mono text-[8.5px] font-black">
                                                {domain === "frequency" ? `${f.toFixed(2)} THz` : `${getWavelength(f)} nm`}
                                            </text>
                                        </motion.g>
                                    );
                                })}
                            </svg>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Thermal Controls">
                        <div className="space-y-10">
                            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                                        <Thermometer size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Environment</span>
                                        <span className="text-xl font-bold font-mono">{temperature.toFixed(1)}°C</span>
                                    </div>
                                </div>
                                <Activity size={24} className="text-orange-500/20" />
                            </div>

                            <CustomSlider
                                label="Substrate Temperature"
                                value={temperature}
                                min={0}
                                max={80}
                                step={0.1}
                                onChange={setTemperature}
                                unit=" °C"
                            />

                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Display Domain</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["frequency", "wavelength"].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDomain(d)}
                                            className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${domain === d
                                                ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
                                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setTemperature(25)}
                                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={14} /> Reset to Room Temp (25°C)
                            </button>
                        </div>
                    </Card>

                    <Card title="Quick Observation">
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Effect</span>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    {temperature > 25
                                        ? "Increasing temperature increases n(T), expanding the effective optical path. This causes a RED SHIFT to longer wavelengths."
                                        : temperature < 25
                                            ? "Lowering temperature decreases n(T), shrinking the effective optical path. This causes a BLUE SHIFT to shorter wavelengths."
                                            : "System is at baseline room temperature (25°C). Resonance frequencies are at nominal values."
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-20 p-12 bg-secondary/[0.02] border border-secondary/10 rounded-[4rem] flex flex-col items-center text-center gap-8">
                <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500">
                    <Target size={32} />
                </div>
                <div className="max-w-2xl space-y-4">
                    <h3 className="text-2xl font-serif font-bold italic text-secondary">Slow but Steady</h3>
                    <p className="text-secondary/40 font-light leading-relaxed">
                        While thermal tuning is too slow for data modulation, its stability and high precision make it indispensable for frequency stabilization and channel selection in dense wavelength division multiplexing (DWDM) networks.
                    </p>
                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/modulation/mzm"
                prevLabel="IQ Modulation & MZM"
                nextTo="/lasers/tunable/vernier"
                nextLabel="Vernier Effect"
            />
        </div>
    );
}

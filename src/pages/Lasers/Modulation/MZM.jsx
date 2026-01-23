import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sliders, Activity, Info, Zap, Target, Layers, Cpu, Play, Pause, RefreshCw, Box } from "lucide-react";
import MathText from "../../../components/MathText";
import PageNavigation from "../../../components/PageNavigation";

// Local sub-components
import IQWaveformPlot from "../../../components/Lasers/MZM/IQWaveformPlot";
import ConstellationPlot from "../../../components/Lasers/MZM/ConstellationPlot";
import SuperMzmDiagram from "../../../components/Lasers/MZM/SuperMzmDiagram";
import TransferCurve from "../../../components/Lasers/MZM/TransferCurve";

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
            <span className="text-blue-500 font-mono">{value.toFixed(2)}{unit}</span>
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

export default function MZM() {
    const [showTheory, setShowTheory] = useState(false);

    // Core MZM Logic States
    const [vBias, setVBias] = useState(0.5); // Normalized for the single MZM check

    // Advanced IQ Modulation States
    const [ampI, setAmpI] = useState(1.0);
    const [ampQ, setAmpQ] = useState(1.0);
    const [freq, setFreq] = useState(1.0);
    const [phaseShiftEnabled, setPhaseShiftEnabled] = useState(true);
    const [biasDrift, setBiasDrift] = useState(0);
    const [modulationFormat, setModulationFormat] = useState('QPSK');
    const [isPlaying, setIsPlaying] = useState(true);
    const [time, setTime] = useState(0);

    const requestRef = useRef();

    // Animation Loop
    useEffect(() => {
        const animate = (t) => {
            if (isPlaying) {
                setTime(prev => prev + 0.05 * freq);
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, freq]);

    const getBiasName = (v) => {
        const val = Math.abs(v % (2 * Math.PI));
        if (val < 0.2 || val > 2 * Math.PI - 0.2) return "Peak Point";
        if (Math.abs(val - Math.PI) < 0.2) return "Null Point";
        if (Math.abs(val - Math.PI / 2) < 0.2 || Math.abs(val - 3 * Math.PI / 2) < 0.2) return "Quadrature Point";
        return "Intermediate";
    };

    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-secondary/10 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        IQ Modulation <br /><span className="text-secondary/20">& Super-MZM</span>
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
                                        <span className="text-blue-500/50">01.</span> Operating Principles
                                    </h2>
                                    <p className="text-xl">
                                        The MZM is an interferometric device that converts **phase modulation** into **intensity modulation**. By splitting the input light into two paths and varying the phase of one path relative to the other, constructive or destructive interference is achieved at the output.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950 p-10 rounded-3xl border border-white/5">
                                        <div>
                                            <h4 className="text-secondary font-bold mb-4 font-black">The Transfer Function</h4>
                                            <MathText block>{String.raw`$P_{\text{out}} = P_{\text{in}} \cos^2\left(\frac{\pi V(t)}{2 V_\pi}\right)$`}</MathText>
                                            <p className="text-xs mt-4 opacity-70">
                                                {String.raw`$V_\pi$ is the "Half-Wave Voltage" required to shift the phase by $\pi$ radians, causing the output to go from Maximum to Minimum.`}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-secondary font-bold font-black">Key Operating Points</h4>
                                            <ul className="text-sm space-y-2">
                                                <li><strong className="text-blue-400">Peak Point ($V=0$):</strong> Maximum transmission, constructive interference.</li>
                                                <li><strong className="text-red-400">Null Point ($V=V_\pi$):</strong> Minimum transmission, destructive interference.</li>
                                                <li><strong className="text-emerald-400">Quadrature ($V=0.5 V_\pi$):</strong> Linear region, ideal for analog modulation.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-secondary/10">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-emerald-500/50">02.</span> Bias & Chirp Control
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-secondary">Dual-Drive MZM</h3>
                                            <MathText className="text-sm">
                                                {String.raw`By driving both arms of the interferometer with independent signals, we can achieve **Zero Chirp**. Chirp is caused by net phase variations in the combined output field. If the arms are driven symmetrically (Push-Pull), the phase changes cancel out, leaving only intensity changes.`}
                                            </MathText>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-secondary">Extinction Ratio</h3>
                                            <MathText className="text-sm">
                                                {String.raw`Defined as the ratio $P_{\text{on}} / P_{\text{off}}$. A high extinction ratio (typically > 20 dB) is critical for minimizing the Bit Error Rate (BER) in digital systems. This depends on perfect power balance between the two arms.`}
                                            </MathText>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-secondary/10">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-fuchsia-500/50">03.</span> Advanced IQ Modulation
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-secondary">Complex Constellations</h3>
                                            <p className="text-sm">
                                                By nesting two MZMs within a larger interferometer and introducing a 90° phase shift, we create an **IQ Modulator**. This allows independent control of the Real (In-phase) and Imaginary (Quadrature) parts of the optical field, enabling formats like QPSK and 16-QAM.
                                            </p>
                                        </div>
                                        <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-4">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Target size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest font-bold">Physics Note</span>
                                            </div>
                                            <MathText className="text-sm text-secondary/40 leading-relaxed italic">
                                                {String.raw`Biasing at the **Quadrature point** ($0.5 V_\pi$) ensures the most linear response for analog signals, while the **Null point** ($V_\pi$) is used for carrier-suppressed formats like BPSK.`}
                                            </MathText>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-12 border-t border-white/10 mt-12 text-center max-w-3xl mx-auto">
                                    <MathText className="text-sm opacity-40 italic font-medium">
                                        "The IQ Modulator (or Super-MZM) is the backbone of coherent optical communication, mapping digital bits onto the complex plane with unprecedented spectral efficiency."
                                    </MathText>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Architecture Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <Card title="IQ Modulator Architecture" className="lg:col-span-2 bg-slate-950">
                    <SuperMzmDiagram phaseShiftEnabled={phaseShiftEnabled} />
                </Card>
                <Card title="Global Controls">
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-secondary/30 mb-4">Modulation Format</label>
                            <select
                                value={modulationFormat}
                                onChange={(e) => setModulationFormat(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-900 border border-white/10 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer shadow-xl"
                            >
                                <option value="NRZ" className="bg-slate-900">NRZ / OOK</option>
                                <option value="BPSK" className="bg-slate-900">BPSK</option>
                                <option value="QPSK" className="bg-slate-900">QPSK</option>
                                <option value="8-PSK" className="bg-slate-900">8-PSK</option>
                                <option value="16-QAM" className="bg-slate-900">16-QAM</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-secondary/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">90° Phase Shift</span>
                            <button
                                onClick={() => setPhaseShiftEnabled(!phaseShiftEnabled)}
                                className={`w-12 h-6 rounded-full transition-all relative ${phaseShiftEnabled ? 'bg-emerald-500' : 'bg-secondary/10'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${phaseShiftEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="flex-1 py-4 px-6 rounded-2xl bg-blue-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
                            </button>
                            <button
                                onClick={() => { setTime(0); setBiasDrift(0); setAmpI(1); setAmpQ(1); }}
                                className="p-4 rounded-2xl bg-secondary/5 text-secondary/40 hover:text-secondary hover:bg-secondary/10 transition-all border border-secondary/5"
                                title="Reset Simulation"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <Card>
                    <CustomSlider label="I-Arm Amplitude" value={ampI} min={0} max={2} step={0.1} onChange={setAmpI} />
                </Card>
                <Card>
                    <CustomSlider label="Q-Arm Amplitude" value={ampQ} min={0} max={2} step={0.1} onChange={setAmpQ} />
                </Card>
                <Card>
                    <CustomSlider label="RF Frequency" value={freq} min={0.1} max={5} step={0.1} onChange={setFreq} />
                </Card>
                <Card>
                    <CustomSlider label="Bias Phase Error" value={biasDrift} min={-1} max={1} step={0.05} onChange={setBiasDrift} unit=" rad" />
                </Card>
            </div>

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="I/Q Drive Waveforms (Electrical)">
                    <IQWaveformPlot
                        ampI={ampI}
                        ampQ={ampQ}
                        freq={freq}
                        phaseShiftEnabled={phaseShiftEnabled}
                        modulationFormat={modulationFormat}
                        time={time}
                    />
                </Card>

                <Card title="Constellation Diagram (Complex Domain)" className="bg-slate-950">
                    <div className="flex justify-center">
                        <ConstellationPlot
                            ampI={ampI}
                            ampQ={ampQ}
                            phaseShiftEnabled={phaseShiftEnabled}
                            modulationFormat={modulationFormat}
                            biasDrift={biasDrift}
                        />
                    </div>
                </Card>


                <Card title="Single Arm Transfer Check">
                    <div className="space-y-8">
                        <TransferCurve biasV={vBias} />
                        <CustomSlider
                            label="DC Bias Voltage"
                            value={vBias}
                            onChange={setVBias}
                            min={-Math.PI}
                            max={Math.PI}
                            step={0.05}
                            unit=" rad"
                        />
                        <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mr-4">State:</span>
                            <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">
                                {getBiasName(vBias)}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-20 p-12 bg-white/[0.02] border border-white/10 rounded-[4rem] flex flex-col items-center text-center gap-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400">
                    <Box size={32} />
                </div>
                <div className="max-w-2xl space-y-4">
                    <h3 className="text-2xl font-serif font-bold">Vector Modulation</h3>
                    <p className="text-white/40 font-light leading-relaxed">
                        By controlling both the in-phase (I) and quadrature (Q) components, we can synthesize any point on the complex plane. This is the fundamental mechanism behind all high-speed coherent data transmission.
                    </p>
                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/modulation/external"
                prevLabel="External Modulation"
                nextTo="/lasers/tunable/thermal"
                nextLabel="Temperature Tuning"
            />
        </div>
    );
}

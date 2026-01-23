import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sliders, Activity, Info, Zap, Waves, Cpu, Layers } from "lucide-react";
import MathText from "../../../components/MathText";
import PageNavigation from "../../../components/PageNavigation";

export default function ExternalModulation() {
    const [showTheory, setShowTheory] = useState(false);
    const [modType, setModType] = useState("EOM"); // EOM, EAM, AOM
    const [modDepth, setModDepth] = useState(0.8);
    const [modFreq, setModFrequency] = useState(2);
    const [insertionLoss, setInsertionLoss] = useState(3); // dB
    const [carrierFreq, setCarrierFreq] = useState(15);

    // Time axis for visualization
    const time = useMemo(() => Array.from({ length: 400 }, (_, i) => i / 40), []);

    // 1. Stable CW Laser Output (Unmodulated)
    const laserCW = useMemo(() => time.map(t => Math.sin(2 * Math.PI * carrierFreq * t)), [carrierFreq, time]);

    // 2. Modulating Signal (Drive Voltage)
    const driveSignal = useMemo(() => {
        return time.map(t => {
            const signal = 0.5 + 0.5 * Math.sin(2 * Math.PI * modFreq * t);
            return signal;
        });
    }, [modFreq, time]);

    // 3. Modulated Output Calculation
    const modulatedOutput = useMemo(() => {
        const lossFactor = Math.pow(10, -insertionLoss / 10);

        return time.map((t, i) => {
            const drive = driveSignal[i];
            let envelope = 1;

            if (modType === "EOM") {
                // Mach-Zehnder effect: P_out = P_in * cos^2(phi/2)
                // We map drive signal to a phase shift
                const phi = drive * Math.PI * modDepth;
                envelope = Math.pow(Math.cos(phi / 2), 2);
            } else if (modType === "EAM") {
                // Electro-absorption: Exponential decay
                // P_out = P_in * exp(-alpha * L)
                envelope = Math.exp(-3 * modDepth * drive);
            } else if (modType === "AOM") {
                // Acousto-optic: Bragg diffraction efficiency
                // Simplified as proportional to drive power
                envelope = drive * modDepth;
            }

            const carrier = Math.sin(2 * Math.PI * carrierFreq * t);
            return envelope * carrier * Math.sqrt(lossFactor);
        });
    }, [modType, modDepth, insertionLoss, carrierFreq, driveSignal, time]);

    // Detector Output (Square-law)
    const detectedSignal = useMemo(() => modulatedOutput.map(v => v * v), [modulatedOutput]);

    const toPolyline = (data, yScale, yOffset) =>
        data.map((v, i) => `${i},${yOffset - v * yScale}`).join(" ");

    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-secondary/10 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        External Modulation <br /><span className="text-secondary/20">The High-Speed Frontier</span>
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
                                        <span className="text-blue-500/50">01.</span> Overview
                                    </h2>
                                    <p className="text-xl">
                                        External Modulation decouples the laser's internal dynamics from the modulation process. The laser operates in **Continuous Wave (CW)** mode, and a secondary device manipulates the light afterwards.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: "Zero Chirp", desc: "No carrier-density shifts within the laser cavity." },
                                            { title: "Ultra High Bandwidth", desc: "Speeds exceeding 100 GHz with Lithium Niobate (LiNbO₃)." },
                                            { title: "Signal Fidelity", desc: "Minimal distortion and support for complex modulation (QAM)." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                                                <h4 className="text-white font-bold mb-1 tracking-tight">{item.title}</h4>
                                                <p className="text-xs opacity-50">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-emerald-500/50">02.</span> Comparison of Techniques
                                    </h2>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Zap className="text-blue-400" size={32} />
                                                <span className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest">Phase to Intensity</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Electro-Optic (EOM)</h3>
                                            <p className="text-sm opacity-70 leading-relaxed">
                                                Utilizes the **Pockels Effect** where the refractive index changes linearly with an applied electric field. Typically implemented as a Mach-Zehnder Interferometer (MZI).
                                            </p>
                                            <MathText className="text-[10px] bg-black/40 p-3 rounded-lg block">
                                                {String.raw`$P_{\text{out}} = P_{\text{in}} \cos^2\left(\frac{\pi V}{2 V_\pi}\right)$`}
                                            </MathText>
                                            <ul className="text-[10px] opacity-50 space-y-1">
                                                <li>• Material: Lithium Niobate ($LiNbO_3$)</li>
                                                <li>• Zero or controlled chirp</li>
                                                <li>• Very high speeds (&gt;100 Gbps)</li>
                                            </ul>
                                        </div>
                                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Layers className="text-emerald-400" size={32} />
                                                <span className="text-[10px] font-bold text-emerald-400/50 uppercase tracking-widest">Absorption</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Electro-Absorption (EAM)</h3>
                                            <p className="text-sm opacity-70 leading-relaxed">
                                                Based on the **Franz-Keldysh Effect** or Quantum Confined Stark Effect (QCSE). An applied voltage shifts the absorption edge.
                                            </p>
                                            <MathText className="text-[10px] bg-black/40 p-3 rounded-lg block">
                                                {String.raw`$I(L) = I_0 \cdot e^{-\alpha(V) L}$`}
                                            </MathText>
                                            <ul className="text-[10px] opacity-50 space-y-1">
                                                <li>• Monolithic integration with LDs</li>
                                                <li>• Low drive voltage (&lt; 2V)</li>
                                                <li>• Compact footprint</li>
                                            </ul>
                                        </div>
                                        <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Waves className="text-orange-400" size={32} />
                                                <span className="text-[10px] font-bold text-orange-400/50 uppercase tracking-widest">Diffraction</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Acousto-Optic (AOM)</h3>
                                            <p className="text-sm opacity-70 leading-relaxed">
                                                Uses sound waves to create a periodic refractive index variation (Bragg grating), diffracting light into different orders.
                                            </p>
                                            <ul className="text-[10px] opacity-50 space-y-1">
                                                <li>• Frequency Shifting ($f_c \pm f_s$)</li>
                                                <li>• High extinction ratio</li>
                                                <li>• Slower response (MHz-GHz)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-purple-500/50">03.</span> Advantages & Limitations
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                                                <Activity size={20} /> Key Advantages
                                            </h3>
                                            <ul className="space-y-4">
                                                {[
                                                    { t: "Minimal Chirp", d: "Decoupling laser and modulator eliminates carrier density fluctuations." },
                                                    { t: "Higher Speeds", d: "External modulators can exceed 100 GHz, far beyond laser resonance limits." },
                                                    { t: "Linearity", d: "Better control over signal quality for advanced modulation (16-QAM, etc.)." },
                                                    { t: "Wavelength Stability", d: "Laser runs in CW mode, ensuring a rock-steady carrier frequency." }
                                                ].map((adv, i) => (
                                                    <li key={i} className="flex gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                                        <div>
                                                            <div className="text-white font-bold text-sm">{adv.t}</div>
                                                            <div className="text-xs opacity-50">{adv.d}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                                                <Info size={20} /> Limitations
                                            </h3>
                                            <ul className="space-y-4">
                                                {[
                                                    { t: "Insertion Loss", d: "Passing light through an extra device reduces total output power (3-6 dB typical)." },
                                                    { t: "Complexity & Cost", d: "Requires precision alignment and often more expensive materials like LiNbO₃." },
                                                    { t: "Size", d: "Discrete modulators add significant footprint to the transmitter package." },
                                                    { t: "Polarization Sensitivity", d: "Most external modulators require strictly polarized input light." }
                                                ].map((lim, i) => (
                                                    <li key={i} className="flex gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                                        <div>
                                                            <div className="text-white font-bold text-sm">{lim.t}</div>
                                                            <div className="text-xs opacity-50">{lim.d}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-orange-500/50">04.</span> Design Considerations
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { title: "Half-Wave Voltage ($V_\pi$)", desc: "Voltage required for a π phase shift; determines power consumption." },
                                            { title: "Contrast Ratio", desc: "Ratio of power in '1' state vs '0' state; critical for BER." },
                                            { title: "Chirp Parameter", desc: "Small residual phase modulation during intensity switching." },
                                            { title: "Bandwidth ($S_{21}$)", desc: "Frequency response roll-off due to RC time constants and travel time." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                                                <h4 className="text-orange-300 font-bold text-sm mb-2">{item.title}</h4>
                                                <p className="text-[11px] leading-relaxed opacity-50">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5 pb-8">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-cyan-500/50">05.</span> Applications
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                            <Cpu className="text-cyan-400 mb-4" size={24} />
                                            <h4 className="font-bold text-white mb-2">Long-Haul Fiber</h4>
                                            <p className="text-xs opacity-50 leading-relaxed">Dense Wavelength Division Multiplexing (DWDM) systems requiring ultra-stable frequencies.</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                            <Activity className="text-purple-400 mb-4" size={24} />
                                            <h4 className="font-bold text-white mb-2">Coherent Systems</h4>
                                            <p className="text-xs opacity-50 leading-relaxed">Sophisticated modulation formats like PM-QPSK and 16-QAM using dual-drive MZIs.</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                            <Zap className="text-yellow-400 mb-4" size={24} />
                                            <h4 className="font-bold text-white mb-2">Microwave Photonics</h4>
                                            <p className="text-xs opacity-50 leading-relaxed">Converting RF signals to optical domain for radar and satellite communications.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Waveforms section */}
                <div className="lg:col-span-3 space-y-12">
                    {[
                        { label: "1. Stable CW Laser Output", data: laserCW, scale: 20, offset: 25, color: "#94a3b8", desc: "Pure carrier emission" },
                        { label: "2. Modulating Drive Signal", data: driveSignal, scale: 40, offset: 50, color: "var(--color-secondary)", desc: "External electrical control" },
                        { label: "3. Modulated Optical Output", data: modulatedOutput, scale: 20, offset: 25, color: "#a855f7", desc: `${modType} Implementation` },
                        { label: "4. Detected Signal (Receiver)", data: detectedSignal, scale: 40, offset: 50, color: "#3b82f6", desc: "Photodiode output (Square-Law)" }
                    ].map((plot, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h3 className="text-lg font-bold text-secondary/80">{plot.label}</h3>
                                <div className="text-xs text-secondary/30">{plot.desc}</div>
                            </div>
                            <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
                                <svg viewBox="0 0 400 50" className="w-full h-32 overflow-visible">
                                    <polyline
                                        points={toPolyline(plot.data, plot.scale, plot.offset)}
                                        fill="none"
                                        stroke={plot.color}
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                        className="transition-all duration-300"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls section */}
                <div className="space-y-8">
                    <div className="p-8 bg-secondary/[0.03] backdrop-blur-3xl border border-secondary/10 rounded-[2.5rem] shadow-xl sticky top-8">
                        <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-secondary/30 mb-8 flex items-center gap-2">
                            <Sliders size={12} className="text-blue-500" /> Interaction
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-4 text-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Modulation Type</div>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                                    {["EOM", "EAM", "AOM"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setModType(type)}
                                            className={`py-2 text-[10px] font-bold rounded-lg transition-all ${modType === type ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {[
                                { label: "Modulation Depth", val: modDepth, set: setModDepth, min: 0, max: 1, step: 0.01 },
                                { label: "Modulation Freq", val: modFreq, set: setModFrequency, min: 0.5, max: 5, step: 0.1 },
                                { label: "Insertion Loss", val: insertionLoss, set: setInsertionLoss, min: 0, max: 10, step: 1, unit: "dB" },
                                { label: "Carrier Freq", val: carrierFreq, set: setCarrierFreq, min: 5, max: 30, step: 1 },
                            ].map((ctrl, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <span>{ctrl.label}</span>
                                        <span className="text-blue-400 font-mono">{ctrl.val.toFixed(ctrl.step < 1 ? 2 : 0)}{ctrl.unit}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={ctrl.min}
                                        max={ctrl.max}
                                        step={ctrl.step}
                                        value={ctrl.val}
                                        onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                                        className="w-full accent-blue-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/modulation/direct"
                prevLabel="Direct Modulation"
                nextTo="/lasers/modulation/mzm"
                nextLabel="IQ Modulation & MZM"
            />
        </div>
    );
}

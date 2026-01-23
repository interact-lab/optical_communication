import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sliders, Activity, Info } from "lucide-react";
import MathText from "../../../components/MathText";
import PageNavigation from "../../../components/PageNavigation";

export default function DirectModulation() {
    const [showTheory, setShowTheory] = useState(false);
    const [bias, setBias] = useState(0.6);
    const [modAmp, setModAmp] = useState(0.3);
    const [bandwidth, setBandwidth] = useState(5);
    const [carrierFreq, setCarrierFreq] = useState(12);
    const [chirpCoeff, setChirpCoeff] = useState(2);

    const threshold = 0.5;

    // Time axis (arbitrary units for visualization)
    const time = Array.from({ length: 400 }, (_, i) => i / 40);

    // Digital NRZ input signal
    const digitalSignal = time.map(t => (Math.floor(t) % 2 === 0 ? 1 : 0));

    // Injection current = bias + modulation
    const injectionCurrent = digitalSignal.map(d => bias + d * modAmp);

    // Simple low-pass filter to emulate finite modulation bandwidth
    const filteredEnvelope = injectionCurrent.map((i, idx, arr) => {
        if (idx === 0) return i;
        const alpha = Math.min(0.95, bandwidth / 3);
        return alpha * i + (1 - alpha) * arr[idx - 1];
    });

    // AM envelope (kept above zero)
    const amEnvelope = filteredEnvelope.map(i => Math.max(0, i - threshold));

    // Unmodulated optical carrier
    const pureCarrier = time.map(t => Math.sin(2 * Math.PI * carrierFreq * t));

    // Optical carrier with AM + chirp
    let accumulatedPhase = 0;

    const opticalCarrier = amEnvelope.map((a, idx) => {
        const dA = idx > 0 ? a - amEnvelope[idx - 1] : 0;
        const deltaFreq = chirpCoeff * 20 * dA;
        accumulatedPhase += 2 * Math.PI * deltaFreq;
        const phase = 2 * Math.PI * carrierFreq * time[idx] + accumulatedPhase;
        return a * Math.sin(phase);
    });

    // Square-law detection + receiver low-pass filter
    const detectedPower = opticalCarrier.map(v => v * v);

    const receivedSignal = detectedPower.map((p, idx, arr) => {
        if (idx === 0) return p;
        const alpha = Math.min(0.95, bandwidth / 3);
        return alpha * p + (1 - alpha) * arr[idx - 1];
    });

    // Helper to convert samples to SVG polyline points
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
                        Direct Modulation <br /><span className="text-secondary/20">Carrier-Level Effects</span>
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
                                    <MathText className="text-xl">
                                        Direct Modulation controls a laser diode by applying the modulation signal directly to the drive current. The optical output varies according to the input current waveform.
                                    </MathText>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: "Simple", desc: "No complex external hardware" },
                                            { title: "Cost-Effective", desc: "Minimal components involved" },
                                            { title: "Compact", desc: "Ideal for small-footprint systems" }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-secondary/5 rounded-2xl border border-secondary/5 transition-colors hover:bg-secondary/10">
                                                <h4 className="text-secondary font-bold mb-1 tracking-tight">{item.title}</h4>
                                                <p className="text-xs opacity-50">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-8 bg-secondary/10 border border-secondary/10 rounded-2xl">
                                        <h3 className="text-center text-xs text-secondary/50 uppercase tracking-widest mb-6 font-bold">Governing Rate Equations</h3>
                                        <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                                            <MathText block>{String.raw`$\frac{dN}{dt} = \frac{I}{qV} - \frac{N}{\tau_n} - G S$`}</MathText>
                                            <MathText block>{String.raw`$\frac{dS}{dt} = G S - \frac{S}{\tau_p} + \beta \frac{N}{\tau_n}$`}</MathText>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-secondary/10">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-emerald-500/50">02.</span> How it Works
                                    </h2>
                                    <MathText className="text-xl">{String.raw`The injection current ($I$) directly dictates the carrier density ($N$), which in turn controls photon generation ($S$).`}</MathText>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <ul className="space-y-4">
                                            {[
                                                String.raw`Light emission occurs only when $I > I_{\text{th}}$.`,
                                                "Current variations encode information into optical power.",
                                                "Standard drivers apply the waveform (analog or digital)."
                                            ].map((text, i) => (
                                                <li key={i} className="flex gap-4 items-start">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    </div>
                                                    <MathText className="text-sm">{text}</MathText>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 flex flex-col justify-center">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Non-Linear Dynamics</h4>
                                            <p className="text-sm opacity-80 leading-relaxed italic">
                                                "The optical response is internally delayed by carrier transport. Output power might not strictly follow the input waveform at high frequencies due to Relaxation Oscillations."
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-secondary/10">
                                    <h2 className="text-3xl font-serif font-bold text-secondary flex items-center gap-4">
                                        <span className="text-orange-500/50">03.</span> Modulation Formats
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4 p-8 bg-secondary/5 rounded-[2.5rem] border border-secondary/10">
                                            <h3 className="text-xl font-bold text-secondary">Analog</h3>
                                            <MathText className="text-sm opacity-60">{String.raw`Continuous current variation, such as $I(t) = I_0 + I_m \sin(\omega t)$.`}</MathText>
                                            <ul className="text-xs space-y-2 text-secondary/40">
                                                <li>• Smooth, predictable response</li>
                                                <li>• Essential for radio-over-fiber and sensing</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4 p-8 bg-secondary/5 rounded-[2.5rem] border border-secondary/10">
                                            <h3 className="text-xl font-bold text-secondary">Digital</h3>
                                            <MathText className="text-sm opacity-60">Discrete switching between stable current levels.</MathText>
                                            <ul className="text-xs space-y-2 text-secondary/40">
                                                <li>{String.raw`• Logic High ($I_{\text{on}}$) vs Logic Low ($I_{\text{off}}$)`}</li>
                                                <li>• Foundation of binary optical communications</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-purple-500/50">04.</span> Transient Phenomena
                                    </h2>
                                    <p className="text-lg">Temporal effects that dictate high-speed performance:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { title: "Relaxation Osc.", desc: "Interaction between electron and photon populations causing ringing." },
                                            { title: "Turn-On Delay", desc: "Charge storage delay before stimulated emission dominates." },
                                            { title: "Rise Time", desc: "Transition period between noise floor and steady-state '1'." },
                                            { title: "Fall Time", desc: "Depletion period as carriers recombine during transition to '0'." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                                                <h4 className="text-purple-300 font-bold text-sm mb-2">{item.title}</h4>
                                                <p className="text-[11px] leading-relaxed opacity-50">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-purple-900/20 p-6 rounded-2xl border border-purple-500/30 text-xs text-center mt-6">
                                        <MathText>{String.raw`Important: Maintaining $I_{\text{bias}} > I_{\text{th}}$ significantly reduces Turn-On Delay and waveform jitter.`}</MathText>
                                    </div>
                                </section>

                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-cyan-500/50">05.</span> Performance Limits
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2 space-y-6">
                                            <h3 className="text-xl font-bold text-secondary flex gap-2">The <MathText>{String.raw`$3\text{ dB}$`}</MathText> Limit</h3>
                                            <MathText className="text-sm text-secondary/60 leading-relaxed">
                                                {String.raw`The modulation bandwidth is restricted by the resonance frequency of the laser. Beyond the $3\text{ dB}$ point, the system cannot respond fast enough to input changes.`}
                                            </MathText>
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400">Engineering Factors</h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        "Parasitic inductance in packaging",
                                                        "Carrier transport within the active region",
                                                        "Thermal drift at high injection levels",
                                                        "Impedance matching with driver circuitry"
                                                    ].map((t, i) => (
                                                        <li key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-[11px]">• {t}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="bg-cyan-500/5 p-8 rounded-[3rem] border border-cyan-500/10 flex flex-col justify-center">
                                            <h4 className="text-lg font-bold text-cyan-400 mb-4">Common Uses</h4>
                                            <ul className="text-xs space-y-3 opacity-60 font-medium">
                                                <li>• LAN/Access Networks</li>
                                                <li>• Low-power LIDAR Scan</li>
                                                <li>• Optical Interconnects</li>
                                                <li>• Sensor Interrogation</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-12 border-t border-white/10 mt-12 text-center max-w-3xl mx-auto">
                                    <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mb-6 flex items-center justify-center gap-4">
                                        <div className="h-px w-12 bg-white/10" /> Final Perspective <div className="h-px w-12 bg-white/10" />
                                    </h4>
                                    <MathText className="text-sm opacity-40 italic">
                                        "Direct Modulation remains a pillar of photonics due to its sheer simplicity and cost. While frequency chirp and relaxation oscillations limit its use in long-haul coherent systems, it is the primary choice for short-range high-volume deployments."
                                    </MathText>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Waveforms section */}
                <div className="lg:col-span-3 space-y-12">
                    {[
                        { label: "1. Digital Modulating Signal", data: digitalSignal, scale: 40, offset: 50, color: "var(--color-secondary)", desc: "" },
                        { label: "2. AM Envelope (Bandwidth-Limited)", data: amEnvelope, scale: 40, offset: 50, color: "#4ade80", desc: String.raw`Red dashed line = $I_{\text{th}}$`, threshold: threshold },
                        { label: "3. Optical Carrier (Unmodulated)", data: pureCarrier, scale: 20, offset: 25, color: "#94a3b8", desc: "Pure sinusoidal carrier" },
                        { label: "4. Optical Carrier With AM & Chirp", data: opticalCarrier, scale: 20, offset: 25, color: "#a855f7", desc: String.raw`Includes phase shift $\Delta \phi \sim \Delta I$` },
                        { label: "5. Received Signal (Filtered Output)", data: receivedSignal, scale: 40, offset: 50, color: "#3b82f6", desc: String.raw`Detected power with bandwidth $BW$` }
                    ].map((plot, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h3 className="text-lg font-bold text-white/80">{plot.label}</h3>
                                <MathText className="text-xs text-white/30 truncate">{plot.desc}</MathText>
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
                                    {plot.threshold !== undefined && (
                                        <line
                                            x1="0"
                                            y1={50 - plot.threshold * 40}
                                            x2="400"
                                            y2={50 - plot.threshold * 40}
                                            stroke="#ef4444"
                                            strokeDasharray="4"
                                            strokeWidth="1"
                                            opacity="0.5"
                                        />
                                    )}
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
                            {[
                                { label: "Bias Current", val: bias, set: setBias, min: 0, max: 1, step: 0.01 },
                                { label: "Modulation Amp", val: modAmp, set: setModAmp, min: 0, max: 0.5, step: 0.01 },
                                { label: "Bandwidth", val: bandwidth, set: setBandwidth, min: 0.5, max: 5, step: 0.1 },
                                { label: "Chirp Coeff", val: chirpCoeff, set: setChirpCoeff, min: 0, max: 5, step: 0.1 },
                                { label: "Carrier Freq", val: carrierFreq, set: setCarrierFreq, min: 5, max: 40, step: 1 },
                            ].map((ctrl, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/40">
                                        <span>{ctrl.label}</span>
                                        <span className="text-blue-500 font-mono">{ctrl.val.toFixed(ctrl.step < 1 ? 2 : 0)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={ctrl.min}
                                        max={ctrl.max}
                                        step={ctrl.step}
                                        value={ctrl.val}
                                        onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                                        className="w-full accent-blue-500 h-1.5 bg-secondary/5 rounded-full appearance-none cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/resonators/semiconductor-cavities"
                prevLabel="Semiconductor Cavities"
                nextTo="/lasers/modulation/external"
                nextLabel="External Modulation"
            />
        </div>
    );
}

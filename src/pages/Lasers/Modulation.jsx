import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MathText from '../../components/MathText';

const MZMDiagram = () => {
    const [phase, setPhase] = useState(0); // 0 to 180 (Pi)

    return (
        <div className="bg-secondary/[0.04] border border-secondary/10 p-8 rounded-2xl my-10 shadow-sm">
            <h3 className="text-xl font-serif text-center mb-8 text-[var(--color-secondary)]">Mach-Zehnder Modulator (MZM)</h3>

            <div className="relative h-48 max-w-2xl mx-auto flex items-center justify-center">
                {/* Input Fiber */}
                <div className="absolute left-0 w-12 h-1 bg-[var(--color-secondary)]/20 shadow-[0_0_5px_rgba(var(--color-secondary-rgb),0.1)]"></div>

                {/* Y-Splitter */}
                <svg className="absolute left-12 w-16 h-24" viewBox="0 0 100 100">
                    <path d="M 0 50 Q 50 50 100 0 M 0 50 Q 50 50 100 100" fill="none" stroke="var(--color-tertiary)" strokeWidth="4" />
                </svg>

                {/* Arms */}
                <div className="absolute left-[112px] top-[48px] w-64 h-1 bg-[var(--color-secondary)]/10"></div>
                <div className="absolute left-[112px] bottom-[48px] w-64 h-1 bg-[var(--color-secondary)]/10"></div>

                {/* Phase Shifter (Voltage Control) */}
                <motion.div
                    className="absolute left-[150px] top-[30px] w-32 h-10 border-2 border-[var(--color-accent)] rounded-lg flex items-center justify-center bg-[var(--color-accent)]/10"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <span className="text-[10px] text-[var(--color-accent)] font-bold">V(t)</span>
                </motion.div>

                {/* Y-Combiner */}
                <svg className="absolute left-[368px] w-16 h-24" viewBox="0 0 100 100">
                    <path d="M 0 0 Q 50 50 100 50 M 0 100 Q 50 50 100 50" fill="none" stroke="var(--color-tertiary)" strokeWidth="4" />
                </svg>

                {/* Waves in Arms */}
                <div className="absolute left-[112px] top-[48px] w-64 overflow-hidden h-6">
                    <motion.div
                        className="flex"
                        animate={{ x: [0, -40] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <svg width="120" height="24">
                            <path d="M0 12 Q15 0, 30 12 T60 12 T90 12 T120 12" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" />
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
                            <path d="M0 12 Q15 0, 30 12 T60 12 T90 12 T120 12" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" />
                        </svg>
                    </motion.div>
                </div>

                {/* Output Fiber */}
                <div className="absolute right-0 w-12 h-1 bg-[var(--color-secondary)]/20 shadow-[0_0_5px_rgba(var(--color-secondary-rgb),0.1)]"></div>

                {/* Resulting Wave (Interference) */}
                <div className="absolute right-0 top-1/2 -mt-4 w-12 h-8 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: Math.max(0, 1 - phase / 180) }}
                        className="flex h-full items-center"
                    >
                        <svg width="40" height="24">
                            <path d="M0 12 Q10 0, 20 12 T40 12" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" />
                        </svg>
                    </motion.div>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
                <input
                    type="range" min="0" max="180" value={phase}
                    onChange={(e) => setPhase(Number(e.target.value))}
                    className="w-full max-w-sm accent-[var(--color-accent)]"
                />
                <div className="mt-2 text-sm text-[var(--color-secondary)]/60">
                    Phase Shift: <span className="text-[var(--color-accent)] font-bold">{phase}°</span>
                    ({phase === 180 ? 'Destructive Interference' : 'Constructive Interference'})
                </div>
            </div>
        </div>
    );
}

const Modulation = () => {
    return (
        <div className="max-w-4xl mx-auto pb-24 text-[var(--color-secondary)]">
            <header className="mb-16">
                <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)] mb-4">
                    Laser Modulation
                </h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light max-w-2xl">
                    Encoding information into the light field.
                </p>
            </header>

            {/* SECTION: DIRECT */}
            <section id="direct" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Direct Modulation</h2>
                <div className="grid md:grid-cols-2 gap-10 leading-relaxed text-[var(--color-secondary)]/80">
                    <div>
                        <p className="mb-4">
                            The simplest way to modulate a laser: just change the injection current <MathText>{String.raw`$I(t)$`}</MathText>. As the current increases, the carrier density and photon density follow.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-4 bg-secondary/[0.04] rounded-xl border border-secondary/10 shadow-sm">
                                <span className="text-[var(--color-tertiary)] font-bold">Pro:</span>
                                <span className="text-sm">Inexpensive, no extra components needed.</span>
                            </li>
                            <li className="flex gap-4 p-4 bg-secondary/[0.04] rounded-xl border border-secondary/10 shadow-sm">
                                <span className="text-red-500 font-bold">Con:</span>
                                <span className="text-sm">Frequency Chirp and limited speed (Relaxation Oscillations).</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col justify-center items-center p-6 bg-[var(--color-primary)] border border-secondary/10 rounded-2xl shadow-inner">
                        <p className="text-xs text-[var(--color-secondary)]/40 mb-6 uppercase tracking-widest font-bold">Rate Equations Simplified</p>
                        <MathText block>{String.raw`$\frac{dN}{dt} = \frac{I}{qV} - \frac{N}{\tau_n} - G S$`}</MathText>
                        <MathText block>{String.raw`$\frac{dS}{dt} = G S - \frac{S}{\tau_p} + \beta \frac{N}{\tau_n}$`}</MathText>
                    </div>
                </div>
            </section>

            {/* SECTION: CHIRP */}
            <section id="chirp" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Chirp: Dynamic Cavity Change</h2>
                <div className="p-8 bg-secondary/[0.04] border border-secondary/10 rounded-2xl leading-relaxed text-[var(--color-secondary)]/80 shadow-sm">
                    <p className="mb-4">
                        Frequency chirp is a major drawback of direct modulation. When the current changes, the refractive index of the semiconductor changes due to the carrier-induced plasma effect.
                    </p>
                    <p className="mb-6">
                        Because the laser wavelength <MathText>{String.raw`$\lambda = 2nL/m$`}</MathText> depends on the index <MathText>{String.raw`$n$`}</MathText>, the laser's frequency shifts (chirps) while its intensity is changing.
                    </p>
                    <div className="flex justify-center border-t border-secondary/10 pt-6">
                        <MathText block>{String.raw`$\Delta\nu(t) = \frac{\alpha_H}{4\pi} \left( \frac{1}{P} \frac{dP}{dt} + \kappa P \right)$`}</MathText>
                    </div>
                </div>
            </section>

            {/* SECTION: EXTERNAL */}
            <section id="external" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Why External Modulators?</h2>
                <div className="grid md:grid-cols-2 gap-8 text-[var(--color-secondary)]/80">
                    <div className="space-y-4 p-6 bg-secondary/[0.04] rounded-xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)]">High Speed</h3>
                        <p className="text-sm opacity-80">External modulators can reach 100+ GHz, far exceeding the 10-20 GHz limit of most directly modulated lasers.</p>
                    </div>
                    <div className="space-y-4 p-6 bg-secondary/[0.04] rounded-xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)]">Zero Chirp</h3>
                        <p className="text-sm opacity-80">By keeping the laser at a constant current (CW), we eliminate the thermal and carrier-induced chirp, allowing for long-haul transmission.</p>
                    </div>
                    <div className="space-y-4 p-6 bg-secondary/[0.04] rounded-xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)]">Phase Control</h3>
                        <p className="text-sm opacity-80">External modulators allow us to control both Amplitude and Phase, enabling complex formats like QPSK or 16-QAM.</p>
                    </div>
                    <div className="space-y-4 p-6 bg-secondary/[0.04] rounded-xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)]">Bandwidth (BW)</h3>
                        <p className="text-sm opacity-80">Modulators create sidebands. The modulation bandwidth determines how much data we can pack into a single optical carrier.</p>
                    </div>
                </div>
            </section>

            {/* SECTION: MZM */}
            <section id="mzm" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Mach-Zehnder Modulators</h2>
                <p className="text-[var(--color-secondary)]/80 mb-8 leading-relaxed">
                    The MZM works on the principle of <strong className="text-[var(--color-secondary)] font-bold italic">Interferometry</strong>. We split the light into two arms, change the phase in one (or both), and recombine them. If the phase difference is 180°, the light cancels out.
                </p>

                <MZMDiagram />

                <div className="mt-8 p-6 bg-[var(--color-accent)]/[0.05] border border-[var(--color-accent)]/20 rounded-2xl shadow-sm">
                    <h4 className="text-[var(--color-accent)] font-bold mb-4">Transfer Function</h4>
                    <MathText block>{String.raw`$P_{out} = P_{in} \cos^2\left(\frac{\pi V}{2 V_\pi}\right)$`}</MathText>
                    <p className="text-xs text-[var(--color-secondary)]/40 mt-4 italic font-bold">
                        Where <MathText>{String.raw`$V_\pi$`}</MathText> is the voltage required to induce a 180° phase shift.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Modulation;

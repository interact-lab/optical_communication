import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MathText from '../../components/MathText';

const GainCurveVisual = () => {
    const [pump, setPump] = useState(50);

    return (
        <div className="bg-secondary/[0.04] border border-secondary/10 p-8 rounded-2xl my-10 shadow-sm">
            <h3 className="text-xl font-serif text-center mb-10 text-[var(--color-secondary)]">Gain Spectrum & Threshold</h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full p-6 bg-[var(--color-primary)] rounded-xl border border-secondary/10 shadow-inner">
                    <svg viewBox="0 0 600 300" className="w-full h-auto">
                        {/* Axes */}
                        <line x1="50" y1="250" x2="550" y2="250" stroke="currentColor" className="text-secondary/20" strokeWidth="2" />
                        <line x1="50" y1="250" x2="50" y2="50" stroke="currentColor" className="text-secondary/20" strokeWidth="2" />

                        {/* Threshold Line */}
                        <line x1="50" y1="150" x2="550" y2="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="520" y="140" fill="#ef4444" fontSize="12" fontWeight="bold">Losses (α)</text>

                        {/* Gain Curve */}
                        <path
                            d={`M 50 250 ${Array.from({ length: 100 }).map((_, i) => {
                                const x = 50 + (i * 5);
                                const normalizedX = (i - 50) / 20;
                                const height = (pump / 10) * Math.exp(-(normalizedX * normalizedX));
                                return `L ${x} ${250 - height * 20}`;
                            }).join(' ')}`}
                            fill="none" stroke="var(--color-tertiary)" strokeWidth="3"
                            className="drop-shadow-[0_0_8px_var(--color-tertiary)]"
                        />

                        <text x="550" y="270" fill="var(--color-secondary)" opacity="0.4" fontSize="12" textAnchor="end">Frequency (ν)</text>
                        <text x="35" y="70" fill="var(--color-secondary)" opacity="0.4" fontSize="12" style={{ transform: 'rotate(-90deg)', transformOrigin: '35px 70px' }}>Gain / Loss</text>
                    </svg>
                </div>

                <div className="w-full md:w-48 space-y-4">
                    <div className="p-5 bg-[var(--color-primary)] rounded-xl border border-secondary/10 shadow-sm">
                        <label className="text-xs text-[var(--color-secondary)]/40 uppercase tracking-widest block mb-3 font-bold">Pump Current</label>
                        <input
                            type="range" min="0" max="100" value={pump}
                            onChange={(e) => setPump(Number(e.target.value))}
                            className="w-full accent-[var(--color-tertiary)]"
                        />
                        <div className="mt-4 text-center">
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${pump > 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {pump > 50 ? 'Lasing State' : 'Below Threshold'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GainLoss = () => {
    return (
        <div className="max-w-4xl mx-auto pb-24 text-[var(--color-secondary)]">
            <header className="mb-16">
                <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)] mb-4">
                    Gain, Loss & Linewidth
                </h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light max-w-2xl">
                    The delicate balance between amplification and decay that defines laser stability.
                </p>
            </header>

            {/* SECTION: GAIN BROADENING */}
            <section id="gain-broadening" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Gain Broadening</h2>
                <div className="grid md:grid-cols-2 gap-10 leading-relaxed text-[var(--color-secondary)]/80">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">Homogeneous Broadening</h3>
                        <p className="mb-4">
                            Every atom in the medium has the same transition frequency. Common in gases where collisions or lifetime effects broaden the line for everyone equally.
                        </p>
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-3">Inhomogeneous Broadening</h3>
                        <p>
                            Different atoms have different center frequencies. In semiconductors, this is driven by local variations in the crystal lattice or Doppler shifts in gases.
                        </p>
                    </div>
                    <div className="p-8 bg-secondary/[0.04] rounded-2xl border border-secondary/10 shadow-sm flex flex-col justify-center">
                        <p className="text-sm italic text-[var(--color-tertiary)] mb-4 font-bold">Frequency Dependency of Gain:</p>
                        <MathText block>{String.raw`$g(\nu) = g_0 \frac{1}{1 + [2(\nu-\nu_0)/\Delta\nu]^2}$`}</MathText>
                        <p className="text-xs text-[var(--color-secondary)]/40 mt-6 leading-relaxed font-medium">
                            The Lorentzian profile describes the available gain across frequencies. Only those modes with <MathText>{String.raw`$g(\nu) > \alpha$`}</MathText> can lase.
                        </p>
                    </div>
                </div>
            </section>

            <GainCurveVisual />

            {/* SECTION: LOSSES */}
            <section id="losses" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Sources of Losses</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Mirror Loss", desc: "Energy escaping the cavity (output coupling). Necessary to use the laser!", icon: "M" },
                        { title: "Internal Loss", desc: "Absorption within the active medium and scattering at interfaces.", icon: "I" },
                        { title: "Diffraction", desc: "Light spilling out of the waveguide or resonator modes.", icon: "D" }
                    ].map(loss => (
                        <div key={loss.title} className="p-6 bg-secondary/[0.04] border border-secondary/10 rounded-xl hover:border-[var(--color-tertiary)] transition-all group">
                            <div className="w-10 h-10 bg-[var(--color-tertiary)]/10 rounded-full flex items-center justify-center text-[var(--color-tertiary)] font-bold mb-4 group-hover:bg-[var(--color-tertiary)] group-hover:text-[var(--color-primary)] transition-colors">{loss.icon}</div>
                            <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-2">{loss.title}</h3>
                            <p className="text-sm text-[var(--color-secondary)]/60 leading-relaxed">{loss.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 p-8 bg-[var(--color-primary)] border border-secondary/10 rounded-2xl text-center shadow-inner">
                    <MathText>{String.raw`$\alpha_{total} = \alpha_{int} + \frac{1}{2L} \ln\left(\frac{1}{R_1 R_2}\right)$`}</MathText>
                </div>
            </section>

            {/* SECTION: LINEWIDTH */}
            <section id="linewidth" className="mb-20">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">The Reason for Linewidth</h2>
                <div className="text-[var(--color-secondary)]/80 leading-relaxed">
                    <p className="text-lg mb-8">
                        In an ideal world, a laser emits a single, perfect frequency. In reality, every laser has a "linewidth" — a spread of frequencies.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 my-8">
                        <div className="p-6 bg-secondary/[0.04] border border-secondary/10 rounded-xl">
                            <h4 className="text-[var(--color-secondary)] font-bold mb-4">Phase Noise</h4>
                            <p className="text-sm opacity-80">
                                Spontaneous emission events inject photons with random phases into the coherent field. This "kicks" the phase, causing it to drift over time.
                            </p>
                        </div>
                        <div className="p-6 bg-secondary/[0.04] border border-secondary/10 rounded-xl">
                            <h4 className="text-[var(--color-secondary)] font-bold mb-4">Henry α Factor</h4>
                            <p className="text-sm opacity-80">
                                In semiconductor lasers, changes in carrier density couple amplitude noise to phase noise, broadening the linewidth further.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION: SCHAWLOW-TOWNES */}
            <section id="schawlow-townes">
                <div className="p-10 bg-secondary/[0.04] border border-secondary/10 rounded-3xl relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Schawlow-Townes Limit</h2>
                        <p className="text-lg text-[var(--color-secondary)]/80 mb-8 max-w-2xl font-light">
                            The fundamental limit of laser linewidth, determined by spontaneous emission into the lasing mode.
                        </p>
                        <div className="bg-[var(--color-primary)] p-8 rounded-2xl border border-secondary/10 flex flex-col items-center shadow-inner">
                            <MathText block>{String.raw`$\Delta\nu = \frac{2\pi h\nu (\Delta\nu_{cav})^2}{P_{out}} (1 + \alpha_H^2)$`}</MathText>
                            <p className="text-xs text-[var(--color-secondary)]/40 mt-8 italic font-bold max-w-md text-center">
                                Wait, why does higher power (P) decrease linewidth? <br />
                                <span className="mt-2 block opacity-60">Because the relative weight of one "spontaneous kick" is smaller when the field is stronger.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GainLoss;

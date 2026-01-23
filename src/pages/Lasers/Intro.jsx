import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import MathText from '../../components/MathText';
import PageNavigation from '../../components/PageNavigation';

const PhotonWave = ({ startX, endX, y, delay = 0, color = "var(--color-tertiary)", onComplete }) => {
    return (
        <motion.div
            initial={{ x: startX, opacity: 0 }}
            animate={{ x: endX, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, delay, ease: "linear" }}
            onAnimationComplete={onComplete}
            className="absolute"
            style={{ top: y }}
        >
            <svg width="40" height="20" viewBox="0 0 40 20">
                <path
                    d="M0 10 Q5 0, 10 10 T20 10 T30 10 T40 10"
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                />
            </svg>
        </motion.div>
    );
};

const ThreeStateDiagram = () => {
    const [stepAbs, setStepAbs] = useState(0);
    const [stepSpon, setStepSpon] = useState(0);
    const [stepStim, setStepStim] = useState(0);

    const playAbs = () => {
        if (stepAbs !== 0) return;
        setStepAbs(1);
        setTimeout(() => setStepAbs(2), 1000);
        setTimeout(() => setStepAbs(0), 4000);
    };

    const playSpon = () => {
        if (stepSpon !== 0) return;
        setStepSpon(1);
        setTimeout(() => setStepSpon(2), 1000);
        setTimeout(() => setStepSpon(0), 4000);
    };

    const playStim = () => {
        if (stepStim !== 0) return;
        setStepStim(1);
        setTimeout(() => setStepStim(2), 1000);
        setTimeout(() => setStepStim(0), 4000);
    };

    const E2_Y = 50;
    const E1_Y = 180;
    const ELECTRON_SIZE = 16;

    const E2_POS = E2_Y - (ELECTRON_SIZE / 2);
    const E1_POS = E1_Y - (ELECTRON_SIZE / 2);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 p-6 bg-secondary/[0.04] rounded-xl border border-secondary/10 shadow-sm">
            {/* Absorption */}
            <div className="relative h-72 border border-secondary/10 rounded-lg p-4 flex flex-col items-center bg-[var(--color-primary)] shadow-sm">
                <div className="flex items-center justify-between w-full mb-4 px-2">
                    <h4 className="text-[var(--color-secondary)] font-bold">Absorption</h4>
                    <button onClick={playAbs} disabled={stepAbs !== 0} className="p-1 hover:bg-secondary/10 rounded-full transition-colors disabled:opacity-30">
                        <Play size={16} className="text-[var(--color-tertiary)] fill-[var(--color-tertiary)]" />
                    </button>
                </div>
                <div className="relative w-full h-full">
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E2_Y }}><span className="text-[10px] text-secondary/60 absolute -top-4 font-bold">E2 (Excited)</span></div>
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E1_Y }}><span className="text-[10px] text-secondary/60 absolute top-2 font-bold">E1 (Ground)</span></div>
                    <motion.div className="absolute left-1/2 -ml-2 w-4 h-4 bg-[var(--color-tertiary)] rounded-full shadow-[0_0_15px_var(--color-tertiary)]" animate={{ top: (stepAbs >= 2) ? E2_POS : E1_POS }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                    {stepAbs === 1 && <PhotonWave startX={-40} endX={100} y={E1_Y - 10} color="var(--color-tertiary)" />}
                </div>
            </div>

            {/* Spontaneous Emission */}
            <div className="relative h-72 border border-secondary/10 rounded-lg p-4 flex flex-col items-center bg-[var(--color-primary)] shadow-sm">
                <div className="flex items-center justify-between w-full mb-4 px-2">
                    <h4 className="text-[var(--color-secondary)] font-bold">Spontaneous Emission</h4>
                    <button onClick={playSpon} disabled={stepSpon !== 0} className="p-1 hover:bg-secondary/10 rounded-full transition-colors disabled:opacity-30">
                        <Play size={16} className="text-[var(--color-tertiary)] fill-[var(--color-tertiary)]" />
                    </button>
                </div>
                <div className="relative w-full h-full">
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E2_Y }}><span className="text-[10px] text-secondary/60 absolute -top-4 font-bold">E2 (Excited)</span></div>
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E1_Y }}><span className="text-[10px] text-secondary/60 absolute top-2 font-bold">E1 (Ground)</span></div>
                    <motion.div className="absolute left-1/2 -ml-2 w-4 h-4 bg-[var(--color-accent)] rounded-full shadow-[0_0_10px_var(--color-accent)]" animate={{ top: (stepSpon >= 2) ? E1_POS : E2_POS }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                    {stepSpon === 2 && (
                        <motion.div initial={{ x: 100, y: E2_Y + 10, opacity: 0 }} animate={{ x: [100, 200], y: [E2_Y + 10, E2_Y - 30], opacity: [0, 1, 0] }} transition={{ duration: 1.5 }} className="absolute">
                            <svg width="40" height="20" viewBox="0 0 40 20" style={{ transform: 'rotate(-30deg)' }}><path d="M0 10 Q5 0, 10 10 T20 10 T30 10 T40 10" fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5" /></svg>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Stimulated Emission */}
            <div className="relative h-72 border border-secondary/10 rounded-lg p-4 flex flex-col items-center bg-[var(--color-primary)] shadow-sm">
                <div className="flex items-center justify-between w-full mb-4 px-2">
                    <h4 className="text-[var(--color-secondary)] font-bold">Stimulated Emission</h4>
                    <button onClick={playStim} disabled={stepStim !== 0} className="p-1 hover:bg-secondary/10 rounded-full transition-colors disabled:opacity-30">
                        <Play size={16} className="text-[var(--color-tertiary)] fill-[var(--color-tertiary)]" />
                    </button>
                </div>
                <div className="relative w-full h-full">
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E2_Y }}><span className="text-[10px] text-secondary/60 absolute -top-4 font-bold">E2 (Excited)</span></div>
                    <div className="absolute left-4 right-4 h-0.5 bg-secondary/20" style={{ top: E1_Y }}><span className="text-[10px] text-secondary/60 absolute top-2 font-bold">E1 (Ground)</span></div>
                    <motion.div className="absolute left-1/2 -ml-2 w-4 h-4 bg-[var(--color-tertiary)] rounded-full shadow-[0_0_15px_var(--color-tertiary)]" animate={{ top: (stepStim >= 2) ? E1_POS : E2_POS }} transition={{ duration: 1.0, ease: "easeInOut" }} />
                    {stepStim === 1 && <PhotonWave startX={-40} endX={100} y={E2_Y - 10} color="var(--color-tertiary)" />}
                    {stepStim === 2 && (
                        <>
                            <PhotonWave startX={100} endX={250} y={E2_Y - 15} color="var(--color-tertiary)" />
                            <PhotonWave startX={100} endX={250} y={E2_Y + 5} color="var(--color-tertiary)" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const Intro = () => {
    const [freq, setFreq] = useState(50);
    const [pol, setPol] = useState("linear");
    const [amp, setAmp] = useState(50);
    const [phase, setPhase] = useState(0);

    return (
        <div className="min-h-screen bg-[var(--color-primary)] text-[var(--color-secondary)] font-sans transition-colors duration-300">
            {/* Hero / What are Lasers */}
            <section id="what-are-lasers" className="py-24 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 font-serif text-[var(--color-secondary)] border-b-2 border-[var(--color-tertiary)]/20 pb-2 inline-block">Definition</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4 text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                        <p>
                            A laser is an optical source that generates light through <span className="text-[var(--color-tertiary)] font-bold">stimulated emission</span>, enforcing strong constraints on frequency, phase, direction, and polarization. Unlike ordinary sources, lasers emit light as long, coherent wave trains rather than short, random bursts.
                        </p>
                        <p>
                            Because of this order, lasers are essential in fiber-optic communication, precision metrology, medical imaging and surgery, manufacturing, sensing, and scientific research.
                        </p>
                    </div>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2 }}
                        className="origin-left h-1 bg-[var(--color-tertiary)] rounded-full mt-12 shadow-[0_0_15px_var(--color-tertiary)] opacity-30"
                    />
                </div>
            </section>

            {/* Optical Sources */}
            <section id="optical-sources" className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-semibold mb-4 font-serif text-[var(--color-secondary)]">Optical Sources</h2>
                    <p className="text-[var(--color-secondary)]/70 mb-4 text-lg">
                        Optical sources generate electromagnetic radiation in the visible or infrared spectrum.
                    </p>
                    <ul className="space-y-3 text-[var(--color-secondary)]/90">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary/20 rounded-full"></div> Thermal sources (Sun, incandescent lamps)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary/40 rounded-full"></div> LEDs (spontaneous emission)</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[var(--color-tertiary)] rounded-full font-bold shadow-[0_0_10px_var(--color-tertiary)]"></div> Lasers (stimulated emission)</li>
                    </ul>
                </div>
                <motion.div className="rounded-2xl bg-secondary/5 border border-secondary/10 p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-sm text-[var(--color-secondary)]/80 relative z-10">
                        <span className="text-[var(--color-tertiary)] font-bold">Coherence</span> describes how predictable a light wave is in space and time. In coherent sources, the wave maintains a stable phase relationship over many cycles, forming long, ordered wave trains.
                    </p>
                    <motion.div
                        animate={{ x: [0, 40, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="mt-4 h-1 bg-gradient-to-r from-[var(--color-tertiary)] to-transparent relative z-10 rounded-full"
                    />
                </motion.div>
            </section>

            {/* Components of Light */}
            <section id="components" className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold mb-10 font-serif text-[var(--color-secondary)] border-b border-secondary/10 pb-4">Light Components</h2>

                {/* Amplitude */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 items-center">
                    <div>
                        <h3 className="text-2xl mb-2 text-[var(--color-secondary)] font-bold">Amplitude</h3>
                        <p className="text-[var(--color-secondary)]/70 mb-2 font-light">Sets the strength of the electric field.</p>
                        <p className="text-[var(--color-secondary)]/50 mb-4 text-sm font-italic">Physically, this corresponds to optical power or intensity.</p>
                        <input type="range" min="10" max="80" value={amp} onChange={(e) => setAmp(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="border border-secondary/10 p-6 bg-[var(--color-primary)] rounded-2xl shadow-sm">
                        <svg viewBox="0 0 600 200" className="w-full">
                            <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" className="text-secondary/20" />
                            <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" className="text-secondary/20" />
                            <path
                                d={`M 0 100 ${Array.from({ length: 60 }).map((_, i) => {
                                    const x = i * 10;
                                    const y = 100 + amp * Math.sin((i / 50) * Math.PI * 2);
                                    return `L ${x} ${y}`;
                                }).join(" ")}`}
                                fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5"
                                className="drop-shadow-[0_0_5px_var(--color-tertiary)]"
                            />
                        </svg>
                    </div>
                </div>

                {/* Frequency */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 items-center">
                    <div>
                        <h3 className="text-2xl mb-2 text-[var(--color-secondary)] font-bold">Frequency</h3>
                        <p className="text-[var(--color-secondary)]/70 mb-2 font-light">Controls how fast the wave oscillates.</p>
                        <p className="text-[var(--color-secondary)]/50 mb-4 text-sm font-italic">Higher frequency means shorter wavelength (blue shift).</p>
                        <input type="range" min="10" max="100" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="border border-secondary/10 p-6 bg-[var(--color-primary)] rounded-2xl shadow-sm">
                        <svg viewBox="0 0 600 200" className="w-full">
                            <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" className="text-secondary/20" />
                            <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" className="text-secondary/20" />
                            <path
                                d={`M 0 100 ${Array.from({ length: 60 }).map((_, i) => {
                                    const x = i * 10;
                                    const y = 100 + 40 * Math.sin((i / (110 - freq)) * Math.PI * 2);
                                    return `L ${x} ${y}`;
                                }).join(" ")}`}
                                fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5"
                                className="drop-shadow-[0_0_5px_var(--color-tertiary)]"
                            />
                        </svg>
                    </div>
                </div>

                {/* Phase */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 items-center">
                    <div>
                        <h3 className="text-2xl mb-2 text-[var(--color-secondary)] font-bold">Phase</h3>
                        <p className="text-[var(--color-secondary)]/70 mb-2 font-light">Defines the wave's starting position.</p>
                        <p className="text-[var(--color-secondary)]/50 mb-4 text-sm font-italic">Crucial for interference and coherent communication.</p>
                        <input type="range" min="0" max="360" value={phase} onChange={(e) => setPhase(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="border border-secondary/10 p-6 bg-[var(--color-primary)] rounded-2xl shadow-sm">
                        <svg viewBox="0 0 600 200" className="w-full">
                            <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" className="text-secondary/20" />
                            <path
                                d={`M 0 100 ${Array.from({ length: 60 }).map((_, i) => {
                                    const x = i * 10;
                                    const y = 100 + 40 * Math.sin((i / 50) * Math.PI * 2 + (phase * Math.PI) / 180);
                                    return `L ${x} ${y}`;
                                }).join(" ")}`}
                                fill="none" stroke="var(--color-tertiary)" strokeWidth="2.5"
                                className="drop-shadow-[0_0_5px_var(--color-tertiary)]"
                            />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Energy Levels Section */}
            <section id="energy-levels" className="py-24 px-6 max-w-6xl mx-auto border-t border-secondary/10">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-secondary)] mb-4">Energy Levels</h1>
                    <p className="text-xl text-[var(--color-tertiary)] font-light italic opacity-80">
                        How quantized energy levels and light–matter interaction give rise to laser action.
                    </p>
                </header>

                <div className="mb-16">
                    <h2 className="text-3xl font-serif text-[var(--color-secondary)] mb-6">Interaction States</h2>
                    <p className="text-lg text-[var(--color-secondary)]/80 leading-relaxed mb-6">
                        Atoms and molecules possess quantized energy levels. Transitions occur when a photon energy matches the gap:
                    </p>

                    <div className="flex justify-center my-10">
                        <div className="p-8 bg-secondary/5 border border-secondary/10 rounded-2xl shadow-xl">
                            <MathText block>{String.raw`$\Delta E = E_2 - E_1 = h\nu$`}</MathText>
                        </div>
                    </div>
                </div>

                <ThreeStateDiagram />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-[var(--color-secondary)]">
                    <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Absorption</h3>
                        <p className="text-sm opacity-80">A photon is <span className="text-[var(--color-tertiary)] font-semibold">consumed</span> to lift an electron to the excited state.</p>
                    </div>
                    <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 hover:border-[var(--color-accent)] transition-all">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Spontaneous Emission</h3>
                        <p className="text-sm opacity-80">The electron falls naturally, releasing a photon in any direction.</p>
                    </div>
                    <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Stimulated Emission</h3>
                        <p className="text-sm opacity-80">An incident photon seeds the transition, creating a <span className="text-[var(--color-tertiary)] font-bold">clone</span> photon.</p>
                    </div>
                </div>
            </section>

            <PageNavigation
                nextTo="/lasers/resonators"
                nextLabel="Optical Resonators"
            />

            <footer className="py-24 text-center text-[var(--color-secondary)]/20">
                <p className="text-sm italic">"The light is coherent because every photon knows what the other is doing."</p>
            </footer>
        </div>
    );
};

export default Intro;

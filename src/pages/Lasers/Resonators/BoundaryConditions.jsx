import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MathText from '../../../components/MathText';

export default function BoundaryConditions() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [length, setLength] = useState(400); // cavity length in px
    const [mode, setMode] = useState(1);
    const [showTheory, setShowTheory] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let t = 0;

        // Get CSS variable colors
        const getColor = (varName) => {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        };

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 300 * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = 300;

        function draw() {
            const tertiaryColor = getColor('--color-tertiary');
            const secondaryColor = getColor('--color-secondary');

            ctx.clearRect(0, 0, width, height);

            const left = 100;
            const right = left + length;
            const midY = height / 2;

            // mirrors
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(left, midY - 60);
            ctx.lineTo(left, midY + 60);
            ctx.moveTo(right, midY - 60);
            ctx.lineTo(right, midY + 60);
            ctx.stroke();

            // standing wave
            ctx.beginPath();
            const k = (mode * Math.PI) / length;
            for (let x = 0; x <= length; x++) {
                const X = left + x;
                const y = midY + 40 * Math.sin(k * x) * Math.cos(t);
                if (x === 0) ctx.moveTo(X, y);
                else ctx.lineTo(X, y);
            }
            ctx.strokeStyle = tertiaryColor;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = tertiaryColor;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // nodes
            ctx.fillStyle = secondaryColor;
            for (let m = 0; m <= mode; m++) {
                const nx = left + (m * length) / mode;
                ctx.beginPath();
                ctx.arc(nx, midY, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            t += 0.05;
            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, [length, mode]);

    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)]">
                        Boundary Conditions Create Quantization
                    </h1>
                    <button
                        onClick={() => setShowTheory(!showTheory)}
                        className="p-2 rounded-full hover:bg-secondary/10 transition-all text-secondary/40 hover:text-secondary mt-2"
                        title="Toggle Theory"
                    >
                        <ChevronDown size={28} className={`transition-transform duration-300 ${showTheory ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light mb-8">
                    Cavity boundaries impose phase constraints. Only standing waves with nodes at the mirrors survive.
                </p>

                <AnimatePresence>
                    {showTheory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="p-8 bg-secondary/[0.04] rounded-3xl border border-secondary/10 space-y-6 text-[var(--color-secondary)]/80 leading-relaxed">
                                <p>
                                    In a laser cavity (e.g., Fabry–Pérot, ring, spherical), one looks for solutions of Maxwell’s equations that are invariant under propagation through the cavity—i.e., they reproduce their amplitude and phase after one round trip. These are <strong>eigenmodes</strong> of the passive cavity:
                                </p>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li>
                                        <strong className="text-secondary">Longitudinal modes:</strong> satisfy the round-trip phase condition, <MathText inline>{String.raw`$\Delta \phi = 2 \pi m$`}</MathText>, where <MathText inline>{String.raw`$m$`}</MathText> is an integer.
                                    </li>
                                    <li>
                                        <strong className="text-secondary">Transverse modes:</strong> represent specific spatial field distributions that are self-reproducing after a complete round trip.
                                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 opacity-60">djvu.online +1</span>
                                    </li>
                                </ul>
                                <p>
                                    Mathematically these are solutions to the wave equation with appropriate boundary conditions rather than isolated “reflections.”
                                </p>

                                <div className="pt-4 border-t border-secondary/10">
                                    <h3 className="text-xl font-serif font-bold text-secondary mb-4 text-[var(--color-tertiary)]">2.2. Threshold and Phase Conditions</h3>
                                    <p className="mb-6 text-sm">Two fundamental conditions determine whether a mode will lase:</p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-[var(--color-primary)] rounded-2xl border border-secondary/10 relative">
                                            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-30">Wikipedia</span>
                                            <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                Amplitude (gain) condition
                                            </h4>
                                            <p className="text-sm opacity-80">Round-trip gain must exceed losses experienced in one cycle (including mirror, scattering, and material losses).</p>
                                        </div>

                                        <div className="p-6 bg-[var(--color-primary)] rounded-2xl border border-secondary/10 relative">
                                            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-30">neurophasia.com</span>
                                            <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)]"></div>
                                                Phase (resonance) condition
                                            </h4>
                                            <p className="text-sm opacity-80 mb-4">The total accumulated optical phase after a round trip must be an integer multiple of <MathText inline>{String.raw`$2\pi$`}</MathText>, leading to discrete resonant frequencies:</p>
                                            <div className="bg-secondary/[0.03] p-3 rounded-lg border border-secondary/5">
                                                <MathText block>{String.raw`$n \cdot 2L = m\lambda \implies f_m = \frac{mc}{2nL}$`}</MathText>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-sm italic">Only such frequencies can build up coherently in the cavity. These eigenvalues define the allowed wavelengths of the laser.</p>
                                </div>

                                <div className="pt-8 border-t border-secondary/10 mt-8">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-4 divider flex items-center gap-4">
                                        References
                                        <div className="h-px bg-secondary/10 flex-1"></div>
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[11px] opacity-60">
                                        <li>A. E. Siegman, <em>Lasers</em>, University Science Books, 1986.</li>
                                        <li>W. T. Silfvast, <em>Laser Fundamentals</em>, Cambridge University Press, 2004.</li>
                                        <li>A. Yariv and P. Yeh, <em>Photonics: Optical Electronics in Modern Communications</em>, Oxford University Press.</li>
                                        <li>Maxwell–Bloch formalism and cavity mode theory summaries, Wikipedia.</li>
                                        <li>Neurophasia, <em>Laser Resonators and Cavity Modes</em> (educational notes).</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="space-y-8">
                {/* Canvas Visualization */}
                <div
                    ref={containerRef}
                    className="bg-[var(--color-primary)] p-6 rounded-3xl border border-secondary/10 shadow-inner overflow-hidden"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-[300px] block"
                    />
                </div>

                {/* Controls */}
                <div className="bg-secondary/[0.04] p-6 rounded-2xl border border-secondary/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-[var(--color-secondary)]/60 uppercase tracking-wider">
                                    Cavity Length
                                </label>
                                <span className="text-[var(--color-tertiary)] font-mono font-bold text-lg">
                                    {length} px
                                </span>
                            </div>
                            <input
                                type="range"
                                min={200}
                                max={600}
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-2 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-[var(--color-secondary)]/60 uppercase tracking-wider">
                                    Mode Index (m)
                                </label>
                                <span className="text-[var(--color-tertiary)] font-mono font-bold text-lg">
                                    {mode}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={6}
                                value={mode}
                                onChange={(e) => setMode(Number(e.target.value))}
                                className="w-full h-2 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Explanation */}
                <div className="p-6 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-[var(--color-accent)] mb-3 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Key Insight
                    </h3>
                    <p className="text-[var(--color-secondary)]/80 text-base leading-relaxed">
                        The laser does not choose its wavelength. <strong className="text-[var(--color-secondary)]">Geometry forces the allowed modes.</strong> Only wavelengths that satisfy <MathText inline>{String.raw`$m\lambda/2 = L$`}</MathText> can form stable standing waves with nodes at both mirrors.
                    </p>
                </div>

                {/* Formula */}
                <div className="bg-secondary/[0.04] p-8 rounded-2xl border border-secondary/10">
                    <h3 className="text-xl font-serif text-[var(--color-tertiary)] mb-4">Quantization Condition</h3>
                    <div className="text-center">
                        <MathText block>{String.raw`$m \frac{\lambda}{2} = L \quad \implies \quad \nu_m = m \cdot \frac{c}{2L}$`}</MathText>
                    </div>
                    <p className="text-sm text-[var(--color-secondary)]/60 mt-4 text-center">
                        Where <MathText inline>{String.raw`$m$`}</MathText> is the mode number, <MathText inline>{String.raw`$\lambda$`}</MathText> is the wavelength, and <MathText inline>{String.raw`$L$`}</MathText> is the cavity length.
                    </p>
                </div>
            </div>
        </div>
    );
}

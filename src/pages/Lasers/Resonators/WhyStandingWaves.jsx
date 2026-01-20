import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from '../../../components/MathText';
import { Sliders, Zap, Play, Pause, RotateCcw, SkipForward, ChevronDown } from 'lucide-react';

const WhyStandingWaves = () => {
    // -------------------------------------------------------------------------
    // State & Constants
    // -------------------------------------------------------------------------
    const [wavelength, setWavelength] = useState(100); // Conceptual units
    const [roundTrips, setRoundTrips] = useState(0); // N bounces
    const [isPlaying, setIsPlaying] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(0.01); // New Speed State
    const [isResonant, setIsResonant] = useState(false);
    const [showTheory, setShowTheory] = useState(false);

    // Canvas Refs
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef();
    const roundTripsRef = useRef(roundTrips); // Ref for animation loop access
    const speedRef = useRef(animationSpeed);

    // Physics Parameters
    const L = 600; // Cavity Length
    const SPEED = 3.0; // Oscillation speed -- effectively unused since we drive by roundTrips increment
    const MAX_BOUNCES = 50;

    // Sync Ref
    useEffect(() => {
        roundTripsRef.current = roundTrips;
        speedRef.current = animationSpeed;
    }, [roundTrips, animationSpeed]);

    // -------------------------------------------------------------------------
    // Physics Engine & Render Loop
    // -------------------------------------------------------------------------
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 400 * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = 400;
        const centerY = height / 2;

        const render = () => {
            // Update Time / Distance
            if (isPlaying) {
                setRoundTrips(prev => {
                    const next = prev + speedRef.current; // Dynamic Speed
                    if (next >= MAX_BOUNCES) {
                        setIsPlaying(false);
                        return MAX_BOUNCES;
                    }
                    return next;
                });
            }

            const currentN = roundTripsRef.current;
            const k = (2 * Math.PI) / wavelength;
            const reflectivity = 0.92;

            // Total distance wavefront has traveled
            const totalC = currentN * 2 * L;

            ctx.clearRect(0, 0, width, height);

            // Draw Mirrors
            const leftMirrorX = 50;
            const rightMirrorX = leftMirrorX + L * (width / (L + 100)); // Dynamic Width

            // Axis
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff20';
            ctx.setLineDash([5, 5]);
            ctx.moveTo(leftMirrorX, centerY);
            ctx.lineTo(rightMirrorX, centerY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Mirrors Bodies
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(leftMirrorX - 4, centerY - 100, 8, 200);
            ctx.fillRect(rightMirrorX - 4, centerY - 100, 8, 200);

            // -----------------------------------------------------------------
            // Compute Field
            // -----------------------------------------------------------------
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';

            let totalMagSqSum = 0;
            let sampleCount = 0;

            ctx.beginPath();

            const resolution = 2; // px
            for (let px = leftMirrorX; px <= rightMirrorX; px += resolution) {
                const x = (px - leftMirrorX) * L / (rightMirrorX - leftMirrorX);

                let realSum = 0;
                let imagSum = 0;

                const maxN = Math.ceil(currentN) + 2;

                for (let n = 0; n < maxN; n++) {
                    const amplitude = Math.pow(reflectivity, n);

                    // --- Forward Wave n ---
                    // Propagation distance required to reach x: 2nL + x
                    const fwdDistReq = 2 * n * L + x;

                    if (totalC >= fwdDistReq) {
                        const phaseF = k * fwdDistReq - k * totalC;
                        realSum += amplitude * Math.cos(phaseF);
                        imagSum += amplitude * Math.sin(phaseF);
                    }

                    // --- Backward Wave n ---
                    // Propagation distance req: 2nL + L + (L-x) = 2(n+1)L - x
                    const bwdDistReq = 2 * (n + 1) * L - x;

                    if (totalC >= bwdDistReq) {
                        const phaseB = k * bwdDistReq - k * totalC + Math.PI;
                        realSum += amplitude * Math.cos(phaseB);
                        imagSum += amplitude * Math.sin(phaseB);
                    }
                }

                const y = centerY - realSum * 8;
                if (px === leftMirrorX) ctx.moveTo(px, y);
                else ctx.lineTo(px, y);

                const mag = realSum * realSum + imagSum * imagSum;
                totalMagSqSum += mag;
                sampleCount++;
            }

            // Resonance Check
            const avgI = sampleCount > 0 ? totalMagSqSum / sampleCount : 0;
            const isRes = avgI > 80; // Threshold
            setIsResonant(isRes);

            ctx.shadowBlur = isRes ? 15 : 2;
            ctx.stroke();

            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestRef.current);
    }, [wavelength, isPlaying]);

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    const findResonance = () => {
        const mCurrent = (2 * L) / wavelength;
        const mTarget = Math.round(mCurrent);
        const newLambda = (2 * L) / mTarget;
        setWavelength(newLambda);
        setRoundTrips(0);
        setIsPlaying(true);
    };

    const togglePlay = useCallback(() => {
        setIsPlaying(p => !p);
        if (roundTrips >= MAX_BOUNCES) {
            setRoundTrips(0);
            setIsPlaying(true);
        }
    }, [roundTrips]);

    // -------------------------------------------------------------------------
    // Render JSX
    // -------------------------------------------------------------------------
    return (
        <div className="max-w-4xl mx-auto pb-24 text-[var(--color-secondary)]">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] text-xs font-bold uppercase tracking-widest">
                        Interference Simulator
                    </span>
                    {isResonant && (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold animate-pulse">
                            RESONANCE DETECTED
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)]">
                        Why does standing wave exist inside a cavity?
                    </h1>
                    <button
                        onClick={() => setShowTheory(!showTheory)}
                        className="p-2 rounded-full hover:bg-secondary/10 transition-all text-secondary/40 hover:text-secondary mt-2"
                        title="Toggle Theory"
                    >
                        <ChevronDown size={28} className={`transition-transform duration-300 ${showTheory ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light max-w-2xl mb-8">
                    Watch how a single wave reflects and interferes with itself over time.
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Visualizer Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        ref={containerRef}
                        className="bg-[var(--color-primary)] p-0 rounded-3xl border border-secondary/10 shadow-inner relative overflow-hidden h-[400px] flex items-center justify-center"
                    >
                        <canvas ref={canvasRef} className="w-full h-full block" />

                        {/* Labels */}
                        <div className="absolute top-6 left-6 font-mono text-xs text-[var(--color-tertiary)] opacity-60">
                            N = {Math.floor(roundTrips)} Round Trips
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-4 bg-secondary/[0.04] p-4 rounded-2xl border border-secondary/10">
                        <button
                            onClick={togglePlay}
                            className="p-3 rounded-full bg-[var(--color-tertiary)] text-white hover:bg-[var(--color-tertiary)]/80 transition-all shadow-lg shadow-[var(--color-tertiary)]/20"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                        </button>

                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="font-bold opacity-60 uppercase tracking-widest">Time (Reflections)</span>
                                <span className="font-mono opacity-80">{Math.floor(roundTrips)} / {MAX_BOUNCES}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={MAX_BOUNCES}
                                step="0.1"
                                value={roundTrips}
                                onChange={(e) => {
                                    setRoundTrips(Number(e.target.value));
                                    setIsPlaying(false);
                                }}
                                className="w-full h-2 bg-[var(--color-secondary)]/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                            />
                        </div>

                        <button
                            onClick={() => { setRoundTrips(0); setIsPlaying(true); }}
                            className="p-2 text-[var(--color-secondary)]/60 hover:text-[var(--color-tertiary)] transition-colors"
                            title="Restart"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="space-y-8">
                    <div className="bg-secondary/[0.04] p-6 rounded-3xl border border-secondary/10 shadow-sm">
                        <div className="flex items-center gap-2 mb-8 border-b border-secondary/10 pb-4">
                            <Sliders size={18} className="text-[var(--color-tertiary)]" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-secondary)]/60">Parameters</h3>
                        </div>

                        {/* Wavelength Slider */}
                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold opacity-60 uppercase tracking-tighter">Wavelength (λ)</span>
                                <span className="text-[var(--color-tertiary)] font-mono font-bold text-lg">{wavelength.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="60"
                                max="180"
                                step="0.1"
                                value={wavelength}
                                onChange={(e) => setWavelength(Number(e.target.value))}
                                className="w-full h-2 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                            />
                        </div>

                        {/* Speed Slider */}
                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold opacity-60 uppercase tracking-tighter">Animation Speed</span>
                                <span className="text-[var(--color-tertiary)] font-mono font-bold text-lg">{(animationSpeed * 100).toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="0.005"
                                max="0.1"
                                step="0.005"
                                value={animationSpeed}
                                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                className="w-full h-2 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-tertiary)]"
                            />
                        </div>

                        {/* Smart Helper */}
                        <div className="p-4 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest">Auto-Tune</span>
                            </div>
                            <button
                                onClick={findResonance}
                                className="w-full py-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold rounded-lg hover:bg-[var(--color-accent)]/20 transition-all flex items-center justify-center gap-2"
                            >
                                <SkipForward size={14} /> Snap to Nearest Resonance
                            </button>
                            <p className="text-[10px] text-[var(--color-secondary)]/40 mt-3 leading-relaxed text-center">
                                <MathText inline>$m\lambda/2 = L$</MathText>.
                            </p>
                        </div>
                    </div>

                    {/* Explainers */}
                    <div className="p-6 rounded-2xl border border-secondary/5 bg-[var(--color-primary)]">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--color-secondary)] mb-2">
                            <Zap size={14} className="text-[var(--color-tertiary)]" /> Real-time Interference
                        </h4>
                        <p className="text-xs text-[var(--color-secondary)]/60 leading-relaxed font-light">
                            The blue line shows the sum of <strong className="text-[var(--color-secondary)]">{Math.floor(roundTrips)}</strong> round trips. <br /><br />
                            Notice how at resonance, each new reflection adds perfectly to the pile. Off-resonance, new reflections fight the old ones (destructive interference).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyStandingWaves;

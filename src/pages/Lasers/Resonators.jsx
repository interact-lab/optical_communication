import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MathText from '../../components/MathText';

const CavitySimulation = () => {
    const [length, setLength] = useState(10); // arbitrary units 10-20
    const [mode, setMode] = useState(2); // integer mode

    return (
        <div className="bg-secondary/[0.04] p-6 rounded-2xl border border-secondary/10 my-8 shadow-sm">
            <h3 className="text-xl font-serif text-center mb-4 text-[var(--color-secondary)]">Cavity Mode Simulation</h3>

            <div className="flex justify-center items-center gap-8 mb-6">
                <div className="flex flex-col items-center">
                    <label className="text-xs text-[var(--color-secondary)]/50 mb-1">Cavity Length (L)</label>
                    <input
                        type="range" min="10" max="20" step="1"
                        value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                        className="accent-[var(--color-tertiary)]"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-xs text-[var(--color-secondary)]/50 mb-1">Mode Number (m)</label>
                    <input
                        type="range" min="1" max="5" step="1"
                        value={mode} onChange={(e) => setMode(parseInt(e.target.value))}
                        className="accent-[var(--color-tertiary)]"
                    />
                </div>
            </div>

            <div className="relative h-32 w-full max-w-lg mx-auto bg-[var(--color-primary)] rounded-xl border border-secondary/10 shadow-inner overflow-hidden flex items-center justify-between px-0">
                {/* Left Mirror */}
                <div className="w-2 h-full bg-secondary/20 border-r border-secondary/10 z-10 shadow-lg"></div>

                <div className="absolute inset-x-2 inset-y-0 flex items-center">
                    <StandingWaveCanvas m={mode} />
                </div>

                {/* Right Mirror */}
                <div className="w-2 h-full bg-secondary/20 border-l border-secondary/10 z-10 shadow-lg"></div>
            </div>

            <div className="text-center mt-4 text-[var(--color-secondary)]">
                <MathText>{String.raw`$L = ${mode} \cdot \frac{\lambda}{2}$`}</MathText>
            </div>
        </div>
    );
};

const StandingWaveCanvas = ({ m }) => {
    return (
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <OscillatingPath m={m} />
        </svg>
    )
}

const OscillatingPath = ({ m }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setTime(t => t + 0.05);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const width = 100; // SVG coordinate space percentage or units
    const height = 50;
    const amplitude = 30 * Math.cos(time);

    let pathD = `M 0,${height} `;
    for (let x = 0; x <= width; x++) {
        const y = height + amplitude * Math.sin((m * Math.PI * x) / width);
        pathD += `L ${x}% ${y} `;
    }

    return (
        <>
            <path d={pathD} stroke="var(--color-tertiary)" strokeWidth="2.5" fill="none" className="drop-shadow-[0_0_8px_var(--color-tertiary)]" />
        </>
    )
}


const Resonators = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <h1 className="text-5xl font-serif font-bold text-[var(--color-secondary)] mb-4">
                    Optical Resonators
                </h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light">
                    Trapping light to build intensity.
                </p>
            </header>

            <section id="standing-waves" className="mb-12">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Why Standing Waves?</h2>
                <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed mb-4">
                    Laser light is generated inside a cavity, typically formed by two mirrors.
                    Light bounces back and forth, interfering with itself.
                    For the light to survive without cancelling itself out, it must form a
                    <strong className="text-[var(--color-secondary)]"> standing wave</strong>.
                </p>
                <p id="boundary-conditions" className="text-[var(--color-secondary)]/80 text-lg leading-relaxed mb-4">
                    This imposes a strict <strong className="text-[var(--color-secondary)] font-bold">Boundary Condition</strong>: the electric field must be zero at the mirrors (or match the phase upon reflection).
                    Essentially, an integer number of half-wavelengths must fit inside the cavity length <MathText>{String.raw`$L$`}</MathText>.
                </p>

                <CavitySimulation />

                <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed mt-4">
                    Only specific wavelengths <MathText>{String.raw`$\lambda_m$`}</MathText> satisfy this condition:
                </p>
                <MathText block>{String.raw`$m \frac{\lambda}{2} = L \implies \nu_m = m \cdot \frac{c}{2L}$`}</MathText>
            </section>

            <section id="longitudinal-transverse" className="mb-16">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Longitudinal vs Transverse Modes</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-secondary/[0.04] rounded-2xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-2">Longitudinal Modes</h3>
                        <p className="text-[var(--color-secondary)]/70">
                            Different values of <MathText>{String.raw`$m$`}</MathText> correspond to different "longitudinal modes".
                            These are different frequencies (colors) that the laser <i>could</i> emit.
                            In a typical semiconductor laser, these are spaced by:
                        </p>
                        <div className="my-4">
                            <MathText block>{String.raw`$\Delta \nu = \frac{c}{2n_g L}$`}</MathText>
                        </div>
                        <p className="text-[var(--color-secondary)]/50 text-sm mt-2">Where <MathText>{String.raw`$n_g$`}</MathText> is the group index.</p>
                    </div>
                    <div className="p-6 bg-secondary/[0.04] rounded-2xl border border-secondary/10">
                        <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-2">Transverse Modes</h3>
                        <p className="text-[var(--color-secondary)]/70">
                            The spatial profile of the beam (perpendicular to propagation).
                            The fundamental mode is called <strong className="text-[var(--color-secondary)] font-bold">TEM00</strong> (Gaussian).
                            Higher order modes (TEM01, TEM11) look like distinct spots or donuts.
                            Single-mode fibers usually require single transverse mode lasers.
                        </p>
                    </div>
                </div>
            </section>

            <section id="semiconductor-cavities">
                <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-6">Semiconductor Cavities</h2>
                <div className="p-8 bg-secondary/[0.04] rounded-2xl border border-secondary/10">
                    <p className="text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                        In semiconductor lasers (like Fabry-Perot lasers), actual mirrors aren't always needed.
                        The semiconductor material itself has a high refractive index (<MathText>{String.raw`$n \approx 3.5$`}</MathText>), while air is (<MathText>{String.raw`$n \approx 1$`}</MathText>).
                        This index contrast causes Fresnel reflection at the cleaved facets, acting as natural mirrors (albeit with ~30% reflectivity).
                    </p>
                    <div className="mt-8 p-6 bg-[var(--color-primary)] rounded-xl border border-secondary/10 text-center shadow-inner">
                        <MathText>{String.raw`$R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2 \approx \left(\frac{3.5 - 1}{3.5 + 1}\right)^2 \approx 0.31$`}</MathText>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Resonators;

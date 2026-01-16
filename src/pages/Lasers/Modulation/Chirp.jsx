import React from 'react';
import MathText from '../../../components/MathText';

const Chirp = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Chirp: Dynamic Cavity Change</h1>
                <p className="text-xl text-gray-400 font-light">Why intensity changes cause frequency shifts.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    In semiconductor lasers, frequency chirp is a major drawback of direct modulation. It occurs because the refractive index of the laser medium is strongly dependent on the carrier density.
                </p>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-2xl font-serif text-primary mb-4">The Carrier-Plasma Effect</h3>
                    <p>
                        When the current increases to create a '1', the carrier density ($N$) rises. This density change alters the refractive index ($n$). Since $\lambda = 2nL/m$, a change in $n$ is equivalent to a physical change in the cavity length – the resonance frequency shifts.
                    </p>
                </div>

                <div className="p-10 bg-black/50 border border-primary/20 rounded-3xl flex flex-col items-center">
                    <MathText block>{String.raw`$\Delta\nu(t) = \frac{\alpha_H}{4\pi} \left( \frac{1}{P} \frac{dP}{dt} + \kappa P \right)$`}</MathText>
                    <p className="text-sm text-gray-500 mt-6 italic">The Henry α-factor governs the linewidth enhancement and chirp.</p>
                </div>

                <div className="bg-red-950/20 border border-red-700/30 p-6 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-2">Transmission Problem</h4>
                    <p className="text-sm">Chirp spreads the signal's spectrum. Over long fibers, chromatic dispersion causes these different frequencies to arrive at different times, causing inter-symbol interference (ISI).</p>
                </div>
            </section>
        </div>
    );
};

export default Chirp;

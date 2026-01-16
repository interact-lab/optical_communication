import React from 'react';
import MathText from '../../../components/MathText';
import GainCurveVisual from '../../../components/Lasers/GainCurveVisual';

const FrequencyGain = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Frequency Dependency of Gain</h1>
                <p className="text-xl text-gray-400 font-light">The bandwidth of amplification.</p>
            </header>

            <section className="space-y-8 text-gray-300">
                <p className="text-lg leading-relaxed">
                    Gain is not uniform across all frequencies. It depends on the population of electrons in the transitions and the line shape of the active medium.
                </p>

                <GainCurveVisual />

                <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-serif text-primary mb-4">Lorentzian Profile</h2>
                    <MathText block>{String.raw`$g(\nu) = g_0 \frac{1}{1 + [2(\nu-\nu_0)/\Delta\nu]^2}$`}</MathText>
                    <p className="mt-4 text-gray-400">
                        In homogeneously broadened systems, the gain spectrum takes a Lorentzian shape centered at the transition frequency $\nu_0$.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default FrequencyGain;

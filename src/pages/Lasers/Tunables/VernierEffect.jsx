import React from 'react';
import VernierVisual from '../../../components/Lasers/VernierVisual';

const VernierEffect = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">The Vernier Effect</h1>
                <p className="text-xl text-gray-400 font-light">Achieving wide tunability with sliding combs.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    To tune across the entire C-band (40 nm), we use the Vernier effect. We place two mirrors (Sampled Bragg Gratings) in the cavity, each with a slightly different peak spacing.
                </p>

                <VernierVisual />

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-2xl font-serif text-primary mb-4">Levering Small Index Changes</h3>
                    <p className="mb-4">
                        A tiny indexed shift in one mirror causes its peaks to align with a different peak from the second mirror. This "jumps" the lasing frequency by a large amount (e.g., 5-6 nm per jump).
                    </p>
                    <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r">
                        <p className="text-sm italic">
                            "Just like a Vernier caliper allows for precision measurement, a Vernier laser allows for precision frequency selection over a wide range."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VernierEffect;

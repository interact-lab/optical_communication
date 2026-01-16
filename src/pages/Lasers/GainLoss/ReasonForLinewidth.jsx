import React from 'react';

const ReasonForLinewidth = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Reason for Linewidth</h1>
                <p className="text-xl text-gray-400 font-light">Why lasers are not perfectly monochromatic.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    In an ideal world, a laser emits exactly one frequency. In reality, the "spectral line" has a finite width (the Linewidth). This is driven by three main factors:
                </p>

                <div className="space-y-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-2xl font-serif text-primary mb-4">1. Spontaneous Emission Noise</h3>
                        <p>
                            Occasionally, an electron falls spontaneously and emits a photon with a random phase. This photon adds to the coherent lasing field, "kicking" the phase of the wave and causing frequency drift.
                        </p>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-2xl font-serif text-secondary mb-4">2. The α-Factor (Linewidth Enhancement)</h3>
                        <p>
                            In semiconductors, any change in carrier density changes both the gain and the refractive index. This means amplitude fluctuations (noise) are directly converted into frequency fluctuations (phase noise).
                        </p>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-2xl font-serif text-white mb-4">3. External Fluctuations</h3>
                        <p>
                            Temperature changes and current stability also play a role, but these are technical limits rather than fundamental physical limits.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ReasonForLinewidth;

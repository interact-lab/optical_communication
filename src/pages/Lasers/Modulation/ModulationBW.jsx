import React from 'react';
import MathText from '../../../components/MathText';

const ModulationBW = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-4">How Modulators Create Bandwidth</h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light">From single frequency to sidebands.</p>
            </header>

            <section className="space-y-8 text-[var(--color-secondary)]/80">
                <p className="text-lg leading-relaxed">
                    A purely monochromatic laser is a single vertical line in the frequency domain. However, as soon as we modulate it, we create "Information Bandwidth".
                </p>

                <div className="p-8 bg-secondary/[0.04] border border-secondary/10 rounded-2xl leading-relaxed shadow-sm">
                    <h2 className="text-2xl font-serif text-[var(--color-tertiary)] mb-4">The Fourier Perspective</h2>
                    <p className="mb-6">
                        If we modulate a carrier at $\nu_c$ with a frequency $f_m$, Fourier analysis shows that we create <strong className="text-[var(--color-secondary)] font-bold">Sidebands</strong> at $\nu_c + f_m$ and $\nu_c - f_m$.
                    </p>
                    <div className="flex justify-center my-6">
                        <svg width="400" height="150" viewBox="0 0 400 150">
                            <line x1="50" y1="130" x2="350" y2="130" stroke="currentColor" className="text-[var(--color-secondary)]/10" strokeWidth="2" />
                            <line x1="200" y1="130" x2="200" y2="20" stroke="var(--color-tertiary)" strokeWidth="3" />
                            <line x1="100" y1="130" x2="100" y2="80" stroke="var(--color-accent)" strokeWidth="2.5" />
                            <line x1="300" y1="130" x2="300" y2="80" stroke="var(--color-accent)" strokeWidth="2.5" />
                            <text x="200" y="145" fill="var(--color-tertiary)" fontSize="12" textAnchor="middle" fontWeight="bold">Carrier</text>
                            <text x="100" y="145" fill="var(--color-accent)" fontSize="10" textAnchor="middle" fontWeight="bold">-Sideband</text>
                            <text x="300" y="145" fill="var(--color-accent)" fontSize="10" textAnchor="middle" fontWeight="bold">+Sideband</text>
                        </svg>
                    </div>
                </div>

                <div className="bg-[var(--color-primary)] border border-secondary/10 p-8 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-[var(--color-secondary)] mb-4">3dB Bandwidth</h3>
                    <p className="text-sm opacity-80">
                        The 3dB bandwidth is the frequency where the modulation response drops by half. For fiber systems, this defines the maximum "Symbol Rate" (Baud) we can transmit without the pulses merging into each other.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ModulationBW;

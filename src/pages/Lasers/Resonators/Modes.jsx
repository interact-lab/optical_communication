import React from 'react';
import MathText from '../../../components/MathText';

const Modes = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-4">Longitudinal vs Transverse Modes</h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light">The spatial and spectral structure of laser light.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-secondary/[0.04] border border-secondary/10 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-serif text-[var(--color-tertiary)] mb-4">Longitudinal Modes</h2>
                    <p className="text-[var(--color-secondary)]/80 leading-relaxed mb-4">
                        These correspond to different resonance frequencies along the axis of propagation. They are spaced by the Free Spectral Range (FSR).
                    </p>
                    <MathText block>{String.raw`$\Delta \nu = \frac{c}{2n_g L}$`}</MathText>
                    <p className="text-sm text-[var(--color-secondary)]/40 mt-4 italic">Where $n_g$ is the group index.</p>
                </div>

                <div className="p-8 bg-secondary/[0.04] border border-secondary/10 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-serif text-[var(--color-tertiary)] mb-4">Transverse Modes</h2>
                    <p className="text-[var(--color-secondary)]/80 leading-relaxed">
                        These describe the intensity pattern in the cross-section of the beam. The fundamental mode is <strong className="text-[var(--color-secondary)] font-bold">TEM₀₀</strong>, which is a perfect Gaussian.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="w-32 h-32 rounded-full bg-radial-gradient from-[var(--color-tertiary)] to-transparent blur-md opacity-40 shadow-[0_0_30px_var(--color-tertiary)]"></div>
                    </div>
                </div>
            </div>

            <section className="text-[var(--color-secondary)]/80 leading-relaxed max-w-2xl mx-auto text-center p-6 bg-[var(--color-primary)] rounded-xl border border-secondary/10 shadow-inner">
                <p>
                    While longitudinal modes determine the <span className="font-bold text-[var(--color-tertiary)]">spectral purity</span> (linewidth), transverse modes determine the <span className="font-bold text-[var(--color-tertiary)]">beam quality</span> and how well the light can be focused.
                </p>
            </section>
        </div>
    );
};

export default Modes;

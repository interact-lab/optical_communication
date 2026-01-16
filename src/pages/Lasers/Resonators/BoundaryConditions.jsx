import React from 'react';
import MathText from '../../../components/MathText';

const BoundaryConditions = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-4">Boundary Conditions Create Quantization</h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light">How physical limits define allowed frequencies.</p>
            </header>

            <section className="space-y-6 text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                <p>
                    Interaction with the mirrors imposes a strict <strong className="text-[var(--color-secondary)] font-bold">Boundary Condition</strong>: the electric field must be zero at the mirrors (for metallic mirrors) or match the phase exactly upon reflection.
                </p>

                <div className="flex justify-center my-10">
                    <div className="p-8 bg-secondary/[0.04] border border-secondary/10 rounded-2xl shadow-sm">
                        <MathText block>{String.raw`$m \frac{\lambda}{2} = L$`}</MathText>
                    </div>
                </div>

                <p>
                    Essentially, an integer number of half-wavelengths must fit inside the cavity length <MathText>{String.raw`$L$`}</MathText>. This "quantizes" the allowed frequencies into discrete values, known as cavity modes.
                </p>

                <div className="bg-[var(--color-primary)] p-6 rounded-xl border border-secondary/10 shadow-inner">
                    <h3 className="text-[var(--color-tertiary)] font-bold mb-2">Quantized Frequency Formula:</h3>
                    <MathText block>{String.raw`$\nu_m = m \cdot \frac{c}{2L}$`}</MathText>
                </div>
            </section>
        </div>
    );
};

export default BoundaryConditions;

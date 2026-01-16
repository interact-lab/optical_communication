import React from 'react';
import MathText from '../../../components/MathText';

const SemiconductorCavities = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20 text-[var(--color-secondary)]">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-[var(--color-secondary)] mb-4">Semiconductor Laser Cavities</h1>
                <p className="text-xl text-[var(--color-secondary)]/60 font-light">Miniature resonators made of crystal facets.</p>
            </header>

            <section className="space-y-6 text-[var(--color-secondary)]/80 text-lg leading-relaxed">
                <p>
                    In semiconductor lasers, we don't always need external mirrors. The high refractive index of the material itself (<MathText>{String.raw`$n \approx 3.5$`}</MathText>) creates a breakdown at the air interface (<MathText>{String.raw`$n \approx 1$`}</MathText>).
                </p>

                <div className="p-8 bg-[var(--color-primary)] border border-secondary/10 rounded-2xl flex flex-col items-center shadow-inner">
                    <MathText block>{String.raw`$R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2 \approx \left(\frac{3.5 - 1}{3.5 + 1}\right)^2 \approx 31\%$`}</MathText>
                    <p className="text-sm text-[var(--color-secondary)]/40 mt-4 italic font-bold">Fresnel reflection at cleaved facets acts as mirror.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 my-10">
                    <div className="p-6 bg-secondary/[0.04] border border-secondary/10 rounded-xl shadow-sm">
                        <h3 className="text-[var(--color-tertiary)] font-bold mb-3">Cleaved Facets</h3>
                        <p className="text-sm text-[var(--color-secondary)]/70">Mechanical splitting along crystalline planes produces atomic-flat mirrors.</p>
                    </div>
                    <div className="p-6 bg-secondary/[0.04] border border-secondary/10 rounded-xl shadow-sm">
                        <h3 className="text-[var(--color-tertiary)] font-bold mb-3">Mirror Coatings</h3>
                        <p className="text-sm text-[var(--color-secondary)]/70">Dielectric stacks can be applied to increase reflectivity to {'>'}99% (HR) or decrease it (AR).</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SemiconductorCavities;

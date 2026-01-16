import React from 'react';
import MathText from '../../../components/MathText';

const SchawlowTownes = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Schawlow-Townes Limit</h1>
                <p className="text-xl text-gray-400 font-light">The fundamental limit of laser spectral purity.</p>
            </header>

            <section className="space-y-8 text-gray-300">
                <p className="text-lg leading-relaxed">
                    First derived in 1958, this formula defines the narrowest possible linewidth a laser can achieve, based solely on quantum noise (spontaneous emission).
                </p>

                <div className="p-10 bg-black/50 border border-primary/30 rounded-3xl flex flex-col items-center">
                    <MathText block>{String.raw`$\Delta\nu_{ST} = \frac{h\nu (\Delta\nu_{cav})^2}{P}$`}</MathText>
                    <p className="text-sm text-gray-500 mt-6 italic">Where <MathText>{String.raw`$\Delta\nu_{cav}$`}</MathText> is the passive cavity linewidth.</p>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl leading-relaxed">
                    <h2 className="text-2xl font-serif text-primary mb-4">Why is it Power Dependent?</h2>
                    <p>
                        As the output power (<MathText>{String.raw`$P_{out}$`}</MathText>) increases, the number of coherent photons in the cavity grows much faster than the rate of random spontaneous emission. The "relative weight" of each random phase kick becomes smaller, resulting in a narrower linewidth.
                    </p>
                    <div className="mt-4 p-4 bg-primary/10 rounded border border-primary/20 text-sm">
                        Total Linewidth = <span className="text-white font-bold">Quantum Noise (Schawlow-Townes)</span> + <span className="text-white font-bold">Enhancement (<MathText>{String.raw`$\alpha$`}</MathText>-factor)</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SchawlowTownes;

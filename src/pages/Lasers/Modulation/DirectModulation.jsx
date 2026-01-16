import React from 'react';
import MathText from '../../../components/MathText';

const DirectModulation = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Direct Modulation</h1>
                <p className="text-xl text-gray-400 font-light">Encoding data by toggling the laser current.</p>
            </header>

            <section className="space-y-8 text-gray-300">
                <p className="text-lg leading-relaxed">
                    Direct modulation is the simplest and cheapest method. We simply vary the injection current $I(t)$ to represent '0's and '1's. The photon density $S(t)$ follows the carrier density $N(t)$.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">The Benefit</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                            <li>Very low cost (no extra hardware)</li>
                            <li>Simple drive electronics</li>
                            <li>Compact footprint</li>
                        </ul>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold text-red-400 mb-4">The Limit</h3>
                        <p className="text-sm text-gray-400">
                            Speed is limited by <strong className="text-white">Relaxation Oscillations</strong> (typically 10-20 GHz) and Frequency Chirp.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-black/40 border border-white/10 rounded-2xl">
                    <h3 className="text-center text-xs text-gray-500 uppercase tracking-widest mb-6">Rate Equations</h3>
                    <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                        <MathText block>{String.raw`$\frac{dN}{dt} = \frac{I}{qV} - \frac{N}{\tau_n} - G S$`}</MathText>
                        <MathText block>{String.raw`$\frac{dS}{dt} = G S - \frac{S}{\tau_p} + \beta \frac{N}{\tau_n}$`}</MathText>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DirectModulation;

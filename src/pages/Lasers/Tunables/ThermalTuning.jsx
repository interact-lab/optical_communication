import React from 'react';
import MathText from '../../../components/MathText';

const ThermalTuning = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Temperature as a Knob</h1>
                <p className="text-xl text-gray-400 font-light">Fine-tuning frequency via thermal physics.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    The most basic way to tune a laser's frequency is by changing its temperature. Most lasers are mounted on a Thermo-Electric Cooler (TEC) for this very reason.
                </p>

                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-primary">Thermal Index Change</h3>
                        <p>
                            Heating the semiconductor increases the refractive index ($n$). Since the resonance frequency is $\nu = m c / 2nL$, an increase in $n$ decreases the frequency (red shift).
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                            <li>Typical rate: 0.1 nm / °C</li>
                            <li>Slow response: Millisecond scale</li>
                            <li>Range: ~2-4 nm total</li>
                        </ul>
                    </div>
                    <div className="p-8 bg-black/40 border border-white/10 rounded-2xl">
                        <MathText block>{String.raw`$\frac{d\lambda}{dT} = \lambda \left( \frac{1}{n_e} \frac{dn_e}{dT} + \alpha_{therm} \right)$`}</MathText>
                    </div>
                </div>

                <div className="p-6 bg-orange-950/10 border border-orange-700/20 rounded-xl">
                    <h4 className="text-orange-400 font-bold mb-2">The Thermal Problem</h4>
                    <p className="text-sm">Because current injection also creates heat, it's impossible to change the laser's power without slightly shifting its frequency thermally. Designers must carefully compensate for this.</p>
                </div>
            </section>
        </div>
    );
};

export default ThermalTuning;

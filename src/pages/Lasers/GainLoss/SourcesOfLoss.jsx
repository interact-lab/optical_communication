import React from 'react';
import MathText from '../../../components/MathText';

const SourcesOfLoss = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Sources of Losses</h1>
                <p className="text-xl text-gray-400 font-light">Why light decays in the cavity.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                    { title: "Mirror Loss", desc: "Energy escaping to be used as output. Controlled by reflectivity R.", icon: "M" },
                    { title: "Internal Loss", desc: "Absorption by impurities or the carrier plasma (Free Carrier Absorption).", icon: "I" },
                    { title: "Scattering", desc: "Surface roughness and waveguide irregularities scatter photons out.", icon: "S" }
                ].map(loss => (
                    <div key={loss.title} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mb-4">{loss.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-2">{loss.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{loss.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-10 bg-black/40 border border-primary/20 rounded-3xl text-center">
                <p className="text-gray-400 mb-6">The Threshold Condition: Gain must exactly equal Total Loss.</p>
                <MathText block>{String.raw`$g_{th} = \alpha_{int} + \frac{1}{2L} \ln\left(\frac{1}{R_1 R_2}\right)$`}</MathText>
            </div>
        </div>
    );
};

export default SourcesOfLoss;

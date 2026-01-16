import React from 'react';

const ExternalModulation = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">Why External Modulators Exist?</h1>
                <p className="text-xl text-gray-400 font-light">Breaking the speed and chirp limits of direct modulation.</p>
            </header>

            <section className="space-y-8 text-gray-300">
                <p className="text-lg leading-relaxed">
                    For high-speed, long-distance communication (coherent fiber optics), direct modulation simply isn't enough. External modulators take a steady Beam of light (CW) and modulate it externally.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4">1. Zero Chirp</h3>
                        <p className="text-sm text-gray-400">By keeping the laser at a constant current, we eliminate all carrier-induced frequency shifts. This allows signals to travel thousands of kilometers.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4">2. Extreme Speed</h3>
                        <p className="text-sm text-gray-400">Modulators based on the Electro-Optic effect (Lithium Niobate) can reach bandwidths of 100 GHz, far beyond the 20 GHz limit of laser physics.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4">3. Phase Modulation</h3>
                        <p className="text-sm text-gray-400">External modulators allow us to shift the PHASE of the wave, enabling complex formats like QPSK or 16-QAM which pack more bits per second.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4">4. High Extinction Ratio</h3>
                        <p className="text-sm text-gray-400">They can turn light completely 'off' (extinguish it) much more effectively than directly turning a laser below threshold.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExternalModulation;

import React from 'react';

const CMA_DMA = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">CMA and DMA Control</h1>
                <p className="text-xl text-gray-400 font-light">Navigating the tuning map.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    Controlling a multi-section Vernier laser requires sophisticated current management. We categorize currents into two primary modes of operation.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/50 transition-colors">
                        <h3 className="text-2xl font-serif text-accent mb-4">CMA</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Continuous Modal Alignment</p>
                        <p className="text-sm">
                            Mirror currents are shifted in the <strong className="text-white">same</strong> direction. The overlap point moves smoothly without jumping to a new peak. This is used for fine-tuning the exact ITU channel.
                        </p>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/50 transition-colors">
                        <h3 className="text-2xl font-serif text-accent mb-4">DMA</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Differential Modal Alignment</p>
                        <p className="text-sm">
                            Mirror currents are shifted in <strong className="text-white">opposite</strong> directions. This forces a "Vernier Jump" to a completely different reflection peak. This is used for coarse-tuning across the band.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-black/40 border border-white/5 rounded-2xl text-center text-sm font-serif italic text-gray-400">
                    "Tuning a laser is a balancing act: CMA for the smooth glide, DMA for the giant leap."
                </div>
            </section>
        </div>
    );
};

export default CMA_DMA;

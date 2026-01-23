import React from 'react';
import MathText from '../../../components/MathText';
import PageNavigation from '../../../components/PageNavigation';

const Card = ({ title, children, className = "" }) => (
    <div className={`p-8 bg-secondary/[0.03] backdrop-blur-3xl border border-secondary/10 rounded-[2.5rem] shadow-xl ${className}`}>
        {title && (
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-secondary/30 mb-8 flex items-center gap-2">
                {title}
            </h3>
        )}
        {children}
    </div>
);

const SemiconductorCavities = () => {
    return (
        <div className="max-w-7xl mx-auto pb-40 text-secondary px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-secondary/10 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        Semiconductor <br /><span className="text-secondary/20">Laser Cavities</span>
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <section className="space-y-8 text-secondary/80 text-lg leading-relaxed font-light">
                    <p>
                        In semiconductor lasers, we don't always need external mirrors. The high refractive index of the material itself (<MathText>{String.raw`$n \approx 3.5$`}</MathText>) creates a massive impedance mismatch at the air interface (<MathText>{String.raw`$n \approx 1$`}</MathText>).
                    </p>
                    <p>
                        This "jump" in refractive index causes light to reflect back into the crystal, forming a resonator out of the very material that provides the gain.
                    </p>

                    <Card title="Reflection Physics">
                        <div className="flex flex-col items-center">
                            <MathText block>{String.raw`$R = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2 \approx \left(\frac{3.5 - 1}{3.5 + 1}\right)^2 \approx 31\%$`}</MathText>
                            <p className="text-xs text-secondary/40 mt-6 italic text-center">
                                Fresnel reflection at cleaved facets acts as a partial mirror, providing the feedback necessary for oscillation.
                            </p>
                        </div>
                    </Card>
                </section>

                <div className="space-y-8">
                    <Card title="Structural Engineering">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-6 bg-secondary/5 border border-secondary/10 rounded-2xl transition-all hover:bg-secondary/10">
                                <h3 className="text-tertiary font-bold mb-3 tracking-tight">Cleaved Facets</h3>
                                <p className="text-sm text-secondary/60 leading-relaxed">
                                    Mechanical splitting along crystalline planes produces atomic-flat surfaces. This is the simplest and most common method for Fabry-Perot edge-emitting lasers.
                                </p>
                            </div>
                            <div className="p-6 bg-secondary/5 border border-secondary/10 rounded-2xl transition-all hover:bg-secondary/10">
                                <h3 className="text-tertiary font-bold mb-3 tracking-tight">Mirror Coatings</h3>
                                <p className="text-sm text-secondary/60 leading-relaxed">
                                    Dielectric stacks (evaporated layers of SiO₂/TiO₂) can be applied to the facets to increase reflectivity {'>'}99% (HR) or create anti-reflection (AR) windows.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Visual Insight">
                        <div className="aspect-video bg-secondary rounded-[1.5rem] border border-secondary/10 relative overflow-hidden flex items-center justify-center p-8">
                            <div className="w-full h-1 bg-red-500/10 blur-xl absolute" />
                            <div className="relative z-10 w-full h-4 bg-gradient-to-r from-transparent via-red-500/40 to-transparent blur-sm animate-pulse" />
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary border-r border-secondary/20 shadow-[8px_0_20px_rgba(0,0,0,0.5)]" />
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-secondary border-l border-secondary/20 shadow-[-8px_0_20px_rgba(0,0,0,0.5)]" />
                            <span className="absolute bottom-4 text-[8px] uppercase tracking-[0.5em] text-secondary/30 font-black">Fabry-Perot Edge Emitter</span>
                        </div>
                    </Card>
                </div>
            </div>

            <PageNavigation
                prevTo="/lasers/resonators/modes"
                prevLabel="Cavity Modes"
                nextTo="/lasers/modulation/direct"
                nextLabel="Direct Modulation"
            />
        </div>
    );
};

export default SemiconductorCavities;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="space-y-8 text-[var(--color-secondary)]">
            {/* Hero Section - Full Height */}
            <header className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                    Optical Communication Suite
                </h1>
                <p className="text-xl md:text-2xl opacity-60 max-w-2xl font-light leading-relaxed">
                    An interactive journey through the physics of light, lasers, and fiber optics.
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-24 text-[var(--color-tertiary)]"
                >
                    <svg className="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </header>

            {/* Modules Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-20 border-t border-[var(--color-secondary)]/10">

                {/* LASERS MODULE CARD */}
                <div className="p-8 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all group hover:-translate-y-1 duration-300">
                    <Link to="/lasers/intro">
                        <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-4 group-hover:text-[var(--color-secondary)] transition-colors">Lasers</h2>
                    </Link>
                    <p className="opacity-70 leading-relaxed mb-6 italic">
                        Explore the quantum mechanics of stimulated emission, optical resonators, and modulation.
                    </p>
                    <div className="grid grid-cols-2 gap-2 border-t border-secondary/10 pt-4">
                        <Link to="/lasers/intro" className="text-xs opacity-50 hover:text-[var(--color-tertiary)] transition-colors font-medium hover:translate-x-1 duration-200">• Intro</Link>
                        <Link to="/lasers/resonators" className="text-xs opacity-50 hover:text-[var(--color-tertiary)] transition-colors font-medium hover:translate-x-1 duration-200">• Resonators</Link>
                        <Link to="/lasers/gain-loss" className="text-xs opacity-50 hover:text-[var(--color-tertiary)] transition-colors font-medium hover:translate-x-1 duration-200">• Gain & Loss</Link>
                        <Link to="/lasers/modulation" className="text-xs opacity-50 hover:text-[var(--color-tertiary)] transition-colors font-medium hover:translate-x-1 duration-200">• Modulation</Link>
                        <Link to="/lasers/tunable" className="text-xs opacity-50 hover:text-[var(--color-tertiary)] transition-colors font-medium hover:translate-x-1 duration-200">• Tunables</Link>
                    </div>
                </div>

                {/* FIBER OPTICS CARD */}
                <div className="p-8 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all group hover:-translate-y-1 duration-300">
                    <Link to="/fiber-optics">
                        <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-4 group-hover:text-[var(--color-secondary)] transition-colors">Fiber Optics</h2>
                    </Link>
                    <p className="opacity-70 leading-relaxed font-light">
                        Understand total internal reflection, modes, and dispersion in optical fibers.
                    </p>
                </div>

                {/* OPTICAL NETWORKS CARD */}
                <div className="p-8 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all group hover:-translate-y-1 duration-300">
                    <Link to="/networks">
                        <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-4 group-hover:text-[var(--color-secondary)] transition-colors">Optical Networks</h2>
                    </Link>
                    <p className="opacity-70 leading-relaxed font-light">
                        Route and manage data traffic through complex optical systems.
                    </p>
                </div>

                {/* NON-LINEAR OPTICS CARD */}
                <div className="p-8 bg-secondary/5 rounded-2xl border border-secondary/10 hover:border-[var(--color-tertiary)] transition-all group hover:-translate-y-1 duration-300">
                    <Link to="/nonlinear">
                        <h2 className="text-3xl font-serif text-[var(--color-tertiary)] mb-4 group-hover:text-[var(--color-secondary)] transition-colors">Non-linear Optics</h2>
                    </Link>
                    <p className="opacity-70 leading-relaxed font-light">
                        From Kerr effect to solitons: when light interacts strongly with matter.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;

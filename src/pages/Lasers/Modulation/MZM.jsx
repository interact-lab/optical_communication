import React from 'react';
import MathText from '../../../components/MathText';
import MZMDiagram from '../../../components/Lasers/MZMDiagram';

const MZM = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-white mb-4">How Modulation is Created: MZM</h1>
                <p className="text-xl text-gray-400 font-light">The Mach-Zehnder Interferometer in action.</p>
            </header>

            <section className="space-y-8 text-gray-300 leading-relaxed">
                <p className="text-lg">
                    The Mach-Zehnder Modulator (MZM) is the workhorse of optical networking. It works by splitting an optical beam into two arms, shifting the phase of one, and recombining them to create <strong className="text-white">Interference</strong>.
                </p>

                <MZMDiagram />

                <div className="p-10 bg-black/40 border border-accent/20 rounded-3xl">
                    <h4 className="text-accent font-bold mb-4">The Mathematical Transfer Function</h4>
                    <p className="mb-6">The output intensity varies sinusoidally with the applied voltage $V$:</p>
                    <MathText block>{String.raw`$P_{out} = P_{in} \cos^2\left(\frac{\pi V}{2 V_\pi}\right)$`}</MathText>
                    <p className="text-sm text-gray-500 mt-4 italic">
                        $V_\pi$ is the critical voltage required to flip the signal from fully 'On' to fully 'Off'.
                    </p>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Phase & Amplitude</h3>
                    <p className="text-sm">
                        By driving both arms of the MZM independently (Dual-Drive MZM), we can control both the final amplitude and the final phase of the carrier. This is essential for modern high-order modulation formats.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default MZM;

import React, { useState, useEffect } from 'react';
import MathText from '../MathText';

const OscillatingPath = ({ m }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setTime(t => t + 0.05);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const width = 100;
    const height = 50;
    const amplitude = 30 * Math.cos(time);

    let pathD = `M 0,${height} `;
    for (let x = 0; x <= width; x++) {
        const y = height + amplitude * Math.sin((m * Math.PI * x) / width);
        pathD += `L ${x} ${y} `;
    }

    return (
        <path d={pathD} stroke="#74C0E3" strokeWidth="3" fill="none" className="drop-shadow-[0_0_5px_rgba(116,192,227,0.5)]" />
    );
};

const StandingWaveCanvas = ({ m }) => {
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <OscillatingPath m={m} />
        </svg>
    );
};

const CavitySimulation = () => {
    const [length, setLength] = useState(10);
    const [mode, setMode] = useState(2);

    return (
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 my-8">
            <h3 className="text-xl font-serif text-center mb-4 text-gray-300">Cavity Mode Simulation</h3>

            <div className="flex justify-center items-center gap-8 mb-6">
                <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Cavity Length (L)</label>
                    <input
                        type="range" min="10" max="20" step="1"
                        value={length} onChange={(e) => setLength(parseInt(e.target.value))}
                        className="accent-primary"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Mode Number (m)</label>
                    <input
                        type="range" min="1" max="5" step="1"
                        value={mode} onChange={(e) => setMode(parseInt(e.target.value))}
                        className="accent-primary"
                    />
                </div>
            </div>

            <div className="relative h-32 w-full max-w-lg mx-auto bg-gray-900 overflow-hidden flex items-center justify-between px-0">
                <div className="w-2 h-full bg-gradient-to-r from-gray-400 to-gray-200 border-r border-gray-500 z-10"></div>
                <div className="absolute inset-x-2 inset-y-0 flex items-center">
                    <StandingWaveCanvas m={mode} />
                </div>
                <div className="w-2 h-full bg-gradient-to-l from-gray-400 to-gray-200 border-l border-gray-500 z-10"></div>
            </div>

            <div className="text-center mt-4">
                <MathText>{String.raw`$L = ${mode} \cdot \frac{\lambda}{2}$`}</MathText>
            </div>
        </div>
    );
};

export default CavitySimulation;

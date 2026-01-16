import React, { useState } from 'react';

const GainCurveVisual = ({ initialPump = 50 }) => {
    const [pump, setPump] = useState(initialPump);

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl my-10">
            <h3 className="text-xl font-serif text-center mb-10 text-white">Gain Spectrum & Threshold</h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                    <svg viewBox="0 0 600 300" className="w-full h-auto">
                        <line x1="50" y1="250" x2="550" y2="250" stroke="#444" strokeWidth="2" />
                        <line x1="50" y1="250" x2="50" y2="50" stroke="#444" strokeWidth="2" />

                        <line x1="50" y1="150" x2="550" y2="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
                        <text x="560" y="155" fill="#ef4444" fontSize="12">Losses (α)</text>

                        <path
                            d={`M 50 250 ${Array.from({ length: 100 }).map((_, i) => {
                                const x = 50 + (i * 5);
                                const normalizedX = (i - 50) / 20;
                                const height = (pump / 10) * Math.exp(-(normalizedX * normalizedX));
                                return `L ${x} ${250 - height * 20}`;
                            }).join(' ')}`}
                            fill="none" stroke="#74C0E3" strokeWidth="3"
                            className="drop-shadow-[0_0_10px_rgba(116,192,227,0.5)]"
                        />

                        <text x="550" y="270" fill="#666" fontSize="12" textAnchor="end">Frequency (ν)</text>
                        <text x="30" y="50" fill="#666" fontSize="12" transform="rotate(-90 30,50)">Gain / Loss</text>
                    </svg>
                </div>

                <div className="w-full md:w-48 space-y-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Pump Current</label>
                        <input
                            type="range" min="0" max="100" value={pump}
                            onChange={(e) => setPump(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <div className="mt-4 text-center">
                            <span className={`text-sm font-bold ${pump > 50 ? 'text-green-400' : 'text-red-400'}`}>
                                {pump > 50 ? 'Lasing State' : 'Below Threshold'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GainCurveVisual;

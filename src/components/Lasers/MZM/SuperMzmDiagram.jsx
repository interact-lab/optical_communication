import React from 'react';

const SuperMzmDiagram = ({ phaseShiftEnabled }) => {
    const blue = '#3b82f6';
    const rose = '#f43f5e';
    const emerald = '#10b981';
    const textColor = 'rgba(255, 255, 255, 0.4)';

    return (
        <div className="relative w-full h-[300px] bg-[#050505] rounded-[2.5rem] border border-white/10 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
            <svg width="100%" height="100%" viewBox="0 0 400 250" className="overflow-visible">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
                    </marker>
                    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={blue} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={blue} stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={rose} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={rose} stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* --- Main Input Splitter --- */}
                <path d="M 0 125 L 40 125" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                <path d="M 40 125 L 70 60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
                <path d="M 40 125 L 70 190" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />

                {/* --- Top MZM (I-MZM) --- */}
                <path d="M 70 60 L 90 60" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 90 60 L 110 40" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 90 60 L 110 80" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />

                {/* Arms I */}
                <path d="M 110 40 L 210 40" stroke={blue} strokeWidth="3" fill="none" className="drop-shadow-lg" />
                <path d="M 110 80 L 210 80" stroke={blue} strokeWidth="3" fill="none" className="drop-shadow-lg" />

                {/* RF Electrodes I */}
                <rect x="130" y="30" width="60" height="20" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.3" rx="4" />
                <text x="160" y="25" textAnchor="middle" fill={blue} fontSize="9" fontWeight="bold">Drive I(t)</text>

                {/* Recombine I */}
                <path d="M 210 40 L 230 60" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 210 80 L 230 60" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 230 60 L 280 60" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />


                {/* --- Bottom MZM (Q-MZM) --- */}
                <path d="M 70 190 L 90 190" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 90 190 L 110 170" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 90 190 L 110 210" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />

                {/* Arms Q */}
                <path d="M 110 170 L 210 170" stroke={rose} strokeWidth="3" fill="none" className="drop-shadow-lg" />
                <path d="M 110 210 L 210 210" stroke={rose} strokeWidth="3" fill="none" className="drop-shadow-lg" />

                {/* RF Electrodes Q */}
                <rect x="130" y="200" width="60" height="20" fill="white" fillOpacity="0.05" stroke="white" strokeOpacity="0.3" rx="4" />
                <text x="160" y="235" textAnchor="middle" fill={rose} fontSize="9" fontWeight="bold">Drive Q(t)</text>

                {/* Recombine Q */}
                <path d="M 210 170 L 230 190" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 210 210 L 230 190" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 230 190 L 250 190" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />

                {/* --- Phase Shifter (90 deg) --- */}
                <circle
                    cx="268" cy="190" r="14"
                    fill={phaseShiftEnabled ? emerald : 'transparent'}
                    fillOpacity="0.1"
                    stroke={phaseShiftEnabled ? emerald : 'rgba(255,255,255,0.1)'}
                    strokeWidth="2"
                />
                <text x="268" y="194" textAnchor="middle" fill={phaseShiftEnabled ? emerald : textColor} fontSize="9" fontWeight="black">π/2</text>
                <path d="M 282 190 L 300 190" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />


                {/* --- Final Combiner --- */}
                <path d="M 280 60 L 330 125" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 300 190 L 330 125" stroke="white" strokeOpacity="0.2" strokeWidth="2" fill="none" />
                <path d="M 330 125 L 390 125" stroke="white" strokeOpacity="0.5" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

                {/* Labels */}
                <text x="375" y="115" textAnchor="end" fill="white" fontSize="10" fontWeight="black" className="uppercase tracking-widest">Output Field</text>
                <text x="0" y="145" textAnchor="start" fill="white" fontSize="10" fontWeight="black" className="uppercase tracking-widest" opacity="0.3">Laser Input</text>

                <text x="160" y="70" textAnchor="middle" fill="white" fontSize="8" fontWeight="black" opacity="0.1" className="uppercase">I-Interferometer</text>
                <text x="160" y="185" textAnchor="middle" fill="white" fontSize="8" fontWeight="black" opacity="0.1" className="uppercase">Q-Interferometer</text>
            </svg>
        </div>
    );
};

export default SuperMzmDiagram;

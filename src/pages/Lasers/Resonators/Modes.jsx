import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Eye, EyeOff, Play, Layers, ChevronDown } from 'lucide-react';
import MathText from '../../../components/MathText';

// --- 3D Scene Components ---

const fiberLength = 14;

const FiberStructure = ({ showWireframe }) => {
    return (
        <group>
            {/* Core Body */}
            <mesh rotation={[0, 0, -Math.PI / 2]}>
                <cylinderGeometry args={[1.5, 1.5, fiberLength, 64]} />
                <meshStandardMaterial
                    color="#4aa3df"
                    transparent
                    opacity={0.12}
                    side={THREE.DoubleSide}
                    metalness={0.7}
                    roughness={0.1}
                />
            </mesh>

            {showWireframe && (
                <group rotation={[0, 0, -Math.PI / 2]}>
                    {/* Core Outline (Wireframe) */}
                    <mesh>
                        <cylinderGeometry args={[1.505, 1.505, fiberLength, 32]} />
                        <meshBasicMaterial
                            color="#88ccff"
                            wireframe
                            transparent
                            opacity={0.3}
                        />
                    </mesh>

                    {/* Perspective Rings at Ends and Center */}
                    {[-7, 0, 7].map((yOffset) => (
                        <Line
                            key={yOffset}
                            points={new Array(65).fill(0).map((_, i) => {
                                const a = (i / 64) * Math.PI * 2;
                                // In this rotated frame, Y is along the fiber axis
                                return [Math.cos(a) * 1.5, yOffset, Math.sin(a) * 1.5];
                            })}
                            color="#88ccff"
                            lineWidth={1.5}
                            transparent
                            opacity={0.5}
                        />
                    ))}
                </group>
            )}
        </group>
    );
};

const PropagationArrow = () => {
    return (
        <group position={[0, -3.5, 0]}> {/* Position below the fiber */}
            {/* Main Arrow Line along X axis (horizontal left-to-right) */}
            <Line points={[[-5, 0, 0], [5, 0, 0]]} color="#4ade80" lineWidth={6} />
            {/* Arrow Head at +X */}
            <mesh position={[5.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <coneGeometry args={[0.3, 0.7, 16]} />
                <meshBasicMaterial color="#4ade80" />
            </mesh>
            {/* Label */}
            <Text
                position={[0, -0.6, 0]}
                fontSize={0.4}
                color="#4ade80"
                font="https://fonts.gstatic.com/s/robotomono/v13/L0tkPmxpVq3er2L980OR96oA_Z7S.woff"
            >
                PROPAGATION (+Z Axis)
            </Text>
        </group>
    );
};

// Component to render mathematically accurate field lines using Tubes for 3D volume
const FieldLines = ({ mode, showE, showH }) => {
    const lines = useMemo(() => {
        const eCurves = [];
        const hCurves = [];

        // In this scene, fiber axis is X-axis (from -7 to 7)
        // Cross-section is Y-Z plane
        const createAzimuthal = (r, xPos) => {
            const pts = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                pts.push(new THREE.Vector3(xPos, Math.cos(a) * r, Math.sin(a) * r));
            }
            return new THREE.CatmullRomCurve3(pts);
        };

        const createMeridian = (rMax, xCenter, xWidth, phi) => {
            const pts = [];
            const cosP = Math.cos(phi);
            const sinP = Math.sin(phi);
            for (let i = 0; i <= 64; i++) {
                const t = (i / 64) * Math.PI * 2;
                const r = rMax * Math.abs(Math.sin(t));
                const x = xCenter + xWidth * Math.cos(t);
                pts.push(new THREE.Vector3(x, r * cosP, r * sinP));
            }
            return new THREE.CatmullRomCurve3(pts);
        };

        if (mode === 'TE') {
            // E is Azimuthal
            [0.7, 1.1].forEach(r => {
                [-4, -2, 0, 2, 4].forEach(x => {
                    eCurves.push({ curve: createAzimuthal(r, x), color: '#22d3ee' });
                });
            });
            // H is Meridian
            for (let p = 0; p < Math.PI * 2; p += Math.PI / 4) {
                [-3, 3].forEach(x => {
                    hCurves.push({ curve: createMeridian(1.3, x, 1.8, p), color: '#fb923c' });
                });
            }
        } else {
            // H is Azimuthal
            [0.7, 1.1].forEach(r => {
                [-4, -2, 0, 2, 4].forEach(x => {
                    hCurves.push({ curve: createAzimuthal(r, x), color: '#fb923c' });
                });
            });
            // E is Meridian
            for (let p = 0; p < Math.PI * 2; p += Math.PI / 4) {
                [-3, 3].forEach(x => {
                    eCurves.push({ curve: createMeridian(1.3, x, 1.8, p), color: '#22d3ee' });
                });
            }
        }

        return { eCurves, hCurves };
    }, [mode]);

    return (
        <group>
            {showE && lines.eCurves.map((l, i) => (
                <mesh key={`e-${i}`}>
                    <tubeGeometry args={[l.curve, 64, 0.02, 8, false]} />
                    <meshStandardMaterial
                        color={l.color}
                        emissive={l.color}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
            {showH && lines.hCurves.map((l, i) => (
                <mesh key={`h-${i}`}>
                    <tubeGeometry args={[l.curve, 64, 0.02, 8, false]} />
                    <meshStandardMaterial
                        color={l.color}
                        emissive={l.color}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
};

// --- Main Interactive Viewer Wrapper ---

const TETMViewer = () => {
    const [mode, setMode] = useState('TE');
    const [showE, setShowE] = useState(true);
    const [showH, setShowH] = useState(true);
    const [showWireframe, setShowWireframe] = useState(false); // Default: invisible

    return (
        <div className="flex flex-col gap-10">
            {/* 3D Visual Area - Zoomed out view by default */}
            <div className="relative w-full h-[650px] bg-[#020202] rounded-[3rem] overflow-hidden border border-white/10 shadow-4xl">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 4, 18], fov: 35 }}>
                    <color attach="background" args={['#020202']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, -5, -10]} intensity={0.5} color="#88ccff" />

                    <group>
                        <FiberStructure showWireframe={showWireframe} />
                        <FieldLines mode={mode} showE={showE} showH={showH} />
                        <PropagationArrow />
                    </group>

                    <OrbitControls
                        makeDefault
                        enableDamping
                        dampingFactor={0.07}
                        minDistance={8}
                        maxDistance={35}
                    />
                </Canvas>

                {/* Mode Caption inside viewer */}
                <div className="absolute top-10 left-10 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/5">
                        <h4 className={`text-lg font-serif font-black tracking-tight ${mode === 'TE' ? 'text-cyan-400' : 'text-orange-400'}`}>
                            {mode === 'TE' ? 'TE Transverse Electric' : 'TM Transverse Magnetic'}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Controls Bar Below Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mode Selection */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mb-6 flex items-center gap-2">
                        <Play size={10} className="text-blue-500" /> Interaction Mode
                    </h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('TE')}
                            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${mode === 'TE' ? 'bg-cyan-600/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <span className={`text-xs font-black tracking-[0.1em] uppercase ${mode === 'TE' ? 'text-white' : 'text-white/30'}`}>TE 01</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mode === 'TE' ? 'border-cyan-400' : 'border-white/10'}`}>
                                {mode === 'TE' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('TM')}
                            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-500 ${mode === 'TM' ? 'bg-orange-600/10 border-orange-500/50 shadow-[0_0_15px_rgba(251,146,60,0.1)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <span className={`text-xs font-black tracking-[0.1em] uppercase ${mode === 'TM' ? 'text-white' : 'text-white/30'}`}>TM 01</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mode === 'TM' ? 'border-orange-400' : 'border-white/10'}`}>
                                {mode === 'TM' && <div className="w-2 h-2 rounded-full bg-orange-400" />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Structure Controls */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mb-6">Structural View</h3>
                    <button
                        onClick={() => setShowWireframe(!showWireframe)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${showWireframe ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Layers size={16} className={showWireframe ? 'text-blue-400' : 'text-white/20'} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${showWireframe ? 'text-white' : 'text-white/20'}`}>Core Wireframe</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-all relative ${showWireframe ? 'bg-blue-500/40' : 'bg-white/5'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${showWireframe ? 'right-1 bg-blue-400' : 'left-1 bg-white/20'}`} />
                        </div>
                    </button>
                </div>

                {/* Field Visibility */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mb-6">Field Isolation</h3>
                    <div className="flex gap-8">
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowE(!showE)}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${showE ? 'text-cyan-400' : 'text-white/20'}`}>Electric</span>
                                <div className={`w-10 h-5 rounded-full relative transition-all ${showE ? 'bg-cyan-500/30' : 'bg-white/5'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${showE ? 'right-1 bg-cyan-400' : 'left-1 bg-white/20'}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowH(!showH)}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${showH ? 'text-orange-400' : 'text-white/20'}`}>Magnetic</span>
                                <div className={`w-10 h-5 rounded-full relative transition-all ${showH ? 'bg-orange-500/30' : 'bg-white/5'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${showH ? 'right-1 bg-orange-400' : 'left-1 bg-white/20'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Page Root ---

const Modes = () => {
    const [showTheory, setShowTheory] = useState(false);

    return (
        <div className="max-w-7xl mx-auto pb-40 text-white px-4">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="flex items-center gap-6 mb-10">
                    <h1 className="text-5xl lg:text-7xl font-serif font-black tracking-[-0.03em] leading-[0.9]">
                        TE and TM modes<br /><span className="text-white/20">in a Cavity</span>
                    </h1>
                    <button
                        onClick={() => setShowTheory(!showTheory)}
                        className="p-4 rounded-full hover:bg-white/5 transition-all text-white/20 hover:text-white mt-4 border border-white/5"
                        title="Toggle Theory"
                    >
                        <ChevronDown size={40} className={`transition-transform duration-500 ${showTheory ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <p className="text-2xl text-white/30 font-light max-w-4xl leading-tight mb-12">
                    Use the controls below to isolate fields and inspect the internal structure.
                </p>

                <AnimatePresence mode="wait">
                    {showTheory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-16"
                        >
                            <div className="p-12 bg-white/[0.03] rounded-[3rem] border border-white/10 space-y-12 text-white/60 leading-relaxed font-light">
                                {/* Section 1 */}
                                <section className="space-y-6">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-blue-500/50">01.</span> What “modes” mean in this context
                                    </h2>
                                    <p className="text-xl">
                                        A mode is a self-consistent solution of Maxwell’s equations that satisfies:
                                    </p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "The geometry of the structure (waveguide, cavity, mirror boundaries)",
                                            "The boundary conditions on the electromagnetic fields",
                                            "The material properties (refractive index, gain, loss)"
                                        ].map((item, i) => (
                                            <li key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-6">
                                        <p className="text-white/40 mb-4 italic uppercase text-[10px] tracking-widest font-bold">Each mode specifies:</p>
                                        <div className="flex flex-wrap gap-4">
                                            {["Spatial field distribution", "Polarization structure", "Propagation constant / resonance frequency"].map((tag, i) => (
                                                <span key={i} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/80">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 text-blue-200 text-sm">
                                        <strong>Note:</strong> TE and TM refer only to the <strong>polarization structure</strong> of a mode, not to whether the light is “laser” or “non-laser.”
                                    </p>
                                </section>

                                {/* Section 2 */}
                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-orange-500/50">02.</span> Definition of TE and TM modes
                                    </h2>
                                    <p className="text-xl">The definitions are <strong>always with respect to a propagation direction</strong>. Assume propagation along the z-axis.</p>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="p-8 bg-cyan-500/5 rounded-[2.5rem] border border-cyan-500/20 space-y-4">
                                            <h3 className="text-2xl font-bold text-cyan-400 mb-2">TE Mode (Transverse Electric)</h3>
                                            <p className="text-sm opacity-80">Electric field has no longitudinal component:</p>
                                            <MathText block>{String.raw`$E_z = 0$`}</MathText>
                                            <p className="text-sm opacity-80">Magnetic field does have a longitudinal component:</p>
                                            <MathText block>{String.raw`$H_z \neq 0$`}</MathText>
                                        </div>
                                        <div className="p-8 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/20 space-y-4">
                                            <h3 className="text-2xl font-bold text-orange-400 mb-2">TM Mode (Transverse Magnetic)</h3>
                                            <p className="text-sm opacity-80">Magnetic field has no longitudinal component:</p>
                                            <MathText block>{String.raw`$H_z = 0$`}</MathText>
                                            <p className="text-sm opacity-80">Electric field does have a longitudinal component:</p>
                                            <MathText block>{String.raw`$E_z \neq 0$`}</MathText>
                                        </div>
                                    </div>
                                    <p className="text-center italic text-white/40">“Transverse” means transverse to the propagation direction.</p>
                                </section>

                                {/* Section 3 */}
                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-purple-500/50">03.</span> Why TE and TM modes exist (Deep Physical Reason)
                                    </h2>
                                    <p className="text-xl">The origin lies in the <strong>boundary conditions</strong> at dielectric or metallic interfaces.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            "Tangential E must be continuous",
                                            "Tangential H must be continuous",
                                            "Normal D and B obey material-dependent constraints"
                                        ].map((text, i) => (
                                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                                                <p className="text-sm">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-lg leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/5">
                                        When you solve Maxwell’s equations under these constraints, the fields naturally split into <strong>two independent families</strong>. These families cannot mix unless symmetry is broken. This decoupling is why TE and TM modes are mathematically distinct and physically robust.
                                    </p>
                                </section>

                                {/* Section 4 */}
                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-green-500/50">04.</span> TE and TM in Common Laser Structures
                                    </h2>

                                    <div className="space-y-12">
                                        {/* 4.1 Planar */}
                                        <div className="grid md:grid-cols-2 gap-12 items-center">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-bold text-white">4.1 Planar Waveguide (Slab Waveguide)</h3>
                                                <p className="text-base text-white/50">This is the cleanest place to understand TE/TM isolation.</p>
                                                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-[10px] text-green-400">
                                                    <pre>{String.raw`        ^ y
        |
 cladding
 -------------------
 |      CORE (n1)  |  --- z (prop) --->
 -------------------
 cladding
        |
`}</pre>
                                                </div>
                                            </div>
                                            <div className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/5">
                                                <p><strong className="text-white">TE modes:</strong> electric field oscillates parallel to the interfaces.</p>
                                                <p><strong className="text-white">TM modes:</strong> electric field oscillates partly perpendicular to interfaces.</p>
                                                <div className="h-px bg-white/10 my-4" />
                                                <p className="text-sm italic">Key result: TE and TM modes have different <strong>effective refractive indices</strong> and resonate at slightly different frequencies.</p>
                                            </div>
                                        </div>

                                        {/* 4.2 FP */}
                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                                            <h3 className="text-xl font-bold text-white mb-4">4.2 Fabry–Pérot Laser Cavity</h3>
                                            <p className="mb-6">In a simple mirror cavity, TE/TM are often degenerate (same frequency). But any asymmetry breaks this degeneracy:</p>
                                            <div className="flex flex-wrap gap-4">
                                                {["Mirror coatings", "Gain anisotropy", "Stress / Birefringence"].map((tag, i) => (
                                                    <span key={i} className="px-4 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-300 tracking-wide">{tag}</span>
                                                ))}
                                            </div>
                                            <p className="mt-6 text-sm opacity-50 italic">This is why real lasers often lase preferentially in one specific polarization.</p>
                                        </div>

                                        {/* 4.3 Semiconductor */}
                                        <div className="p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl">LASER</div>
                                            <h3 className="text-xl font-bold text-white mb-4">4.3 Semiconductor Lasers (Very Important)</h3>
                                            <p className="mb-6">In edge-emitting semiconductor lasers: <strong>TE mode dominates</strong> while TM mode experiences lower gain.</p>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                                    <li>Quantum well selection rules</li>
                                                    <li>Dipole moment lies in the plane of the well</li>
                                                    <li>Strong coupling only to TE-polarized light</li>
                                                </ul>
                                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-center">
                                                    <p className="text-xs text-center font-mono uppercase tracking-widest text-white/40 leading-relaxed">Microscopic quantum-mechanical origin of macroscopic polarization.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5 */}
                                <section className="space-y-8 pt-12 border-t border-white/5">
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <span className="text-pink-500/50">05.</span> Field Structure Comparison (Mental Picture)
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-cyan-400">TE Mode (Cross-section)</h3>
                                            <div className="p-10 bg-black/40 rounded-3xl border border-cyan-500/20 text-center font-bold text-2xl tracking-[0.5em] text-cyan-300">
                                                → → → → →<br />
                                                → → → → →
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" /> No Ez component</li>
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" /> Electric field entirely transverse</li>
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" /> Smooth across the core with strong confinement</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-orange-400">TM Mode</h3>
                                            <div className="p-10 bg-black/40 rounded-3xl border border-orange-500/20 text-center font-bold text-2xl tracking-[0.5em] text-orange-300 leading-none">
                                                ↑&nbsp;&nbsp;&nbsp;↑&nbsp;&nbsp;&nbsp;↑<br />
                                                ↗&nbsp;&nbsp;|&nbsp;&nbsp;↖<br />
                                                ↓&nbsp;&nbsp;&nbsp;↓&nbsp;&nbsp;&nbsp;↓
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Contains significant Ez component</li>
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Electric field “leans” into the propagation direction</li>
                                                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Strong interaction with boundaries (different confinement / loss)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* References */}
                                <div className="pt-12 border-t border-white/10 mt-12 grid md:grid-cols-4 gap-8">
                                    <div className="col-span-1">
                                        <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-white/30 mb-2">Sources</h4>
                                        <div className="h-1 w-12 bg-white/10 rounded-full" />
                                    </div>
                                    <ul className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-[11px] opacity-40 font-mono">
                                        <li>A. E. Siegman, <em>Lasers</em>, University Science Books, 1986.</li>
                                        <li>W. T. Silfvast, <em>Laser Fundamentals</em>, Cambridge University Press, 2004.</li>
                                        <li>A. Yariv and P. Yeh, <em>Photonics</em>, Oxford University Press.</li>
                                        <li>Maxwell–Bloch formalism summaries, Wikipedia.</li>
                                        <li>Neurophasia, <em>Laser Resonators</em> (educational notes).</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <TETMViewer />

            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-24">
                <section className="space-y-10 group">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all group-hover:shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                            <span className="text-4xl font-black italic">TE</span>
                        </div>
                        <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">Transverse Electric</h2>
                    </div>
                    <div className="space-y-8 text-xl text-white/40 font-light leading-relaxed">
                        <p>
                            In <strong className="text-white font-bold">TE01</strong>, the electric field lacks any longitudinal component. It forms azimuthal loops within the fiber's core cross-section.
                        </p>
                        <p className="bg-white/5 p-8 rounded-[3rem] border border-white/5 text-sm font-mono text-cyan-300">
                            Ez = 0 everywhere.<br />
                            E-field: Azimuthal (φ).
                        </p>
                    </div>
                </section>

                <section className="space-y-10 group">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[2rem] bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all group-hover:shadow-[0_0_50px_rgba(249,115,22,0.2)]">
                            <span className="text-4xl font-black italic">TM</span>
                        </div>
                        <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">Transverse Magnetic</h2>
                    </div>
                    <div className="space-y-8 text-xl text-white/40 font-light leading-relaxed">
                        <p>
                            In <strong className="text-white font-bold">TM01</strong>, the magnetic field is purely azimuthal. The electric field must loop along the fiber length to satisfy boundary conditions.
                        </p>
                        <p className="bg-white/5 p-8 rounded-[3rem] border border-white/5 text-sm font-mono text-orange-300">
                            Hz = 0 everywhere.<br />
                            E-field: Poloidal loops in r-z planes.
                        </p>
                    </div>
                </section>
            </div>

            <div className="mt-40 p-16 bg-white/[0.02] border border-white/10 rounded-[5rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-4xl text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/20 shrink-0">
                        <Info size={40} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-3xl font-serif font-bold tracking-tight">Analytical Structure</h3>
                        <p className="text-xl text-white/30 font-light leading-snug max-w-2xl">
                            The visualizer represents the core topology with high geometric precision. The cladding has been removed for analytical clarity of the modal fields.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modes;

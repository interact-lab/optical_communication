import React, { useEffect, useRef } from 'react';

const ConstellationPlot = ({ ampI, ampQ, phaseShiftEnabled, modulationFormat, biasDrift }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = (w / 4) * 0.8;

        const axisColor = 'rgba(255, 255, 255, 0.1)';
        const gridColor = 'rgba(255, 255, 255, 0.05)';
        const pointColor = '#f43f5e'; // Rose
        const labelColor = 'rgba(255, 255, 255, 0.3)';

        ctx.clearRect(0, 0, w, h);

        // Grid Lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue;
            // Vertical
            ctx.beginPath();
            ctx.moveTo(cx + i * scale, 0);
            ctx.lineTo(cx + i * scale, h);
            ctx.stroke();
            // Horizontal
            ctx.beginPath();
            ctx.moveTo(0, cy + i * scale);
            ctx.lineTo(w, cy + i * scale);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(w, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();

        // Labels
        ctx.fillStyle = labelColor;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('In-Phase (I)', w - 60, cy - 10);
        ctx.save();
        ctx.translate(cx + 15, 60);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Quadrature (Q)', 0, 0);
        ctx.restore();

        // Calculate Points
        let points = [];
        const driftAngle = biasDrift || 0;

        const addPoint = (iVal, qVal) => {
            const qPhase = Math.PI / 2 + driftAngle;
            const real = iVal + qVal * Math.cos(qPhase);
            const imag = qVal * Math.sin(qPhase);
            points.push({ x: real, y: imag });
        };

        if (modulationFormat === 'BPSK') {
            addPoint(ampI, 0);
            addPoint(-ampI, 0);
        } else if (modulationFormat === 'QPSK') {
            addPoint(ampI, ampQ);
            addPoint(-ampI, ampQ);
            addPoint(-ampI, -ampQ);
            addPoint(ampI, -ampQ);
        } else if (modulationFormat === '8-PSK') {
            for (let k = 0; k < 8; k++) {
                const theta = k * Math.PI / 4;
                addPoint(ampI * Math.cos(theta), ampQ * Math.sin(theta));
            }
        } else if (modulationFormat === '16-QAM') {
            const levels = [-3, -1, 1, 3];
            levels.forEach(i => {
                levels.forEach(q => {
                    addPoint(i * ampI / 3, q * ampQ / 3);
                });
            });
        } else if (modulationFormat === 'NRZ') {
            addPoint(ampI, 0);
            addPoint(0, 1); // Representing the "off" state or similar if relevant
        }

        // Draw Points with Glow
        points.forEach(p => {
            const screenX = cx + p.x * scale;
            const screenY = cy - p.y * scale;

            // Glow effect
            const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 15);
            grad.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
            grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 15, 0, 2 * Math.PI);
            ctx.fill();

            // Point
            ctx.beginPath();
            ctx.fillStyle = pointColor;
            ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            ctx.arc(screenX, screenY, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

    }, [ampI, ampQ, phaseShiftEnabled, modulationFormat, biasDrift]);

    return (
        <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] shadow-2xl">
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full bg-[#050505] rounded-[1.8rem]"
            />
        </div>
    );
};

export default ConstellationPlot;

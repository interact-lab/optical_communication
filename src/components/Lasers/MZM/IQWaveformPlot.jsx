import React, { useEffect, useRef } from 'react';

const IQWaveformPlot = ({ ampI, ampQ, freq, phaseShiftEnabled, modulationFormat, time }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const axisColor = 'rgba(255, 255, 255, 0.1)';
        const iColor = '#3b82f6'; // Blue
        const qColor = '#f43f5e'; // Rose

        ctx.clearRect(0, 0, w, h);

        // Draw Axes
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();

        const drawWave = (color, isQ) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            const amplitude = isQ ? ampQ : ampI;
            let phaseOffset = 0;
            if (isQ && phaseShiftEnabled) phaseOffset = Math.PI / 2;

            for (let x = 0; x < w; x++) {
                const t = (x / w) * (4 * Math.PI);
                const val = amplitude * Math.sin(t * freq + time + phaseOffset);
                const y = h / 2 - val * (h / 3);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        drawWave(iColor, false); // I
        drawWave(qColor, true);  // Q

        // Legend
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = iColor;
        ctx.fillText('In-Phase I(t)', 20, 30);
        ctx.fillStyle = qColor;
        ctx.fillText('Quadrature Q(t)', 120, 30);

    }, [ampI, ampQ, freq, phaseShiftEnabled, modulationFormat, time]);

    return (
        <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] shadow-2xl">
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                className="w-full bg-[#050505] rounded-[1.8rem]"
            />
        </div>
    );
};

export default IQWaveformPlot;

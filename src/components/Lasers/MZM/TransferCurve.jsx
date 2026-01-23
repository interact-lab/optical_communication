import React, { useEffect, useRef } from 'react';

const TransferCurve = ({ biasV }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const blue = '#3b82f6';
        const rose = '#f43f5e';
        const axisColor = 'rgba(255, 255, 255, 0.1)';

        ctx.clearRect(0, 0, w, h);

        const zeroX = w / 2;
        const scaleX = w / 3;
        const scaleY = h * 0.7;
        const offsetY = h * 0.85;

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(zeroX - scaleX, 0); ctx.lineTo(zeroX - scaleX, h);
        ctx.moveTo(zeroX, 0); ctx.lineTo(zeroX, h);
        ctx.moveTo(zeroX + scaleX, 0); ctx.lineTo(zeroX + scaleX, h);
        ctx.stroke();

        // Curve
        ctx.beginPath();
        ctx.strokeStyle = blue;
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';

        for (let x = 0; x < w; x++) {
            const normalizedX = (x - zeroX) / scaleX * Math.PI;
            const y = offsetY - (0.5 * (1 + Math.cos(normalizedX))) * scaleY;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.shadowBlur = 15;
        ctx.shadowColor = blue;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // X-Axis
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(w, offsetY);
        ctx.stroke();

        // Ticks
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        [
            { v: -1, label: '-Vπ' },
            { v: 0, label: '0' },
            { v: 1, label: 'Vπ' }
        ].forEach(tick => {
            const tx = zeroX + tick.v * scaleX;
            ctx.fillText(tick.label, tx, offsetY + 20);
        });

        // Current Bias Point
        const biasX = zeroX + (biasV / Math.PI) * scaleX;
        const biasY = offsetY - (0.5 * (1 + Math.cos(biasV))) * scaleY;

        ctx.beginPath();
        ctx.fillStyle = rose;
        ctx.arc(biasX, biasY, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Point Core
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(biasX, biasY, 3, 0, 2 * Math.PI);
        ctx.fill();

    }, [biasV]);

    return (
        <div className="relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] shadow-2xl">
            <canvas
                ref={canvasRef}
                width={600}
                height={350}
                className="w-full bg-[#050505] rounded-[2.3rem]"
            />
        </div>
    );
};

export default TransferCurve;

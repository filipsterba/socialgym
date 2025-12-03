import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';

const VoiceAnalyzer = () => {
    const [isListening, setIsListening] = useState(false);
    const [volume, setVolume] = useState(0);
    const [feedback, setFeedback] = useState("Klikni na mikrofon a začni mluvit.");
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationRef = useRef(null);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);

            setIsListening(true);
            setFeedback("Poslouchám... Mluv plynule.");
            draw();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setFeedback("Chyba: Nemohu přistoupit k mikrofonu.");
        }
    };

    const stopListening = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsListening(false);
        setVolume(0);
        setFeedback("Analýza zastavena.");
    };

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        ctx.clearRect(0, 0, width, height);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setVolume(average);

        // Feedback logic
        if (average > 10 && average < 30) {
            setFeedback("Moc potichu! Zníš jako myš. 🐭");
        } else if (average >= 30 && average < 80) {
            setFeedback("Dobrý tón. Pokračuj. 🗣️");
        } else if (average >= 80) {
            setFeedback("Moc řveš! Uklidni se. 📢");
        } else if (average <= 10) {
            setFeedback("Ticho... Mluv! 😶");
        }

        // Visualizer
        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const r = barHeight + 25 * (i / bufferLength);
            const g = 250 * (i / bufferLength);
            const b = 50;

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        animationRef.current = requestAnimationFrame(draw);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Activity color="var(--secondary)" /> Analýza Hlasu
            </h2>

            <div style={{
                height: '200px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '16px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <canvas ref={canvasRef} width="600" height="200" style={{ width: '100%', height: '100%' }} />
            </div>

            <div style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', minHeight: '1.5em' }}>
                {feedback}
            </div>

            <button
                className={isListening ? "btn-secondary" : "btn-primary"}
                onClick={isListening ? stopListening : startListening}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
            >
                {isListening ? <><MicOff size={20} /> Zastavit</> : <><Mic size={20} /> Začít Mluvit</>}
            </button>
        </div>
    );
};

export default VoiceAnalyzer;

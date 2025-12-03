import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE } from '@mediapipe/face_mesh';
import { Camera as CameraIcon, CameraOff } from 'lucide-react';

const WebcamTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isEyeContact, setIsEyeContact] = useState(false);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState("Kamera vypnuta");
    const [isCameraOn, setIsCameraOn] = useState(false);
    const cameraRef = useRef(null); // To store the Camera instance

    useEffect(() => {
        let faceMesh = null;

        if (isCameraOn) {
            faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                }
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            faceMesh.onResults(onResults);

            if (webcamRef.current && webcamRef.current.video) {
                cameraRef.current = new Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        if (webcamRef.current && webcamRef.current.video && isCameraOn) {
                            await faceMesh.send({ image: webcamRef.current.video });
                        }
                    },
                    width: 640,
                    height: 480
                });
                cameraRef.current.start();
                setStatus("Hledám obličej...");
            }
        } else {
            if (cameraRef.current) {
                cameraRef.current.stop();
                cameraRef.current = null;
            }
            setStatus("Kamera vypnuta");
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, [isCameraOn]);

    const onResults = (results) => {
        if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video || !isCameraOn) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
        canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const nose = landmarks[1];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            const eyeMidpointX = (leftEye.x + rightEye.x) / 2;
            const noseOffsetX = Math.abs(nose.x - eyeMidpointX);
            const isLookingAtCamera = noseOffsetX < 0.05;

            if (isLookingAtCamera) {
                setIsEyeContact(true);
                setStatus("Oční kontakt navázán! 🔥");
                setScore(s => s + 1);
                canvasCtx.strokeStyle = '#00f2ea';
                canvasCtx.lineWidth = 4;
            } else {
                setIsEyeContact(false);
                setStatus("Uhýbáš pohledem! 🐀");
                canvasCtx.strokeStyle = '#ff0055';
                canvasCtx.lineWidth = 4;
            }

            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: isEyeContact ? '#00f2ea' : '#ff0055', lineWidth: 2 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: isEyeContact ? '#00f2ea' : '#ff0055', lineWidth: 2 });

        } else {
            setStatus("Žádný obličej nedetekován");
            setIsEyeContact(false);
        }
        canvasCtx.restore();
    };

    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ marginBottom: '1rem' }}>Trénink Očního Kontaktu</h2>

            <div style={{ position: 'relative', width: '640px', maxWidth: '100%', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${isEyeContact && isCameraOn ? 'var(--primary)' : 'var(--secondary)'}`, minHeight: '480px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!isCameraOn && (
                    <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <CameraOff size={48} />
                        <p>Kamera je vypnuta</p>
                    </div>
                )}

                {isCameraOn && (
                    <>
                        <Webcam
                            ref={webcamRef}
                            style={{ width: '100%', height: 'auto', display: 'none' }}
                        />
                        <canvas
                            ref={canvasRef}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </>
                )}

                {isCameraOn && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ color: isEyeContact ? 'var(--primary)' : 'var(--secondary)', fontWeight: 'bold' }}>
                            {status}
                        </span>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                <button
                    onClick={toggleCamera}
                    className={isCameraOn ? "btn-secondary" : "btn-primary"}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isCameraOn ? <><CameraOff size={20} /> Vypnout Kameru</> : <><CameraIcon size={20} /> Zapnout Kameru</>}
                </button>

                <div className="stat-box">
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Skóre</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.floor(score / 10)}</div>
                </div>
            </div>
        </div>
    );
};

export default WebcamTracker;

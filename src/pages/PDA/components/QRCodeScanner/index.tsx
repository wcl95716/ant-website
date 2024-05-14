import { CameraOutlined } from '@ant-design/icons';
import { Button, Card, message } from 'antd';
import jsQR from 'jsqr';
import React, { useEffect, useRef, useState } from 'react';

const QRCodeScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanning, setScanning] = useState(false);
    const [qrData, setQrData] = useState<string | null>(null);

    useEffect(() => {
        if (scanning) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas) {
                const context = canvas.getContext('2d');
                navigator.mediaDevices
                    .getUserMedia({ video: { facingMode: 'environment' } })
                    .then((stream) => {
                        video.srcObject = stream;
                        video.play();
                        const scanQRCode = () => {
                            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                                canvas.height = video.videoHeight;
                                canvas.width = video.videoWidth;
                                context?.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const imageData = context?.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height,
                                );
                                if (imageData) {
                                    const code = jsQR(
                                        imageData.data,
                                        imageData.width,
                                        imageData.height,
                                    );
                                    if (code) {
                                        setQrData(code.data);
                                        setScanning(false);
                                        stream.getTracks().forEach((track) => track.stop());
                                    }
                                }
                            }
                            if (scanning) {
                                requestAnimationFrame(scanQRCode);
                            }
                        };
                        requestAnimationFrame(scanQRCode);
                    })
                    .catch((error: any) => {
                        message.error('Error accessing camera', error);
                        setScanning(false);
                    });
            }
        }
    }, [scanning]);

    return (
        <Card bordered>
            <Button icon={<CameraOutlined />} onClick={() => setScanning(true)}>
                Scan QR Code
            </Button>
            {scanning && (
                <div>
                    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
            )}
            {qrData && (
                <div>
                    <h3>QR Code Data:</h3>
                    <p>{qrData}</p>
                </div>
            )}
        </Card>
    );
};

export default QRCodeScanner;

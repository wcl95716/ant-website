import {
    CameraOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, message } from 'antd';
import jsQR from 'jsqr';
import React, { useEffect, useRef, useState } from 'react';
import styles from './indes.style.css';

interface PDAProps {
    title: string;
    description: string;
    onEdit: () => void;
    onDelete: () => void;
    onInfo: () => void;
    onScanSuccess: (data: string) => void;
}

const PDA: React.FC<PDAProps> = ({
    title,
    description,
    onEdit,
    onDelete,
    onInfo,
    onScanSuccess,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanning, setScanning] = useState(false);

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
                                        onScanSuccess(code.data);
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
                    .catch((error) => {
                        message.error('Error accessing camera', error);
                        setScanning(false);
                    });
            }
        }
    }, [scanning, onScanSuccess]);

    return (
        <Card className={styles.pdaCard} bordered>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </Col>
                <Col span={24}>
                    <Button icon={<EditOutlined />} onClick={onEdit} className={styles.pdaButton}>
                        Edit
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                        className={styles.pdaButton}
                    >
                        Delete
                    </Button>
                    <Button
                        icon={<InfoCircleOutlined />}
                        onClick={onInfo}
                        className={styles.pdaButton}
                    >
                        Info
                    </Button>
                    <Button
                        icon={<CameraOutlined />}
                        onClick={() => setScanning(true)}
                        className={styles.pdaButton}
                    >
                        Scan
                    </Button>
                </Col>
            </Row>
            {scanning && (
                <div className={styles.scannerContainer}>
                    <video ref={videoRef} className={styles.scannerVideo} />
                    <canvas ref={canvasRef} className={styles.scannerCanvas} />
                </div>
            )}
        </Card>
    );
};

export default PDA;

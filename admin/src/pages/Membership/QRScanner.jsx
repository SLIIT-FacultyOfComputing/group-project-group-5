import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let scanner = null;
        
        const initializeScanner = () => {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 10,
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2,
                formatsToSupport: ['QR_CODE'],
            });

            scanner.render(onScanSuccess, onScanError);
        };

        const onScanSuccess = (result) => {
            try {
                // Extract memberId from the URL
                const url = new URL(result);
                const memberId = url.pathname.split('/').pop();
                
                // Mark attendance
                const token = localStorage.getItem('token');
                axios.post(`http://localhost:8090/api/attendance/mark/${memberId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setSuccess(true);
                    setError(null);
                    setIsScanning(false);
                    scanner.clear();
                    
                    // Reset success message and restart scanner after 3 seconds
                    setTimeout(() => {
                        setSuccess(false);
                        setScanResult(null);
                        setIsScanning(true);
                        initializeScanner();
                    }, 3000);
                })
                .catch(err => {
                    setError(err.response?.data?.message || 'Failed to mark attendance');
                    setSuccess(false);
                    // Restart scanner after error
                    setTimeout(() => {
                        scanner.clear();
                        initializeScanner();
                    }, 2000);
                });
            } catch (err) {
                setError('Invalid QR code format');
                setSuccess(false);
                // Restart scanner after error
                setTimeout(() => {
                    scanner.clear();
                    initializeScanner();
                }, 2000);
            }
        };

        const onScanError = (err) => {
            console.warn(err);
            // Don't show error to user for normal scanning process
        };

        if (isScanning) {
            initializeScanner();
        }

        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [isScanning]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-center">Scan Member QR Code</h1>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-gray-600 hover:text-rose-600 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Attendance marked successfully!
                    </div>
                )}
                
                <div id="reader" className="w-full"></div>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                    {isScanning ? (
                        <>
                            <p>Position the QR code within the scanner frame</p>
                            <p className="mt-2">Using {navigator.userAgent.includes('Mobile') ? 'mobile' : 'web'} camera</p>
                        </>
                    ) : (
                        <p>Processing...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRScanner; 
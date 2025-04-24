import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setScanResult(result);
            
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
                // Reset success message after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
                    setScanResult(null);
                }, 3000);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to mark attendance');
                setSuccess(false);
            });
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            scanner.clear();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Scan Member QR Code</h1>
                
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
                    Position the QR code within the scanner frame
                </div>
            </div>
        </div>
    );
};

export default QRScanner; 
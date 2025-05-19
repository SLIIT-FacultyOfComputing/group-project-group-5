import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';

const QRCodePage = () => {
  const { id: memberId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchMemberId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8090/api/members/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch member profile');
        console.error('Error fetching member profile:', err);
        setLoading(false);
      }
    };

    fetchMemberId();
  }, [memberId]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: '#ffffff',
        scale: 2 // Higher scale for better quality
      });
      
      const link = document.createElement('a');
      link.download = `gym-membership-qr-${memberId}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    } catch (err) {
      console.error('Error generating QR code image:', err);
      setError('Failed to generate QR code image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const qrValue = `http://localhost:8090/api/members/verify/${memberId}`;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Membership QR Code</h2>
        <p className="text-gray-600">Show this QR code at the gym entrance for verification</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div ref={qrCodeRef} className="p-4 bg-white rounded-lg shadow-md mb-4">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
        </div>
        
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download QR Code
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          Member ID: {memberId}
        </div>
      </div>
    </div>
  );
};

export default QRCodePage; 
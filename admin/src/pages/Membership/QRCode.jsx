import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const QRCodePage = () => {
  const [memberId, setMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemberId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8090/api/members/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMemberId(response.data.id);
      } catch (err) {
        setError('Failed to fetch member data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberId();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!memberId) return <div>Member not found</div>;

  // Generate a unique URL for the member's QR code
  const qrValue = `http://localhost:3000/members/verify/${memberId}`;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your QR Code</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>
          <p className="text-gray-600 text-sm text-center mb-4">
            Show this QR code at the gym entrance for quick access
          </p>
          <div className="text-xs text-gray-500 text-center">
            Member ID: {memberId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage; 
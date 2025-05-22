import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

const MemberDashboard = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8090/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMember(response.data);
      } catch (err) {
        setError('Failed to fetch member data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  const handleDownloadQR = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current, {
        backgroundColor: '#ffffff',
        scale: 2 // Higher scale for better quality
      });
      
      const link = document.createElement('a');
      link.download = `gym-membership-qr-${id}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    } catch (err) {
      console.error('Error generating QR code image:', err);
      setError('Failed to generate QR code image');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Loading member data...</span>
    </div>
  );
  
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md m-4">{error}</div>;
  if (!member) return <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md m-4">Member not found</div>;

  // Function to determine status badge color
  const getStatusBadgeColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const qrValue = `http://localhost:8090/api/members/verify/${id}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Member Dashboard</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(member.status)}`}>
          {member.status}
        </span>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-rose-100">Member ID: {id}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="font-medium w-24 text-gray-600">Name:</span> 
                <span className="text-gray-800">{member.firstName} {member.lastName}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-24 text-gray-600">Email:</span> 
                <span className="text-gray-800">{member.email}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-24 text-gray-600">Phone:</span> 
                <span className="text-gray-800">{member.phoneNumber}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-24 text-gray-600">Address:</span> 
                <span className="text-gray-800">{member.address}</span>
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Membership Details</h2>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="font-medium w-32 text-gray-600">Type:</span> 
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">{member.membershipType}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-32 text-gray-600">Join Date:</span> 
                <span className="text-gray-800">{new Date(member.joinDate).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-32 text-gray-600">Last Visit:</span> 
                <span className="text-gray-800">{member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}</span>
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-md font-medium text-gray-700 mb-2">Membership Timeline</h3>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{width: `${Math.min(100, Math.random() * 100)}%`}}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Start</span>
                <span>Now</span>
                <span>Renewal</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code Section */}
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Membership QR Code</h3>
            <p className="text-gray-600 text-sm mt-1">Show this QR code at the gym entrance for quick verification</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <QRCodeSVG
                value={qrValue}
                size={180}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>
            
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
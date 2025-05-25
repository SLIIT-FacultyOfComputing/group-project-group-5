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
        
        // Calculate membership duration and progress
        const memberData = response.data;
        
        // If we have join date and membership duration data, calculate timeline percentage
        if (memberData.joinDate) {
          const joinDate = new Date(memberData.joinDate);
          
          // Default membership duration (in months) based on membership type if not provided by API
          const durationMonths = memberData.membershipDuration || 
            (memberData.membershipType === 'PREMIUM' ? 12 : 3);
          
          // Calculate expected end date
          const endDate = new Date(joinDate);
          endDate.setMonth(endDate.getMonth() + durationMonths);
          
          // Calculate current progress percentage
          const now = new Date();
          const totalDuration = endDate - joinDate;
          const elapsed = now - joinDate;
          const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
          
          // Add calculated data to member object
          memberData.membershipEndDate = endDate;
          memberData.membershipProgress = progressPercentage;
          memberData.membershipDuration = durationMonths;
        }
        
        setMember(memberData);
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
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch(statusLower) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Full Name</span>
                    <p className="font-medium text-gray-800">{member.firstName} {member.lastName}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email Address</span>
                    <p className="font-medium text-gray-800">{member.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Phone Number</span>
                    <p className="font-medium text-gray-800">{member.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Address</span>
                    <p className="font-medium text-gray-800">{member.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Membership Details</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Membership Type</span>
                    <p className="mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                        {member.membershipType || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Join Date</span>
                    <p className="font-medium text-gray-800">{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center">
                  <div className="bg-teal-100 p-2 rounded-md mr-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Last Visit</span>
                    <p className="font-medium text-gray-800">{member.lastVisit ? new Date(member.lastVisit).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
              <div className="mt-6 pt-4 border-t">
              <h3 className="text-md font-medium text-gray-700 mb-2">Membership Timeline</h3>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{width: `${member.membershipProgress || 0}%`}}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'Start'}</span>
                <span>Now</span>
                <span>{member.membershipEndDate ? new Date(member.membershipEndDate).toLocaleDateString() : 'Renewal'}</span>
              </div>
              {member.membershipDuration && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {member.membershipDuration} month{member.membershipDuration !== 1 ? 's' : ''} membership
                </p>
              )}
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
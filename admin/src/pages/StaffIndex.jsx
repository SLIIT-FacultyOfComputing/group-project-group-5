"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import Header from "../components/Staff_header.jsx"
import Footer from "../components/Staff_Footer.jsx"
import AppointmentList from "./Appointments/AppointmentList.jsx"
import BookAppointment from "./Appointments/BookAppointment.jsx"
import TicketsViewerPage from "./Tickets/TicketsViewerPage.jsx"
import ProfilePage from "./Profile/ProfilePage.jsx"
import MemberList from "./Members/SMembersList.jsx"
import { getTicketCountBystaffId } from "../services/ticketApi"
import EquipmentList from "./Equipment/Staff_EquipmentList.jsx"
import EditMember from "./Members/EditMember.jsx"
import RegisterMember from "./Members/RegisterPage.jsx"
import Dashboard from "./Dashboard/StaffDashboard.jsx"
import SCreateRoutine from "./Routine/SCreateRoutine.jsx"
import ViewRouting  from "./Routine/SViewRoutine.jsx"


const StaffPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [inProgressTicketCount, setInProgressTicketCount] = useState(0)
  const [ticketCountLoading, setTicketCountLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/staff/login')
      return
    }

    const name = localStorage.getItem('userName')
    const role = localStorage.getItem('userRole')
    setUserName(name || '')
    setUserRole(role || '')

    const fetchInProgressTicketCount = async () => {
      setTicketCountLoading(true)
      try {
        const staffId = localStorage.getItem('userId')
        if (staffId) {
          const response = await getTicketCountBystaffId(staffId)
          setInProgressTicketCount(response.data || 0)
        }
      } catch (err) {
        console.error('Error fetching in-progress tickets count:', err)
      } finally {
        setTicketCountLoading(false)
      }
    }
    
    fetchInProgressTicketCount()
    
    const intervalId = setInterval(fetchInProgressTicketCount, 60 * 1000)

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    document.addEventListener("scroll", handleScroll)
    return () => {
      document.removeEventListener("scroll", handleScroll)
      clearInterval(intervalId)
    }
  }, [scrolled, navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header scrolled={scrolled} />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 md:mt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 neu-convex">
          <div className="md:hidden p-4 border-b border-gray-100">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between text-gray-700 hover:text-rose-600 transition-colors"
            >
              <span className="font-medium">Menu</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? "transform rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>

          <nav className={`flex flex-col md:flex-row ${mobileMenuOpen ? "block" : "hidden md:flex"}`}>
            
            <Link 
              to="/staff/dashboard" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/staff/dashboard' || currentPath === '/' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>
            
            {/* Only show Members link to MANAGER and RECEPTIONIST roles */}
            {(userRole === 'MANAGER' || userRole === 'RECEPTIONIST') && (
              <Link 
                to="/staff/members" 
                className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                  currentPath === '/staff/members' || currentPath.includes('/staff/member/')
                    ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span className="whitespace-nowrap">View Members</span>
              </Link>
            )}

            <Link 
              to="/staff/equipment-list" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/staff/equipment-list'
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span className="whitespace-nowrap">View Gym Equipment</span>
            </Link>
            
            <Link
              to="/staff/appointments"
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === "/staff/appointments"
                  ? "bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-rose-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="whitespace-nowrap">Appointments</span>
            </Link>
            
            <Link 
              to="/staff/tickets" 
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === '/staff/tickets' 
                  ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              <span className="whitespace-nowrap">View Tickets</span>
              {!ticketCountLoading && inProgressTicketCount > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full min-w-[1.25rem] text-center ${
                  currentPath === '/staff/tickets' 
                    ? 'bg-white text-rose-700' 
                    : 'bg-rose-500 text-white'
                }`}>
                  {inProgressTicketCount}
                </span>
              )}
            </Link>

          </nav>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-8 md:pb-12 relative mt-4 md:mt-6">
        <div className="glass-effect rounded-xl p-2 sm:p-4">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="equipment-list" element={<EquipmentList />} />
            
            {/* Member routes - now accessible to all staff */}
            <Route path="members" element={<MemberList />} />
            <Route path="member/register-member" element={<RegisterMember />} />
            <Route path="member/edit-member/:id" element={<EditMember />} />
            
            <Route path="book-appointment" element={<BookAppointment />} />
            
            
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="tickets" element={<TicketsViewerPage />} />
            <Route path="profile" element={<ProfilePage />} />            <Route path="member/edit-member/:id" element={<EditMember />} />
            <Route path="member/register-member" element={<RegisterMember />} />
            <Route path="member/create-routine/:id" element={<SCreateRoutine />} />
            <Route path="member/view-routine/:id" element={<ViewRouting />} />


            {/* Redirect to dashboard if no specific route is matched */}
            <Route
              path="*"
              element={
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 mt-4 md:mt-6 text-center relative backdrop-blur-sm">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Page Not Found</h2>
                  <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                  <Link
                    to="/staff/dashboard"
                    className="px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>
      </div>

      <Footer />
      <style>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-pattern-light {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px 2px rgba(244, 63, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(244, 63, 94, 0.6);
          }
        }
        
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
        @keyframes pulseBorder {
          0%, 100% {
            border-color: rgba(244, 63, 94, 0.4);
            box-shadow: 0 0 5px rgba(244, 63, 94, 0.2);
          }
          50% {
            border-color: rgba(244, 63, 94, 0.8);
            box-shadow: 0 0 10px rgba(244, 63, 94, 0.4);
          }
        }
        
        .pulse-border {
          animation: pulseBorder 2s infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .btn-3d {
          transform: translateY(0);
          transition: transform 0.2s;
          box-shadow: 0 4px 0 0 rgba(157, 23, 77, 1);
        }
        
        .btn-3d:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 0 rgba(157, 23, 77, 1);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .neu-convex {
          background: linear-gradient(145deg, #e2e8ec, #ffffff);
          box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
        }
        
        .neu-concave {
          background: linear-gradient(145deg, #ffffff, #e2e8ec);
          box-shadow: inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff;
        }
        
        @media (max-width: 640px) {
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .neu-convex {
            box-shadow: 3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff;
          }
        }
      `}</style>
    </div>
  )
}

export default StaffPage

"use client"

import { useState, useEffect } from "react"
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom"
import StaffList from "./Staff/StaffList.jsx"
import AddStaff from "./Staff/AddStaff.jsx"
import UpdateStaff from "./Staff/UpdateStaff.jsx"
import Header from "../components/header.jsx"
import Footer from "../components/Footer.jsx"

const StaffPage = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    document.addEventListener("scroll", handleScroll)
    return () => {
      document.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

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
              to="/staff-list"
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === "/staff-list" || currentPath === "/"
                  ? "bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <span className="whitespace-nowrap">View Staff</span>
            </Link>
            <Link
              to="/add-staff"
              className={`px-4 sm:px-5 md:px-7 py-3 md:py-4 text-sm font-medium flex items-center transition-all duration-300 group ${
                currentPath === "/add-staff"
                  ? "bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span className="whitespace-nowrap">Add Staff</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-8 md:pb-12 relative mt-4 md:mt-6">
        <div className="glass-effect rounded-xl p-2 sm:p-4">
          <Routes>
            <Route path="/staff-list" element={<StaffList />} />
            <Route path="/add-staff" element={<AddStaff />} />
            <Route path="/update-staff/:nic" element={<UpdateStaff />} />
            <Route path="/" element={<Navigate to="/staff-list" replace />} />
            <Route
              path="*"
              element={
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-12 mt-4 md:mt-6 text-center relative backdrop-blur-sm">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Page Not Found</h2>
                  <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                  <Link
                    to="/staff-list"
                    className="px-5 md:px-7 py-2.5 md:py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium hover:from-rose-700 hover:to-rose-600 transition-all duration-300 flex items-center shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
                  >
                    Return to Staff List
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>
      </div>

      <Footer />
      <style jsx>{`
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

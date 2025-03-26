import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rose-900 to-rose-800 py-12 text-center text-sm text-rose-100 relative mt-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 gym-pattern"></div>
      </div>
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-3">
              <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold">About MANSA GYM</h3>
            </div>
            <p className="text-rose-200 text-xs leading-relaxed">
              MANSA GYM Equipment Management System provides comprehensive tools for tracking and managing gym
              equipment inventory, maintenance schedules, and usage statistics.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center mb-3">
              <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Quick Links</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/equipment-list" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                View Equipment
              </Link>
              <Link to="/add-equipment" className="text-rose-200 hover:text-white transition-colors duration-200 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Add Equipment
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-3">
              <div className="bg-rose-700 bg-opacity-40 p-1.5 rounded-lg shadow-md mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold">Contact Us</h3>
            </div>
            <p className="text-rose-200 text-xs">support@mansagym.com</p>
            <p className="text-rose-200 text-xs mt-1">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-rose-700 border-opacity-50 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-sm">
            <svg className="w-5 h-5 mr-2 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>MANSA GYM Equipment Management &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="bg-rose-800 bg-opacity-40 px-3 py-1 rounded-full text-xs">Version 1.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

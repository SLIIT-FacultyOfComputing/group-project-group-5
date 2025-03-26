const Header = ({ scrolled }) => {
    return (
      <header
        className={`bg-gradient-to-r from-rose-800 to-rose-600 shadow-xl py-5 sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 shadow-lg' : 'py-5'
        }`}
      >
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 gym-pattern"></div>
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Enhanced Header Logo with 3D effect */}
              <div className="bg-rose-900 bg-opacity-40 p-2.5 rounded-lg shadow-lg mr-4 transform hover:rotate-3 transition-transform duration-300 btn-3d">
                <svg
                  className="w-8 h-8 text-white drop-shadow-md"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zm-1.41-1.41L11.5 18H5v-6.5l6.76-6.76a4 4 0 0 1 5.66 5.66l-2.83 2.83"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md tracking-tight">
                  MANSA GYM
                </h1>
                <span className="text-rose-100 text-xs md:text-sm tracking-wider font-medium">
                  Equipment Management System
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* Fixed System Active Button - Enhanced with better glow effect and animation */}
              <span className="inline-flex items-center px-3.5 py-1.5 bg-gradient-to-r from-rose-900 to-rose-800 rounded-full text-xs font-medium text-white shadow-lg border border-rose-500 border-opacity-40 pulse-border hover:from-rose-800 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-lg animate-pulse ring-2 ring-green-400 ring-opacity-50 group-hover:ring-opacity-70 transition-all duration-300"></span>
                <span className="relative">
                  System Active
                  <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent bg-clip-text blur-sm opacity-50 animate-pulse-slow"></span>
                </span>
              </span>
              <div className="relative">
                <button className="flex items-center text-rose-100 hover:text-white transition-colors p-2 bg-rose-800 bg-opacity-40 rounded-full hover:bg-opacity-60">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
  
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  // 🔁 Sync with localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
  <nav className="w-full px-6 py-4 flex items-center justify-between
               shadow-md bg-[#2E1B0F] text-white
               relative z-50">


      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-tr from-blue-600 to-green-500 font-bold">
          W
        </div>
        <span className="text-lg font-semibold">WebApp</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Link to="/guide" className="text-gray-300 hover:text-white">
          Become Partner
        </Link>

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700"
          >
            Login
          </Link>
        ) : (
          <div className="relative">

            {/* Profile */}
            <button
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center"
            >
              👤
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

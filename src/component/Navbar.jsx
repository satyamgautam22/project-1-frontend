import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-tr from-blue-600 to-green-500 font-bold">
          W
        </div>
        <span className="text-lg font-semibold">WebApp</span>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-4">
        <a
          href="/guide"
          className="text-gray-300 hover:text-white transition"
        >
          Become Partner
        </a>

        <a
          href="/login"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
        >
          Login
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import sections
import ProjectsSection from "../pages/Project.jsx";
import AddImageSection from "../component/Image.jsx";
import AddVideoSection from "../component/Video.jsx";
import FileUploadSection from "../component/File.jsx";
import Uploadingproject from "../component/Uploadingproject.jsx";
import InstantMessages from "./InstantMessages.jsx";
import GuideBooking from "./GuideBooking.jsx";
import DashboardHome from "./DashboardHome.jsx";




const Dashboard = () => {
  // pick a valid default tab:
  const [activeSection, setActiveSection] = useState("Messenger");
  const [loggedOut, setLoggedOut] = useState(false);

  // 🔒 block entry if no token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token || loggedOut) {
    
    toast.success("Logged out successfully");
    return <Navigate to="/login" replace />;
    
  }



  const logout = () => {
    // clear auth on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedOut(true);
    
  };
  

  const menuItems = [
   
    { key: "uploadProject", label: "📂 Post" },
    { key: "bookguide", label: "🧑‍✈️ Guide Booking" },
    { key: "instantMessager", label: "💬 Messenger" }


  ];

  // Live Location Sharing
  

  return (
    <div className="min-h-screen flex bg-[#F5F2EB] text-[#2E1B0F]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2E1B0F] text-[#F5F2EB] flex flex-col shadow-xl">
        <div className="p-5 border-b border-[#5C4330]">
          <h1 className="text-xl font-bold tracking-wide">User Dashboard</h1>
          
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeSection === item.key
                  ? "bg-[#C58F48] text-[#2E1B0F]"
                  : "hover:bg-[#5C4330]"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-yellow-600 transition-colors font-medium mt-4"
          >
            Logout
          </button>

          <button onClick={() => window.location.href = "/"} className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-yellow-600 transition-colors font-medium mt-4">
            Home
          </button>
          
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#FDF7EC] overflow-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Header */}
          

          {/* Card Wrapper – logic inside is EXACTLY same as your original */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#E2D7C5] p-4 md:p-5">
            {activeSection === "uploadProject" && <Uploadingproject />}
            {activeSection === "addImage" && <AddImageSection />}
            {activeSection === "addVideo" && <AddVideoSection />}
            {activeSection === "file" && <FileUploadSection />}
            {activeSection === "projects" && <ProjectsSection />}
            {activeSection === "instantMessager" && <InstantMessages />}
            {activeSection === "home" && <DashboardHome />}
            {activeSection === "bookguide" && <GuideBooking />}

           
            
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

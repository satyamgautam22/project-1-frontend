import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import ProjectsSection from "../pages/Project.jsx";
import AddImageSection from "../component/Image.jsx";
import AddVideoSection from "../component/Video.jsx";
import FileUploadSection from "../component/File.jsx";
import Uploadingproject from "../component/Uploadingproject.jsx";
import Soket from "../Soket.jsx";
import InstantMessages from "./InstantMessages.jsx";
import GuideBooking from "./GuideBooking.jsx";

const Dashboard = () => {
  // pick a valid default tab:
  const [activeSection, setActiveSection] = useState("file");
  const [loggedOut, setLoggedOut] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // 🔒 block entry if no token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token || loggedOut) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    // clear auth on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedOut(true);
  };

  const menuItems = [
    { key: "file", label: "📂 Upload Files" },
    { key: "addImage", label: "🖼 Upload Image" },
    { key: "addVideo", label: "🎥 Upload Video" },
    { key: "uploadProject", label: "📂 Upload Project" },
    { key: "liveLocation", label: "📍 Live Location" },
    { key: "instantMessager", label: "💬 Instant Messager" },
    { key: "bookguide", label: "🧑‍✈️ Guide Booking" },
  ];

  // Live Location Sharing
  const startSharing = async () => {
    const res = await fetch("http://localhost:5000/api/live-location/share", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // include token if backend protects it
    });
    const data = await res.json();
    setShareLink(data.shareUrl);

    const shareId = data.shareUrl.split("/").pop();
    Soket.emit("start-sharing", { shareId });

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((pos) => {
        Soket.emit("send-location", {
          shareId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      alert("❌ Geolocation not supported in your browser");
    }
  };

  const stopSharing = () => {
    if (!shareLink) return;
    const shareId = shareLink.split("/").pop();
    Soket.emit("stop-sharing", { shareId });
    setShareLink("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-5 text-2xl font-bold border-b border-gray-700">My Dashboard</div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === item.key ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {activeSection === "uploadProject" && <Uploadingproject />}
        {activeSection === "addImage" && <AddImageSection />}
        {activeSection === "addVideo" && <AddVideoSection />}
        {activeSection === "file" && <FileUploadSection />}
        {activeSection === "projects" && <ProjectsSection />}
        {activeSection === "instantMessager" && <InstantMessages />}
        {activeSection === "bookguide" && <GuideBooking />}

        {activeSection === "liveLocation" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Live Location Sharing</h2>

            {!shareLink ? (
              <button onClick={startSharing} className="bg-blue-600 text-white px-4 py-2 rounded">
                Start Sharing Live Location
              </button>
            ) : (
              <div className="space-y-4">
                <p>
                  Share this link:{" "}
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {shareLink}
                  </a>
                </p>
                <button onClick={stopSharing} className="bg-red-600 text-white px-4 py-2 rounded">
                  Stop Sharing
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

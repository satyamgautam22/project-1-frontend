import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import About from "./component/About.jsx"
import Projects from "./pages/Project.jsx";
import Dashboard from "./pages/Dasboard.jsx";

import LiveLocationViewer from "./component/Viewer.jsx"
import ProjectDetails from "./pages/Project.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import GuideRegisteration from "./pages/GuideRegisteration.jsx";
import Guidelogin from "./pages/Guidelogin.jsx";
import GuideBooking from "./pages/GuideBooking.jsx";
import Success from "./pages/Payementpass.jsx";
import Cancel from "./pages/Fail.jsx";
import Toaster from "react-hot-toast";



const App = () => {
  return (
    <>
     
    
   
      <Router>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live/:shareId" element={<LiveLocationViewer />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/guide" element={<GuideRegisteration />} />
          <Route path="/logingguide" element={<Guidelogin />} />
          <Route path="/bookguide" element={<GuideBooking />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
      

        </Routes>
      </Router>


    </>
  );
};

export default App;

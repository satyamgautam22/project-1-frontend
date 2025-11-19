import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../component/Navbar.jsx";
import Hero from "../component/Hero.jsx";
import { Link } from "react-router-dom";


axios.defaults.baseURL = "http://localhost:5000/api";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
 

  return (
    <>
      <Navbar />
      <Hero />

      {/* SERVICES SECTION */}
      <motion.section
  className="py-16 bg-gray-100"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
  transition={{ duration: 0.6 }}
>
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-8">Explore</h2>
    <div className="grid gap-8 md:grid-cols-3">
      {/* Handicraft */}
      <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Handicraft</h3>
        <p className="text-gray-600">
          Discover unique handmade art and crafts from local artisans.
        </p>
      </div>

      {/* Places */}
      
      <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
       <h3 className="text-xl font-semibold mb-2">Places</h3>
        <p className="text-gray-600">
          Explore heritage sites, cultural landmarks, and must-visit destinations.
        </p>
      </div>
     
      

      {/* Documents */}
      <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">Documents</h3>
        <p className="text-gray-600">
          Access and share important cultural and historical documents.
        </p>
      </div>
    </div>
  </div>
</motion.section>


     
      

    </>
  );
};

export default Home;

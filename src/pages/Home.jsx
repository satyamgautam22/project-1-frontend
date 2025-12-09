import React from "react";
import Navbar from "../component/Navbar.jsx";
import dance from "../assets/dance.jpg";
import GallerySection from "../component/GallerySection.jsx";

const Home = () => {
  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2E1B0F]">
      {/* Navbar stays as it is */}
      <Navbar />

      {/* Hero Banner */}
      <section
        className="relative w-full h-[520px] md:h-[650px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${dance})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />

        {/* Hero Text */}
        <div className="relative h-full flex items-center">
          <div className="w-full flex justify-start md:justify-end px-6 md:px-16">
            <div className="max-w-xl text-right space-y-2 md:space-y-3">
             

              <h1 className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg leading-tight">
                Explore
              </h1>
              <h1 className="text-3xl md:text-5xl font-bold text-red-300 drop-shadow-lg leading-tight">
                The Rich Culture
              </h1>
              <h1 className="text-3xl md:text-5xl font-bold text-green-300 drop-shadow-lg leading-tight">
                Of India
              </h1>


             
            </div>
          </div>
        </div>
      </section>

      {/* About / Intro Section */}
      <section
        id="about"
        className="w-full flex items-center justify-center px-4 py-12 md:py-16"
      >
        <div className="max-w-4xl w-full bg-[#FDF7EC] border border-[#E2D7C5] rounded-2xl shadow-sm px-6 py-8 md:px-10 md:py-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#3A2417] text-center">
            India&apos;s Heritage in One Place
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#5C4330] leading-relaxed text-center">
            This platform brings together monuments, traditions, languages,
            festivals, food, crafts, and stories that define India&apos;s
            identity. Explore curated posts, visual galleries, and cultural
            insights contributed by travelers, students, and heritage
            enthusiasts.
          </p>
        </div>
      </section>

      {/* Gallery / Explore Section */}
      <section id="gallery" className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
         

          {/* Existing gallery component – logic unchanged */}
          <GallerySection />
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";

const GallerySection = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`
        );

        console.log("GALLERY RESPONSE:", res.data);

        
        if (Array.isArray(res.data.projects)) {
          setPhotos(res.data.projects);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error("Error loading gallery:", err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const safePhotos = Array.isArray(photos) ? photos : [];

  return (
    <section className="w-full bg-[#F5F2EB] py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2417]">
          Community Heritage Gallery
        </h2>
        <p className="mt-1 text-sm md:text-base text-[#5C4330]">
          Photos shared by our explorers with love, culture and stories.
        </p>

      
        {loading && (
          <div className="text-center py-10 text-[#7A5A44] italic">
            Loading gallery...
          </div>
        )}

        
        {!loading && safePhotos.length === 0 && (
          <div className="text-center text-[#7A5A44] text-sm italic bg-[#FFF9F0] border border-[#E0D4C2] rounded-lg py-10 mt-6">
            No photos uploaded yet. Be the first to share your heritage story!
          </div>
        )}

       
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {safePhotos.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E0D4C2] hover:shadow-md transition"
            >
             
              <div className="h-56 overflow-hidden">
                <img
                  src={item.imageUrl} 
                  alt={item.title || item.location || "Heritage image"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              
              <div className="p-4 space-y-1">
                {/* Name – for now, fallback to title or 'Explorer' */}
                <p className="text-sm text-[#5C4330]">
                  <span className="font-semibold">Uploaded by:</span>{" "}
                  {item.uploaderName|| "Heritage Explorer"}
                </p>

                {/* Title */}
                <p className="text-sm text-[#5C4330]">
                  <span className="font-semibold">Title:</span>{" "}
                  {item.title || "Untitled"}
                </p>

                {/* Location – you can add this field in schema later */}
                <p className="text-sm text-[#5C4330]">
                  <span className="font-semibold">Location:</span>{" "}
                  {item.location || "Unknown"}
                </p>

                {/* Date from createdAt (timestamps) */}
                <p className="text-xs text-[#8B715B] mt-1">
                  {item.createdAt &&
                    new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

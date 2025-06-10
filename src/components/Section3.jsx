import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import BookCard from "./BookCard";
import { Sparkles, Loader } from "lucide-react";

export default function Section3() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ebook-nvc-3.onrender.com/api/v1/products?page=1&limit=5"
        );
        setNewArrivals(res.data.product);
        setError(null);
      } catch (err) {
        console.error("🔥 Lỗi khi tải New Arrivals:", err);
        setError("Không thể tải New Arrivals. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <section className="py-20 bg-white" id="new-arrivals">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              New Arrivals
            </h2>
            <Sparkles className="text-yellow-500" size={24} />
          </div>
          <a 
            href="/Viewcate" 
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
          >
            Xem tất cả
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-indigo-600">
            <Loader className="animate-spin mr-2" size={24} />
            <span>Đang tải New Arrivals...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : (
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-70 z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-50 rounded-full opacity-50 z-0"></div>
            
            {/* Swiper */}
            <div className="relative z-10">
              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{ 
                  640: { slidesPerView: 2 }, 
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                navigation
                modules={[Navigation, Autoplay]}
                className="pb-8"
              >
                {newArrivals.map((book) => (
                  <SwiperSlide key={book.id}>
                    <div className="h-full">
                      <div className="relative">
                        <span className="absolute top-4 left-4 z-10 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                          New
                        </span>
                        <BookCard book={book} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
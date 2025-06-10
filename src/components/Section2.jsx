import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import BookCard from "./BookCard";
import { Flame, Loader } from "lucide-react";

export default function Section2() {
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ebook-nvc-3.onrender.com/api/v1/products?page=0&limit=5"
        );
        setFlashDeals(res.data.product);
        setError(null);
      } catch (err) {
        console.error("🔥 Lỗi khi tải Flash Deals:", err);
        setError("Không thể tải Flash Deals. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashDeals();
  }, []);

  return (
    <section className="py-28 bg-gray-50" id="flash-deals">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Flash Deals
            </h2>
            <Flame className="text-orange-500" size={24} />
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
            <span>Đang tải Flash Deals...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : (
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 
              640: { slidesPerView: 2 }, 
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            modules={[Navigation, Autoplay, EffectCoverflow]}
            className="pb-8"
          >
            {flashDeals.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="h-full">
                  <div className="relative">
                    <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                      -30%
                    </span>
                    <BookCard book={book} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
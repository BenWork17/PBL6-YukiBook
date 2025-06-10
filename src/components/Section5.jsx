import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookCard from "./BookCard";
import { Rocket, Loader } from "lucide-react";

export default function Section5() {
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ebook-nvc-3.onrender.com/api/v1/products?page=3&limit=5"
        );
        setHotDeals(res.data.product);
        setError(null);
      } catch (err) {
        console.error("🔥 Lỗi khi tải Hot Deals:", err);
        setError("Không thể tải Hot Deals. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotDeals();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="hot-deals">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Hot Deals
            </h2>
            <Rocket className="text-red-500" size={24} />
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
            <span>Đang tải Hot Deals...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-orange-50 to-indigo-50 p-6 rounded-2xl mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                    Ưu đãi đặc biệt tháng này
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Giảm giá lên đến 50% cho các đầu sách bestseller. Áp dụng từ 01/06 - 30/06/2025.
                  </p>
                  <a 
                    href="#deals" 
                    className="inline-block bg-indigo-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Xem ưu đãi
                  </a>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Books collection" 
                    className="rounded-xl h-64 w-full object-cover"
                  />
                </div>
              </div>
            </div>
        
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 
                640: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Autoplay, Pagination]}
              className="pb-12"
            >
              {hotDeals.map((book) => (
                <SwiperSlide key={book.id}>
                  <div className="h-full">
                    <div className="relative">
                      <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md animate-pulse">
                        Hot
                      </span>
                      <BookCard book={book} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
}
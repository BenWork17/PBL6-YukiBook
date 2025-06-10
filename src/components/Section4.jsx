import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import { Clock, Loader } from "lucide-react";

export default function Section4() {
  const [dealOfTheWeek, setDealOfTheWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDealOfWeek = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://ebook-nvc-3.onrender.com/api/v1/products?page=2&limit=5"
        );
        setDealOfTheWeek(res.data.product);
        setError(null);
      } catch (err) {
        console.error("🔥 Lỗi khi tải Deal of the Week:", err);
        setError("Không thể tải Deal of the Week. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchDealOfWeek();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="deal-of-week">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Deal of the Week
            </h2>
            <Clock className="text-yellow-500" size={24} />
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
            <span>Đang tải Deal of the Week...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : (
          <>
            {/* Featured Deal */}
            <div className="bg-gradient-to-r from-yellow-50 to-indigo-50 p-6 rounded-2xl mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                    Ưu đãi đặc biệt tuần này
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Giảm giá lên đến 40% cho các đầu sách bestseller. Chỉ áp dụng trong tuần này.
                  </p>
                  <div className="flex gap-4">
                    <a 
                      href="#deals" 
                      className="inline-block bg-indigo-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Xem ưu đãi
                    </a>
                    <a 
                      href="#learn-more" 
                      className="inline-block bg-white text-indigo-600 rounded-lg px-5 py-2.5 font-medium hover:bg-indigo-50 transition-colors"
                    >
                      Tìm hiểu thêm
                    </a>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Deal of the Week" 
                    className="rounded-xl h-64 w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Deal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealOfTheWeek.map((book) => (
                <div key={book.id} className="relative">
                  <span className="absolute top-4 left-4 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                    -40%
                  </span>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
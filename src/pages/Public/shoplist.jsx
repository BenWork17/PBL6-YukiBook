import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ShopList() {
  const { user, isAuthLoading } = useAuth();
  // Lấy token từ user object (AuthContext thường lưu trong user)
  const token = user?.token || user?.accessToken;

  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 20;

  useEffect(() => {
    console.log("🛒 ShopList useEffect:", { page, token, isAuthLoading, user });

    const loadShops = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://ebook-nvc-3.onrender.com/api/v1/shops", {
          params: { page, limit },
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        console.log("🚀 Fetched shops:", res.data);
        setShops(res.data);
      } catch (err) {
        console.error("🔥 Error loading shops:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      // nếu không có token, vẫn thử fetch (nếu API công khai)
      loadShops();
    }
  }, [page, token, isAuthLoading, user]);

  if (isAuthLoading) {
    return <div className="p-8 text-gray-500">Đang xác thực người dùng…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8 lg:px-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Shops</h1>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="text-lg text-gray-600">Loading shops...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800">{shop.name}</h2>
                <p className="text-gray-600 mt-2">{shop.description}</p>
                <Link
                  to={`/shops/${shop.id}`}
                  className="mt-4 inline-block text-primary hover:underline font-medium"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => page > 0 && setPage((p) => p - 1)}
              disabled={page === 0}
              className="bg-primary text-white py-2 px-4 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center text-gray-700">
              Page {page + 1}
            </span>
            <button
              onClick={() => shops.length === limit && setPage((p) => p + 1)}
              disabled={shops.length < limit}
              className="bg-primary text-white py-2 px-4 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import OwnerSidebar from "../../components/OwnerSidebar";

const formatDateTime = (arr) => {
  if (!Array.isArray(arr) || arr.length < 3) return "Không rõ";
  const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
  const date = new Date(year, month - 1, day, hour, minute, second);
  return isNaN(date.getTime())
    ? "Không rõ"
    : date.toLocaleString("vi-VN", { hour12: false });
};

export default function ShopInfo() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const shopId = 1; // Có thể lấy từ userContext nếu cần

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("bookstore-user"))?.token;

        const res = await axios.get(`https://ebook-nvc-3.onrender.com/api/v1/shops/${shopId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShop(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin cửa hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  if (loading) return <div className="p-8">Đang tải thông tin cửa hàng...</div>;

  if (!shop) return <div className="p-8 text-red-600">Không tìm thấy cửa hàng.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />

      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-primary text-center">Thông tin cửa hàng</h1>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Tên cửa hàng</label>
              <p className="text-lg font-semibold text-gray-800">{shop.name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Mô tả</label>
              <p className="text-gray-700">{shop.description || "Không có mô tả."}</p>
            </div>

            <div className="flex gap-6">
              <div>
                <label className="text-sm text-gray-600">Ngày tạo</label>
                <p className="text-gray-700">{formatDateTime(shop.created_at)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Ngày cập nhật</label>
                <p className="text-gray-700">{formatDateTime(shop.updated_at)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Trạng thái</label>
              <p className={`font-medium ${shop.is_active ? "text-green-600" : "text-red-500"}`}>
                {shop.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
              ✏️ Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
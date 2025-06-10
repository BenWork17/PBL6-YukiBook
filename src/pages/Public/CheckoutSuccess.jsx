import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function CheckoutSuccess() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận orderId và orderData từ state
  const { orderId, orderData, purchasedBooks } = location.state || {};

  useEffect(() => {
    if (isAuthLoading) return;
    if (!orderId || !orderData) {
      console.error("Thiếu orderId hoặc orderData để cập nhật status");
      return;
    }

    const updateOrderStatus = async () => {
      try {
        await axios.put(
          `https://ebook-nvc-3.onrender.com/api/v1/orders/${orderId}`,
          { ...orderData, status: "paid" },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } catch (err) {
        console.error("🔥 Lỗi khi cập nhật status order:", err);
      }
    };

    updateOrderStatus();
  }, [isAuthLoading, user, orderId, orderData]);

  // Nếu thiếu dữ liệu, redirect về trang chủ
  useEffect(() => {
    if (!isAuthLoading && !orderId) {
      navigate("/");
    }
  }, [isAuthLoading, orderId, navigate]);

  if (isAuthLoading || !orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang xử lý đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h2 className="text-3xl font-bold text-primary mb-6">🎉 Thanh toán thành công!</h2>
      <p className="text-gray-600 mb-10">
        Cảm ơn bạn đã mua sách. Bạn có thể tải xuống các eBook ngay bây giờ:
      </p>

      <div className="flex flex-col gap-4">
        {purchasedBooks?.map((book) => (
          <div
            key={book.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <a href={book.fileUrl} download className="btn-primary px-6 py-2 rounded-full text-sm">
              Tải xuống
            </a>
          </div>
        ))}
      </div>

      <a href="/" className="inline-block mt-10 text-primary hover:underline">
        ⬅️ Quay về trang chủ
      </a>
    </div>
  );
}

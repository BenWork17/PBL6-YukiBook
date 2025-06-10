import React, { useEffect, useState } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function Orders() {
  const { user, isAuthLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (isAuthLoading || !user?.user_id) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://ebook-nvc-3.onrender.com/api/v1/orders/user/${user.user_id}`,
          getAuthHeader()
        );
        setOrders(res.data);
      } catch (err) {
        console.error("🔥 Lỗi khi tải đơn hàng:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthLoading]);

  if (isAuthLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải đơn hàng…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">Không lấy được đơn hàng. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CustomerSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg bg-white p-6 shadow hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Mã đơn hàng */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-semibold">{order.id}</p>
                  </div>

                  {/* Shop đặt hàng */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Người đặt hàng</p>
                    <p className="font-medium">{order.fullname}</p>
                  </div>

                  {/* Tình trạng */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Tình trạng</p>
                    <p
                      className={`font-semibold ${
                        order.status === "Đã giao" || order.status === "delivered"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>

                  {/* Tổng tiền & PT thanh toán */}
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-500">Tổng cộng</p>
                    <p className="font-bold text-primary">
                      {order.total_money.toLocaleString()}₫
                    </p>
                    <p className="text-xs text-gray-400">
                      PT thanh toán: {order.payment_method.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

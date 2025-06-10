import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy giỏ hàng từ localStorage
  const loadCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };

  // Lưu giỏ hàng vào localStorage
  const saveCart = (rawCart) => {
    localStorage.setItem("cart", JSON.stringify(rawCart));
  };

  // Fetch chi tiết các item trong giỏ
  const fetchCartItems = async () => {
    const rawCart = loadCart();
    const detailed = [];

    for (const { bookId, quantity } of rawCart) {
      try {
        const bookRes = await axios.get(
          `https://ebook-nvc-3.onrender.com/api/v1/products/${bookId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const book = bookRes.data;

        const shopRes = await axios.get(
          `https://ebook-nvc-3.onrender.com/api/v1/shops/${book.shop_id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const shop = shopRes.data;

        detailed.push({ bookId, quantity, book, shop });
      } catch (err) {
        console.error(`Lỗi fetch cart item ${bookId}:`, err);
      }
    }

    setCartItems(detailed);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthLoading) fetchCartItems();
  }, [isAuthLoading, user]);

  // Tính tổng tiền
  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + (item.book.price || 0) * item.quantity, 0);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (bookId, newQty) => {
    const rawCart = loadCart();
    const updatedCart = rawCart.map((it) =>
      it.bookId === bookId ? { ...it, quantity: Number(newQty) } : it
    );
    saveCart(updatedCart);
    setCartItems((prev) =>
      prev.map((it) =>
        it.bookId === bookId ? { ...it, quantity: Number(newQty) } : it
      )
    );
  };

  // Xử lý xóa item
  const handleRemove = (bookId) => {
    const rawCart = loadCart();
    const updatedCart = rawCart.filter((it) => it.bookId !== bookId);
    saveCart(updatedCart);
    setCartItems((prev) => prev.filter((it) => it.bookId !== bookId));
  };

  // Thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm.");
      return;
    }

    const totalAmount = getTotal();
    navigate("/checkout", { state: { totalAmount } });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-20">
      <h2 className="text-2xl font-bold mb-6">🛒 Giỏ hàng của bạn</h2>

      {/* Hiển thị các sản phẩm */}
      <div className="flex flex-col gap-6">
        {cartItems.map((item) => (
          <div
            key={item.bookId}
            className="flex gap-4 bg-white p-4 rounded-lg shadow items-center"
          >
            <img
              src={
                item.book.thumbnail ||
                "https://via.placeholder.com/80x112?text=No+Image"
              }
              alt={item.book.name}
              className="w-20 h-28 rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.book.name}</h3>
              <p className="text-gray-500 text-sm">{item.shop.name}</p>
              <div className="mt-2 flex items-center space-x-2">
                <label className="text-sm">Số lượng:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.bookId, e.target.value)}
                  className="w-16 border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
            <div className="text-primary font-bold">
              {(item.book.price * item.quantity).toLocaleString()}₫
            </div>
            <button
              onClick={() => handleRemove(item.bookId)}
              className="ml-4 text-red-500 hover:underline text-sm"
            >
              Xóa
            </button>
          </div>
        ))}
        {cartItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Giỏ hàng của bạn đang trống.
          </div>
        )}
      </div>

      {/* Tổng tiền và nút thanh toán */}
      <div className="flex justify-between items-center mt-10">
        <div className="text-xl font-bold">
          Tổng cộng: <span className="text-primary">{getTotal().toLocaleString()}₫</span>
        </div>
        <button
          onClick={handleCheckout}
          className="btn-primary px-6 py-2 rounded-full bg-green-500 hover:bg-green-600"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}

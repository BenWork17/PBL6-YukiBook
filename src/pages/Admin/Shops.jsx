import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function Shops() {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  // Filter state
  const [filterName, setFilterName] = useState("");
  const [filterUser, setFilterUser] = useState("");      // user_id
  const [filterActive, setFilterActive] = useState("");  // "" | "true" | "false"

  // Modal state for adding shop
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShop, setNewShop] = useState({
    name: "",
    description: "",
    user_id: "",
    is_active: true,
  });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${user?.accessToken || user?.token}` },
  });

  // Fetch shops từ API
  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ebook-nvc-3.onrender.com/api/v1/shops?page=${page}&limit=${limit}`,
        getAuthHeader()
      );
      setShops(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [page]);

  // CRUD handlers (add/edit/delete) giữ nguyên giống cũ...
  const handleAddShop = async (shopData) => {
    try {
      await axios.post(
        "https://ebook-nvc-3.onrender.com/api/v1/shops",
        shopData,
        getAuthHeader()
      );
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditShop = async (id, updatedData) => {
    try {
      await axios.put(
        `https://ebook-nvc-3.onrender.com/api/v1/shops/${id}`,
        updatedData,
        getAuthHeader()
      );
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteShop = async (id) => {
    try {
      await axios.delete(
        `https://ebook-nvc-3.onrender.com/api/v1/shops/${id}`,
        getAuthHeader()
      );
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  // Áp dụng filter trước khi render
  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterUser === "" || String(s.user_id) === filterUser) &&
    (filterActive === "" || String(s.is_active) === filterActive)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header và nút Thêm */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý cửa hàng</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Thêm mới
          </button>
        </div>

        {/* FILTER PANEL */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên cửa hàng..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <input
            type="number"
            placeholder="User ID..."
            value={filterUser}
            onChange={e => setFilterUser(e.target.value)}
            className="border rounded px-3 py-1 w-32"
          />
          <select
            value={filterActive}
            onChange={e => setFilterActive(e.target.value)}
            className="border rounded px-3 py-1 w-40"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Add Shop Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4">Thêm cửa hàng mới</h2>
              <div className="space-y-3">
                {[
                  { label: "Tên cửa hàng", key: "name", type: "text" },
                  { label: "Mô tả", key: "description", type: "text" },
                  { label: "User ID", key: "user_id", type: "number" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type={type}
                      value={newShop[key]}
                      onChange={e =>
                        setNewShop({ ...newShop, [key]: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-2 py-1"
                    />
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newShop.is_active}
                    onChange={e =>
                      setNewShop({ ...newShop, is_active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewShop({ name: "", description: "", user_id: "", is_active: true });
                  }}
                  className="px-4 py-2 rounded border"
                >Hủy</button>
                <button
                  onClick={() => {
                    handleAddShop(newShop);
                    setShowAddModal(false);
                    setNewShop({ name: "", description: "", user_id: "", is_active: true });
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >Lưu</button>
              </div>
            </div>
          </div>
        )}

        {/* Bảng Shops */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mô tả</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredShops.map(shop => (
                <tr key={shop.id} className="border-t">
                  <td className="px-4 py-3">{shop.name}</td>
                  <td className="px-4 py-3">{shop.description}</td>
                  <td className="px-4 py-3">{shop.user_id}</td>
                  <td className="px-4 py-3">
                    {shop.is_active ? (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {/* mở modal edit ở đây */}}
                      className="text-blue-600 hover:underline text-sm mr-2"
                    >Sửa</button>
                    <button
                      onClick={() => handleDeleteShop(shop.id)}
                      className="text-red-500 hover:underline text-sm"
                    >Xóa</button>
                  </td>
                </tr>
              ))}
              {filteredShops.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Không có cửa hàng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            className="px-3 py-1 rounded border"
          >Previous</button>
          <span className="px-3 py-1">Page {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded border"
          >Next</button>
        </div>
      </main>
    </div>
  );
}

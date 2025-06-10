// Categories.jsx - Quản lý danh mục sản phẩm
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 30;

  // Filter state
  const [filterName, setFilterName] = useState("");

  // Modal state cho Thêm / Sửa
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentCat, setCurrentCat] = useState({ id: null, name: "" });

  const authHeader = {
    headers: { Authorization: `Bearer ${user?.accessToken || user?.token}` },
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ebook-nvc-3.onrender.com/api/v1/categories?page=${page}&limit=${limit}`,
        authHeader
      );
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  // CRUD handlers
  const handleSave = async () => {
    try {
      if (isEdit) {
        await axios.put(
          `https://ebook-nvc-3.onrender.com/api/v1/categories/${currentCat.id}`,
          { name: currentCat.name },
          authHeader
        );
      } else {
        await axios.post(
          `https://ebook-nvc-3.onrender.com/api/v1/categories`,
          { name: currentCat.name },
          authHeader
        );
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(
        `https://ebook-nvc-3.onrender.com/api/v1/categories/${id}`,
        authHeader
      );
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  // Áp dụng filter trước khi render
  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header & Thêm mới */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
          <button
            onClick={() => {
              setIsEdit(false);
              setCurrentCat({ id: null, name: "" });
              setShowModal(true);
            }}
            className="inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Thêm danh mục
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên danh mục..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            className="w-full max-w-sm border rounded px-3 py-1"
          />
        </div>

        {/* Modal Thêm/Sửa */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-80 p-6">
              <h2 className="text-lg font-semibold mb-4">
                {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                <input
                  type="text"
                  value={currentCat.name}
                  onChange={e =>
                    setCurrentCat({ ...currentCat, name: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bảng Categories */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tên danh mục</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filtered.map(cat => (
                <tr key={cat.id} className="border-t">
                  <td className="px-4 py-3">{cat.id}</td>
                  <td className="px-4 py-3">{cat.name}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setIsEdit(true);
                        setCurrentCat(cat);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    Không có danh mục phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded border"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </main>
    </div>
);
}

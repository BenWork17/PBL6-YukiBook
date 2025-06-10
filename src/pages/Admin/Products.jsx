import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const limit = 30;  // Số sản phẩm mỗi trang

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${user?.accessToken || user?.token}` },
  });

  // Fetch products từ API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ebook-nvc-3.onrender.com/api/v1/products?page=${page}&limit=${limit}`,
        getAuthHeader()
      );
      // API trả về { product: [...], totalPage: N }
      setProducts(res.data.product);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // CRUD handlers (thêm / sửa / xoá) – có thể tuỳ chỉnh thêm tương tự Shops.jsx
  const handleAddProduct = async (productData) => {
    try {
      await axios.post(
        "https://ebook-nvc-3.onrender.com/api/v1/products",
        productData,
        getAuthHeader()
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = async (id, updatedData) => {
    try {
      await axios.put(
        `https://ebook-nvc-3.onrender.com/api/v1/products/${id}`,
        updatedData,
        getAuthHeader()
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `https://ebook-nvc-3.onrender.com/api/v1/products/${id}`,
        getAuthHeader()
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header và nút Thêm */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <button
            type="button"
            onClick={() => {/* mở modal thêm sản phẩm */}}
            className="inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Thêm sản phẩm
          </button>
        </div>

        {/* Bảng Products */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mã danh mục</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Mã cửa hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tải được</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {products.map((prod) => (
                <tr key={prod.id} className="border-t">
                  <td className="px-4 py-3">{prod.name}</td>
                  <td className="px-4 py-3">{prod.price.toLocaleString()}₫</td>
                  <td className="px-4 py-3">{prod.category_id}</td>
                  <td className="px-4 py-3">{prod.shop_id}</td>
                  <td className="px-4 py-3">
                    {prod.is_downloadable ? (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Yes</span>
                    ) : (
                      <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEditProduct(prod.id, {/* updatedData */})}
                      className="text-blue-600 hover:underline text-sm mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Không có sản phẩm
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
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-3 py-1 rounded border"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </main>
    </div>
);
}

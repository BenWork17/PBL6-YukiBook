import React, { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import OwnerSidebar from "../../components/OwnerSidebar";
import { useAuth } from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";
import ProductSection from "../../components/owner/ProductSection";
import EditProductModal from "../../components/owner/EditProductModal";
import AddProductModal from "../../components/owner/AddProductModal";

export default function Products() {
  const { user, isAuthLoading } = useAuth();
  const {
    products,
    loading,
    error,
    deleteProduct,
    fetchProducts,
    updateProduct,
    createProduct,
  } = useProducts();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adding, setAdding] = useState(false);

  // Load danh mục
  useEffect(() => {
    axios
      .get("https://ebook-nvc-3.onrender.com/api/v1/categories?page=1&limit=10")
      .then(({ data }) => setCategories(data))
      .catch(console.error);
  }, []);

  if (loading || isAuthLoading)
    return <div className="p-8 text-gray-500">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-8 text-red-500">Lỗi: {error.message}</div>;

  const getByCat = (cid) => products.filter((p) => p.category_id === cid);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar với fixed position, bắt đầu từ dưới header */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40 overflow-hidden">
        <OwnerSidebar />
      </div>
      
      {/* Main content với margin-left và margin-top để tránh sidebar và header */}
      <main className="flex-1 ml-64 mt-16 min-h-screen">
        <div className="p-8 space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Sản phẩm của tôi</h1>
            <button
              onClick={() => setAdding(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              + Thêm sản phẩm
            </button>
          </div>

          {/* Các section theo danh mục */}
          {categories.map((cat) => (
            <ProductSection
              key={cat.id}
              category={cat}
              products={getByCat(cat.id)}
              onEdit={(p) => setEditingProduct(p)}
              onDelete={async (id) => {
                if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
                await deleteProduct(id);
                // state products đã auto cập nhật qua hook deleteProduct
              }}
            />
          ))}
        </div>
      </main>

      {/* Modal Sửa */}
      {editingProduct &&
        createPortal(
          <EditProductModal
            product={editingProduct}
            categories={categories}
            onClose={() => setEditingProduct(null)}
            onSaved={(updates) => {
              updateProduct(editingProduct.id, updates);
              setEditingProduct(null);
            }}
            className="z-50" // Thêm z-index để đảm bảo modal hiển thị trên cùng
          />,
          document.body
        )}

      {/* Modal Thêm */}
      {adding &&
        createPortal(
          <AddProductModal
            shopId={user.user_id} // hoặc shop.id nếu bạn fetch trước
            categories={categories}
            onClose={() => setAdding(false)}
            onAdded={async (newProd) => {
              try {
                await createProduct(newProd);
                await fetchProducts();
              } catch (err) {
                console.error("Lỗi khi thêm sản phẩm:", err);
              } finally {
                setAdding(false);
              }
            }}
            className="z-50" // Thêm z-index để đảm bảo modal hiển thị trên cùng
          />,
          document.body
        )}
    </div>
  );
}
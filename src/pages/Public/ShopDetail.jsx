"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth" // Updated import path

export default function ShopDetail() {
  const { id } = useParams()
  const { user, isAuthLoading } = useAuth()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` }
        // Lấy info shop
        const shopRes = await axios.get(`https://ebook-nvc-3.onrender.com/api/v1/shops/${id}`, { headers })
        setShop(shopRes.data)

        // Lấy products của shop dưới dạng mảng
        const prodRes = await axios.get(`https://ebook-nvc-3.onrender.com/api/v1/products/shop/${id}`, { headers })
        const prods = prodRes.data || []
        setProducts(prods)

        // Lấy categories để lọc
        const catRes = await axios.get(`https://ebook-nvc-3.onrender.com/api/v1/categories?page=1&limit=100`, { headers })
        const allCats = catRes.data || []
        const usedCats = allCats.filter((c) => prods.some((p) => p.category_id === c.id))
        setCategories(usedCats)
      } catch (err) {
        console.error("🔥 Lỗi khi tải dữ liệu shop:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    if (!isAuthLoading && user) fetchData()
  }, [id, user, isAuthLoading])

  if (loading || isAuthLoading) return <LoadingState />
  if (error) return <ErrorState message={error.message} />
  if (!shop) return <NotFoundState />

  const filtered = selectedCat === null ? products : products.filter((p) => p.category_id === selectedCat)

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Shop header with improved design */}
      <ShopHeader shop={shop} />

      {/* Category filter tabs with improved styling */}
      <CategoryFilters categories={categories} selectedCat={selectedCat} onSelectCategory={setSelectedCat} />

      {/* Products grid with improved card design */}
      <ProductGrid products={filtered} />
    </div>
  )
}

// Rest of the component remains the same
function ShopHeader({ shop }) {
  return (
    <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden shadow-lg">
      <div className="h-40 flex items-center justify-between p-6">
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
          {shop.description && <p className="text-blue-100 max-w-md">{shop.description}</p>}
        </div>
        {shop.logo_url && (
          <div className="h-20 w-20 bg-white rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={shop.logo_url || "/placeholder.svg"}
              alt={`${shop.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryFilters({ categories, selectedCat, onSelectCategory }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Danh mục</h2>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCat === null ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 border hover:bg-gray-50"
          }`}
          onClick={() => onSelectCategory(null)}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedCat === cat.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductGrid({ products }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Sản phẩm</h2>
        <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm nào trong danh mục này</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-white"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={book.file_url || "/placeholder.svg"}
                  alt={book.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium line-clamp-2 h-10 mb-1">{book.name}</div>
                <div className="text-blue-600 font-bold mt-1">{book.price.toLocaleString()}₫</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="p-8 flex justify-center items-center min-h-[300px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Đang tải shop…</p>
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="p-8 text-center">
      <div className="bg-red-50 p-6 rounded-lg inline-block">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800 mb-2">Lỗi</h3>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="p-8 text-center">
      <div className="bg-gray-50 p-6 rounded-lg inline-block">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Shop không tồn tại!</h3>
        <p className="text-gray-600">Shop bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    </div>
  )
}

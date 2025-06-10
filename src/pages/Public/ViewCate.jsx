import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { useLocation } from "react-router-dom";

import Banner from "../../components/viewcate/Banner";
import Loader from "../../components/viewcate/Loader";
import MobileFilters from "../../components/viewcate/MobileFilters";
import FilterSidebar from "../../components/viewcate/FilterSidebar";
import ProductsGrid from "../../components/viewcate/ProductsGrid";
import Pagination from "../../components/viewcate/Pagination";

export default function BooksByCategory() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keywordParam = params.get("keyword");

  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  useEffect(() => {
    if (isAuthLoading || !user?.token) return;
    axios
      .get(
        "https://ebook-nvc-3.onrender.com/api/v1/categories?page=1&limit=30",
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(res => {
        const list = res.data.data ?? res.data;
        setCategories(list);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, [user, isAuthLoading]);

  // Search if keywordParam exists
  useEffect(() => {
    if (isAuthLoading || !user?.token) return;
    if (keywordParam) {
      setLoading(true);
      axios
        .get(
          `https://ebook-nvc-3.onrender.com/api/v1/products/search?keyword=${encodeURIComponent(keywordParam)}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then(res => {
          const payload = res.data.data ?? res.data;
          const prods = Array.isArray(payload) ? payload : [];
          setBooks(prods);
          setTotalPages(1);
          setCurrentPage(0);
          setSelectedCategory(null);
          setCategoryId(null);
        })
        .catch(err => console.error("Error searching products:", err))
        .finally(() => setLoading(false));
    }
  }, [keywordParam, user, isAuthLoading]);

  // Fetch products & filter by category when no keywordParam
  useEffect(() => {
    if (isAuthLoading || !user?.token) return;
    if (keywordParam) return;

    setLoading(true);
    axios
      .get(
        `https://ebook-nvc-3.onrender.com/api/v1/products?page=${currentPage}&limit=30`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(res => {
        const payload = res.data.data ?? res.data;
        let prods = Array.isArray(payload.product)
          ? payload.product
          : payload;

        if (categoryId !== null) {
          const catIdNum = Number(categoryId);
          prods = prods.filter(p => {
            const idsRaw = [
              p.category_id,
              p.categoryId,
              p.category?.id,
              ...(Array.isArray(p.categories)
                ? p.categories.map(c => c.id)
                : [])
            ];
            const ids = idsRaw
              .filter(v => v != null)
              .map(v => Number(v));
            return ids.includes(catIdNum);
          });
        }

        setBooks(prods);
        setTotalPages(payload.totalPage ?? 1);
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [user, isAuthLoading, categoryId, currentPage, keywordParam]);

  // Apply price + sort
  useEffect(() => {
    let res = books.filter(
      b => b.price >= priceRange.min && b.price <= priceRange.max
    );
    if (sortOption === "price-asc")      res.sort((a, b) => a.price - b.price);
    else if (sortOption === "price-desc") res.sort((a, b) => b.price - a.price);
    else if (sortOption === "name-asc")   res.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "name-desc")  res.sort((a, b) => b.name.localeCompare(a.name));
    setFilteredBooks(res);
  }, [books, sortOption, priceRange]);

  // Handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCategoryId(cat?.id != null ? Number(cat.id) : null);
    setCurrentPage(0);
  };
  const handleSortChange  = opt => setSortOption(opt);
  const handlePriceChange = (type, val) =>
    setPriceRange(p => ({ ...p, [type]: parseInt(val) || 0 }));
  const toggleMobileFilters = () => setShowMobileFilters(v => !v);
  const handlePageChange = p => {
    if (p >= 0 && p < totalPages) {
      setCurrentPage(p);
      window.scrollTo(0, 0);
    }
  };
  const resetFilters = () => {
    setSelectedCategory(null);
    setCategoryId(null);
    setPriceRange({ min: 0, max: 1000000 });
    setSortOption("default");
  };

  if (loading && books.length === 0) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Banner
        title={
          keywordParam
            ? `Kết quả tìm kiếm: "${keywordParam}"`
            : selectedCategory?.name || "Tất cả sách"
        }
        count={filteredBooks.length}
      />

      <div className="container mx-auto px-4 pb-12 lg:grid lg:grid-cols-4 lg:gap-8">
        <MobileFilters
          show={showMobileFilters}
          toggle={toggleMobileFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        <div className="col-span-3 mt-6 lg:mt-0">
          <ProductsGrid
            books={filteredBooks}
            loading={loading}
            resetFilters={resetFilters}
          />

          {filteredBooks.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
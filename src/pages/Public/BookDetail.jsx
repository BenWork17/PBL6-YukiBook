import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ShoppingCart, Store, BookOpen, Award, Star, BookOpenText } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner.tsx";
import { ErrorMessage } from "../../components/ui/ErrorMessage.tsx";
import { PriceTag } from "../../components/ui/PriceTag.tsx";
import { AddToCartButton } from "../../components/bookdetail/AddToCartButton";
import { ShopInfo } from "../../components/bookdetail/ShopInfo.tsx";
import { BookImage } from "../../components/bookdetail/BookImage.tsx";
import { BookPreview } from "../../components/bookdetail/BookPreview.tsx";
import { useAuth } from "../../hooks/useAuth";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const [book, setBook] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `https://ebook-nvc-3.onrender.com/api/v1/products/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setBook(res.data);

        const shopRes = await axios.get(
          `https://ebook-nvc-3.onrender.com/api/v1/shops/${res.data.shop_id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setShop(shopRes.data);
      } catch (err) {
        console.error("Error loading book details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (!isAuthLoading && user) {
      fetchDetail();
    }
  }, [id, user, isAuthLoading]);

  const handleAddToCart = () => {
    if (!book) return;
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.bookId === book.id);
    
    if (existing) existing.quantity++;
    else cart.push({ bookId: book.id, quantity: 1 });
    
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  if (loading || isAuthLoading) return <LoadingSpinner />;
  if (!book) return <ErrorMessage message="Book not found!" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-gray-800 transition-colors flex items-center">
          <ChevronLeft size={16} className="mr-1" />
          Back to Books
        </a>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left column - Book image */}
        <div>
          <BookImage 
            imageUrl={book.file_url} 
            altText={book.name} 
          />
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <BookOpenText size={20} />
            <span>Preview First 4 Pages</span>
          </button>
        </div>

        {/* Right column - Book details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
              {book.name}
            </h1>
            <p className="text-lg text-gray-600 mb-2">by {book.author || "Unknown Author"}</p>

            <div className="flex items-center mt-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={`${i < Math.floor(book.ratings || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {book.ratings || "0"} ({book.reviewCount || "0"} reviews)
              </span>
            </div>

            <PriceTag price={book.price} />
          </div>

          {/* Book details */}
          <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b py-4 border-gray-200">
            <div className="flex items-center">
              <BookOpen size={20} className="text-gray-500 mr-2" />
              <span className="text-gray-700">{book.pageCount || "Unknown"} pages</span>
            </div>
            <div className="flex items-center">
              <Award size={20} className="text-gray-500 mr-2" />
              <span className="text-gray-700">Published {book.publishYear || "N/A"}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Store size={20} className="text-gray-500 mr-2" />
              <span className="text-gray-700">Genre: {book.category || "Uncategorized"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>

          {/* Shop information */}
          {shop && <ShopInfo shop={shop} />}

          {/* Add to cart button */}
          <div className="mt-auto pt-6">
            <AddToCartButton onClick={handleAddToCart} />
          </div>
        </div>
      </div>

      <BookPreview 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
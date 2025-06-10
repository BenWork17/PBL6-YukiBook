"use client"

import { useEffect, useState } from "react"
import { ProfileCard } from "../../components/profile/profile-card.tsx"
import { BooksSection } from "../../components/profile/books-section.tsx"
import { ProfileSidebar } from "../../components/profile/profile-sidebar"
import { LoadingSpinner } from "../../components/profile/loading-spinner"

// Mock useAuth hook - replace with your actual implementation
const useAuth = () => {
  return {
    user: {
      user_id: "123",
      token: "mock-token",
    },
    isAuthLoading: false,
  }
}

export default function Profile() {
  const { user, isAuthLoading } = useAuth()
  const [profile, setProfile] = useState({
    fullname: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phoneNumber: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  })
  const [loading, setLoading] = useState(false)
  const [purchasedBooks, setPurchasedBooks] = useState([
    {
      id: 1,
      name: "Giác Ngộ",
      fileUrl: "https://example.com/ebook1.pdf",
      purchaseDate: "15/01/2024",
      size: "2.5 MB",
    },
    {
      id: 2,
      name: "Căn Phòng Của Râu Xanh",
      fileUrl: "https://example.com/ebook2.pdf",
      purchaseDate: "20/02/2024",
      size: "3.2 MB",
    },
    {
      id: 3,
      name: "Chiếc Hộp Pandora",
      fileUrl: "https://example.com/ebook3.pdf",
      purchaseDate: "10/03/2024",
      size: "1.8 MB",
    },
    {
      id: 4,
      name: "Thần Thoại Ai Cập",
      fileUrl: "https://example.com/ebook4.pdf",
      purchaseDate: "25/03/2024",
      size: "4.1 MB",
    },
  ])

  useEffect(() => {
    if (isAuthLoading || !user?.user_id) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        // Replace with your actual API call
        // const res = await fetch(`https://ebook-nvc-3.onrender.com/api/v1/users/${user.user_id}`, {
        //   headers: { Authorization: `Bearer ${user.token}` }
        // })
        // const data = await res.json()
        // setProfile(data)

        // Simulating API call
        setTimeout(() => {
          setLoading(false)
        }, 1500)
      } catch (err) {
        console.error("🔥 Lỗi khi tải hồ sơ:", err)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, isAuthLoading])

  const handleDownload = (book) => {
    // Simulate download with notification
    const link = document.createElement("a")
    link.href = book.fileUrl
    link.download = book.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // You could add a toast notification here
    console.log(`Đang tải xuống: ${book.name}`)
  }

  const handleEditProfile = () => {
    // Handle edit profile action
    console.log("Chỉnh sửa hồ sơ")
  }

  if (isAuthLoading || loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600 text-lg">Quản lý thông tin cá nhân và thư viện sách của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <ProfileCard profile={profile} onEdit={handleEditProfile} />
            <BooksSection books={purchasedBooks} onDownload={handleDownload} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar profile={profile} booksCount={purchasedBooks.length} />
          </div>
        </div>
      </div>
    </div>
  )
}
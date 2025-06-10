"use client"

import { createContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"

// Export the context so it can be imported by the hook
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookstore-user"))
    if (saved) setUser(saved)
    setIsAuthLoading(false)
  }, [])

  const login = async ({ phone_number, password, role_id }) => {
    try {
      const res = await axios.post("https://ebook-nvc-3.onrender.com/api/v1/users/login", {
        phone_number,
        password,
        role_id,
      })

      const { token, role, user_id } = res.data

      const userData = {
        token,
        role_id: role,
        user_id,
      }

      localStorage.setItem("bookstore-user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại"
      alert(message)
      throw new Error(message)
    }
  }

  const register = async (payload) => {
    try {
      const res = await axios.post("https://ebook-nvc-3.onrender.com/api/v1/users/register", payload)
      const user = res.data.user

      await login({
        phone_number: payload.phone_number,
        password: payload.password,
        role_id: payload.role_id,
      })
    } catch (err) {
      const message = err.response?.data?.message || "Đăng ký thất bại"
      alert(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bookstore-user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, logout, register }}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}


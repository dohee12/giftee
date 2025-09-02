"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  email?: string
  name?: string
  photoUrl?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  const readFromStorage = () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
      const profileRaw = typeof window !== "undefined" ? localStorage.getItem("user_profile") : null
      const profile: AuthUser | null = profileRaw ? JSON.parse(profileRaw) : null
      setIsAuthenticated(!!token)
      setUser(profile)
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  useEffect(() => {
    readFromStorage()
    // 테스트용: 토큰이 없으면 도희 계정으로 자동 로그인
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        localStorage.setItem("auth_token", "dev_token")
        localStorage.setItem(
          "user_profile",
          JSON.stringify({ email: "dohee@example.com", name: "도희", photoUrl: "/avatar-placeholder.png" }),
        )
        window.dispatchEvent(new Event("giftee:auth-changed"))
      }
    } catch {}
    const onAuthChanged = () => readFromStorage()
    window.addEventListener("giftee:auth-changed", onAuthChanged)
    return () => window.removeEventListener("giftee:auth-changed", onAuthChanged)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      localStorage.setItem("auth_token", "dev_token")
      localStorage.setItem(
        "user_profile",
        JSON.stringify({ email, name: email.split("@")[0], photoUrl: "/avatar-placeholder.png" }),
      )
      window.dispatchEvent(new Event("giftee:auth-changed"))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_profile")
    setIsAuthenticated(false)
    setUser(null)
    window.dispatchEvent(new Event("giftee:auth-changed"))
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

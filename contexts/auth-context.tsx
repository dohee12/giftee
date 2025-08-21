"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 테스트를 위해 기본값을 true로 설정
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ email: "test@example.com", name: "테스트 사용자" })

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // 실제 로그인 로직은 나중에 구현
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsAuthenticated(true)
      setUser({ email, name: "사용자" })
      localStorage.setItem("auth_token", "test_token")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
      }}
    >
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

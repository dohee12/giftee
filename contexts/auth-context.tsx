"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // localStorage에서 로그인 상태 복원
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLoginState = localStorage.getItem("auth-login-state")
      if (savedLoginState === "true") {
        setIsLoggedIn(true)
      }
    }
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem("auth-login-state", "true")
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.setItem("auth-login-state", "false")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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

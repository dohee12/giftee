"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gift, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // 간단한 유효성 검사
    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.")
      setIsLoading(false)
      return
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      setIsLoading(false)
      return
    }

    // 임시 로그인 처리 (실제로는 백엔드 API 호출)
    setTimeout(() => {
      setIsLoading(false)
      // 성공 시 메인 페이지로 이동
      router.push("/")
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    // 실제로는 소셜 로그인 API 호출
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4">
            <Gift className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">기프티콘 모음북</span>
          </Link>
          <p className="text-gray-600">계정에 로그인하세요</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-2xl">로그인</CardTitle>
            <p className="text-center text-sm text-gray-600">서비스를 이용하려면 로그인이 필요합니다</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10 h-11"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 h-11"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            {/* 소셜 로그인 */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 bg-transparent"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <span className="mr-2 text-lg">🔍</span>
                Google로 로그인
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 bg-yellow-300 hover:bg-yellow-400 text-black border-yellow-300"
                onClick={() => handleSocialLogin("kakao")}
                disabled={isLoading}
              >
                <span className="mr-2 text-lg">💬</span>
                카카오로 로그인
              </Button>
            </div>

            <div className="text-center text-sm space-y-2">
              <div>
                <span className="text-gray-600">계정이 없으신가요? </span>
                <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  회원가입
                </Link>
              </div>
              <div>
                <Link href="/auth/forgot-password" className="text-gray-500 hover:text-gray-700">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/demo" className="text-blue-600 hover:underline text-sm">
            로그인 없이 데모 체험하기
          </Link>
        </div>
      </div>
    </div>
  )
}

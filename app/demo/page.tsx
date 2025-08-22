"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gift, ChevronLeft, Info, ExternalLink, CheckCircle, Bell, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import type { Gifticon } from "@/types/gifticon"
import { useAuth } from "@/contexts/auth-context"

export default function DemoPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)

  // 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  // 데모용 샘플 데이터
  const demoGifticons: Gifticon[] = [
    {
      id: "demo-1",
      name: "아메리카노 Tall",
      brand: "스타벅스",
      category: "cafe",
      expiryDate: "2024-12-31",
      isUsed: false,
      imageUrl: "/placeholder.svg?height=200&width=300&text=Starbucks+Americano",
      barcode: "1234567890123",
      memo: "생일 선물로 받음",
      registeredAt: "2024-01-15",
      price: 4500,
    },
    {
      id: "demo-2",
      name: "치킨버거 세트",
      brand: "맥도날드",
      category: "food",
      expiryDate: "2024-02-28",
      isUsed: false,
      imageUrl: "/placeholder.svg?height=200&width=300&text=McDonald%27s+Burger",
      barcode: "9876543210987",
      registeredAt: "2024-01-05",
      price: 6500,
    },
    {
      id: "demo-3",
      name: "상품권 5000원",
      brand: "CU",
      category: "convenience",
      expiryDate: "2024-06-30",
      isUsed: true,
      imageUrl: "/placeholder.svg?height=200&width=300&text=CU+Voucher",
      barcode: "5555666677778",
      memo: "이미 사용함",
      registeredAt: "2024-01-01",
      price: 5000,
    },
    {
      id: "demo-4",
      name: "아이스크림 쿠폰",
      brand: "베스킨라빈스",
      category: "food",
      expiryDate: "2024-03-15",
      isUsed: false,
      imageUrl: "/placeholder.svg?height=200&width=300&text=Baskin+Robbins",
      barcode: "7777888899990",
      registeredAt: "2024-01-20",
      price: 3500,
    },
  ]

  const handleToggleUsed = (id: string) => {
    // 데모에서는 실제 상태 변경 없이 알림만 표시
    const alertDiv = document.createElement("div")
    alertDiv.className = "fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse"
    alertDiv.textContent = "데모 모드에서는 실제 변경이 되지 않습니다!"
    document.body.appendChild(alertDiv)
    setTimeout(() => {
      document.body.removeChild(alertDiv)
    }, 3000)
  }

  const demoFeatures = [
    {
      icon: Gift,
      title: "스마트 관리",
      description: "카테고리별 체계적 분류",
    },
    {
      icon: Bell,
      title: "만료 알림",
      description: "미리 알려주는 똑똑한 알림",
    },
    {
      icon: TrendingUp,
      title: "사용 통계",
      description: "한눈에 보는 사용 패턴",
    },
    {
      icon: Star,
      title: "즐겨찾기",
      description: "자주 쓰는 기프티콘 북마크",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Gift className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">기프티콘 모음북</span>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 animate-pulse">🚀 DEMO</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent">
                  로그인
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">회원가입</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 데모 안내 */}
        <Alert className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-blue-800">🎮 데모 모드입니다.</strong>
                <p className="text-blue-700 mt-1">
                  실제 기능을 체험해보세요! 데이터는 저장되지 않으며, 모든 기능을 사용하려면 회원가입이 필요합니다.
                </p>
              </div>
              <div className="hidden md:block">
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    무료 가입하기
                  </Button>
                </Link>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {demoFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 기프티콘</p>
                  <p className="text-2xl font-bold text-blue-600">{demoGifticons.length}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">사용 가능</p>
                  <p className="text-2xl font-bold text-green-600">{demoGifticons.filter((g) => !g.isUsed).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">곧 만료</p>
                  <p className="text-2xl font-bold text-yellow-600">1</p>
                </div>
                <Bell className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">총 가치</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {demoGifticons.reduce((sum, g) => sum + (g.price || 0), 0).toLocaleString()}원
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 기프티콘 목록 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">내 기프티콘</h2>
              <p className="text-gray-600 mt-1">클릭해서 상세 정보를 확인해보세요</p>
            </div>
            <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
              <Gift className="h-4 w-4 mr-2" />
              기프티콘 추가 (데모 제한)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoGifticons.map((gifticon) => (
              <div key={gifticon.id} className="transform hover:scale-105 transition-transform">
                <GifticonCard gifticon={gifticon} onToggleUsed={handleToggleUsed} onView={setSelectedGifticon} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA 섹션 */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">마음에 드시나요?</h3>
              <p className="text-lg mb-6 opacity-90 leading-relaxed">
                지금 회원가입하고 모든 기능을 무제한으로 사용해보세요! 첫 달은 무료로 체험할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    무료 회원가입
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                  >
                    로그인
                  </Button>
                </Link>
              </div>
              <div className="mt-4 text-sm opacity-75">
                <p>✨ 신용카드 등록 불필요 • 언제든 해지 가능</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 기프티콘 상세 다이얼로그 */}
      <GifticonDetailDialog
        gifticon={selectedGifticon}
        isOpen={!!selectedGifticon}
        onClose={() => setSelectedGifticon(null)}
      />
    </div>
  )
}

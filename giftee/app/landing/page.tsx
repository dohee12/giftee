"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Smartphone, Bell, Shield, Zap, Users, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const features = [
    {
      icon: Gift,
      title: "스마트 관리",
      description: "기프티콘을 카테고리별, 브랜드별로 체계적으로 관리하세요",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Bell,
      title: "만료 알림",
      description: "유효기간 임박 시 자동으로 알림을 받아보세요",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Smartphone,
      title: "모바일 최적화",
      description: "언제 어디서나 편리하게 사용할 수 있는 반응형 디자인",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Zap,
      title: "빠른 등록",
      description: "이미지 업로드만으로 기프티콘 정보를 자동 인식",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Shield,
      title: "안전한 보관",
      description: "소중한 기프티콘을 안전하게 보관하고 관리하세요",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Users,
      title: "공유 기능",
      description: "가족, 친구와 기프티콘을 쉽게 공유할 수 있습니다",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  const stats = [
    { number: "10,000+", label: "등록된 기프티콘" },
    { number: "500+", label: "지원 브랜드" },
    { number: "99.9%", label: "만료 방지율" },
    { number: "4.8★", label: "사용자 만족도" },
  ]

  const testimonials = [
    {
      name: "김민수",
      role: "직장인",
      content: "더 이상 기프티콘을 잃어버리지 않아요! 만료 알림 덕분에 모든 기프티콘을 제때 사용할 수 있게 되었습니다.",
      avatar: "👨‍💼",
    },
    {
      name: "이소영",
      role: "대학생",
      content: "OCR 기능이 정말 편해요. 사진만 찍으면 자동으로 정보가 입력되니까 등록이 너무 간단해졌어요.",
      avatar: "👩‍🎓",
    },
    {
      name: "박준호",
      role: "가족 대표",
      content: "가족들과 기프티콘을 공유하기 좋아요. 아이들이 받은 기프티콘도 한 번에 관리할 수 있어 너무 편합니다.",
      avatar: "👨‍👩‍👧‍👦",
    },
  ]

  const pricingPlans = [
    {
      name: "무료",
      price: "0원",
      period: "영원히",
      features: ["기프티콘 50개까지 등록", "기본 만료 알림", "카테고리별 분류", "기본 통계"],
      recommended: false,
    },
    {
      name: "프리미엄",
      price: "2,900원",
      period: "/월",
      features: [
        "무제한 기프티콘 등록",
        "고급 알림 설정",
        "OCR 자동 인식",
        "백업 및 동기화",
        "상세 통계 및 분석",
        "프리미엄 지원",
      ],
      recommended: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Gift className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">기프티콘 모음북</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                기능
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                요금제
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
                후기
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2">🎉 해커톤 특별 출시!</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              기프티콘을 <span className="text-blue-600">스마트하게</span>
              <br />
              관리하세요
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              흩어져 있는 기프티콘들을 한 곳에 모아 체계적으로 관리하고, 만료되기 전에 미리 알림을 받아보세요. 더 이상
              소중한 기프티콘을 잃어버리지 마세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700">
                  <Gift className="h-5 w-5 mr-2" />
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent">
                  데모 체험하기
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">신용카드 등록 불필요 • 언제든 해지 가능</p>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">왜 기프티콘 모음북인가요?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              기프티콘 관리의 모든 불편함을 해결하는 올인원 솔루션입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 요금제 */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">간단한 요금제</h2>
            <p className="text-xl text-gray-600">필요에 맞는 플랜을 선택하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.recommended ? "border-blue-500 shadow-xl scale-105" : "border-gray-200"}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">추천</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      {plan.price}
                      <span className="text-lg text-gray-500 font-normal">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup">
                    <Button
                      className={`w-full ${plan.recommended ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"}`}
                    >
                      {plan.name === "무료" ? "무료로 시작하기" : "프리미엄 시작하기"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 사용자 후기 */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">사용자들의 이야기</h2>
            <p className="text-xl text-gray-600">실제 사용자들이 경험한 변화를 확인해보세요</p>
          </div>

          <div className="relative">
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{testimonials[currentTestimonial].avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작해보세요!</h2>
          <p className="text-xl mb-8 opacity-90">
            더 이상 기프티콘을 잃어버리지 마세요. 스마트한 관리로 모든 혜택을 놓치지 않으세요.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100"
            >
              <Gift className="h-5 w-5 mr-2" />
              무료로 시작하기
            </Button>
          </Link>
          <p className="text-sm opacity-75 mt-4">30초면 가입 완료 • 바로 사용 가능</p>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">기프티콘 모음북</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                기프티콘을 스마트하게 관리하는 가장 쉬운 방법. 더 이상 소중한 기프티콘을 잃어버리지 마세요.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  📧 support@gifticon-book.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    기능 소개
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    요금제
                  </a>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    도움말
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    데모
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    회사 소개
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    블로그
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 기프티콘 모음북. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

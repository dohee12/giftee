"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Camera, Bell, Share2, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: Gift,
      title: "기프티콘 모음북에 오신 걸 환영합니다!",
      description: "흩어져 있는 기프티콘들을 한 곳에서 스마트하게 관리해보세요. 더 이상 만료로 인한 손실은 없습니다.",
      image: "/placeholder.svg?height=300&width=400&text=Welcome",
      features: [
        "카테고리별 체계적 관리",
        "브랜드별 분류 및 검색",
        "직관적인 사용자 인터페이스",
        "실시간 상태 업데이트",
      ],
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Camera,
      title: "간편한 등록 시스템",
      description: "이미지만 업로드하면 AI가 기프티콘 정보를 자동으로 인식합니다. 수동 입력의 번거로움은 이제 그만!",
      image: "/placeholder.svg?height=300&width=400&text=OCR+Magic",
      features: [
        "이미지 업로드로 자동 인식",
        "정확한 OCR 텍스트 추출",
        "수동 입력도 언제든 가능",
        "바코드 정보 자동 저장",
      ],
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Bell,
      title: "스마트 만료 알림",
      description: "유효기간이 임박한 기프티콘을 미리 알려드립니다. 설정 가능한 알림으로 완벽한 관리를 경험하세요.",
      image: "/placeholder.svg?height=300&width=400&text=Smart+Alerts",
      features: ["설정 가능한 알림 기간", "실시간 만료 상태 확인", "놓치지 않는 스마트 알림", "우선순위별 알림 분류"],
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Share2,
      title: "공유 및 통계",
      description: "가족, 친구와 기프티콘을 공유하고 사용 패턴을 분석해보세요. 더 나은 기프티콘 관리가 시작됩니다.",
      image: "/placeholder.svg?height=300&width=400&text=Share+%26+Analytics",
      features: [
        "카카오톡, 문자로 간편 공유",
        "상세한 사용 내역 추적",
        "브랜드별 통계 및 분석",
        "월별 사용 패턴 리포트",
      ],
      color: "from-purple-500 to-pink-600",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/")
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* 이미지 섹션 */}
              <div
                className={`bg-gradient-to-br ${currentStepData.color} p-8 flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                    <StepIcon className="h-12 w-12 text-white" />
                  </div>
                  <img
                    src={currentStepData.image || "/placeholder.svg"}
                    alt={currentStepData.title}
                    className="max-w-full max-h-80 rounded-xl shadow-2xl mx-auto"
                  />
                </div>
                {/* 장식 요소 */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/10 rounded-full"></div>
              </div>

              {/* 컨텐츠 섹션 */}
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {currentStep + 1} / {steps.length}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      건너뛰기
                    </Button>
                  </div>

                  <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {currentStepData.title}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">{currentStepData.description}</p>
                  </div>

                  <div className="space-y-3">
                    {currentStepData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 group">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 진행 표시기 */}
                <div className="mb-8">
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          index <= currentStep ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>시작</span>
                    <span>완료</span>
                  </div>
                </div>

                {/* 네비게이션 버튼 */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    이전
                  </Button>

                  <Button onClick={handleNext} className="px-6">
                    {currentStep === steps.length - 1 ? (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>시작하기</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>다음</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>

                {/* 추가 정보 */}
                {currentStep === steps.length - 1 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      🎉 모든 준비가 완료되었습니다! 이제 기프티콘을 스마트하게 관리해보세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

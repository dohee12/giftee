"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Camera,
  Bell,
  Share2,
  Settings,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  Phone,
  Clock,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HelpPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqData = [
    {
      id: "1",
      question: "기프티콘은 어떻게 등록하나요?",
      answer:
        "메인 화면의 '추가' 버튼을 클릭하거나, 이미지를 업로드하여 자동으로 정보를 인식할 수 있습니다. OCR 기능을 통해 기프티콘 이미지에서 브랜드명, 상품명, 만료일 등을 자동으로 추출합니다. 수동으로 직접 입력하는 것도 가능합니다.",
      category: "기본 사용법",
      difficulty: "초급",
    },
    {
      id: "2",
      question: "만료 알림은 언제 받을 수 있나요?",
      answer:
        "설정에서 알림 기간을 조정할 수 있습니다. 기본적으로 만료 7일 전부터 알림을 받을 수 있으며, 3일, 14일, 30일 전으로 변경 가능합니다. 알림은 브라우저 푸시 알림으로 제공되며, 앱이 열려있지 않아도 받을 수 있습니다.",
      category: "알림 설정",
      difficulty: "초급",
    },
    {
      id: "3",
      question: "기프티콘을 실수로 삭제했어요. 복구할 수 있나요?",
      answer:
        "현재 버전에서는 삭제된 기프티콘의 복구 기능이 제공되지 않습니다. 중요한 기프티콘은 백업 기능을 이용해 주기적으로 백업해주세요. 설정 > 데이터 관리에서 백업 파일을 생성할 수 있습니다.",
      category: "데이터 관리",
      difficulty: "중급",
    },
    {
      id: "4",
      question: "여러 기기에서 동일한 데이터를 볼 수 있나요?",
      answer:
        "회원가입 후 로그인하시면 클라우드 동기화를 통해 모든 기기에서 동일한 데이터를 확인할 수 있습니다. 현재는 웹 브라우저 기반으로 제공되며, 추후 모바일 앱도 출시될 예정입니다.",
      category: "계정 관리",
      difficulty: "초급",
    },
    {
      id: "5",
      question: "기프티콘 이미지가 자동으로 인식되지 않아요.",
      answer:
        "이미지가 선명하고 텍스트가 잘 보이는지 확인해주세요. 조명이 충분한 곳에서 촬영하거나, 고해상도 이미지를 사용하시면 인식률이 향상됩니다. 이미지가 기울어져 있거나 흐릿한 경우 인식이 어려울 수 있습니다.",
      category: "OCR 기능",
      difficulty: "중급",
    },
    {
      id: "6",
      question: "기프티콘을 친구와 공유할 수 있나요?",
      answer:
        "기프티콘 상세 화면에서 '공유하기' 버튼을 통해 카카오톡, 문자 등으로 공유할 수 있습니다. 공유할 때는 기프티콘의 이미지와 정보가 함께 전송됩니다.",
      category: "공유 기능",
      difficulty: "초급",
    },
    {
      id: "7",
      question: "백업 파일은 어떻게 사용하나요?",
      answer:
        "설정 > 데이터 관리에서 '백업' 버튼을 클릭하면 JSON 형태의 백업 파일이 다운로드됩니다. 복원할 때는 '복원' 버튼을 클릭하고 해당 파일을 선택하면 됩니다. 백업 파일에는 모든 기프티콘 정보와 설정이 포함됩니다.",
      category: "데이터 관리",
      difficulty: "중급",
    },
    {
      id: "8",
      question: "카테고리를 직접 만들 수 있나요?",
      answer:
        "현재는 미리 정의된 카테고리(카페, 음식, 편의점, 쇼핑, 기타)만 사용할 수 있습니다. 사용자 정의 카테고리 기능은 향후 업데이트에서 제공될 예정입니다.",
      category: "기본 사용법",
      difficulty: "초급",
    },
  ]

  const categories = Array.from(new Set(faqData.map((faq) => faq.category)))
  const difficulties = Array.from(new Set(faqData.map((faq) => faq.difficulty)))

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const quickActions = [
    {
      icon: Camera,
      title: "기프티콘 등록하기",
      description: "새로운 기프티콘을 추가하는 방법을 알아보세요",
      link: "#faq-1",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Bell,
      title: "알림 설정하기",
      description: "만료 알림을 설정하는 방법을 확인하세요",
      link: "#faq-2",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Share2,
      title: "공유 기능 사용하기",
      description: "기프티콘을 공유하는 방법을 배워보세요",
      link: "#faq-6",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Settings,
      title: "설정 변경하기",
      description: "앱 설정을 변경하고 최적화하는 방법",
      link: "/settings",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: "이메일 문의",
      description: "자세한 문의는 이메일로 보내주세요",
      contact: "support@gifticon-book.com",
      available: "24시간 접수",
    },
    {
      icon: MessageCircle,
      title: "채팅 상담",
      description: "실시간으로 빠른 답변을 받아보세요",
      contact: "웹사이트 우하단 채팅 버튼",
      available: "평일 9:00-18:00",
    },
    {
      icon: Phone,
      title: "전화 상담",
      description: "급한 문의사항은 전화로 연락주세요",
      contact: "1588-1234",
      available: "평일 9:00-18:00",
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
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">도움말</span>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="bg-transparent">
                앱으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">도움이 필요하신가요?</h1>
          <p className="text-xl text-gray-600 mb-8">궁금한 내용을 검색하거나 아래 가이드를 참고해보세요</p>

          {/* 검색바 */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="궁금한 내용을 검색해보세요... (예: 기프티콘 등록, 만료 알림)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 빠른 도움말 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">빠른 도움말</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <span>자세히 보기</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h2>
            <div className="text-sm text-gray-500">총 {filteredFAQs.length}개의 질문</div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={searchTerm === "" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => setSearchTerm("")}
            >
              전체 ({faqData.length})
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setSearchTerm(category)}
              >
                {category} ({faqData.filter((faq) => faq.category === category).length})
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="shadow-sm hover:shadow-md transition-shadow">
                <Collapsible
                  open={openFAQ === faq.id}
                  onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex space-x-2 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                faq.difficulty === "초급"
                                  ? "border-green-200 text-green-700"
                                  : faq.difficulty === "중급"
                                    ? "border-yellow-200 text-yellow-700"
                                    : "border-red-200 text-red-700"
                              }`}
                            >
                              {faq.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-left text-base font-medium flex-1 leading-relaxed">
                            {faq.question}
                          </CardTitle>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform flex-shrink-0 ml-4 ${
                            openFAQ === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6">
                      <div className="ml-20">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-500">이 답변이 도움이 되었나요?</span>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                              👍 도움됨
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                              👎 아니요
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 mb-4">다른 검색어를 시도해보시거나 아래 문의 방법을 이용해주세요</p>
                <Button onClick={() => setSearchTerm("")} variant="outline" className="bg-transparent">
                  전체 질문 보기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 문의하기 */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-900">더 궁금한 점이 있으신가요?</CardTitle>
            <p className="text-center text-gray-600 mt-2">
              FAQ에서 답을 찾지 못하셨다면 언제든 문의해주세요. 최대한 빠르게 도움을 드리겠습니다.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                    <div className="text-blue-600 font-medium text-sm">{method.contact}</div>
                    <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {method.available}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-8 p-6 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">💡 문의 전 확인사항</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 브라우저와 운영체제 정보를 함께 알려주시면 더 정확한 도움을 받을 수 있습니다</p>
                <p>• 오류 발생 시 스크린샷을 첨부해주시면 빠른 해결이 가능합니다</p>
                <p>• 기프티콘 관련 문의 시 브랜드명과 상품명을 명시해주세요</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

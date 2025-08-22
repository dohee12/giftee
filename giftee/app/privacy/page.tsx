"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Shield, Eye, Lock, Database } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPage() {
  const router = useRouter()

  const sections = [
    {
      icon: Database,
      title: "수집하는 개인정보",
      content: [
        "회원가입 시: 이메일, 이름, 비밀번호",
        "서비스 이용 시: 기프티콘 정보, 사용 기록",
        "자동 수집: 접속 로그, 기기 정보, 쿠키",
      ],
    },
    {
      icon: Eye,
      title: "개인정보 이용 목적",
      content: ["서비스 제공 및 운영", "회원 관리 및 본인 확인", "만료 알림 등 서비스 개선", "고객 지원 및 문의 응답"],
    },
    {
      icon: Lock,
      title: "개인정보 보호",
      content: ["암호화된 데이터 저장", "접근 권한 제한", "정기적인 보안 점검", "개인정보 처리 직원 교육"],
    },
    {
      icon: Shield,
      title: "개인정보 제3자 제공",
      content: [
        "원칙적으로 제3자에게 제공하지 않음",
        "법령에 의한 요구 시에만 제공",
        "사전 동의 없이 제공하지 않음",
        "서비스 제공을 위한 최소한의 정보만 처리",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">개인정보처리방침</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 소개 */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
                <p className="text-gray-600 mb-4">
                  기프티콘 모음북은 사용자의 개인정보를 소중히 여기며, 개인정보보호법에 따라 안전하게 처리하고 있습니다.
                </p>
                <div className="text-sm text-gray-500">
                  <p>시행일자: 2025년 1월 20일</p>
                  <p>최종 수정일: 2025년 1월 20일</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 주요 섹션들 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 상세 내용 */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>개인정보 보유 및 이용기간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">회원 정보</h4>
                <p className="text-gray-600">회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">서비스 이용 기록</h4>
                <p className="text-gray-600">
                  서비스 제공을 위해 필요한 기간 동안 보유하며, 법령에 따라 일정 기간 보관할 수 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">접속 로그</h4>
                <p className="text-gray-600">통신비밀보호법에 따라 3개월간 보관 후 파기합니다.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개인정보 처리 위탁</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">수탁업체</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">위탁업무</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Vercel Inc.</td>
                      <td className="border border-gray-300 px-4 py-2">웹 호스팅 서비스</td>
                      <td className="border border-gray-300 px-4 py-2">서비스 제공 기간</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Supabase Inc.</td>
                      <td className="border border-gray-300 px-4 py-2">데이터베이스 관리</td>
                      <td className="border border-gray-300 px-4 py-2">서비스 제공 기간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>정보주체의 권리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">사용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">개인정보 처리현황 통지 요구</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">개인정보 열람 요구</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">개인정보 정정·삭제 요구</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">개인정보 처리정지 요구</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle>개인정보 보호책임자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> 개인정보보호팀
              </p>
              <p>
                <strong>이메일:</strong> privacy@gifticon-book.com
              </p>
              <p>
                <strong>전화:</strong> 1588-1234
              </p>
              <p className="text-sm text-gray-600 mt-4">
                개인정보 처리에 관한 문의사항이 있으시면 언제든 연락주시기 바랍니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

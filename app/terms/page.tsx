"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Users, Shield, AlertTriangle, Gavel } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">이용약관</span>
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
              <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">서비스 이용약관</h1>
                <p className="text-gray-600 mb-4">
                  기프티콘 모음북 서비스를 이용하기 전에 다음 약관을 반드시 읽어보시기 바랍니다.
                </p>
                <div className="text-sm text-gray-500">
                  <p>시행일자: 2025년 1월 20일</p>
                  <p>최종 수정일: 2025년 1월 20일</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 약관 내용 */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <span>제1조 (목적)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                이 약관은 기프티콘 모음북(이하 "회사")이 제공하는 기프티콘 관리 서비스(이하 "서비스")의 이용과 관련하여
                회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>제2조 (정의)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">1. "서비스"</p>
                  <p className="text-gray-700 ml-4">
                    회사가 제공하는 기프티콘 등록, 관리, 알림 등의 모든 서비스를 의미합니다.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. "이용자"</p>
                  <p className="text-gray-700 ml-4">
                    이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3. "회원"</p>
                  <p className="text-gray-700 ml-4">
                    회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는
                    서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <span>제3조 (회원가입)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">1. 가입 신청</p>
                  <p className="text-gray-700 ml-4">
                    이용자가 회원가입을 신청할 때는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에
                    동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. 가입 승낙</p>
                  <p className="text-gray-700 ml-4">
                    회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                    등록합니다.
                  </p>
                  <ul className="ml-8 space-y-1 text-gray-700">
                    <li>• 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>• 실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>• 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>제4조 (서비스의 제공)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">1. 제공 서비스</p>
                  <p className="text-gray-700 ml-4">회사는 다음과 같은 서비스를 제공합니다:</p>
                  <ul className="ml-8 space-y-1 text-gray-700">
                    <li>• 기프티콘 등록 및 관리 서비스</li>
                    <li>• 만료 임박 알림 서비스</li>
                    <li>• 카테고리별 분류 서비스</li>
                    <li>• 사용 내역 관리 서비스</li>
                    <li>• 기타 회사가 정하는 서비스</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. 서비스 이용시간</p>
                  <p className="text-gray-700 ml-4">
                    서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로
                    합니다. 단, 회사는 시스템 정기점검, 증설 및 교체를 위해 당해 서비스를 일시적으로 중단할 수 있으며,
                    예정되어 있는 작업으로 인한 서비스 일시중단은 당해 서비스 상에서 공지합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
                <span>제5조 (이용자의 의무)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>신청 또는 변경 시 허위 내용의 등록</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>타인의 정보 도용</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>회사가 게시한 정보의 변경</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Gavel className="h-6 w-6 text-blue-600" />
                <span>제6조 (서비스 이용제한)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">1. 이용제한 사유</p>
                  <p className="text-gray-700 ml-4">
                    회사는 이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지,
                    영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. 이용제한 해제</p>
                  <p className="text-gray-700 ml-4">
                    회사는 이용제한 사유가 해소된 것이 확인된 경우에 한하여 이용제한을 해제할 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>제7조 (면책조항)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-700">
                    회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
                    관한 책임이 면제됩니다.
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    회사는 이용자가 서비스를 이용하여 기대하는 손익이나 서비스를 통하여 얻은 자료로 인한 손해에 관하여
                    책임을 지지 않습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle>문의사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-700">본 약관에 대한 문의사항이 있으시면 아래로 연락주시기 바랍니다.</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>이메일:</strong> support@gifticon-book.com
                </p>
                <p>
                  <strong>전화:</strong> 1588-1234
                </p>
                <p>
                  <strong>주소:</strong> 서울특별시 강남구 테헤란로 123, 456호
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

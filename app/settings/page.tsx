"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import {
  ChevronRight,
  Share2,
  FileText,
  Upload,
  Download,
  ArrowLeft,
  SettingsIcon,
  Palette,
  Bell,
  Zap,
  Gift,
} from "lucide-react"
import { useSettings, type ListView, type SortBy, type SortOrder } from "@/hooks/use-app-settings"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useIsMobile } from "@/hooks/use-mobile"

function SettingsPageContent() {
  const { settings, updateSetting } = useSettings()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const handleBackup = () => {
    const data = localStorage.getItem("gifticon-data")
    const settingsData = localStorage.getItem("appSettings")

    const backupData = {
      gifticons: data ? JSON.parse(data) : [],
      settings: settingsData ? JSON.parse(settingsData) : {},
      backupDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `기프티콘모음북_백업_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRestore = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.gifticons) {
              localStorage.setItem("gifticon-data", JSON.stringify(data.gifticons))
            }
            if (data.settings) {
              localStorage.setItem("appSettings", JSON.stringify(data.settings))
            }
            alert("복원이 완료되었습니다. 페이지를 새로고침합니다.")
            window.location.reload()
          } catch (error) {
            alert("잘못된 백업 파일입니다.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleCategorySettings = () => {
    alert("카테고리 설정 페이지 (개발 중)")
  }

  const handleRecommendApp = () => {
    if (navigator.share) {
      navigator.share({
        title: "기프티콘 모음북",
        text: "기프티콘을 스마트하게 관리하는 앱을 추천합니다!",
        url: window.location.origin,
      })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      alert("링크가 복사되었습니다!")
    }
  }

  return (
    <SidebarInset>
      {/* 헤더 */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <div className="flex items-center space-x-1 md:space-x-5 flex-1">
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <button 
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="사이드바 토글"
          >
            <Gift className="h-6 w-6 text-blue-600" />
          </button>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-lg font-bold text-gray-900">Giftee</h1>
          </Link>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-6 w-6 text-gray-600" />
            <h1 className="text-xl font-bold text-gray-900">설정</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {/* 화면 표시 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-blue-600" />
                <span>화면 표시</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">기프티콘 리스트 형태</Label>
                  <p className="text-sm text-gray-500 mt-1">카드형 또는 리스트형으로 표시 방식을 선택할 수 있습니다.</p>
                </div>
                <RadioGroup
                  value={settings.listView}
                  onValueChange={(value: ListView) => updateSetting("listView", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card-view" />
                    <Label htmlFor="card-view">카드형</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list-view" />
                    <Label htmlFor="list-view">리스트형</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">바코드 밝기 최적화</Label>
                  <p className="text-sm text-gray-500 mt-1">바코드를 더 밝게 표시하여 스캔 인식률을 향상시킵니다.</p>
                </div>
                <Switch
                  checked={settings.barcodeBrightness}
                  onCheckedChange={(value) => updateSetting("barcodeBrightness", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 정렬 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <ArrowLeft className="h-5 w-5 text-blue-600 rotate-90" />
                <span>정렬 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">정렬 기준</Label>
                  <p className="text-sm text-gray-500 mt-1">기프티콘 목록의 기본 정렬 방식을 설정합니다.</p>
                </div>
                <Select value={settings.sortBy} onValueChange={(value: SortBy) => updateSetting("sortBy", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">브랜드 이름</SelectItem>
                    <SelectItem value="expiryDate">유효기간</SelectItem>
                    <SelectItem value="registeredAt">등록일</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">정렬 순서</Label>
                  <p className="text-sm text-gray-500 mt-1">오름차순 또는 내림차순으로 정렬할 수 있습니다.</p>
                </div>
                <RadioGroup
                  value={settings.sortOrder}
                  onValueChange={(value: SortOrder) => updateSetting("sortOrder", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asc" id="sort-asc" />
                    <Label htmlFor="sort-asc">오름차순</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="desc" id="sort-desc" />
                    <Label htmlFor="sort-desc">내림차순</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>알림 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">유효기간 임박 알림</Label>
                  <p className="text-sm text-gray-500 mt-1">기프티콘 만료가 가까워지면 알림을 받을 수 있습니다.</p>
                </div>
                <Switch
                  checked={settings.expiryNotification}
                  onCheckedChange={(value) => updateSetting("expiryNotification", value)}
                />
              </div>

              {settings.expiryNotification && (
                <div className="flex items-center justify-between pl-4 border-l-2 border-blue-200 bg-blue-50 p-4 rounded-r-lg">
                  <div>
                    <Label className="text-base font-medium">알림 시점</Label>
                    <p className="text-sm text-gray-500 mt-1">만료 며칠 전에 알림을 받을지 설정합니다.</p>
                  </div>
                  <Select
                    value={settings.expiryNotificationDays.toString()}
                    onValueChange={(value) => updateSetting("expiryNotificationDays", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3일 전</SelectItem>
                      <SelectItem value="7">7일 전</SelectItem>
                      <SelectItem value="14">14일 전</SelectItem>
                      <SelectItem value="30">30일 전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 자동화 기능 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>자동화 기능</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between opacity-50">
                <div>
                  <Label className="text-base font-medium">쿠폰 자동 인식 (갤러리)</Label>
                  <p className="text-sm text-gray-500 mt-1">갤러리에 저장된 기프티콘 이미지를 자동으로 인식합니다.</p>
                  <p className="text-xs text-gray-400 mt-1">* 웹 환경에서는 지원되지 않습니다.</p>
                </div>
                <Switch
                  checked={settings.autoCouponRecognition}
                  onCheckedChange={(value) => updateSetting("autoCouponRecognition", value)}
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">이미지 업로드 시 자동 분석 (OCR)</Label>
                  <p className="text-sm text-gray-500 mt-1">업로드한 이미지에서 기프티콘 정보를 자동으로 추출합니다.</p>
                </div>
                <Switch
                  checked={settings.autoImageInput}
                  onCheckedChange={(value) => updateSetting("autoImageInput", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>데이터 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between bg-transparent" onClick={handleBackup}>
                <span className="flex items-center space-x-3">
                  <Download className="h-4 w-4 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">백업</p>
                    <p className="text-sm text-gray-500">기프티콘 데이터를 파일로 저장</p>
                  </div>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <Button variant="outline" className="w-full justify-between bg-transparent" onClick={handleRestore}>
                <span className="flex items-center space-x-3">
                  <Upload className="h-4 w-4 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">복원</p>
                    <p className="text-sm text-gray-500">백업 파일에서 데이터 복원</p>
                  </div>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </CardContent>
          </Card>

          {/* 기타 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>기타 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={handleCategorySettings}
              >
                <span className="flex items-center space-x-3">
                  <SettingsIcon className="h-4 w-4 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium">카테고리 설정</p>
                    <p className="text-sm text-gray-500">사용자 정의 카테고리 관리</p>
                  </div>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </CardContent>
          </Card>

          {/* 앱 정보 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>앱 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between bg-transparent" onClick={handleRecommendApp}>
                <span className="flex items-center space-x-3">
                  <Share2 className="h-4 w-4 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">앱 추천하기</p>
                    <p className="text-sm text-gray-500">친구들에게 앱을 소개해보세요</p>
                  </div>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => router.push("/terms")}
              >
                <span className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <div className="text-left">
                    <p className="font-medium">약관 및 정책</p>
                    <p className="text-sm text-gray-500">이용약관, 개인정보처리방침</p>
                  </div>
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <div className="text-center py-4 border-t">
                <p className="text-sm text-gray-500">기프티콘 모음북 v1.0.0</p>
                <p className="text-xs text-gray-400 mt-1">&copy; 2025 Gifticon Book. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}

export default function SettingsPage() {
  return (
    <LayoutWrapper>
      <SettingsPageContent />
    </LayoutWrapper>
  )
}

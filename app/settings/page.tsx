"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar"
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
  Gift,
  ChevronLeft as ChevronLeftIcon,
  Zap,
  Sparkles,
  User2,
  Shield,
} from "lucide-react"
import { useRef, useState } from "react"
import Link from "next/link"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DEFAULT_EMOJI_OPTIONS } from "@/constants/emoji-options"
import { useSettings, type ListView, type SortBy, type SortOrder } from "@/hooks/use-app-settings"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

function SettingsPageContent() {
  const { settings, updateSetting } = useSettings()
  const router = useRouter()
  const [isEmojiDialogOpen, setIsEmojiDialogOpen] = useState(false)
  const { notifications } = useGifticons()
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleSidebar, openMobile, state } = useSidebar()
  const isMobile = useIsMobile()

  const navItems = [
    { id: "display", label: "화면 표시", icon: Palette },
    { id: "sorting", label: "정렬 설정", icon: ArrowLeft },
    { id: "notifications", label: "알림 설정", icon: Bell },
    { id: "account", label: "계정", icon: User2 },
    { id: "security", label: "보안", icon: Shield },
    { id: "export", label: "데이터 내보내기", icon: Download },
  ] as const

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    display: useRef<HTMLDivElement>(null),
    sorting: useRef<HTMLDivElement>(null),
    notifications: useRef<HTMLDivElement>(null),
    account: useRef<HTMLDivElement>(null),
    security: useRef<HTMLDivElement>(null),
    export: useRef<HTMLDivElement>(null),
  }

  const scrollToSection = (id: keyof typeof sectionRefs) => {
    const el = sectionRefs[id].current
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

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

  const appVersion = "v1.0.0"
  const handleCopyVersion = async () => {
    try {
      await navigator.clipboard.writeText(appVersion)
      alert("버전을 복사했습니다.")
    } catch (e) {
      alert(appVersion + " 복사 실패")
    }
  }

  return (
    <>
    <SidebarInset>
      {/* 헤더 */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-2 md:px-4 bg-white">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            {/* 모바일: PC 사이드바 스타일의 토글 버튼 */}
            <button
              onClick={toggleSidebar}
              aria-label="사이드바 토글"
              className="md:hidden inline-flex items-center justify-center"
            >
              <div className="group/icon relative w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Gift className="h-4 w-4 text-white transition-opacity duration-150 group-hover/icon:opacity-0" />
                {(isMobile ? openMobile : state !== "collapsed") ? (
                  <ChevronLeftIcon className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                ) : (
                  <ChevronRight className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                )}
              </div>
            </button>
            <Link href="/">
              <h1 className="text-xl font-black text-gray-900 cursor-pointer font-ydsnow">Giftee</h1>
            </Link>
          </div>
          {/* 설정 페이지: 검색창 제거 */}
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {settings.expiryNotification && notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0">
              {settings.expiryNotification && notifications.length > 0 ? (
                <>
                  <div className="p-2 text-xs text-amber-700 bg-amber-50">⏰ 곧 만료되는 기프티콘이 {notifications.length}개 있어요.</div>
                  <div className="max-h-64 overflow-auto divide-y">
                    {notifications.slice(0, 10).map((g) => (
                      <div key={g.id} className="p-3 text-sm">
                        <div className="font-medium text-gray-900 truncate">{g.brand} {g.name}</div>
                        <div className="text-xs text-gray-600">{g.expiryDate}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>알림이 없습니다</p>
                </div>
              )}
            </PopoverContent>
          </Popover>
          {!isAuthenticated ? (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="계정" className="h-8 w-8 rounded-full overflow-hidden border">
                  <img src={user?.photoUrl || "/avatar-placeholder.png"} alt={user?.name || "user"} className="h-full w-full object-cover" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-0">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">안녕하세요, {user?.name || "사용자"}님</p>
                </div>
                <div className="p-2">
                  <Button variant="outline" className="w-full" onClick={logout}>로그아웃</Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      <div className="flex flex-1 p-3 md:p-4 bg-gray-50">
        {/* 왼쪽 네비게이션: 모바일에서는 공간 확보를 위해 숨김 */}
        {!isMobile && (
          <aside className="w-56 sticky top-16 h-[calc(100vh-4rem)] overflow-auto self-start pt-4 px-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-gray-100 text-gray-700"
                  >
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </aside>
        )}

        {/* 본문 섹션 */}
        <div className="max-w-3xl mx-auto w-full">
          
          <div className="py-4 -mt-2">
            <h1 className="text-2xl font-bold text-gray-900">설정</h1>
          </div>
          <div className="space-y-6">
          {/* 화면 표시 설정 */}
          <div ref={sectionRefs.display}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-blue-600" />
                <span>화면 표시</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Label className="text-base font-medium">기프티콘 리스트 형태</Label>
                  <p className="text-sm text-gray-500 mt-1">카드형 또는 리스트형으로 표시 방식을 선택할 수 있습니다.</p>
                </div>
                <RadioGroup
                  value={settings.listView}
                  onValueChange={(value: ListView) => updateSetting("listView", value)}
                  className="flex flex-col gap-2 md:flex-row md:space-x-4 md:gap-0"
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

              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
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
          </div>

          {/* 정렬 설정 */}
          <div ref={sectionRefs.sorting}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <ArrowLeft className="h-5 w-5 text-blue-600 rotate-90" />
                <span>정렬 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Label className="text-base font-medium">정렬 기준</Label>
                  <p className="text-sm text-gray-500 mt-1">기프티콘 목록의 기본 정렬 방식을 설정합니다.</p>
                </div>
                <Select value={settings.sortBy} onValueChange={(value: SortBy) => updateSetting("sortBy", value)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">브랜드 이름</SelectItem>
                    <SelectItem value="expiryDate">유효기간</SelectItem>
                    <SelectItem value="registeredAt">등록일</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Label className="text-base font-medium">정렬 순서</Label>
                  <p className="text-sm text-gray-500 mt-1">오름차순 또는 내림차순으로 정렬할 수 있습니다.</p>
                </div>
                <RadioGroup
                  value={settings.sortOrder}
                  onValueChange={(value: SortOrder) => updateSetting("sortOrder", value)}
                  className="flex flex-col gap-2 md:flex-row md:space-x-4 md:gap-0"
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
          </div>

          {/* 알림 설정 */}
          <div ref={sectionRefs.notifications}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>알림 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Label className="text-base font-medium">유효기간 임박 알림</Label>
                  <p className="text-sm text-gray-500 mt-1">기프티콘 만료일이 가까워지면 알림을 받을 수 있습니다.</p>
                </div>
                <Switch
                  checked={settings.expiryNotification}
                  onCheckedChange={(value) => updateSetting("expiryNotification", value)}
                />
              </div>

              {settings.expiryNotification && (
                <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Label className="text-base font-medium">알림 시점</Label>
                    <p className="text-sm text-gray-500 mt-1">만료일 전에 알림 받을 시점을 설정합니다.</p>
                  </div>
                  <Select
                    value={settings.expiryNotificationDays.toString()}
                    onValueChange={(value) => updateSetting("expiryNotificationDays", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full md:w-[120px]">
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
          </div>

          {/* AI 추천 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>AI 추천 설정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Label className="text-base font-medium">AI 추천 기능</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    시간대, 날씨, 상황에 맞는 기프티콘을 자동으로 추천받습니다.
                  </p>
                </div>
                <Switch
                  checked={settings.aiRecommendations}
                  onCheckedChange={(value) => updateSetting("aiRecommendations", value)}
                />
              </div>

              {settings.aiRecommendations && (
                <>
                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Label className="text-base font-medium">추천 빈도</Label>
                      <p className="text-sm text-gray-500 mt-1">AI 추천을 얼마나 자주 업데이트할지 설정합니다.</p>
                    </div>
                    <Select
                      value={settings.aiRecommendationFrequency}
                      onValueChange={(value: "realtime" | "15min" | "hourly" | "6hours" | "daily") =>
                        updateSetting("aiRecommendationFrequency", value)
                      }
                    >
                      <SelectTrigger className="w-full md:w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">실시간</SelectItem>
                        <SelectItem value="15min">15분마다</SelectItem>
                        <SelectItem value="hourly">1시간마다</SelectItem>
                        <SelectItem value="6hours">6시간마다</SelectItem>
                        <SelectItem value="daily">하루마다</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <Label className="text-base font-medium">추천 배지 표시</Label>
                      <p className="text-sm text-gray-500 mt-1">추천된 기프티콘에 특별한 배지를 표시합니다.</p>
                    </div>
                    <Switch
                      checked={settings.showRecommendationBadges}
                      onCheckedChange={(value) => updateSetting("showRecommendationBadges", value)}
                    />
                  </div>
                </>
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
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between opacity-50">
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

              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
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

          {/* 데이터 내보내기 */}
          <div ref={sectionRefs.export}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>데이터 내보내기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div>
                  <p className="font-medium">백업/복원</p>
                  <p className="text-sm text-gray-500">데이터를 파일로 저장하거나 파일에서 복원합니다.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleBackup}>
                    <Download className="h-4 w-4 mr-2" />
                    백업
                  </Button>
                  <Button variant="outline" onClick={handleRestore}>
                    <Upload className="h-4 w-4 mr-2" />
                    복원
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* 계정 */}
          <div ref={sectionRefs.account}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <User2 className="h-5 w-5 text-blue-600" />
                <span>계정</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">계정 관련 설정은 추후 추가 예정입니다.</p>
            </CardContent>
          </Card>
          </div>

          {/* 보안 */}
          <div ref={sectionRefs.security}>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>보안</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">2단계 인증 등 보안 설정은 추후 추가 예정입니다.</p>
            </CardContent>
          </Card>
          </div>

          {/* 기타 설정 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>기타 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div>
                  <p className="font-medium">카테고리 설정</p>
                  <p className="text-sm text-gray-500">사용자 정의 카테고리 관리</p>
                </div>
                <div>
                  <Button variant="ghost" onClick={handleCategorySettings} className="px-3">
                    설정 열기
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">이모지 관리</p>
                  <p className="text-sm text-gray-500">기본 이모지 숨김/사용자 이모지 추가·삭제</p>
                </div>
                <Button variant="ghost" onClick={() => setIsEmojiDialogOpen(true)} className="px-3">
                  이모지 관리 열기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 앱 정보 */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>앱 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRecommendApp}
                  className="group rounded-xl border p-4 text-left hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">
                      <Share2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">앱 추천하기</p>
                      <p className="text-xs text-gray-500">친구에게 링크 공유</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/terms")}
                  className="group rounded-xl border p-4 text-left hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">약관 및 정책</p>
                      <p className="text-xs text-gray-500">이용약관, 개인정보처리방침</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="text-center py-4 border-t">
                <p className="text-sm text-gray-500">기프티콘 모음북 v1.0.0</p>
                <p className="text-xs text-gray-400 mt-1">&copy; 2025 Gifticon Book. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </SidebarInset>

    {/* 이모지 관리 다이얼로그 */}
    <Dialog open={isEmojiDialogOpen} onOpenChange={setIsEmojiDialogOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>이모지 관리</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input placeholder="이모지 입력 (예: ⭐)" id="emoji-manage-input-dialog" className="w-32" />
            <Button
              variant="outline"
              onClick={() => {
                const input = document.getElementById("emoji-manage-input-dialog") as HTMLInputElement
                if (!input?.value) return
                const emoji = input.value.trim()
                const valid = /\p{Extended_Pictographic}/u.test(emoji)
                if (!valid) {
                  alert("이모지를 입력해 주세요 (예: ⭐)")
                  return
                }
                updateSetting("customEmojis", [...(settings.customEmojis || []), emoji])
                input.value = ""
              }}
            >
              추가
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">모든 이모지</p>
            <div className="flex flex-wrap gap-2">
              {[...DEFAULT_EMOJI_OPTIONS, ...(settings.customEmojis || [])].map((e, idx) => {
                const isDefault = DEFAULT_EMOJI_OPTIONS.includes(e)
                const hidden = isDefault && (settings.hiddenDefaultEmojis || []).includes(e)
                return (
                  <span key={`${e}-${idx}`} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-lg ${hidden ? "opacity-40" : "hover:bg-gray-50"}`}>
                    <button
                      onClick={() => {
                        if (isDefault) {
                          const current = new Set(settings.hiddenDefaultEmojis || [])
                          if (current.has(e)) current.delete(e)
                          else current.add(e)
                          updateSetting("hiddenDefaultEmojis", Array.from(current))
                        }
                      }}
                      title={isDefault ? (hidden ? "클릭해서 표시" : "클릭해서 숨기기") : "사용자 이모지"}
                    >
                      {e}
                    </button>
                    {(!isDefault) && (
                      <button
                        aria-label="삭제"
                        className="text-xs text-gray-500 hover:text-red-600"
                        onClick={() =>
                          updateSetting(
                            "customEmojis",
                            (settings.customEmojis || []).filter((x, i) => !(x === e && i === (settings.customEmojis || []).indexOf(e)))
                          )
                        }
                      >
                        ×
                      </button>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default function SettingsPage() {
  return (
    <LayoutWrapper>
      <SettingsPageContent />
    </LayoutWrapper>
  )
}

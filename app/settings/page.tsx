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
  ChevronLeft,
  SettingsIcon,
  Palette,
  Bell,
  Zap,
  Gift,
  History,
  Settings,
} from "lucide-react"
import { useSettings, type ListView, type SortBy, type SortOrder } from "@/hooks/use-app-settings"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useIsMobile } from "@/hooks/use-mobile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AppHeader } from "@/components/app-header"

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
      <AppHeader />
      <div className="flex flex-1 bg-gray-50">
        {/* 좌측 설정 사이드바 */}
        <aside className="hidden md:block w-64 border-r bg-white p-4 sticky top-16 self-start">
          <nav className="space-y-1 text-sm">
            <a href="#section-display" className="block px-3 py-2 rounded hover:bg-gray-100">화면 표시</a>
            <a href="#section-sort" className="block px-3 py-2 rounded hover:bg-gray-100">정렬 설정</a>
            <a href="#section-noti" className="block px-3 py-2 rounded hover:bg-gray-100">알림 설정</a>
            <a href="#section-account" className="block px-3 py-2 rounded hover:bg-gray-100">계정</a>
            <a href="#section-security" className="block px-3 py-2 rounded hover:bg-gray-100">보안</a>
            <a href="#section-export" className="block px-3 py-2 rounded hover:bg-gray-100">데이터 내보내기</a>
          </nav>
        </aside>

        {/* 우측 섹션형 폼 */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1150px]">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

            {/* 화면 표시 */}
            <section id="section-display" className="bg-white rounded-lg border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">화면 표시</h2>
              </div>
              <div className="p-6 space-y-6">
                <fieldset className="flex items-center justify-between">
                  <div>
                    <legend className="text-base font-medium">기프티콘 리스트 형태</legend>
                    <p className="text-sm text-gray-500 mt-1">카드형 또는 리스트형으로 선택하세요.</p>
                  </div>
                  <RadioGroup value={settings.listView} onValueChange={(v: ListView) => updateSetting("listView", v)} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card-view" />
                      <Label htmlFor="card-view">카드형</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="list" id="list-view" />
                      <Label htmlFor="list-view">리스트형</Label>
                    </div>
                  </RadioGroup>
                </fieldset>

                <fieldset className="flex items-center justify-between">
                  <div>
                    <legend className="text-base font-medium">바코드 밝기 최적화</legend>
                    <p className="text-sm text-gray-500 mt-1">바코드를 더 밝게 표시하여 스캔 인식률 향상</p>
                  </div>
                  <Switch checked={settings.barcodeBrightness} onCheckedChange={(v) => updateSetting("barcodeBrightness", v)} />
                </fieldset>
              </div>
            </section>

            {/* 정렬 설정 */}
            <section id="section-sort" className="bg-white rounded-lg border mt-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">정렬 설정</h2>
              </div>
              <div className="p-6 space-y-6">
                <fieldset className="flex items-center justify-between">
                  <div>
                    <legend className="text-base font-medium">정렬 기준/순서</legend>
                    <p className="text-sm text-gray-500 mt-1">브랜드/등록일/만료일 + 오름/내림</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select value={settings.sortBy} onValueChange={(v) => updateSetting("sortBy", v as SortBy)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand">브랜드</SelectItem>
                        <SelectItem value="registeredAt">등록일</SelectItem>
                        <SelectItem value="expiryDate">만료일</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={settings.sortOrder} onValueChange={(v) => updateSetting("sortOrder", v as SortOrder)}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">오름차순</SelectItem>
                        <SelectItem value="desc">내림차순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </fieldset>
              </div>
            </section>

            {/* 알림 설정 */}
            <section id="section-noti" className="bg-white rounded-lg border mt-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">알림 설정</h2>
              </div>
              <div className="p-6 space-y-6">
                <fieldset className="flex items-center justify-between">
                  <div>
                    <legend className="text-base font-medium">만료 임박 알림</legend>
                    <p className="text-sm text-gray-500 mt-1">만료일이 가까워지면 알림 표시</p>
                  </div>
                  <Switch checked={settings.expiryNotification} onCheckedChange={(v) => updateSetting("expiryNotification", v)} />
                </fieldset>
                <fieldset className="flex items-center justify-between">
                  <div>
                    <legend className="text-base font-medium">알림 기준 일수</legend>
                    <p className="text-sm text-gray-500 mt-1">며칠 전에 알림을 받을지 선택</p>
                  </div>
                  <Select value={String(settings.expiryNotificationDays)} onValueChange={(v) => updateSetting("expiryNotificationDays", Number(v))}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3일 전</SelectItem>
                      <SelectItem value="5">5일 전</SelectItem>
                      <SelectItem value="7">7일 전</SelectItem>
                      <SelectItem value="14">14일 전</SelectItem>
                    </SelectContent>
                  </Select>
                </fieldset>
              </div>
            </section>

            {/* 계정/보안 플레이스홀더 */}
            <section id="section-account" className="bg-white rounded-lg border mt-8">
              <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">계정</h2></div>
              <div className="p-6 text-sm text-gray-500">계정 설정은 추후 연동 예정입니다.</div>
            </section>
            <section id="section-security" className="bg-white rounded-lg border mt-8">
              <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">보안</h2></div>
              <div className="p-6 text-sm text-gray-500">보안 옵션은 추후 추가 예정입니다.</div>
            </section>

            {/* 데이터 내보내기 */}
            <section id="section-export" className="bg-white rounded-lg border mt-8 mb-24">
              <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">데이터 내보내기</h2></div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-base font-medium">백업 / 복원</p>
                  <p className="text-sm text-gray-500 mt-1">기프티콘 데이터와 설정을 JSON으로 저장/복원</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleBackup}>백업 파일 다운로드</Button>
                  <Button variant="ghost" onClick={handleRestore}>백업에서 복원</Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 하단 고정 액션 바 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/90 backdrop-blur px-4 py-3">
        <div className="mx-auto max-w-[1150px] flex justify-end gap-2">
          <Button variant="ghost" onClick={() => window.location.reload()}>취소</Button>
          <Button variant="outline" onClick={handleRestore}>초기화</Button>
          <Button onClick={() => alert("저장되었습니다.")}>저장</Button>
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

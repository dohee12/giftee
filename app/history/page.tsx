"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Search, Calendar, TrendingUp, RotateCcw, FileX, Grid, List, Bell, Gift, ChevronLeft as ChevronLeftIcon, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ko } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import type { Gifticon } from "@/types/gifticon"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { useAuth } from "@/contexts/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

function HistoryPageContent() {
  const router = useRouter()
  const { gifticons, toggleUsed, notifications } = useGifticons()
  const { settings, updateSetting } = useSettings()
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleSidebar, openMobile, state } = useSidebar()
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("registeredAt")
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)

  // 히스토리 데이터 (사용됨 + 만료됨)
  const historyGifticons = gifticons.filter((g) => {
    const isExpired = getDaysUntilExpiry(g.expiryDate) < 0
    return g.isUsed || isExpired
  })

  // 월별 필터링을 위한 데이터 준비
  const availableMonths = Array.from(
    new Set(
      historyGifticons.map((g) => {
        return format(parseISO(g.registeredAt), "yyyy-MM")
      }),
    ),
  ).sort((a, b) => b.localeCompare(a))

  // 브랜드 목록
  const availableBrands = Array.from(new Set(historyGifticons.map((g) => g.brand))).sort()

  // 필터링된 기프티콘
  const filteredHistoryGifticons = historyGifticons
    .filter((gifticon) => {
      const matchesSearch =
        gifticon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gifticon.brand.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMonth =
        selectedMonth === "all" || format(parseISO(gifticon.registeredAt), "yyyy-MM") === selectedMonth

      const matchesBrand = selectedBrand === "all" || gifticon.brand === selectedBrand

      const isExpired = getDaysUntilExpiry(gifticon.expiryDate) < 0
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "used" && gifticon.isUsed) ||
        (selectedStatus === "expired" && isExpired && !gifticon.isUsed)

      return matchesSearch && matchesMonth && matchesBrand && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "registeredAt":
          return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        case "expiryDate":
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
        case "brand":
          return a.brand.localeCompare(b.brand)
        case "price":
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })

  // 통계 계산
  const usedGifticons = gifticons.filter((g) => g.isUsed)
  const expiredGifticons = gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) < 0)
  const totalUsedCount = usedGifticons.length
  const totalExpiredCount = expiredGifticons.length
  
  const thisMonthUsed = usedGifticons.filter((g) => {
    const giftIconDate = parseISO(g.registeredAt)
    const now = new Date()
    return isWithinInterval(giftIconDate, {
      start: startOfMonth(now),
      end: endOfMonth(now),
    })
  }).length

  return (
    <SidebarInset>
      {/* 헤더: 홈과 동일 */}
      <header className="relative flex h-16 shrink-0 items-center gap-2 border-b px-2 md:px-4 bg-white">
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
          <div className="flex-1 flex justify-center px-2">
            <div className="relative w-full max-w-[18rem] md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="기프티콘 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
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

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">사용한 기프티콘</p>
                  <p className="text-2xl font-bold text-blue-600">{totalUsedCount}개</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">이번 달 사용</p>
                  <p className="text-2xl font-bold text-purple-600">{thisMonthUsed}개</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">만료된 기프티콘</p>
                  <p className="text-2xl font-bold text-red-600">{totalExpiredCount}개</p>
                </div>
                <FileX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        

        {/* 내역 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              사용 내역 및 만료 기프티콘 ({filteredHistoryGifticons.length}개)
            </h3>
            <div className="flex border rounded-md">
              <Button
                variant={settings.listView === "card" ? "default" : "ghost"}
                size="sm"
                onClick={() => updateSetting("listView", "card")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={settings.listView === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => updateSetting("listView", "list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 필터: 헤더 바로 아래로 이동 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="등록일 기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">등록일 전체 기간</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {format(parseISO(month + "-01"), "yyyy년 M월", { locale: ko })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="브랜드 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 브랜드</SelectItem>
                {availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="used">사용완료</SelectItem>
                <SelectItem value="expired">만료됨</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registeredAt">등록일순</SelectItem>
                <SelectItem value="expiryDate">만료일순</SelectItem>
                <SelectItem value="brand">브랜드순</SelectItem>
                <SelectItem value="price">금액순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredHistoryGifticons.length > 0 ? (
            <div
              className={
                settings.listView === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
              }
            >
              {filteredHistoryGifticons.map((gifticon) => (
                settings.listView === "card" ? (
                  <GifticonCard
                    key={gifticon.id}
                    gifticon={gifticon}
                    onToggleUsed={toggleUsed}
                    onView={() => setSelectedGifticon(gifticon)}
                    disableExpiredToggle
                    preferUsedStatus
                  />
                ) : (
                  <GifticonListItem
                    key={gifticon.id}
                    gifticon={gifticon}
                    onToggleUsed={toggleUsed}
                    onView={() => setSelectedGifticon(gifticon)}
                    disableExpiredToggle
                    preferUsedStatus
                  />
                )
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">내역이 없습니다</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedMonth !== "all" || selectedBrand !== "all"
                    ? "검색 조건에 맞는 내역이 없습니다"
                    : "아직 사용하거나 만료된 기프티콘이 없습니다"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 상세 다이얼로그 */}
      <GifticonDetailDialog
        gifticon={selectedGifticon}
        isOpen={!!selectedGifticon}
        onClose={() => setSelectedGifticon(null)}
      />
    </SidebarInset>
  )
}

export default function HistoryPage() {
  return (
    <LayoutWrapper>
      <HistoryPageContent />
    </LayoutWrapper>
  )
}

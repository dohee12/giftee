"use client"

import { useMemo, useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { addMonths, format, isSameDay, isSameMonth, parseISO, startOfDay, differenceInCalendarDays } from "date-fns"
import { ko } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"
import { Bell, Search, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import type { Gifticon } from "@/types/gifticon"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"

function CalendarContent() {
  const { gifticons, notifications, addGifticon } = useGifticons()
  const { settings } = useSettings()
  const { toggleSidebar, openMobile, state } = useSidebar()
  const isMobile = useIsMobile()
  const { isAuthenticated, user, logout } = useAuth()
  const [selected, setSelected] = useState<Date | undefined>(new Date())
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [detailGifticon, setDetailGifticon] = useState<Gifticon | null>(null)
  const calendarClass = isMobile
    ? "w-full [--cell-size:30px]"
    : "w-full [--cell-by-height:calc((100dvh-10rem)*0.92/8)] [--cell-size:clamp(16px,var(--cell-by-height),35px)]"
  const contentTopClass = isMobile ? "pt-6" : ""

  const expiryDates = useMemo(() => {
    const map = new Map<string, number>()
    for (const g of gifticons) {
      if (!g.isUsed && g.expiryDate && g.expiryDate !== "no-expiry") {
        map.set(g.expiryDate, (map.get(g.expiryDate) || 0) + 1)
      }
    }
    return map
  }, [gifticons])

  const selectedList = useMemo(() => {
    if (!selected) return []
    const start = startOfDay(selected)
    return gifticons
      .filter((g) => !g.isUsed && g.expiryDate && g.expiryDate !== "no-expiry")
      .filter((g) => {
        const d = parseISO(g.expiryDate)
        return d >= start && isSameMonth(d, selected)
      })
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
  }, [gifticons, selected])

  const monthlyCount = useMemo(() => {
    return gifticons.filter((g) => {
      if (g.isUsed || !g.expiryDate || g.expiryDate === "no-expiry") return false
      const d = parseISO(g.expiryDate)
      return isSameMonth(d, displayMonth)
    }).length
  }, [gifticons, displayMonth])

  const isSelectedToday = useMemo(() => {
    return selected ? isSameDay(selected, new Date()) : false
  }, [selected])

  // 초기 진입 시 오늘 날짜를 기본 선택으로 보장
  useEffect(() => {
    if (!selected) {
      const today = new Date()
      setSelected(today)
      setDisplayMonth(today)
    }
  }, [])

  

  return (
    <SidebarInset>
      {isMobile ? (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-2 md:px-4 bg-white">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                aria-label="사이드바 토글"
                className="md:hidden inline-flex items-center justify-center"
              >
                <div className="group/icon relative w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-white transition-opacity duration-150 group-hover/icon:opacity-0" />
                  {(openMobile) ? (
                    <ChevronLeft className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                  ) : (
                    <ChevronRight className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                  )}
                </div>
              </button>
              <Link href="/">
                <h1 className="text-xl font-black text-gray-900 cursor-pointer font-ydsnow">Giftee</h1>
              </Link>
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
      ) : (
        <header className="relative flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              <Link href="/" aria-label="홈으로" className="cursor-pointer">
                <h1 className="text-lg font-bold text-gray-900 font-logo">Giftee</h1>
              </Link>
            </div>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center w-full max-w-md z-10 pointer-events-none">
              <div className="relative w-full pointer-events-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="기프티콘 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {settings.expiryNotification && notifications.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-0">
                  <div className="p-2 text-xs text-amber-700 bg-amber-50">⏰ 곧 만료되는 기프티콘이 {notifications.length}개 있어요.</div>
                  <div className="max-h-64 overflow-auto divide-y">
                    {notifications.slice(0, 10).map((g) => (
                      <div key={g.id} className="p-3 text-sm">
                        <div className="font-medium text-gray-900 truncate">{g.brand} {g.name}</div>
                        <div className="text-xs text-gray-600">{g.expiryDate}</div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
          </div>
        </header>
      )}

      <div className="flex flex-1 flex-col gap-4 p-4 bg-background">
        <div className={`max-w-7xl mx-auto w-full ${contentTopClass}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mx-auto w-full max-w-[54rem] mt-6 md:mt-5 px-2 md:px-0">
                <div className="relative flex items-center justify-center h-9 -mb-3">
                  <div className="text-base sm:text-lg font-semibold">
                    {format(displayMonth, "yyyy년 M월", { locale: ko })}
                  </div>
                  <div className="absolute left-0 -translate-y-[5px] flex items-center gap-2 text-xs sm:text-sm">
                    <Badge variant="secondary">이번 달 만료 {monthlyCount}개</Badge>
                  </div>
                  <div className="absolute right-0 -translate-y-[5px] flex items-center gap-2 text-xs sm:text-sm">
                    <Button size="sm" variant="outline" onClick={() => { setSelected(new Date()); setDisplayMonth(new Date()) }}>오늘</Button>
                  </div>
                </div>
                {isMobile && (
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2" aria-label="이전 해" onClick={() => setDisplayMonth(addMonths(displayMonth, -12))}>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" aria-label="이전 달" onClick={() => setDisplayMonth(addMonths(displayMonth, -1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-muted-foreground">{format(displayMonth, "yyyy.MM", { locale: ko })}</div>
                    <Button variant="ghost" size="sm" className="p-2" aria-label="다음 달" onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" aria-label="다음 해" onClick={() => setDisplayMonth(addMonths(displayMonth, 12))}>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="mt-2 relative px-2 md:px-14">
                  {/* 사이드 내비게이션 (왼쪽: 바깥=이전 해, 안쪽=이전 달) */}
                  <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-row items-center gap-3 z-20">
                    <Button variant="ghost" size="sm" className="p-2" aria-label="이전 해" onClick={() => setDisplayMonth(addMonths(displayMonth, -12))}>
                      <ChevronsLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" aria-label="이전 달" onClick={() => setDisplayMonth(addMonths(displayMonth, -1))}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* 사이드 내비게이션 (오른쪽: 안쪽=다음 달, 바깥=다음 해) */}
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-row items-center gap-3 z-20">
                    <Button variant="ghost" size="sm" className="p-2" aria-label="다음 달" onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" aria-label="다음 해" onClick={() => setDisplayMonth(addMonths(displayMonth, 12))}>
                      <ChevronsRight className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* 커스텀 요일 헤더 (기본 요일 헤더는 숨김) */}
                  <div className="grid grid-cols-7 gap-0 px-1 md:px-2 text-[11px] md:text-xs text-gray-500 text-center select-none">
                    {['일','월','화','수','목','금','토'].map((d) => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>
                  <Calendar
                    className={calendarClass}
                    mode="single"
                    month={displayMonth}
                    selected={selected}
                    onSelect={(d) => {
                      if (!d) return
                      if (isSameMonth(d, displayMonth)) setSelected(d)
                    }}
                    showOutsideDays
                    onMonthChange={(m) => setDisplayMonth(m)}
                    classNames={{ nav: "hidden", month_caption: "hidden", dropdowns: "hidden", head_row: "hidden", head_cell: "hidden" }}
                    getDayBadge={(date) => {
                      const key = format(date, "yyyy-MM-dd")
                      const count = Array.from(expiryDates.keys()).filter(d => d === key).length
                      if (count > 0) {
                        // 같은 날 여러 브랜드가 있으면 첫 번째 브랜드명 + 외 N
                        const brands = gifticons.filter(g => g.expiryDate === key && !g.isUsed).map(g => g.brand)
                        const unique = Array.from(new Set(brands))
                        return unique.length > 1 ? `${unique[0]} 외 ${unique.length - 1}` : unique[0]
                      }
                      return null
                    }}
                    modifiers={{
                      hasExpiry: (day) => {
                        const key = format(day, "yyyy-MM-dd")
                        return expiryDates.has(key)
                      },
                    }}
                    modifiersClassNames={{
                      hasExpiry: "",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
            <Card className="md:sticky md:top-20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selected ? format(selected, "yyyy년 M월 d일 (EEE)", { locale: ko }) : "날짜 선택"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {!selected ? (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    날짜를 먼저 선택해 주세요.
                  </div>
                ) : selectedList.length === 0 ? (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    이번 달에는 선택한 날짜 이후 만료 예정 기프티콘이 없어요. 다음 달을 확인해 보세요.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[40vh] md:max-h-none overflow-auto pr-1">
                    {selectedList.map((g) => {
                      const isTodaySel = selected && isSameDay(parseISO(g.expiryDate), selected)
                      const base = selected ? startOfDay(selected) : startOfDay(new Date())
                      const daysDiff = differenceInCalendarDays(startOfDay(parseISO(g.expiryDate)), base)
                      const ddayLabel = daysDiff === 0 ? 'D-0' : daysDiff > 0 ? `D-${daysDiff}` : `D+${Math.abs(daysDiff)}`
                      return (
                        <div
                          key={g.id}
                          className={`flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50 cursor-pointer ${
                            isTodaySel ? 'border-l-4 border-primary/60 pl-2' : ''
                          }`}
                          onClick={() => setDetailGifticon(g as Gifticon)}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{g.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{g.brand}</p>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {isTodaySel && (
                              <span className="font-expiry inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px]">
                                {isSelectedToday ? '오늘 만료 예정' : '선택일 만료 예정'}
                              </span>
                            )}
                            {!isTodaySel && (
                              <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] ${daysDiff === 1 ? 'bg-red-100 text-red-700 font-semibold' : 'bg-muted text-foreground/80'}`}>
                                {ddayLabel}
                              </span>
                            )}
                            <span className={`text-xs ${isTodaySel ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{g.expiryDate}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                기프티콘 등록
              </Button>
            </div>
            </div>
          </div>
        </div>
        <AddGifticonDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={addGifticon}
          initialExpiryDate={selected ? format(selected, 'yyyy-MM-dd') : ''}
        />
        <GifticonDetailDialog
          gifticon={detailGifticon}
          isOpen={!!detailGifticon}
          onClose={() => setDetailGifticon(null)}
        />
      </div>
    </SidebarInset>
  )
}

export default function CalendarPage() {
  return (
    <LayoutWrapper>
      <CalendarContent />
    </LayoutWrapper>
  )
}




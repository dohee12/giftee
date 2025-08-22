"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Search, Calendar, TrendingUp, RotateCcw, ArrowLeft, FileX, Grid, List } from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ko } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { brandLogos, categories } from "@/constants/gifticon-categories"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import { LayoutWrapper } from "@/components/layout-wrapper"

function HistoryPageContent() {
  const router = useRouter()
  const { gifticons, toggleUsed } = useGifticons()
  const { settings, updateSetting } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("registeredAt")

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
  const totalUsedValue = usedGifticons.reduce((sum, g) => sum + (g.price || 0), 0)
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
      {/* 헤더 */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">사용 내역</h1>
        </div>
        <div className="ml-auto flex items-center space-x-2">
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
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <p className="text-sm text-gray-600">총 사용 금액</p>
                  <p className="text-2xl font-bold text-green-600">{totalUsedValue.toLocaleString()}원</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
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

        {/* 필터 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="기프티콘 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기간</SelectItem>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {format(parseISO(month + "-01"), "yyyy년 M월", { locale: ko })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="used">사용완료</SelectItem>
                  <SelectItem value="expired">만료됨</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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
          </CardContent>
        </Card>

        {/* 내역 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              사용 내역 및 만료 기프티콘 ({filteredHistoryGifticons.length}개)
            </h3>
          </div>

          {filteredHistoryGifticons.length > 0 ? (
            <div
              className={
                settings.listView === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
              }
            >
              {filteredHistoryGifticons.map((gifticon) => {
                const logo = brandLogos[gifticon.brand] || "🏪"
                const categoryInfo = categories[gifticon.category] || {
                  label: gifticon.category || "기타",
                  color: "text-gray-600",
                  bgColor: "bg-gray-100"
                }
                const isExpired = gifticon.expiryDate === "no-expiry" ? false : getDaysUntilExpiry(gifticon.expiryDate) < 0
                const statusText = gifticon.isUsed ? "사용완료" : isExpired ? "만료됨" : "기타"
                const statusColor = gifticon.isUsed
                  ? "bg-gray-100 text-gray-600"
                  : isExpired
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"

                return settings.listView === "card" ? (
                  <Card
                    key={gifticon.id}
                    className="bg-white shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{logo}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{gifticon.brand}</p>
                            <Badge className={categoryInfo.color + " " + categoryInfo.bgColor + " text-xs"}>
                              {categoryInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={statusColor + " text-xs"}>{statusText}</Badge>
                      </div>

                      {gifticon.imageUrl && (
                        <img
                          src={gifticon.imageUrl || "/placeholder.svg"}
                          alt={gifticon.name}
                          className={`w-full h-24 object-cover rounded-lg mb-3 ${
                            isExpired && !gifticon.isUsed ? "grayscale opacity-50" : "grayscale"
                          }`}
                        />
                      )}

                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-sm leading-tight">{gifticon.name}</h4>
                        {gifticon.price && (
                          <p className="text-base font-bold text-gray-600">{gifticon.price.toLocaleString()}원</p>
                        )}
                        <p className="text-xs text-gray-500">
                          만료일: {gifticon.expiryDate === "no-expiry" ? "만료일 없음" : format(parseISO(gifticon.expiryDate), "yyyy년 M월 d일", { locale: ko })}
                        </p>
                        <p className="text-xs text-gray-500">
                          등록일: {gifticon.registeredAt ? format(parseISO(gifticon.registeredAt), "yyyy년 M월 d일", { locale: ko }) : "등록일 없음"}
                        </p>
                        {gifticon.memo && <p className="text-xs text-gray-500 italic line-clamp-2">{gifticon.memo}</p>}
                      </div>

                      {gifticon.isUsed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUsed(gifticon.id)}
                          className="w-full bg-transparent"
                        >
                          <RotateCcw className="h-3 w-3 mr-2" />
                          사용 취소
                        </Button>
                      )}

                      {isExpired && !gifticon.isUsed && (
                        <div className="text-center text-xs text-red-500 py-2 bg-red-50 rounded">
                          만료된 기프티콘입니다
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div
                    key={gifticon.id}
                    className="bg-white p-4 rounded-lg shadow-sm border opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center space-x-4">
                      {gifticon.imageUrl && (
                        <img
                          src={gifticon.imageUrl || "/placeholder.svg"}
                          alt={gifticon.name}
                          className={`w-16 h-16 object-cover rounded-md flex-shrink-0 ${
                            isExpired && !gifticon.isUsed ? "grayscale opacity-50" : "grayscale"
                          }`}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-base">{logo}</span>
                          <p className="text-sm font-medium text-gray-600">{gifticon.brand}</p>
                          <Badge className={categoryInfo.color + " " + categoryInfo.bgColor + " text-xs"}>
                            {categoryInfo.label}
                          </Badge>
                          <Badge className={statusColor + " text-xs"}>{statusText}</Badge>
                        </div>
                        <h4 className="font-semibold text-base leading-tight truncate">{gifticon.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          {gifticon.price && (
                            <p className="text-sm font-bold text-gray-600">{gifticon.price.toLocaleString()}원</p>
                          )}
                          <p className="text-xs text-gray-500">
                            만료: {format(parseISO(gifticon.expiryDate), "yyyy.MM.dd", { locale: ko })}
                          </p>
                          <p className="text-xs text-gray-500">
                            등록: {format(parseISO(gifticon.registeredAt), "yyyy.MM.dd", { locale: ko })}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {gifticon.isUsed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUsed(gifticon.id)}
                            className="bg-transparent"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            취소
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
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

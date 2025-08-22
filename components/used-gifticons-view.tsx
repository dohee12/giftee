"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, TrendingUp, RotateCcw } from "lucide-react"
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { brandLogos, categories } from "@/constants/gifticon-categories"

interface UsedGiftIconsViewProps {
  gifticons: Gifticon[]
  onRestoreGifticon: (id: string) => void
}

export function UsedGiftIconsView({ gifticons, onRestoreGifticon }: UsedGiftIconsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("usedDate")

  // 사용된 기프티콘만 필터링
  const usedGifticons = gifticons.filter((g) => g.isUsed)

  // 월별 필터링을 위한 데이터 준비
  const availableMonths = Array.from(
    new Set(
      usedGifticons.map((g) => {
        // 실제로는 사용일이 있어야 하지만, 여기서는 등록일을 사용
        return format(parseISO(g.registeredAt), "yyyy-MM")
      }),
    ),
  ).sort((a, b) => b.localeCompare(a))

  // 브랜드 목록
  const availableBrands = Array.from(new Set(usedGifticons.map((g) => g.brand))).sort()

  // 필터링된 기프티콘
  const filteredUsedGifticons = usedGifticons
    .filter((gifticon) => {
      const matchesSearch =
        gifticon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gifticon.brand.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMonth =
        selectedMonth === "all" || format(parseISO(gifticon.registeredAt), "yyyy-MM") === selectedMonth

      const matchesBrand = selectedBrand === "all" || gifticon.brand === selectedBrand

      return matchesSearch && matchesMonth && matchesBrand
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "usedDate":
          return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        case "brand":
          return a.brand.localeCompare(b.brand)
        case "price":
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })

  // 통계 계산
  const totalUsedCount = usedGifticons.length
  const totalUsedValue = usedGifticons.reduce((sum, g) => sum + (g.price || 0), 0)
  const thisMonthUsed = usedGifticons.filter((g) => {
    const giftIconDate = parseISO(g.registeredAt)
    const now = new Date()
    return isWithinInterval(giftIconDate, {
      start: startOfMonth(now),
      end: endOfMonth(now),
    })
  }).length

  // 브랜드별 사용 통계
  const brandStats = usedGifticons.reduce(
    (acc, g) => {
      if (!acc[g.brand]) {
        acc[g.brand] = { count: 0, value: 0 }
      }
      acc[g.brand].count++
      acc[g.brand].value += g.price || 0
      return acc
    },
    {} as Record<string, { count: number; value: number }>,
  )

  const topBrands = Object.entries(brandStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 사용한 기프티콘</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsedCount}개</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
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
      </div>

      {/* 인기 브랜드 */}
      {topBrands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">가장 많이 사용한 브랜드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topBrands.map(([brand, stats], index) => {
                const logo = brandLogos[brand] || "🏪"
                return (
                  <div key={brand} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{logo}</div>
                    <p className="font-medium text-sm">{brand}</p>
                    <p className="text-xs text-gray-600">{stats.count}개</p>
                    <p className="text-xs text-blue-600">{stats.value.toLocaleString()}원</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usedDate">사용일순</SelectItem>
                <SelectItem value="brand">브랜드순</SelectItem>
                <SelectItem value="price">금액순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 사용된 기프티콘 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">사용 내역 ({filteredUsedGifticons.length}개)</h3>
        </div>

        {filteredUsedGifticons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsedGifticons.map((gifticon) => {
              const logo = brandLogos[gifticon.brand] || "🏪"
              const categoryInfo = categories[gifticon.category] || {
    label: gifticon.category || "기타",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  }

              return (
                <Card key={gifticon.id} className="opacity-75 hover:opacity-100 transition-opacity">
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
                      <Badge className="bg-gray-100 text-gray-600 text-xs">사용완료</Badge>
                    </div>

                    {gifticon.imageUrl && (
                      <img
                        src={gifticon.imageUrl || "/placeholder.svg"}
                        alt={gifticon.name}
                        className="w-full h-24 object-cover rounded-lg mb-3 grayscale"
                      />
                    )}

                    <div className="space-y-2 mb-4">
                      <h4 className="font-semibold text-sm leading-tight">{gifticon.name}</h4>
                      {gifticon.price && (
                        <p className="text-base font-bold text-gray-600">{gifticon.price.toLocaleString()}원</p>
                      )}
                      <p className="text-xs text-gray-500">
                        사용일: {gifticon.registeredAt ? format(parseISO(gifticon.registeredAt), "yyyy년 M월 d일", { locale: ko }) : "등록일 없음"}
                      </p>
                      {gifticon.memo && <p className="text-xs text-gray-500 italic line-clamp-2">{gifticon.memo}</p>}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestoreGifticon(gifticon.id)}
                      className="w-full bg-transparent"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      사용 취소
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">사용 내역이 없습니다</h3>
              <p className="text-gray-500">
                {searchTerm || selectedMonth !== "all" || selectedBrand !== "all"
                  ? "검색 조건에 맞는 사용 내역이 없습니다"
                  : "아직 사용한 기프티콘이 없습니다"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

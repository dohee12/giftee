"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/constants/gifticon-categories"
import type { SortBy } from "@/hooks/use-app-settings" // useSettings에서 SortBy 타입 임포트

interface MobileFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: SortBy // settings.sortBy와 연동
  setSortBy: (sort: SortBy) => void // settings.sortBy와 연동
  showUsed: boolean
  setShowUsed: (show: boolean) => void
}

export function MobileFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showUsed,
  setShowUsed,
}: MobileFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const activeFiltersCount = [selectedCategory !== "all", sortBy !== "expiryDate", showUsed].filter(Boolean).length

  const clearAllFilters = () => {
    setSelectedCategory("all")
    setSortBy("expiryDate") // 초기 정렬 기준
    setShowUsed(false)
    setIsFilterOpen(false)
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {/* 검색바 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="기프티콘 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 필터 버튼 & 활성 필터 */}
      <div className="flex items-center justify-between">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              필터
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px]">
            <SheetHeader>
              <SheetTitle>필터 설정</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">카테고리</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 카테고리</SelectItem>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">정렬</label>
                <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortBy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expiryDate">유효기간순</SelectItem>
                    <SelectItem value="registeredAt">등록일순</SelectItem>
                    <SelectItem value="brand">브랜드순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">사용완료 포함</label>
                <Button variant={showUsed ? "default" : "outline"} size="sm" onClick={() => setShowUsed(!showUsed)}>
                  {showUsed ? "ON" : "OFF"}
                </Button>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={clearAllFilters} className="flex-1 bg-transparent">
                  초기화
                </Button>
                <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                  적용
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* 활성 필터 표시 */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-1">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="text-xs">
                {categories[selectedCategory as keyof typeof categories]?.label}
              </Badge>
            )}
            {showUsed && (
              <Badge variant="secondary" className="text-xs">
                사용완료 포함
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

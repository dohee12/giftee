"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Grid, List } from "lucide-react"
import { categories } from "@/constants/gifticon-categories"
import type { SortBy } from "@/hooks/use-app-settings" // useSettings에서 SortBy 타입 임포트

interface GifticonFiltersDesktopProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: SortBy // settings.sortBy와 연동
  setSortBy: (sort: SortBy) => void // settings.sortBy와 연동
  showUsed: boolean
  setShowUsed: (show: boolean) => void
  listView: "card" | "list"
  setListView: (view: "card" | "list") => void
}

export function GifticonFiltersDesktop({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  showUsed,
  setShowUsed,
  listView,
  setListView,
}: GifticonFiltersDesktopProps) {
  return (
    <div className="mb-0">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
        {/* 전체 카테고리 */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="전체 카테고리" />
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

        {/* 유효기간(정렬) */}
        <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="유효기간순" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expiryDate">유효기간순</SelectItem>
            <SelectItem value="registeredAt">등록일순</SelectItem>
            <SelectItem value="brand">브랜드순</SelectItem>
          </SelectContent>
        </Select>

        {/* 검색창 */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="기프티콘 이름이나 브랜드로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 사용완료 포함 체크박스 */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUsed}
            onChange={(e) => setShowUsed(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">사용완료 포함</span>
        </label>

        {/* 변환 버튼(뷰 토글) */}
        <div className="flex border rounded-md ml-2">
          <Button
            variant={listView === "card" ? "default" : "ghost"}
            size="sm"
            onClick={() => setListView("card")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={listView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setListView("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

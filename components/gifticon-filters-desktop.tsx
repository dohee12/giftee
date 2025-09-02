"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
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
}: GifticonFiltersDesktopProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="기프티콘 이름이나 브랜드로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="카테고리 선택" />
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
        <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expiryDate">유효기간순</SelectItem>
            <SelectItem value="registeredAt">등록일순</SelectItem>
            <SelectItem value="brand">브랜드순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUsed}
            onChange={(e) => setShowUsed(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">사용완료 포함</span>
        </label>
      </div>
    </div>
  )
}

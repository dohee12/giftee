"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Plus, Search, ChevronLeft, Bell, Gift, Grid, List, History, Settings, X, Filter } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { CategoryCard } from "@/components/category-overview-card"
import { BrandCard } from "@/components/brand-overview-card"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { getBrandStats, filterAndSortGifticons, getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import { categories } from "@/constants/gifticon-categories"
import type { Gifticon } from "@/types/gifticon"
import { useIsMobile } from "@/hooks/use-mobile"
import { GifticonFiltersDesktop } from "@/components/gifticon-filters-desktop"
import { MobileFilters } from "@/components/mobile-filters"
import { useAuth } from "@/contexts/auth-context"

type ViewMode = "categories" | "brands" | "gifticons"

function BrandGifticonManagerContent() {
  const router = useRouter()
  const { gifticons, notifications, brandsByCategory, addGifticon, toggleUsed, deleteGifticon, getGifticonsByBrand } =
    useGifticons()
  const { settings, updateSetting } = useSettings()
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()

  const [viewMode, setViewMode] = useState<ViewMode>("categories")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [showUsedFilter, setShowUsedFilter] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)
  const { isLoggedIn, login, logout } = useAuth()

  const brandStats = getBrandStats(gifticons)

  const handleCategoryClick = (category: string) => {
    setSelectedCategoryFilter("all")
    setSearchTerm("")
    setSelectedCategory(category)
    setViewMode("brands")
  }

  const handleBrandClick = (brand: string) => {
    setSelectedCategoryFilter("all")
    setSearchTerm("")
    setSelectedBrand(brand)
    setViewMode("gifticons")
  }

  const handleBack = () => {
    if (viewMode === "gifticons") {
      setSelectedCategoryFilter("all")
      setSearchTerm("")
      setShowUsedFilter(false)
      setViewMode("brands")
      setSelectedBrand("")
    } else if (viewMode === "brands") {
      setSelectedCategoryFilter("all")
      setSearchTerm("")
      setShowUsedFilter(false)
      setViewMode("categories")
      setSelectedCategory("")
    }
  }

  const handleAddClick = () => {
    setIsAddDialogOpen(true)
  }

  const handleToggleUsed = (id: string) => {
    toggleUsed(id)
  }

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleLogout = () => {
    logout()
  }

  const baseGifticonsForFiltering =
    viewMode === "gifticons" && selectedBrand ? getGifticonsByBrand(selectedBrand) : gifticons

  const displayedGifticons = filterAndSortGifticons(
    baseGifticonsForFiltering,
    searchTerm,
    selectedCategoryFilter,
    settings.sortBy,
    settings.sortOrder,
    showUsedFilter,
    true,
  )

  // 검색어가 있을 때 모든 뷰에서 검색 결과를 보여주기 위한 로직
  const shouldShowSearchResults = searchTerm.trim() !== ""
  const searchResults = shouldShowSearchResults 
    ? filterAndSortGifticons(
        gifticons,
        searchTerm,
        "all",
        settings.sortBy,
        settings.sortOrder,
        false,
        true,
      )
    : []

  return (
    <SidebarInset>
      {/* 헤더 */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white overflow-hidden">
        {/* 왼쪽 섹션 */}
        <div className="flex items-center space-x-1">
          {/* 모바일에서만 사이드바 토글 표시 */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="메뉴 토글"
                >
                  <Gift className="h-6 w-6 text-blue-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">메뉴</h3>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center space-x-2 w-full">
                      <Gift className="h-4 w-4" />
                      <span>기프티콘 관리</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center space-x-2 w-full">
                      <History className="h-4 w-4" />
                      <span>사용 내역</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center space-x-2 w-full">
                      <Settings className="h-4 w-4" />
                      <span>설정</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button 
            onClick={() => {
              setViewMode("categories")
              setSelectedCategory("")
              setSelectedBrand("")
              setSearchTerm("")
              setSelectedCategoryFilter("all")
              setShowUsedFilter(false)
            }}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <h1 className="text-lg font-bold text-gray-900">Giftee</h1>
          </button>
        </div>

        {/* 중앙 섹션 - PC 검색창 */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="기프티콘 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          </div>

        {/* 오른쪽 섹션 */}
        <div className="flex items-center space-x-2">
          {/* 모바일 검색창 */}
          <div className="md:hidden relative w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="기프티콘 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 알림 */}
          {settings.expiryNotification && notifications.length > 0 && (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      만료 임박 기프티콘 ({notifications.length}개)
                    </h3>
                    <DropdownMenuSeparator />
                    {notifications.map((gifticon, index) => (
                      <DropdownMenuItem key={gifticon.id} className="flex flex-col items-start p-3 cursor-default">
                        <div className="flex items-center space-x-2 w-full">
                          <span className="text-sm font-medium text-red-600">
                            {index + 1}.
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {gifticon.brand} {gifticon.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getDaysUntilExpiry(gifticon.expiryDate)}일 남음
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* 로그인/로그아웃 버튼 */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">U</span>
                  </div>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center space-x-2">
                  <span className="text-sm">계정 설정</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                  <span className="text-sm">로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="p-2" onClick={handleLogin}>
              <span className="text-sm font-medium text-gray-700">로그인</span>
              </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {/* 만료 알림 */}
        {settings.expiryNotification && notifications.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong className="text-yellow-800">{notifications.length}개의 기프티콘</strong>이 곧 만료됩니다!
              <div className="mt-1 text-sm">
                {Object.entries(
                  notifications.reduce((acc, g) => {
                    acc[g.brand] = (acc[g.brand] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                ).slice(0, 3).map(([brand, count]) => (
                  <span key={brand} className="inline-block mr-3">
                    • {brand} ({count}개)
                  </span>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 필터 - 기프티콘 뷰에서만 표시 */}
        {viewMode === "gifticons" && (
          <div className="bg-white rounded-lg shadow-sm border">
            {isMobile ? (
              <div className="p-4">
                <div className="space-y-3">
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
                  
                  {/* 필터 버튼과 뷰 토글 */}
                  <div className="flex items-center space-x-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="relative bg-transparent">
                          <Filter className="h-4 w-4 mr-2" />
                          필터
                          {[selectedCategoryFilter !== "all", settings.sortBy !== "expiryDate", showUsedFilter].filter(Boolean).length > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600">
                              {[selectedCategoryFilter !== "all", settings.sortBy !== "expiryDate", showUsedFilter].filter(Boolean).length}
                            </Badge>
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
                            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
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
                            <label className="text-sm font-medium mb-2 block">정렬 기준</label>
                            <Select value={settings.sortBy} onValueChange={(value) => updateSetting("sortBy", value as any)}>
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
                          <div className="flex justify-start">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={showUsedFilter}
                                onChange={(e) => setShowUsedFilter(e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-600">사용완료 포함</span>
                            </label>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    {/* 모바일 뷰 토글 */}
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
                </div>
              </div>
            ) : (
              <div className="p-4 flex justify-center">
                <div className="w-full max-w-4xl">
                <GifticonFiltersDesktop
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategoryFilter}
                  setSelectedCategory={setSelectedCategoryFilter}
                  sortBy={settings.sortBy}
                  setSortBy={(value) => updateSetting("sortBy", value as any)}
                  showUsed={showUsedFilter}
                  setShowUsed={setShowUsedFilter}
                    listView={settings.listView}
                    setListView={(value) => updateSetting("listView", value)}
                />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 검색 결과 */}
        {shouldShowSearchResults && (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                검색 결과 ({searchResults.length}개)
              </h2>
              <p className="text-gray-600 mb-4">"{searchTerm}"에 대한 검색 결과입니다.</p>
            </div>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((gifticon) => (
                  <GifticonCard
                    key={gifticon.id}
                    gifticon={gifticon}
                    onToggleUsed={handleToggleUsed}
                    onView={setSelectedGifticon}
                    onDelete={deleteGifticon}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
                <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500">다른 검색어를 시도해보세요</p>
              </div>
            )}
          </>
        )}

        {/* 카테고리 개요 */}
        {viewMode === "categories" && !shouldShowSearchResults && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/all-gifticons" className="bg-white rounded-lg p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-2xl font-bold text-blue-600">
                  {gifticons.filter((g) => getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">내 기프티콘</p>
              </Link>
              <Link href="/unused-gifticons" className="bg-white rounded-lg p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-2xl font-bold text-green-600">
                  {gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">미사용 기프티콘</p>
              </Link>
              <Link href="/expiring-soon" className="bg-white rounded-lg p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-2xl font-bold text-yellow-600">{notifications.length}</p>
                <p className="text-sm text-gray-600">곧 만료 기프티콘</p>
              </Link>
              <Link href="/gifticon-brands" className="bg-white rounded-lg p-4 text-center shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-2xl font-bold text-purple-600">{Object.keys(brandStats).length}</p>
                <p className="text-sm text-gray-600">기프티콘 브랜드</p>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(brandsByCategory).map(([category, brands]) => (
                <CategoryCard
                  key={category}
                  category={category}
                  brands={brands}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          </>
        )}

        {/* 브랜드 목록 */}
        {viewMode === "brands" && (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleBack} className="p-1">
                  <ChevronLeft className="h-28 w-28 text-gray-500" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{categories[selectedCategory as keyof typeof categories]?.label || selectedCategory} 카테고리</h2>
              <p className="text-gray-600">{brandsByCategory[selectedCategory]?.length || 0}개의 브랜드</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandsByCategory[selectedCategory]?.map((brand) => (
                <BrandCard
                  key={brand.name}
                  brand={brand}
                  expiringSoonCount={brandStats[brand.name]?.expiringSoon || 0}
                  onClick={() => handleBrandClick(brand.name)}
                />
              ))}
            </div>
          </>
        )}

        {/* 기프티콘 목록 */}
        {viewMode === "gifticons" && (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="p-1">
                    <ChevronLeft className="h-28 w-28 text-gray-500" />
                  </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBrand}</h2>
                  <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="secondary">전체 {brandStats[selectedBrand]?.total || 0}개</Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    사용가능 {brandStats[selectedBrand]?.unused || 0}개
                  </Badge>
                  {brandStats[selectedBrand]?.expiringSoon > 0 && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                      곧만료 {brandStats[selectedBrand]?.expiringSoon}개
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {displayedGifticons.length > 0 ? (
              <div
                className={
                  settings.listView === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                }
              >
                {displayedGifticons.map((gifticon) =>
                  settings.listView === "card" ? (
                    <GifticonCard
                      key={gifticon.id}
                      gifticon={gifticon}
                      onToggleUsed={handleToggleUsed}
                      onView={setSelectedGifticon}
                      onDelete={deleteGifticon}
                    />
                  ) : (
                    <GifticonListItem
                      key={gifticon.id}
                      gifticon={gifticon}
                      onToggleUsed={handleToggleUsed}
                      onView={setSelectedGifticon}
                      onDelete={deleteGifticon}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
                <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? "검색 결과가 없습니다" : "등록된 기프티콘이 없습니다"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? "다른 검색어를 시도해보세요" : "새로운 기프티콘을 등록해보세요!"}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddClick} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    기프티콘 등록
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 다이얼로그 */}
      <AddGifticonDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={addGifticon} />
      <GifticonDetailDialog
        gifticon={selectedGifticon}
        isOpen={!!selectedGifticon}
        onClose={() => setSelectedGifticon(null)}
      />
      
      {/* Floating Action Button - 추가 버튼 */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        title="기프티콘 추가"
      >
        <Plus className="h-6 w-6" />
      </button>
    </SidebarInset>
  )
}

export default function BrandGifticonManager() {
  return (
    <LayoutWrapper>
      <BrandGifticonManagerContent />
    </LayoutWrapper>
  )
}

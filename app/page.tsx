"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { categories as categoryMeta } from "@/constants/gifticon-categories"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, Bell, Gift, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { CategoryCard } from "@/components/category-overview-card"
import { BrandCard } from "@/components/brand-overview-card"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import { BulkEditGifticonDialog } from "@/components/bulk-edit-gifticon-dialog"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { getBrandStats, filterAndSortGifticons, getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import type { Gifticon } from "@/types/gifticon"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAIRecommendations } from "@/hooks/use-ai-recommendations"
import { AIRecommendationAlert } from "@/components/ai-recommendation-alert"
import { useAuth } from "@/contexts/auth-context"

type ViewMode = "categories" | "brands" | "gifticons"

function BrandGifticonManagerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams?.get("q") ?? ""
  const { gifticons, notifications, brandsByCategory, addGifticon, toggleUsed, deleteGifticon, updateGifticon, getGifticonsByBrand } =
    useGifticons()
  const { settings, updateSetting } = useSettings()
  const isMobile = useIsMobile()
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleSidebar, openMobile, state } = useSidebar()

  const { recommendations } = useAIRecommendations(gifticons)

  const [viewMode, setViewMode] = useState<ViewMode>("categories")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [showUsedFilter, setShowUsedFilter] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)
  const [selectedGifticons, setSelectedGifticons] = useState<Set<string>>(new Set())
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [dismissedRecommendationIds, setDismissedRecommendationIds] = useState<Set<string>>(new Set())
  const [expiringOnly, setExpiringOnly] = useState(false)
  const isSearchActive = searchTerm.trim() !== ""
  const scopeLabel = isSearchActive
    ? "검색결과"
    : expiringOnly
    ? "곧 만료 기프티콘"
    : !showUsedFilter
    ? "미사용 기프티콘"
    : "전체 기프티콘"

  useEffect(() => {
    // URL 쿼리(q)와 검색어 동기화
    setSearchTerm(urlQuery)
  }, [urlQuery])

  const handleLogoClick = () => {
    setViewMode("categories")
    setSelectedCategory("")
    setSelectedBrand("")
    setSelectedCategoryFilter("all")
    setSearchTerm("")
    setShowUsedFilter(false)
    setExpiringOnly(false)
  }

  // 사이드바의 "기프티콘 관리" 클릭 시 메인 초기화와 동일하게 동작하도록 이벤트 수신
  useEffect(() => {
    const onGoHome = () => {
      handleLogoClick()
    }
    window.addEventListener("giftee:go-home", onGoHome as EventListener)
    return () => window.removeEventListener("giftee:go-home", onGoHome as EventListener)
  }, [])

  const brandStats = getBrandStats(gifticons)

  // 디버깅: 브랜드 통계 확인
  useEffect(() => {
    console.log("=== 브랜드 통계 디버깅 ===")
    console.log("전체 기프티콘:", gifticons)
    console.log("브랜드 통계:", brandStats)
    console.log("맥도날드 기프티콘:", gifticons.filter(g => g.brand === "맥도날드"))
    console.log("맥도날드 통계:", brandStats["맥도날드"])
    console.log("브랜드별 카테고리:", brandsByCategory)
    console.log("=== 디버깅 끝 ===")
  }, [gifticons, brandStats, brandsByCategory])

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
      // 브랜드 상세 보기에 들어온 경우에는 브랜드 목록으로,
      // 최상위(전체/미사용/곧만료)에서 온 경우에는 초기 카테고리 화면으로 이동
      if (selectedBrand) {
        setSelectedCategoryFilter("all")
        setSearchTerm("")
        setShowUsedFilter(false)
        setViewMode("brands")
        setSelectedBrand("")
      } else {
        handleLogoClick()
      }
    } else if (viewMode === "brands") {
      // 브랜드 목록에서 뒤로가면 항상 초기 카테고리 화면으로
      handleLogoClick()
    }
  }

  const handleAddClick = () => {
    // 로그인 없이도 기프티콘 추가 가능
    setIsAddDialogOpen(true)
  }

  const handleToggleUsed = (id: string) => {
    toggleUsed(id)
  }

  const handleEditGifticon = (updatedGifticon: Gifticon) => {
    updateGifticon(updatedGifticon)
  }

  const handleBulkEditGifticons = (updatedGifticons: Gifticon[]) => {
    // 모든 수정된 기프티콘을 업데이트
    updatedGifticons.forEach(updatedGifticon => {
      updateGifticon(updatedGifticon)
    })
    
    // 선택 모드 종료
    setIsSelectMode(false)
    setSelectedGifticons(new Set())
  }

  const handleSelectGifticon = (gifticonId: string) => {
    setSelectedGifticons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(gifticonId)) {
        newSet.delete(gifticonId)
      } else {
        newSet.add(gifticonId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGifticons(new Set(displayedGifticons.map(g => g.id)))
    } else {
      setSelectedGifticons(new Set())
    }
  }

  const handleClearSelection = () => {
    setSelectedGifticons(new Set())
    setIsSelectMode(false)
  }

  const handleUseGifticon = (gifticonId: string) => {
    const gifticon = gifticons.find((g) => g.id === gifticonId)
    if (gifticon) {
      setSelectedGifticon(gifticon)
    }
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

  const finalDisplayedGifticons = expiringOnly
    ? displayedGifticons.filter((g) => {
        const d = getDaysUntilExpiry(g.expiryDate)
        return d !== Infinity && d >= 0 && d <= settings.expiryNotificationDays
      })
    : displayedGifticons

  // 브랜드 뷰에서 표시할 브랜드 목록 (특정 카테고리 또는 전체)
  const brandsListForView = selectedCategory === "all"
    ? Array.from(
        new Map(
          Object.values(brandsByCategory)
            .flat()
            .map((b) => [b.name, b]),
        ).values(),
      )
    : (brandsByCategory[selectedCategory] || [])

  // 전체 고유 브랜드 수 (카드 표시와 목록 표시를 일치시킴)
  const allUniqueBrandsCount = Array.from(
    new Map(
      Object.values(brandsByCategory)
        .flat()
        .map((b) => [b.name, b]),
    ).values(),
  ).length

  return (
    <SidebarInset>
      {/* 헤더 */}
      <header className="relative flex h-16 shrink-0 items-center gap-2 border-b px-2 md:px-4 bg-white">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-3">
            {/* 모바일: PC 사이드바 스타일의 토글 버튼 (그라데이션 상자 + >/<) */}
            <button
              onClick={toggleSidebar}
              aria-label="사이드바 토글"
              className="md:hidden inline-flex items-center justify-center"
            >
              <div className="group/icon relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-base font-ydsnow font-black">G</span>
                {(isMobile ? openMobile : state !== "collapsed") ? (
                  <ChevronLeft className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                ) : (
                  <ChevronRight className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                )}
              </div>
            </button>
            <button onClick={handleLogoClick} aria-label="홈으로" className="cursor-pointer">
              <h1 className="text-xl font-black text-gray-900 font-ydsnow">Giftee</h1>
            </button>
          </div>

          {/* 검색바 */}
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
          {/* 알림 */}
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
                        <div className="text-xs text-gray-600">{getDaysUntilExpiry(g.expiryDate)}일 남음 · {g.expiryDate}</div>
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

          {/* 로그인/아바타 */}
          {!isAuthenticated ? (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">로그인</Button>
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="계정" className="h-8 w-8 rounded-full overflow-hidden border">
                  <img
                    src={user?.photoUrl || "/avatar-placeholder.png"}
                    alt={user?.name || "user"}
                    className="h-full w-full object-cover"
                  />
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
          {/* 추가 버튼 (헤더에서 제거: FAB로 대체) */}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {/* 만료 알림 - 항상 맨 위에 표시 */}
        {settings.expiryNotification && notifications.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong className="text-yellow-800">{notifications.length}개의 기프티콘</strong>이 곧 만료됩니다!
              <div className="mt-1 text-sm">
                {notifications.slice(0, 3).map((g, index) => (
                  <span key={g.id} className="inline-block mr-3">
                    • {g.brand} {g.name} ({getDaysUntilExpiry(g.expiryDate)}일 남음)
                  </span>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* AI recommendations display - 최대 1개만 표시 */}
        {recommendations
          .filter((r) => !dismissedRecommendationIds.has(r.id))
          .slice(0, 1)
          .map((recommendation) => (
          <AIRecommendationAlert
            key={recommendation.id}
            recommendation={recommendation}
            onDismiss={() =>
              setDismissedRecommendationIds((prev) => new Set(prev).add(recommendation.id))
            }
            onUseGifticon={handleUseGifticon}
          />
        ))}

        {/* 카테고리 개요 */}
        {viewMode === "categories" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  setViewMode("gifticons")
                  setShowUsedFilter(true)
                  setExpiringOnly(false)
                  setSelectedBrand("")
                }}
                className="bg-white rounded-lg p-4 text-center shadow-sm border hover:bg-gray-50 transition-colors"
              >
                <p className="text-2xl font-bold text-blue-600">
                  {gifticons.filter((g) => getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">전체 기프티콘</p>
              </button>
              <button
                onClick={() => {
                  setViewMode("gifticons")
                  setShowUsedFilter(false)
                  setExpiringOnly(false)
                  setSelectedBrand("")
                }}
                className="bg-white rounded-lg p-4 text-center shadow-sm border hover:bg-gray-50 transition-colors"
              >
                <p className="text-2xl font-bold text-green-600">
                  {gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">미사용 기프티콘</p>
              </button>
              <button
                onClick={() => {
                  setViewMode("gifticons")
                  setShowUsedFilter(false)
                  setExpiringOnly(true)
                  setSelectedBrand("")
                }}
                className="bg-white rounded-lg p-4 text-center shadow-sm border hover:bg-gray-50 transition-colors"
              >
                <p className="text-2xl font-bold text-yellow-600">{notifications.length}</p>
                <p className="text-sm text-gray-600">곧 만료 기프티콘</p>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setViewMode("brands")
                }}
                className="bg-white rounded-lg p-4 text-center shadow-sm border hover:bg-gray-50 transition-colors"
              >
                <p className="text-2xl font-bold text-purple-600">{allUniqueBrandsCount}</p>
                <p className="text-sm text-gray-600">기프티콘 브랜드</p>
              </button>
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
              <div className="flex items-center gap-1 mb-2">
                <Button variant="ghost" size="sm" className="p-1" onClick={handleBack} aria-label="뒤로">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">{selectedCategory === "all" ? "전체 브랜드" : (categoryMeta[selectedCategory]?.label || selectedCategory) + " 카테고리"}</h2>
              </div>
              <p className="text-gray-600">{brandsListForView.length}개의 브랜드</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandsListForView.map((brand) => (
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
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                {isSearchActive ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">검색결과</h2>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      사용가능 {displayedGifticons.filter((g) => !g.isUsed).length}개
                    </Badge>
                    {displayedGifticons.filter((g) => {
                      const d = getDaysUntilExpiry(g.expiryDate)
                      return !g.isUsed && d !== Infinity && d >= 0 && d <= settings.expiryNotificationDays
                    }).length > 0 && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        곧만료 {
                          displayedGifticons.filter((g) => {
                            const d = getDaysUntilExpiry(g.expiryDate)
                            return !g.isUsed && d !== Infinity && d >= 0 && d <= settings.expiryNotificationDays
                          }).length
                        }개
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="ghost" size="sm" className="p-1" onClick={handleBack} aria-label="뒤로">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold text-gray-800">{scopeLabel}</span>
                    <span className="text-lg font-semibold text-gray-400">-</span>
                    <h2 className="text-xl font-bold text-gray-900">{selectedBrand}</h2>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      사용가능 {brandStats[selectedBrand]?.unused || 0}개
                    </Badge>
                    {brandStats[selectedBrand]?.expiringSoon > 0 && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        곧만료 {brandStats[selectedBrand]?.expiringSoon}개
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-2 md:justify-end w-full md:w-auto">
                  {/* 일괄 수정 버튼 */}
                  <Button 
                    variant={isSelectMode ? "default" : "outline"} 
                    onClick={() => setIsSelectMode(!isSelectMode)}
                    size="sm"
                  >
                    {isSelectMode ? "선택 해제" : "일괄 수정"}
                  </Button>
                  {/* 보기 형식 토글 */}
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

              

              {/* 선택 모드 UI */}
              {isSelectMode && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedGifticons.size === displayedGifticons.length && displayedGifticons.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-blue-800">전체 선택</span>
                      </label>
                      <span className="text-sm text-blue-600">
                        {selectedGifticons.size}개 선택됨
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {selectedGifticons.size > 0 && (
                        <Button size="sm" variant="outline" onClick={handleClearSelection}>
                          선택 해제
                        </Button>
                      )}
                      {selectedGifticons.size > 0 && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsBulkEditOpen(true)}>
                          일괄 수정 ({selectedGifticons.size}개)
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {displayedGifticons.length > 0 ? (
              <div
                className={
                  settings.listView === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
                }
              >
                {finalDisplayedGifticons.map((gifticon) =>
                  settings.listView === "card" ? (
                    <GifticonCard
                      key={gifticon.id}
                      gifticon={gifticon}
                      onToggleUsed={handleToggleUsed}
                      onView={setSelectedGifticon}
                      onDelete={deleteGifticon}
                      onEdit={handleEditGifticon}
                      isSelectMode={isSelectMode}
                      isSelected={selectedGifticons.has(gifticon.id)}
                      onSelect={handleSelectGifticon}
                    />
                  ) : (
                    <GifticonListItem
                      key={gifticon.id}
                      gifticon={gifticon}
                      onToggleUsed={handleToggleUsed}
                      onView={setSelectedGifticon}
                      onDelete={deleteGifticon}
                      onEdit={handleEditGifticon}
                      isSelectMode={isSelectMode}
                      isSelected={selectedGifticons.has(gifticon.id)}
                      onSelect={handleSelectGifticon}
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

      {/* 플로팅 추가 버튼 (FAB) */}
      <Button
        onClick={handleAddClick}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg bg-blue-600 hover:bg-blue-700"
        aria-label="기프티콘 추가"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>

      {/* 다이얼로그 */}
      <AddGifticonDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => {
          console.log("Parent onClose called, setting isAddDialogOpen to false")
          setIsAddDialogOpen(false)
        }} 
        onAdd={addGifticon} 
      />
      <GifticonDetailDialog
        gifticon={selectedGifticon}
        isOpen={!!selectedGifticon}
        onClose={() => setSelectedGifticon(null)}
      />
      <BulkEditGifticonDialog
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        gifticons={gifticons.filter(g => selectedGifticons.has(g.id))}
        onSave={handleBulkEditGifticons}
      />
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
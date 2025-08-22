"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Plus, Search, ArrowLeft, Bell, Gift, Grid, List } from "lucide-react"
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

type ViewMode = "categories" | "brands" | "gifticons"

function BrandGifticonManagerContent() {
  const router = useRouter()
  const { gifticons, notifications, brandsByCategory, addGifticon, toggleUsed, deleteGifticon, updateGifticon, getGifticonsByBrand } =
    useGifticons()
  const { settings, updateSetting } = useSettings()
  const isMobile = useIsMobile()

  const { recommendations, dismissRecommendation } = useAIRecommendations(gifticons)



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

  const handleSelectGifticon = (gifticonId: string, checked: boolean) => {
    setSelectedGifticons(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(gifticonId)
      } else {
        newSet.delete(gifticonId)
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



  return (
    <SidebarInset>
      {/* 헤더 */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">기프티콘 모음북</h1>
          </div>

          {viewMode !== "categories" && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              뒤로
            </Button>
          )}

          {/* 검색바 */}
          <div className="relative flex-1 max-w-md">
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
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              </Button>
            </div>
          )}

          {/* 뷰 토글 - 기프티콘 목록에서만 표시 */}
          {viewMode === "gifticons" && (
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
          )}

          {/* 추가 버튼 */}
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
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
        {recommendations.slice(0, 1).map((recommendation) => (
          <AIRecommendationAlert
            key={recommendation.id}
            recommendation={recommendation}
            onDismiss={() => dismissRecommendation(recommendation.id)}
            onUseGifticon={handleUseGifticon}
          />
        ))}

        {/* 카테고리 개요 */}
        {viewMode === "categories" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
                <p className="text-2xl font-bold text-blue-600">
                  {gifticons.filter((g) => getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">전체 기프티콘</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
                <p className="text-2xl font-bold text-green-600">
                  {gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) >= 0).length}
                </p>
                <p className="text-sm text-gray-600">사용 가능</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
                <p className="text-2xl font-bold text-yellow-600">{notifications.length}</p>
                <p className="text-sm text-gray-600">곧 만료</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border">
                <p className="text-2xl font-bold text-purple-600">{Object.keys(brandStats).length}</p>
                <p className="text-sm text-gray-600">브랜드 수</p>
              </div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedCategory} 카테고리</h2>
              <p className="text-gray-600">{brandsByCategory[selectedCategory]?.length || 0}개의 브랜드</p>
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
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBrand}</h2>
                  <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
                </div>
                <div className="flex items-center space-x-4">
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
                  
                  {/* 일괄 수정 버튼 */}
                  <Button 
                    variant={isSelectMode ? "default" : "outline"} 
                    onClick={() => {
                      console.log("선택 모드 토글 클릭, 현재 상태:", isSelectMode)
                      setIsSelectMode(!isSelectMode)
                      console.log("새로운 상태:", !isSelectMode)
                    }}
                    size="sm"
                  >
                    {isSelectMode ? "선택 해제" : "일괄 수정"}
                  </Button>
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
                {displayedGifticons.map((gifticon) =>
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

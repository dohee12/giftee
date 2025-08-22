"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Plus, ChevronLeft, Bell, Gift, Grid, List, History, Settings, ChevronRight } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { filterAndSortGifticons, getDaysUntilExpiry, getBrandStats } from "@/utils/gifticon-data-utils"
import type { Gifticon } from "@/types/gifticon"
import { useIsMobile } from "@/hooks/use-mobile"
import { GifticonFiltersDesktop } from "@/components/gifticon-filters-desktop"
import { MobileFilters } from "@/components/mobile-filters"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { useRouter } from "next/navigation"

function GifticonBrandsPageContent() {
  const router = useRouter()
  const { gifticons, addGifticon, toggleUsed, deleteGifticon } = useGifticons()
  const { settings, updateSetting } = useSettings()
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [showUsedFilter, setShowUsedFilter] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string>("")

  const handleAddClick = () => {
    setIsAddDialogOpen(true)
  }

  const handleToggleUsed = (id: string) => {
    toggleUsed(id)
  }

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand)
  }

  const handleBack = () => {
    setSelectedBrand("")
  }

  // 브랜드별 기프티콘 그룹화
  const brandStats = getBrandStats(gifticons)
  const brands = Object.keys(brandStats).filter((b) => brandStats[b].unused > 0).sort()

  // 선택된 브랜드의 기프티콘만 필터링
  const brandGifticons = selectedBrand 
    ? gifticons.filter(g => g.brand === selectedBrand)
    : []
  const brandActiveUnexpired = brandGifticons.filter((g) => getDaysUntilExpiry(g.expiryDate) >= 0)
  const brandActiveUnused = brandActiveUnexpired.filter((g) => !g.isUsed)

  const totalActiveUnusedAll = gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) >= 0).length

  const displayedGifticons = filterAndSortGifticons(
    brandGifticons,
    searchTerm,
    selectedCategoryFilter,
    settings.sortBy,
    settings.sortOrder,
    showUsedFilter,
    true,
  )

  return (
    <SidebarInset>
      <AppHeader
        rightExtra={selectedBrand ? (
          <div className="hidden md:flex border rounded-md">
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
        ) : undefined}
      />

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {!selectedBrand ? (
          // 브랜드 목록
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">기프티콘 브랜드</h2>
                <p className="text-gray-600">{brands.length}개의 브랜드</p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary">브랜드 수 {brands.length}개</Badge>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  총 {totalActiveUnusedAll}개 기프티콘
                </Badge>
              </div>
            </div>

            {brands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">🏪</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{brand}</h3>
                          <p className="text-sm text-gray-600">
                            {brandStats[brand].total}개의 기프티콘
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        미사용 {brandStats[brand].unused}
                      </Badge>
                      {brandStats[brand].expiringSoon > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">
                          곧 만료 {brandStats[brand].expiringSoon}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">브랜드가 없습니다</div>
            )}
          </div>
        ) : (
          // 선택된 브랜드의 기프티콘 목록
          <>
            {/* 뒤로가기 버튼 */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleBack} className="p-1">
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBrand}</h2>
                  <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
                </div>
              </div>
            </div>

            {/* 필터 */}
            <div className="bg-white rounded-lg shadow-sm border">
              {isMobile ? (
                <MobileFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategoryFilter}
                  setSelectedCategory={setSelectedCategoryFilter}
                  sortBy={settings.sortBy}
                  setSortBy={(value) => updateSetting("sortBy", value as any)}
                  showUsed={showUsedFilter}
                  setShowUsed={setShowUsedFilter}
                />
              ) : (
                <div className="p-4">
                  <GifticonFiltersDesktop
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategoryFilter}
                    setSelectedCategory={setSelectedCategoryFilter}
                    sortBy={settings.sortBy}
                    setSortBy={(value: any) => updateSetting("sortBy", value as any)}
                    showUsed={showUsedFilter}
                    setShowUsed={setShowUsedFilter}
                    listView={settings.listView}
                    setListView={(value) => updateSetting("listView", value)}
                  />
                </div>
              )}
            </div>

            {/* 기프티콘 목록 */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBrand} 기프티콘</h2>
                  <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="secondary">전체 {brandActiveUnused.length}개</Badge>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">사용가능 {brandActiveUnused.length}개</Badge>
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
                    {searchTerm ? "검색 결과가 없습니다" : `${selectedBrand} 기프티콘이 없습니다`}
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
            </div>
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

export default function GifticonBrandsPage() {
  return (
    <LayoutWrapper>
      <GifticonBrandsPageContent />
    </LayoutWrapper>
  )
}


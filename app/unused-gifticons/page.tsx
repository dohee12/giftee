"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset } from "@/components/ui/sidebar"
import { Plus, Gift } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { filterAndSortGifticons, getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import type { Gifticon } from "@/types/gifticon"
import { useIsMobile } from "@/hooks/use-mobile"
import { GifticonFiltersDesktop } from "@/components/gifticon-filters-desktop"
import { MobileFilters } from "@/components/mobile-filters"
import { AppHeader } from "@/components/app-header"

function UnusedGifticonsPageContent() {
  const { gifticons, addGifticon, toggleUsed, deleteGifticon } = useGifticons()
  const { settings, updateSetting } = useSettings()
  const isMobile = useIsMobile()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [showUsedFilter, setShowUsedFilter] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedGifticon, setSelectedGifticon] = useState<Gifticon | null>(null)

  const handleAddClick = () => {
    setIsAddDialogOpen(true)
  }

  const handleToggleUsed = (id: string) => {
    toggleUsed(id)
  }

  // 미사용 기프티콘만 필터링 (만료 제외)
  const unusedGifticons = gifticons.filter((g) => !g.isUsed && getDaysUntilExpiry(g.expiryDate) >= 0)

  const displayedGifticons = filterAndSortGifticons(
    unusedGifticons,
    searchTerm,
    selectedCategoryFilter,
    settings.sortBy,
    settings.sortOrder,
    false, // 사용된 기프티콘은 표시하지 않음
    true,
  )

  return (
    <SidebarInset>
      <AppHeader />

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
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
                setSortBy={(value) => updateSetting("sortBy", value as any)}
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
              <h2 className="text-xl font-bold text-gray-900">미사용 기프티콘</h2>
              <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">전체 {unusedGifticons.length}개</Badge>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                사용가능 {unusedGifticons.length}개
              </Badge>
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
                {searchTerm ? "검색 결과가 없습니다" : "미사용 기프티콘이 없습니다"}
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

export default function UnusedGifticonsPage() {
  return (
    <LayoutWrapper>
      <UnusedGifticonsPageContent />
    </LayoutWrapper>
  )
}

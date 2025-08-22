"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Plus, Search, ChevronLeft, Bell, Gift, Grid, List, History, Settings } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { GifticonCard } from "@/components/gifticon-card"
import { GifticonListItem } from "@/components/gifticon-list-item"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { GifticonDetailDialog } from "@/components/gifticon-detail-dialog"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { filterAndSortGifticons, getDaysUntilExpiry, getExpiringSoonGifticons } from "@/utils/gifticon-data-utils"
import type { Gifticon } from "@/types/gifticon"
import { useIsMobile } from "@/hooks/use-mobile"
import { GifticonFiltersDesktop } from "@/components/gifticon-filters-desktop"
import { MobileFilters } from "@/components/mobile-filters"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { useRouter } from "next/navigation"

function ExpiringSoonPageContent() {
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

  const handleAddClick = () => {
    setIsAddDialogOpen(true)
  }

  const handleToggleUsed = (id: string) => {
    toggleUsed(id)
  }

  // 곧 만료될 기프티콘만 필터링
  const expiringSoonGifticons = getExpiringSoonGifticons(gifticons, settings.expiryNotificationDays)

  // 만료 임박 기프티콘은 항상 만료일이 빠른 순으로 정렬
  const displayedGifticons = filterAndSortGifticons(
    expiringSoonGifticons,
    searchTerm,
    selectedCategoryFilter,
    "expiryDate", // 항상 만료일 기준으로 정렬
    "asc", // 오름차순 (빠른 순)
    showUsedFilter,
    true,
  )

  return (
    <SidebarInset>
      <AppHeader />

      <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
        {/* 만료 알림 */}
        {expiringSoonGifticons.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Bell className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong className="text-yellow-800">{expiringSoonGifticons.length}개의 기프티콘</strong>이 곧 만료됩니다!
              <div className="mt-1 text-sm">
                {Object.entries(
                  expiringSoonGifticons.reduce((acc, g) => {
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

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {isMobile ? (
            <MobileFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategoryFilter}
              setSelectedCategory={setSelectedCategoryFilter}
              sortBy="expiryDate"
              setSortBy={() => {}} // 만료 임박 페이지에서는 정렬 변경 불가
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
                sortBy="expiryDate"
                setSortBy={() => {}} // 만료 임박 페이지에서는 정렬 변경 불가
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
              <h2 className="text-xl font-bold text-gray-900">곧 만료될 기프티콘</h2>
              <p className="text-gray-600">{displayedGifticons.length}개의 기프티콘</p>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">전체 {expiringSoonGifticons.length}개</Badge>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                {settings.expiryNotificationDays}일 이내 만료
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
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? "검색 결과가 없습니다" : "곧 만료될 기프티콘이 없습니다"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "다른 검색어를 시도해보세요" : "모든 기프티콘이 안전합니다!"}
              </p>
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

export default function ExpiringSoonPage() {
  return (
    <LayoutWrapper>
      <ExpiringSoonPageContent />
    </LayoutWrapper>
  )
}

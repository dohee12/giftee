"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Barcode, Edit, MoreVertical, Eye, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { categories } from "@/constants/gifticon-categories"
import { BarcodeViewer } from "./barcode-viewer"
import { EditGifticonDialog } from "./edit-gifticon-dialog"
import { ImageViewer } from "./image-viewer"
import type { Gifticon } from "@/types/gifticon"

interface GifticonCardProps {
  gifticon: Gifticon
  onToggleUsed: (id: string) => void
  onView: (gifticon: Gifticon) => void
  onEdit?: (gifticon: Gifticon) => void
  onDelete?: (id: string) => void
  isSelectMode?: boolean
  isSelected?: boolean
  onSelect?: (id: string) => void
}

export function GifticonCard({
  gifticon,
  onToggleUsed,
  onView,
  onEdit,
  onDelete,
  isSelectMode = false,
  isSelected = false,
  onSelect,
}: GifticonCardProps) {
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)

  const categoryInfo = categories[gifticon.category] || categories.lifestyle
  const daysUntilExpiry = gifticon.expiryDate === "no-expiry" ? null : 
    Math.ceil((new Date(gifticon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const handleEdit = () => {
    if (onEdit) {
      onEdit(gifticon)
    } else {
      setIsEditOpen(true)
    }
  }

  const handleSave = (updatedGifticon: Gifticon) => {
    if (onEdit) {
      onEdit(updatedGifticon)
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
        {/* 선택 체크박스 */}
        {isSelectMode && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect?.(gifticon.id)}
              className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* 이미지 섹션 */}
            <div className="flex-shrink-0">
              {gifticon.imageUrl ? (
                <div 
                  className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  <img
                    src={gifticon.imageUrl}
                    alt={gifticon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  이미지 없음
                </div>
              )}
            </div>

            {/* 정보 섹션 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {gifticon.giftType === "amount" ? "금액권" : "교환권"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: categoryInfo.color + "20", 
                        borderColor: categoryInfo.color,
                        color: categoryInfo.color 
                      }}
                    >
                      {categoryInfo.label}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {gifticon.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {gifticon.brand}
                  </p>
                </div>
                
                {/* 헤더 액션 */}
                <div className="flex items-center space-x-1 ml-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(gifticon)}>
                        <Eye className="h-4 w-4 mr-2" />
                        상세보기
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={handleEdit}>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(gifticon.id)} className="text-red-600">
                          삭제
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="space-y-1 mb-3">
                {daysUntilExpiry !== null && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`font-medium ${
                      daysUntilExpiry <= 7 ? "text-red-600" : 
                      daysUntilExpiry <= 30 ? "text-orange-600" : "text-gray-600"
                    }`}>
                      {daysUntilExpiry > 0 ? `D-${daysUntilExpiry}` : "만료됨"}
                    </span>
                    <span className="text-gray-500">
                      {gifticon.expiryDate}
                    </span>
                  </div>
                )}
                {gifticon.memo && (
                  <p className="text-sm text-gray-600 truncate">
                    {gifticon.memo}
                  </p>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={gifticon.isUsed ? "secondary" : "default"}
                  onClick={() => {
                    console.log("Button clicked for gifticon:", gifticon.id, gifticon.name)
                    onToggleUsed(gifticon.id)
                  }}
                  className="flex-1"
                >
                  {gifticon.isUsed ? "사용취소" : "사용완료"}
                </Button>
                {gifticon.barcode && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsBarcodeOpen(true)}
                    title="바코드 보기"
                    className="px-3"
                  >
                    <Barcode className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 이미지 뷰어 */}
      <ImageViewer
        imageUrl={gifticon.imageUrl || ""}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        title={gifticon.name}
      />

      {/* 바코드 뷰어 */}
      {gifticon.barcode && (
        <BarcodeViewer
          barcode={gifticon.barcode}
          gifticonName={gifticon.name}
          brand={gifticon.brand}
          isOpen={isBarcodeOpen}
          onClose={() => setIsBarcodeOpen(false)}
        />
      )}

      {/* 수정 다이얼로그 */}
      <EditGifticonDialog
        gifticon={gifticon}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}

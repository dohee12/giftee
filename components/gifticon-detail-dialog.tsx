"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Barcode } from "lucide-react"
import { categories } from "@/constants/gifticon-categories"
import { BarcodeViewer } from "./barcode-viewer"
import { ImageViewer } from "./image-viewer"
import { useToast } from "@/hooks/use-toast"
import type { Gifticon } from "@/types/gifticon"

interface GifticonDetailDialogProps {
  gifticon: Gifticon | null
  isOpen: boolean
  onClose: () => void
}

export function GifticonDetailDialog({ gifticon, isOpen, onClose }: GifticonDetailDialogProps) {
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false)
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const { toast } = useToast()

  if (!gifticon) return null

  const categoryInfo = categories[gifticon.category] || categories.lifestyle
  const daysUntilExpiry = gifticon.expiryDate === "no-expiry" ? null : 
    Math.ceil((new Date(gifticon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const handleCopyBarcode = async () => {
    if (gifticon.barcode) {
      try {
        await navigator.clipboard.writeText(gifticon.barcode)
        toast({
          title: "복사 완료! 📋",
          description: "바코드 번호가 클립보드에 복사되었습니다.",
        })
      } catch (error) {
        toast({
          title: "복사 실패 ❌",
          description: "바코드 번호 복사에 실패했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span>기프티콘 상세보기</span>
              <Badge variant="secondary">
                {gifticon.giftType === "amount" ? "금액권" : "교환권"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 이미지 섹션 */}
            <div className="flex justify-center">
              {gifticon.imageUrl ? (
                <div 
                  className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  <img
                    src={gifticon.imageUrl}
                    alt={gifticon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: categoryInfo.color + "20", 
                    borderColor: categoryInfo.color,
                    color: categoryInfo.color 
                  }}
                >
                  {categoryInfo.label}
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {gifticon.name}
                </h3>
                <p className="text-gray-600 text-lg">
                  {gifticon.brand}
                </p>
              </div>

              {/* 유효기간 정보 */}
              {daysUntilExpiry !== null && (
                <div className="flex items-center space-x-3">
                  <span className={`text-lg font-medium ${
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

              {/* 메모 */}
              {gifticon.memo && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{gifticon.memo}</p>
                </div>
              )}
            </div>

            {/* 바코드 정보 */}
            {gifticon.barcode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">바코드 번호</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyBarcode}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>복사</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBarcodeOpen(true)}
                      className="flex items-center space-x-2"
                    >
                      <Barcode className="h-4 w-4" />
                      <span>바코드 보기</span>
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-mono text-sm">{gifticon.barcode}</p>
                </div>
              </div>
            )}

            {/* 등록 정보 */}
            <div className="text-sm text-gray-500 border-t pt-4">
              <p>등록일: {gifticon.registeredAt}</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  )
}

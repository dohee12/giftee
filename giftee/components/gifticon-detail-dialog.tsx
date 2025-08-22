"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { getExpiryStatus } from "@/utils/gifticon-data-utils"
import { brandLogos, categories } from "@/constants/gifticon-categories"
import { useSettings } from "@/hooks/use-app-settings" // useSettings 훅 임포트

interface GifticonDetailDialogProps {
  gifticon: Gifticon | null
  isOpen: boolean
  onClose: () => void
}

export function GifticonDetailDialog({ gifticon, isOpen, onClose }: GifticonDetailDialogProps) {
  const { settings } = useSettings() // 설정 가져오기

  if (!gifticon) return null

  const expiryStatus = getExpiryStatus(gifticon.expiryDate, gifticon.isUsed)
  const logo = brandLogos[gifticon.brand] || "🏪"
  const categoryInfo = categories[gifticon.category]

  const handleCopyBarcode = () => {
    if (gifticon.barcode) {
      navigator.clipboard.writeText(gifticon.barcode)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">{logo}</span>
            <span>{gifticon.brand}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 이미지 */}
          {gifticon.imageUrl && (
            <img
              src={gifticon.imageUrl || "/placeholder.svg"}
              alt={gifticon.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* 기본 정보 */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{gifticon.name}</h3>
              {gifticon.price && (
                <p className="text-xl font-bold text-blue-600 mt-1">{gifticon.price.toLocaleString()}원</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={categoryInfo.color + " " + categoryInfo.bgColor}>{categoryInfo.label}</Badge>
              <Badge className={expiryStatus.color}>{expiryStatus.text}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">만료일</p>
                <p className="font-medium">{format(parseISO(gifticon.expiryDate), "yyyy년 M월 d일", { locale: ko })}</p>
              </div>
              <div>
                <p className="text-gray-500">등록일</p>
                <p className="font-medium">
                  {format(parseISO(gifticon.registeredAt), "yyyy년 M월 d일", { locale: ko })}
                </p>
              </div>
            </div>

            {gifticon.barcode && (
              <div>
                <p className="text-gray-500 text-sm mb-1">바코드</p>
                <div className="flex items-center space-x-2">
                  <code
                    className={`bg-gray-100 px-2 py-1 rounded text-sm font-mono ${
                      settings.barcodeBrightness ? "brightness-125" : ""
                    }`}
                  >
                    {gifticon.barcode}
                  </code>
                  <Button variant="outline" size="sm" onClick={handleCopyBarcode} className="h-6 px-2 bg-transparent">
                    <Copy className="h-4 w-4" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
                  </Button>
                </div>
              </div>
            )}

            {gifticon.memo && (
              <div>
                <p className="text-gray-500 text-sm mb-1">메모</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{gifticon.memo}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1">
              <Share2 className="h-4 w-4 mr-2" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
              공유하기
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

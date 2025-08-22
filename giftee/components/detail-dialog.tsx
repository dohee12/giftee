import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"

interface GifticonDetailDialogProps {
  gifticon: Gifticon | null
  isOpen: boolean
  onClose: () => void
}

export function GifticonDetailDialog({ gifticon, isOpen, onClose }: GifticonDetailDialogProps) {
  if (!gifticon) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gifticon.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {gifticon.imageUrl && (
            <img
              src={gifticon.imageUrl || "/placeholder.svg"}
              alt={gifticon.name}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div className="space-y-2">
            <p>
              <strong>브랜드:</strong> {gifticon.brand}
            </p>
            <p>
              <strong>카테고리:</strong> {categories[gifticon.category].label}
            </p>
            <p>
              <strong>만료일:</strong> {format(parseISO(gifticon.expiryDate), "yyyy년 MM월 dd일", { locale: ko })}
            </p>
            {gifticon.barcode && (
              <p>
                <strong>바코드:</strong> {gifticon.barcode}
              </p>
            )}
            {gifticon.memo && (
              <p>
                <strong>메모:</strong> {gifticon.memo}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              수정
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

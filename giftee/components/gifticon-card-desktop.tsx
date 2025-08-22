"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"
import { getExpiryStatus } from "@/utils/gifticon-data-utils"

interface GifticonCardProps {
  gifticon: Gifticon
  onToggleUsed: (id: string) => void
  onShare: (gifticon: Gifticon) => void
}

export function GifticonCard({ gifticon, onToggleUsed, onShare }: GifticonCardProps) {
  const category = categories[gifticon.category]
  const CategoryIcon = category.icon
  const expiryStatus = getExpiryStatus(gifticon.expiryDate, gifticon.isUsed)

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${gifticon.isUsed ? "opacity-60" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <CategoryIcon className="h-5 w-5 text-gray-600" />
            <Badge className={category.color}>{category.label}</Badge>
          </div>
          <Badge className={expiryStatus.color}>{expiryStatus.text}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {gifticon.imageUrl && (
          <img
            src={gifticon.imageUrl || "/placeholder.svg"}
            alt={gifticon.name}
            className="w-full h-32 object-cover rounded-md mb-3"
          />
        )}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{gifticon.name}</h3>
          <p className="text-gray-600">{gifticon.brand}</p>
          <p className="text-sm text-gray-500">
            만료일: {format(parseISO(gifticon.expiryDate), "yyyy년 MM월 dd일", { locale: ko })}
          </p>
          {gifticon.memo && <p className="text-sm text-gray-500 italic">{gifticon.memo}</p>}
        </div>
        <div className="flex space-x-2 mt-4">
          <Button
            size="sm"
            variant={gifticon.isUsed ? "secondary" : "default"}
            onClick={() => onToggleUsed(gifticon.id)}
            className="flex-1"
          >
            {gifticon.isUsed ? "사용취소" : "사용완료"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onShare(gifticon)}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

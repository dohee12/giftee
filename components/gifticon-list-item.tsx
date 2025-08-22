"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { getExpiryStatus } from "@/utils/gifticon-data-utils"
import { brandLogos, categories } from "@/constants/gifticon-categories"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GifticonListItemProps {
  gifticon: Gifticon
  onToggleUsed: (id: string) => void
  onView: (gifticon: Gifticon) => void
  onDelete?: (id: string) => void
}

export function GifticonListItem({ gifticon, onToggleUsed, onView, onDelete }: GifticonListItemProps) {
  const expiryStatus = getExpiryStatus(gifticon.expiryDate, gifticon.isUsed)
  const logo = brandLogos[gifticon.brand] || "🏪"
  const categoryInfo = categories[gifticon.category]

  return (
    <div
      className={`flex items-center p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md ${gifticon.isUsed ? "opacity-60" : ""}`}
    >
      {gifticon.imageUrl && (
        <img
          src={gifticon.imageUrl || "/placeholder.svg"}
          alt={gifticon.name}
          className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{logo}</span>
          <p className="text-sm font-medium text-gray-600 truncate">{gifticon.brand}</p>
          <Badge className={expiryStatus.color + " text-xs flex-shrink-0"}>{expiryStatus.text}</Badge>
        </div>
        <h3 className="font-semibold text-base leading-tight truncate">{gifticon.name}</h3>
        {gifticon.price && (
          <p className="text-sm font-bold text-blue-600 mt-0.5">{gifticon.price.toLocaleString()}원</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          만료일: {format(parseISO(gifticon.expiryDate), "yyyy년 M월 d일", { locale: ko })}
        </p>
      </div>
      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
        <Button
          size="sm"
          variant={gifticon.isUsed ? "secondary" : "default"}
          onClick={() => {
            console.log("List item button clicked for gifticon:", gifticon.id, gifticon.name)
            onToggleUsed(gifticon.id)
          }}
          className="w-20 text-xs"
        >
          {gifticon.isUsed ? "사용취소" : "사용완료"}
        </Button>
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
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(gifticon.id)} className="text-red-600">
                삭제
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

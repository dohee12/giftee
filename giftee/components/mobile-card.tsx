"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, MoreVertical } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"
import { getExpiryStatus } from "@/utils/gifticon-data-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileCardProps {
  gifticon: Gifticon
  onToggleUsed: (id: string) => void
  onShare: (gifticon: Gifticon) => void
  onDelete?: (id: string) => void
}

export function MobileCard({ gifticon, onToggleUsed, onShare, onDelete }: MobileCardProps) {
  const category = categories[gifticon.category]
  const CategoryIcon = category.icon
  const expiryStatus = getExpiryStatus(gifticon.expiryDate, gifticon.isUsed)

  return (
    <Card className={`transition-all active:scale-95 ${gifticon.isUsed ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CategoryIcon className="h-5 w-5 text-gray-600" /> {/* 아이콘 크기 h-5 w-5로 변경 */}
            <Badge className={`${category.color} text-xs`}>{category.label}</Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`${expiryStatus.color} text-xs`}>{expiryStatus.text}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onShare(gifticon)}>상세보기</DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(gifticon.id)} className="text-red-600">
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 이미지 */}
        {gifticon.imageUrl && (
          <img
            src={gifticon.imageUrl || "/placeholder.svg"}
            alt={gifticon.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        )}

        {/* 정보 */}
        <div className="space-y-1 mb-4">
          <h3 className="font-semibold text-base leading-tight">{gifticon.name}</h3>
          <p className="text-gray-600 text-sm">{gifticon.brand}</p>
          <p className="text-xs text-gray-500">{format(parseISO(gifticon.expiryDate), "MM/dd까지", { locale: ko })}</p>
          {gifticon.memo && <p className="text-xs text-gray-500 italic line-clamp-2">{gifticon.memo}</p>}
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={gifticon.isUsed ? "secondary" : "default"}
            onClick={() => onToggleUsed(gifticon.id)}
            className="flex-1 h-9"
          >
            {gifticon.isUsed ? "사용취소" : "사용완료"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onShare(gifticon)} className="h-9 px-3">
            <Share2 className="h-4 w-4" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

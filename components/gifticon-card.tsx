"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, MoreVertical, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Gifticon } from "@/types/gifticon"
import { getExpiryStatus } from "@/utils/gifticon-data-utils"
import { brandLogos } from "@/constants/gifticon-categories"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GifticonCardProps {
  gifticon: Gifticon
  onToggleUsed: (id: string) => void
  onView: (gifticon: Gifticon) => void
  onDelete?: (id: string) => void
}

export function GifticonCard({ gifticon, onToggleUsed, onView, onDelete }: GifticonCardProps) {
  const expiryStatus = getExpiryStatus(gifticon.expiryDate, gifticon.isUsed)
  const logo = brandLogos[gifticon.brand] || "🏪"

  return (
    <Card className={`transition-all hover:shadow-lg ${gifticon.isUsed ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{logo}</span>
            <div>
              <p className="text-sm font-medium text-gray-600">{gifticon.brand}</p>
              <Badge className={expiryStatus.color + " text-xs"}>{expiryStatus.text}</Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(gifticon)}>
                <Eye className="h-4 w-4 mr-2" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
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

        {/* 이미지 */}
        {gifticon.imageUrl && (
          <img
            src={gifticon.imageUrl || "/placeholder.svg"}
            alt={gifticon.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        )}

        {/* 정보 */}
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-base leading-tight">{gifticon.name}</h3>
          {gifticon.price && <p className="text-lg font-bold text-blue-600">{gifticon.price.toLocaleString()}원</p>}
          <p className="text-sm text-gray-500">
            {format(parseISO(gifticon.expiryDate), "yyyy년 M월 d일까지", { locale: ko })}
          </p>
          {gifticon.memo && <p className="text-sm text-gray-500 italic line-clamp-2">{gifticon.memo}</p>}
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
          <Button size="sm" variant="outline" onClick={() => onView(gifticon)}>
            <Share2 className="h-4 w-4" /> {/* 아이콘 크기 h-4 w-4로 변경 */}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Clock } from "lucide-react"
import { brandLogos } from "@/constants/gifticon-categories"
import type { Brand } from "@/types/gifticon"

interface BrandCardProps {
  brand: Brand
  expiringSoonCount?: number
  onClick: () => void
}

export function BrandCard({ brand, expiringSoonCount = 0, onClick }: BrandCardProps) {
  const logo = brandLogos[brand.name] || "🏪"

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:scale-105" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{logo}</div>
            <div>
              <h3 className="font-bold text-lg">{brand.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  전체 {brand.count}개
                </Badge>
                {brand.unusedCount > 0 && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                    사용가능 {brand.unusedCount}개
                  </Badge>
                )}
                {expiringSoonCount > 0 && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    곧만료 {expiringSoonCount}개
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  )
}

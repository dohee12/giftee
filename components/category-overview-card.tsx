"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Gift } from "lucide-react"
import { categories } from "@/constants/gifticon-categories"
import type { Brand } from "@/types/gifticon"

interface CategoryCardProps {
  category: string
  brands: Brand[]
  onClick: () => void
}

export function CategoryCard({ category, brands, onClick }: CategoryCardProps) {
  const categoryInfo = categories[category as keyof typeof categories] || {
    label: "알 수 없음",
    icon: Gift,
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
  }
  const Icon = categoryInfo.icon

  const totalCount = brands.reduce((sum, brand) => sum + brand.count, 0)
  const unusedCount = brands.reduce((sum, brand) => sum + brand.unusedCount, 0)

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:scale-105 bg-white border-2`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-transparent`}>
              <Icon className={`h-8 w-8 text-gray-700`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold text-gray-900`}>{categoryInfo.label}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {brands.length}개 브랜드 · {unusedCount}개 사용가능
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRight className={`h-6 w-6 text-gray-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

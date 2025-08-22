import { Card, CardContent } from "@/components/ui/card"
import { Gift, Check, Bell, X } from "lucide-react"
import type { Gifticon } from "@/types/gifticon"

interface GifticonStatsProps {
  gifticons: Gifticon[]
  notifications: Gifticon[]
}

export function GifticonStats({ gifticons, notifications }: GifticonStatsProps) {
  const stats = [
    {
      label: "전체",
      value: gifticons.length,
      icon: Gift,
      color: "text-blue-600",
    },
    {
      label: "사용 가능",
      value: gifticons.filter((g) => !g.isUsed).length,
      icon: Check,
      color: "text-green-600",
    },
    {
      label: "곧 만료",
      value: notifications.length,
      icon: Bell,
      color: "text-yellow-600",
    },
    {
      label: "사용완료",
      value: gifticons.filter((g) => g.isUsed).length,
      icon: X,
      color: "text-gray-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

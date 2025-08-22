import { Coffee, UtensilsCrossed, ShoppingBag, Store, Gift } from "lucide-react"
import type { CategoryInfo, GifticonCategory } from "@/types/gifticon"

export const categories: Record<GifticonCategory, CategoryInfo> = {
  cafe: {
    label: "카페",
    icon: Coffee,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  food: {
    label: "음식",
    icon: UtensilsCrossed,
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
  },
  convenience: {
    label: "편의점",
    icon: Store,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  shopping: {
    label: "쇼핑",
    icon: ShoppingBag,
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  other: {
    label: "기타",
    icon: Gift,
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
  },
}

// 브랜드 로고 매핑
export const brandLogos: Record<string, string> = {
  스타벅스: "☕",
  메가커피: "☕",
  이디야: "☕",
  투썸플레이스: "☕",
  맥도날드: "🍟",
  버거킹: "🍔",
  KFC: "🍗",
  CU: "🏪",
  GS25: "🏪",
  세븐일레븐: "🏪",
  롯데마트: "🛒",
  이마트: "🛒",
  홈플러스: "🛒",
}

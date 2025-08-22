import {
  Coffee,
  UtensilsCrossed,
  Store,
  Cake,
  CreditCard,
  Pizza,
  Apple,
  IceCream,
  Film,
  Utensils,
  Wine,
  Sparkles,
  Camera,
  Scissors,
  GraduationCap,
  Heart,
} from "lucide-react"
import type { CategoryInfo } from "@/types/gifticon"

export const categories: Record<string, CategoryInfo> = {
  // 교환권 카테고리
  bakery: {
    label: "베이커리/도넛/떡",
    icon: Cake,
    color: "text-pink-700",
    bgColor: "bg-pink-50 border-pink-200",
  },
  cafe: {
    label: "카페",
    icon: Coffee,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  icecream: {
    label: "아이스크림/빙수",
    icon: IceCream,
    color: "text-cyan-700",
    bgColor: "bg-cyan-50 border-cyan-200",
  },
  chicken: {
    label: "치킨",
    icon: UtensilsCrossed,
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
  },
  burger: {
    label: "버거/피자",
    icon: Pizza,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
  convenience: {
    label: "편의점",
    icon: Store,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  asian: {
    label: "한식/중식/일식",
    icon: Utensils,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  buffet: {
    label: "패밀리/호텔뷔페",
    icon: UtensilsCrossed,
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  fusion: {
    label: "퓨전/외국/펍",
    icon: Wine,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
  },
  snack: {
    label: "분식/죽/도시락",
    icon: Apple,
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
  },
  alcohol: {
    label: "와인/양주/맥주",
    icon: Wine,
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-200",
  },

  // 금액권 카테고리
  voucher: {
    label: "상품권/마트",
    icon: CreditCard,
    color: "text-slate-700",
    bgColor: "bg-slate-50 border-slate-200",
  },
  beauty: {
    label: "뷰티/패션/건강",
    icon: Sparkles,
    color: "text-pink-700",
    bgColor: "bg-pink-50 border-pink-200",
  },
  entertainment: {
    label: "영화/OTT/게임",
    icon: Film,
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
  },
  care: {
    label: "헤어/네일/스파",
    icon: Scissors,
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-200",
  },
  experience: {
    label: "전시/테마/체험",
    icon: Camera,
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  lifestyle: {
    label: "생활/교육/취미",
    icon: GraduationCap,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  charity: {
    label: "종교/나눔",
    icon: Heart,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
}

export const exchangeCategories: Record<string, CategoryInfo> = {
  bakery: categories.bakery,
  cafe: categories.cafe,
  icecream: categories.icecream,
  chicken: categories.chicken,
  burger: categories.burger,
  convenience: categories.convenience,
  asian: categories.asian,
  buffet: categories.buffet,
  fusion: categories.fusion,
  snack: categories.snack,
  alcohol: categories.alcohol,
}

export const amountCategories: Record<string, CategoryInfo> = {
  voucher: categories.voucher,
  beauty: categories.beauty,
  entertainment: categories.entertainment,
  care: categories.care,
  experience: categories.experience,
  lifestyle: categories.lifestyle,
  charity: categories.charity,
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

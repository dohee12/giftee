export interface Gifticon {
  id: string
  name: string
  brand: string
  category:
    | "cafe"
    | "convenience"
    | "bakery"
    | "voucher"
    | "burger"
    | "chicken"
    | "asian"
    | "fusion"
    | "buffet"
    | "snack"
    | "alcohol"
    | "beauty"
    | "movie"
    | "culture"
    | "living"
    | "icecream"
    | "food"
    | "shopping"
    | "other"
  giftType: "amount" | "exchange"
  expiryDate: string
  isUsed: boolean
  imageUrl?: string
  barcode?: string
  memo?: string
  registeredAt: string
  price?: number
}

export interface GifticonFormData {
  name: string
  brand: string
  category: string
  expiryDate: string
  barcode: string
  memo: string
  isUsed: boolean
  emojiTags: string[]
}

export type GifticonCategory = Gifticon["category"]

export interface Brand {
  name: string
  logo?: string
  category: GifticonCategory
  count: number
  unusedCount: number
}

export interface CategoryInfo {
  label: string
  icon: any
  color: string
  bgColor: string
}

export interface BrandStats {
  [brandName: string]: {
    total: number
    unused: number
    expiringSoon: number
  }
}

export interface RecommendationContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "unknown"
  dayOfWeek: string
  weather?: string
  specialEvents?: string[]
  season?: string
  mood?: string
  isWeekend?: boolean
  isSpecialDay?: boolean
  month?: number
  hour?: number
}

export interface GifticonRecommendation {
  id: string
  type: "time-based" | "event-based" | "weather-based" | "seasonal-based" | "mood-based" | "pattern-based"
  title: string
  message: string
  recommendedGifticons: Gifticon[]
  context: RecommendationContext
  priority: "low" | "medium" | "high"
  createdAt: string
}

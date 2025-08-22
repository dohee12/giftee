export interface Gifticon {
  id: string
  name: string
  brand: string
  category: "cafe" | "food" | "convenience" | "shopping" | "other"
  expiryDate: string
  isUsed: boolean
  imageUrl?: string
  barcode?: string
  memo?: string
  registeredAt: string
  price?: number
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

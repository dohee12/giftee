import { differenceInDays, parseISO } from "date-fns"
import type { Gifticon, Brand, BrandStats } from "@/types/gifticon"
import type { SortBy, SortOrder } from "@/hooks/use-app-settings" // use-settings에서 타입 임포트

export const getDaysUntilExpiry = (expiryDate: string): number => {
  return differenceInDays(parseISO(expiryDate), new Date())
}

export const getExpiryStatus = (expiryDate: string, isUsed: boolean) => {
  if (isUsed) return { text: "사용완료", color: "bg-gray-100 text-gray-600", priority: 0 }

  const days = getDaysUntilExpiry(expiryDate)
  if (days < 0) return { text: "만료됨", color: "bg-red-100 text-red-700", priority: 4 }
  if (days <= 3) return { text: `${days}일 남음`, color: "bg-red-100 text-red-700", priority: 3 }
  if (days <= 7) return { text: `${days}일 남음`, color: "bg-yellow-100 text-yellow-700", priority: 2 }
  return { text: `${days}일 남음`, color: "bg-green-100 text-green-700", priority: 1 }
}

// getExpiringSoonGifticons 함수 시그니처 변경 및 로직 업데이트
export const getExpiringSoonGifticons = (gifticons: Gifticon[], thresholdDays: number): Gifticon[] => {
  return gifticons
    .filter((gifticon) => {
      if (gifticon.isUsed) return false
      const daysUntilExpiry = getDaysUntilExpiry(gifticon.expiryDate)
      return daysUntilExpiry <= thresholdDays && daysUntilExpiry >= 0 // thresholdDays 사용
    })
    .sort((a, b) => {
      // 만료일이 적게 남은 순으로 정렬 (오름차순)
      const daysA = getDaysUntilExpiry(a.expiryDate)
      const daysB = getDaysUntilExpiry(b.expiryDate)
      return daysA - daysB
    })
}

// getBrandStats 함수에서 getExpiringSoonGifticons 호출 시 thresholdDays 추가 (thresholdDays는 일단 7로 고정)
// TODO: 추후 useSettings에서 가져온 expiryNotificationDays 값 사용하도록 변경 필요 (현재는 이 함수가 독립적으로 호출될 수 있어 임시로 7일 고정)
export const getBrandStats = (gifticons: Gifticon[]): BrandStats => {
  const stats: BrandStats = {}

  gifticons.forEach((gifticon) => {
    // 만료된 기프티콘은 통계에서 제외
    const isExpired = getDaysUntilExpiry(gifticon.expiryDate) < 0
    if (isExpired) return

    if (!stats[gifticon.brand]) {
      stats[gifticon.brand] = { total: 0, unused: 0, expiringSoon: 0 }
    }

    stats[gifticon.brand].total++

    if (!gifticon.isUsed) {
      stats[gifticon.brand].unused++

      const daysUntilExpiry = getDaysUntilExpiry(gifticon.expiryDate)
      if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
        stats[gifticon.brand].expiringSoon++
      }
    }
  })

  return stats
}

export const getBrandsByCategory = (gifticons: Gifticon[]): Record<string, Brand[]> => {
  // 만료되지 않은 기프티콘만 필터링
  const activeGifticons = gifticons.filter((g) => getDaysUntilExpiry(g.expiryDate) >= 0)

  const brandStats = getBrandStats(activeGifticons)
  const brandsByCategory: Record<string, Brand[]> = {}

  activeGifticons.forEach((gifticon) => {
    const category = gifticon.category

    if (!brandsByCategory[category]) {
      brandsByCategory[category] = []
    }

    const existingBrand = brandsByCategory[category].find((b) => b.name === gifticon.brand)

    if (!existingBrand) {
      brandsByCategory[category].push({
        name: gifticon.brand,
        category: gifticon.category,
        count: brandStats[gifticon.brand].total,
        unusedCount: brandStats[gifticon.brand].unused,
      })
    }
  })

  // 각 카테고리의 브랜드들을 이름순으로 정렬
  Object.keys(brandsByCategory).forEach((category) => {
    brandsByCategory[category].sort((a, b) => a.name.localeCompare(b.name))
  })

  return brandsByCategory
}

export const filterAndSortGifticons = (
  gifticons: Gifticon[],
  searchTerm: string,
  selectedCategory: string,
  sortBy: SortBy, // 타입 변경
  sortOrder: SortOrder, // 새로 추가
  showUsed: boolean,
  hideExpired = false, // 새로운 매개변수 추가
): Gifticon[] => {
  const filtered = gifticons.filter((gifticon) => {
    const matchesSearch =
      gifticon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gifticon.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || gifticon.category === selectedCategory
    const matchesUsed = showUsed || !gifticon.isUsed

    // 만료된 기프티콘 필터링 로직 추가
    const isExpired = getDaysUntilExpiry(gifticon.expiryDate) < 0
    const matchesExpired = hideExpired ? !isExpired : true

    return matchesSearch && matchesCategory && matchesUsed && matchesExpired
  })

  // 정렬
  filtered.sort((a, b) => {
    let compareResult = 0
    switch (sortBy) {
      case "expiryDate":
        compareResult = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        break
      case "registeredAt":
        compareResult = new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        break
      case "brand":
        compareResult = a.brand.localeCompare(b.brand)
        break
      default:
        compareResult = 0
    }
    return sortOrder === "asc" ? compareResult : -compareResult
  })

  return filtered
}

// OCR 시뮬레이션 함수
export const simulateOCR = (
  imageFile: File,
): Promise<{
  name?: string
  brand?: string
  expiryDate?: string
  barcode?: string
}> => {
  return new Promise((resolve) => {
    // 실제로는 OCR API를 사용하겠지만, 여기서는 시뮬레이션
    setTimeout(() => {
      const mockResults = [
        {
          name: "아메리카노",
          brand: "스타벅스",
          expiryDate: "2024-12-31",
          barcode: "1234567890123",
        },
        {
          name: "불고기버거 세트",
          brand: "맥도날드",
          expiryDate: "2024-06-30",
          barcode: "9876543210987",
        },
        {
          name: "상품권 5000원",
          brand: "CU",
          expiryDate: "2024-09-15",
          barcode: "5555666677778",
        },
      ]

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      resolve(randomResult)
    }, 2000)
  })
}

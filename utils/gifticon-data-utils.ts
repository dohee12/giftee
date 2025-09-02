import { differenceInDays, parseISO } from "date-fns"
import type { Gifticon, Brand, BrandStats } from "@/types/gifticon"
import type { SortBy, SortOrder } from "@/hooks/use-app-settings" // use-settings에서 타입 임포트

const BRAND_DATABASE = [
  {
    name: "스타벅스",
    aliases: ["STARBUCKS", "스벅", "스타벅", "SBUX", "스타"],
    codes: ["1234", "5678"],
    keywords: ["아메리카노", "라떼", "프라푸치노", "커피"], // Kept keywords for reference but not used in matching
    category: "카페",
  },
  {
    name: "투썸플레이스",
    aliases: ["TWOSOME", "TWOSOME PLACE", "투썸", "2SOME"],
    codes: ["2345"],
    keywords: ["케이크", "디저트", "커피"],
    category: "카페",
  },
  {
    name: "이디야",
    aliases: ["EDIYA", "EDIYA COFFEE", "이디야커피"],
    codes: ["3456"],
    keywords: ["커피", "음료"],
    category: "카페",
  },
  {
    name: "메가커피",
    aliases: ["MEGA COFFEE", "메가", "MEGA"],
    codes: ["4646"],
    keywords: ["커피", "음료", "라떼"], // Removed specific product keywords to prevent false matching
    category: "카페",
  },
  {
    name: "맥도날드",
    aliases: ["McDonald", "MCDONALD", "맥날", "맥도", "McD"],
    codes: ["4567"],
    keywords: ["버거", "빅맥", "감자튀김", "해피밀"],
    category: "패스트푸드",
  },
  {
    name: "버거킹",
    aliases: ["BURGER KING", "BK", "버킹"],
    codes: ["5678"],
    keywords: ["와퍼", "버거", "감자튀김"],
    category: "패스트푸드",
  },
  {
    name: "롯데리아",
    aliases: ["LOTTERIA", "롯데", "롯데리"],
    codes: ["6789"],
    keywords: ["불고기버거", "새우버거", "감자튀김"],
    category: "패스트푸드",
  },
  {
    name: "배스킨라빈스",
    aliases: ["BASKIN", "BASKIN ROBBINS", "베스킨", "31"],
    codes: ["7890"],
    keywords: ["아이스크림", "케이크"],
    category: "디저트",
  },
  {
    name: "CU",
    aliases: ["씨유", "편의점"],
    codes: ["1111"],
    keywords: ["편의점", "상품권"],
    category: "편의점",
  },
  {
    name: "GS25",
    aliases: ["지에스25", "GS", "편의점"],
    codes: ["6525", "2525"],
    keywords: ["편의점", "상품권", "모바일"],
    category: "편의점",
  },
  {
    name: "세븐일레븐",
    aliases: ["7-ELEVEN", "7ELEVEN", "세븐", "711"],
    codes: ["7777"],
    keywords: ["편의점", "상품권"],
    category: "편의점",
  },
  {
    name: "올리브영",
    aliases: ["OLIVE YOUNG", "올영", "OLIVEYOUNG"],
    codes: ["8888"],
    keywords: ["화장품", "뷰티", "건강"],
    category: "뷰티",
  },
  {
    name: "다이소",
    aliases: ["DAISO", "다이소몰"],
    codes: ["9999"],
    keywords: ["생활용품", "잡화"],
    category: "생활용품",
  },
  {
    name: "네이버페이",
    aliases: ["NAVER PAY", "네페", "NAVERPAY"],
    codes: ["1588", "1644", "1577"],
    keywords: ["포인트", "캐시", "결제"],
    category: "상품권",
  },
  {
    name: "카카오페이",
    aliases: ["KAKAO PAY", "카페이", "KAKAOPAY"],
    codes: ["1588", "1644", "1577"],
    keywords: ["포인트", "캐시", "결제"],
    category: "상품권",
  },
  {
    name: "토스",
    aliases: ["TOSS", "토스페이"],
    codes: ["1588", "1644", "1577"],
    keywords: ["포인트", "캐시", "결제"],
    category: "상품권",
  },
  {
    name: "할리스",
    aliases: ["HOLLYS", "HOLLYS COFFEE", "할리스커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "빽다방",
    aliases: ["PAIK", "PAIK'S COFFEE", "빽"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "커피빈",
    aliases: ["COFFEE BEAN", "커피빈앤티리프", "CBTL"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "탐앤탐스",
    aliases: ["TOM N TOMS", "탐앤탐스커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "커피나무",
    aliases: ["COFFEE TREE", "커피나무"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "폴바셋",
    aliases: ["PAUL BASSETT", "폴바셋커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "엔제리너스",
    aliases: ["ANGEL-IN-US", "엔제리너스커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "파스쿠찌",
    aliases: ["PASCUCCI", "파스쿠찌커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "카페베네",
    aliases: ["CAFE BENE", "카페베네"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "드롭탑",
    aliases: ["DROPTTOP", "드롭탑커피"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "커피스미스",
    aliases: ["COFFEE SMITH", "커피스미스"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "카페마마",
    aliases: ["CAFE MAMA", "카페마마"],
    codes: ["3456"],
    keywords: ["커피", "음료", "라떼"],
    category: "카페",
  },
  {
    name: "KFC",
    aliases: ["케이에프씨", "케이에프시", "케이에프씨"],
    codes: ["4567"],
    keywords: ["치킨", "버거", "감자튀김"],
    category: "패스트푸드",
  },
  {
    name: "서브웨이",
    aliases: ["SUBWAY", "서브웨이"],
    codes: ["4567"],
    keywords: ["샌드위치", "샐러드", "음료"],
    category: "패스트푸드",
  },
  {
    name: "도미노",
    aliases: ["DOMINO", "도미노피자"],
    codes: ["4567"],
    keywords: ["피자", "파스타", "음료"],
    category: "패스트푸드",
  },
  {
    name: "피자헛",
    aliases: ["PIZZA HUT", "피자헛"],
    codes: ["4567"],
    keywords: ["피자", "파스타", "음료"],
    category: "패스트푸드",
  },
  {
    name: "하겐다즈",
    aliases: ["HAAGEN-DAZS", "하겐다즈"],
    codes: ["7890"],
    keywords: ["아이스크림", "디저트"],
    category: "디저트",
  },
  {
    name: "베스킨",
    aliases: ["BASKIN", "베스킨라빈스"],
    codes: ["7890"],
    keywords: ["아이스크림", "디저트"],
    category: "디저트",
  },
  {
    name: "무인양품",
    aliases: ["MUJI", "무지", "무인양품"],
    codes: ["9999"],
    keywords: ["생활용품", "잡화", "가전"],
    category: "생활용품",
  },
  {
    name: "이케아",
    aliases: ["IKEA", "이케아"],
    codes: ["9999"],
    keywords: ["가구", "인테리어", "생활용품"],
    category: "생활용품",
  },
  {
    name: "홈플러스",
    aliases: ["HOME PLUS", "홈플러스"],
    codes: ["9999"],
    keywords: ["마트", "생활용품", "식품"],
    category: "생활용품",
  },
  {
    name: "이마트",
    aliases: ["EMART", "이마트"],
    codes: ["9999"],
    keywords: ["마트", "생활용품", "식품"],
    category: "생활용품",
  },
  {
    name: "롯데마트",
    aliases: ["LOTTE MART", "롯데마트"],
    codes: ["9999"],
    keywords: ["마트", "생활용품", "식품"],
    category: "생활용품",
  },
  {
    name: "기타",
    aliases: ["기타", "OTHER"],
    codes: ["0000"],
    keywords: ["페이", "결제", "포인트"],
    category: "기타",
  },
]

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

function findBestMatchingBrand(text: string, allText: string): string {
  const normalizedText = text.toUpperCase().trim()
  let bestMatch = ""
  let highestScore = 0

  console.log("[v4] Brand matching for text:", text)
  console.log("[v4] Normalized text:", normalizedText)

  if (normalizedText.length <= 1) {
    console.log("[v4] Skipping very short text:", normalizedText)
    return ""
  }

  for (const brand of BRAND_DATABASE) {
    let score = 0

    // 1. 정확한 브랜드명 매칭 (최고 우선순위)
    if (normalizedText.includes(brand.name.toUpperCase())) {
      console.log("[v4] Exact brand name match:", brand.name)
      return brand.name
    }

    // 2. 별칭 정확 매칭 (높은 우선순위)
    for (const alias of brand.aliases) {
      if (normalizedText.includes(alias.toUpperCase()) || alias.toUpperCase().includes(normalizedText)) {
        console.log("[v4] Exact alias match found:", alias, "->", brand.name)
        return brand.name
      }
    }

    // 3. 코드 정확 매칭
    for (const code of brand.codes) {
      if (normalizedText === code || allText.includes(code)) {
        console.log("[v4] Code match found:", code, "->", brand.name)
        return brand.name
      }
    }

    // 4. 부분 매칭 (더 정확한 점수 계산)
    for (const alias of brand.aliases) {
      if (alias.length >= 2 && normalizedText.length >= 2) {
        // 부분 문자열 매칭
        if (normalizedText.includes(alias.toUpperCase()) || alias.toUpperCase().includes(normalizedText)) {
          const matchLength = Math.min(alias.length, normalizedText.length)
          const maxLength = Math.max(alias.length, normalizedText.length)
          const partialScore = (matchLength / maxLength) * 0.9 // 점수 증가
          score = Math.max(score, partialScore)
          console.log("[v4] Partial alias match:", alias, "score:", partialScore, "brand:", brand.name)
        }
        
        // 레벤슈타인 거리 기반 유사도
        const distance = levenshteinDistance(normalizedText, alias.toUpperCase())
        const maxLength = Math.max(normalizedText.length, alias.length)
        const similarity = 1 - (distance / maxLength)
        
        if (similarity > 0.6) { // 유사도 임계값을 낮춤
          score = Math.max(score, similarity * 0.7)
          console.log("[v4] Similarity match:", alias, "similarity:", similarity, "score:", score, "brand:", brand.name)
        }
      }
    }

    // 5. 키워드 매칭 (낮은 우선순위)
    for (const keyword of brand.keywords) {
      if (normalizedText.includes(keyword.toUpperCase())) {
        score += 0.4 // 키워드 점수 증가
        console.log("[v4] Keyword match:", keyword, "score:", score, "brand:", brand.name)
      }
    }

    // 6. 전체 텍스트에서도 검색
    if (allText && allText !== text) {
      const allTextNormalized = allText.toUpperCase()
      
      // 전체 텍스트에서 브랜드명 검색
      if (allTextNormalized.includes(brand.name.toUpperCase())) {
        console.log("[v4] Brand found in full text:", brand.name)
        return brand.name
      }
      
      // 전체 텍스트에서 별칭 검색
      for (const alias of brand.aliases) {
        if (allTextNormalized.includes(alias.toUpperCase())) {
          console.log("[v4] Alias found in full text:", alias, "->", brand.name)
          return brand.name
        }
      }
    }

    // 최고 점수 업데이트
    if (score > highestScore) {
      highestScore = score
      bestMatch = brand.name
      console.log("[v4] New best match:", brand.name, "score:", score)
    }
  }

  console.log("[v4] Final best match:", bestMatch, "score:", highestScore)
  return highestScore > 0.5 ? bestMatch : "" // 임계값을 낮춰서 더 많은 매칭 허용
}

const OCR_CORRECTIONS = [
  { pattern: /46\\\/|46\/|46\\/g, replacement: "NEW" },
  { pattern: /NEW\/|NEW\\/g, replacement: "NEW" },
  { pattern: /$$106$$/g, replacement: "(ICE)" },
  { pattern: /106(?=\s*[가-힣])/g, replacement: "ICE" }, // 106 followed by Korean characters
  { pattern: /\/\\/g, replacement: "W" },
  { pattern: /\\\//g, replacement: "V" },
  { pattern: /0/g, replacement: "O" }, // Only apply to non-numeric contexts
  { pattern: /5/g, replacement: "S" }, // Only apply to non-numeric contexts
  { pattern: /1/g, replacement: "I" }, // Only apply to non-numeric contexts
  { pattern: /8/g, replacement: "B" }, // Only apply to non-numeric contexts
]

function correctOCRErrors(text: string): string {
  let corrected = text

  const dateProtectedText = text.replace(
    /(\d{4}[-./년\s]*\d{1,2}[-./월\s]*\d{1,2}[일\s]*)|(\d{6,8})|(\d{1,2}[-./]\d{1,2}[-./]\d{4})/g,
    (match) => `__DATE_PROTECTED_${Buffer.from(match).toString("base64")}_END__`,
  )

  // Apply corrections only to non-barcode, non-date text
  if (!/^\d+[\s\d]*$/.test(dateProtectedText) && !/\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(dateProtectedText)) {
    for (const correction of OCR_CORRECTIONS.slice(0, 6)) {
      // Apply pattern corrections including ICE conversion
      corrected = dateProtectedText.replace(correction.pattern, correction.replacement)
    }
  }

  corrected = corrected.replace(/__DATE_PROTECTED_([A-Za-z0-9+/=]+)_END__/g, (match, base64) =>
    Buffer.from(base64, "base64").toString(),
  )

  return corrected
}

export const getDaysUntilExpiry = (expiryDate: string): number => {
  // "no-expiry"인 경우 처리
  if (expiryDate === "no-expiry" || !expiryDate) {
    return Infinity // 만료되지 않음
  }
  
  return differenceInDays(parseISO(expiryDate), new Date())
}

export const getExpiryStatus = (expiryDate: string, isUsed: boolean) => {
  if (isUsed) return { text: "사용완료", color: "bg-gray-100 text-gray-600", priority: 0 }
  
  // "no-expiry"인 경우 처리
  if (expiryDate === "no-expiry" || !expiryDate) {
    return { text: "만료일 없음", color: "bg-blue-100 text-blue-700", priority: 0 }
  }

  const days = getDaysUntilExpiry(expiryDate)
  if (days < 0) return { text: "만료됨", color: "bg-red-100 text-red-700", priority: 4 }
  if (days <= 3) return { text: `${days}일 남음`, color: "bg-red-100 text-red-700", priority: 3 }
  if (days <= 7) return { text: `${days}일 남음`, color: "bg-yellow-100 text-yellow-700", priority: 2 }
  return { text: `${days}일 남음`, color: "bg-green-100 text-green-700", priority: 1 }
}

// getExpiringSoonGifticons 함수 시그니처 변경 및 로직 업데이트
export const getExpiringSoonGifticons = (gifticons: Gifticon[], thresholdDays: number): Gifticon[] => {
  return gifticons.filter((gifticon) => {
    if (gifticon.isUsed) return false
    const daysUntilExpiry = getDaysUntilExpiry(gifticon.expiryDate)
    // "no-expiry"인 경우는 만료 예정 알림에 포함하지 않음
    return daysUntilExpiry !== Infinity && daysUntilExpiry <= thresholdDays && daysUntilExpiry >= 0
  })
}

// getBrandStats 함수에서 getExpiringSoonGifticons 호출 시 thresholdDays 추가 (thresholdDays는 일단 7로 고정)
// TODO: 추후 useSettings에서 가져온 expiryNotificationDays 값 사용하도록 변경 필요 (현재는 이 함수가 독립적으로 호출될 수 있어 임시로 7일 고정)
export const getBrandStats = (gifticons: Gifticon[]): BrandStats => {
  const stats: BrandStats = {}
  
  console.log("=== getBrandStats 시작 ===")
  console.log("입력된 기프티콘:", gifticons.length, "개")

  gifticons.forEach((gifticon) => {
    // 만료된 기프티콘은 통계에서 제외 ("no-expiry"는 제외하지 않음)
    const daysUntilExpiry = getDaysUntilExpiry(gifticon.expiryDate)
    if (daysUntilExpiry !== Infinity && daysUntilExpiry < 0) {
      console.log(`기프티콘 ${gifticon.name} (${gifticon.brand}) 만료됨 - 통계에서 제외`)
      return
    }

    if (!stats[gifticon.brand]) {
      stats[gifticon.brand] = { total: 0, unused: 0, expiringSoon: 0 }
    }

    stats[gifticon.brand].total++
    console.log(`브랜드 ${gifticon.brand}: total 증가 -> ${stats[gifticon.brand].total}`)

    if (!gifticon.isUsed) {
      stats[gifticon.brand].unused++
      console.log(`브랜드 ${gifticon.brand}: unused 증가 -> ${stats[gifticon.brand].unused}`)

      const daysUntilExpiry = getDaysUntilExpiry(gifticon.expiryDate)
      if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
        stats[gifticon.brand].expiringSoon++
        console.log(`브랜드 ${gifticon.brand}: expiringSoon 증가 -> ${stats[gifticon.brand].expiringSoon}`)
      }
    }
  })

  console.log("최종 브랜드 통계:", stats)
  console.log("=== getBrandStats 끝 ===")
  return stats
}

export const getBrandsByCategory = (gifticons: Gifticon[]): Record<string, Brand[]> => {
  // 만료되지 않은 기프티콘만 필터링 ("no-expiry"는 포함)
  const activeGifticons = gifticons.filter((g) => {
    const daysUntilExpiry = getDaysUntilExpiry(g.expiryDate)
    return daysUntilExpiry === Infinity || daysUntilExpiry >= 0
  })

  console.log("=== getBrandsByCategory 시작 ===")
  console.log("활성 기프티콘:", activeGifticons.length, "개")
  console.log("활성 기프티콘 목록:", activeGifticons.map(g => ({ name: g.name, brand: g.brand, category: g.category, isUsed: g.isUsed })))

  const brandStats = getBrandStats(activeGifticons)
  const brandsByCategory: Record<string, Brand[]> = {}

  activeGifticons.forEach((gifticon) => {
    const category = gifticon.category || "other"

    if (!brandsByCategory[category]) {
      brandsByCategory[category] = []
    }

    const existingBrand = brandsByCategory[category].find((b) => b.name === gifticon.brand)

    if (!existingBrand) {
      const brandStat = brandStats[gifticon.brand] || { total: 0, unused: 0 }
      console.log(`새 브랜드 추가: ${gifticon.brand} (${category}) - total: ${brandStat.total}, unused: ${brandStat.unused}`)
      
      brandsByCategory[category].push({
        name: gifticon.brand,
        category: category,
        count: brandStat.total,
        unusedCount: brandStat.unused,
      })
    }
  })

  // 각 카테고리의 브랜드들을 이름순으로 정렬
  Object.keys(brandsByCategory).forEach((category) => {
    brandsByCategory[category].sort((a, b) => a.name.localeCompare(b.name))
  })

  console.log("최종 브랜드별 카테고리:", brandsByCategory)
  console.log("=== getBrandsByCategory 끝 ===")
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

export const performOCR = async (
  imageFile: File,
): Promise<{
  name?: string
  brand?: string
  expiryDate?: string
  barcode?: string
  category?: string
  giftType?: "amount" | "exchange"
}> => {
  try {
    const { createWorker } = await import("tesseract.js")

    console.log("[v4] Starting perfect OCR extraction...")

    // 다중 이미지 전처리 함수 - 다양한 방법으로 이미지 처리
    const preprocessImageMultiple = async (file: File): Promise<File[]> => {
      const processedImages: File[] = []
      
      // 원본 이미지도 포함
      processedImages.push(file)
      
      // 1. 기본 전처리 (고해상도 + 이진화)
      const basicProcessed = await new Promise<File>((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          const scale = 3
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          
          if (ctx) {
            ctx.scale(scale, scale)
            ctx.drawImage(img, 0, 0)
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            
            for (let i = 0; i < data.length; i += 4) {
              const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
              const enhanced = gray > 127 ? 255 : 0
              data[i] = enhanced
              data[i + 1] = enhanced
              data[i + 2] = enhanced
            }
            
            ctx.putImageData(imageData, 0, 0)
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, { type: file.type })
              resolve(processedFile)
            } else {
              resolve(file)
            }
          }, file.type, 1.0)
        }
        
        img.src = URL.createObjectURL(file)
      })
      processedImages.push(basicProcessed)
      
      // 2. 대비 강화 전처리
      const contrastProcessed = await new Promise<File>((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          const scale = 2
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          
          if (ctx) {
            ctx.scale(scale, scale)
            ctx.drawImage(img, 0, 0)
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            
            // 대비 강화
            const factor = 1.5
            const offset = 0
            
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, factor * data[i] + offset))
              data[i + 1] = Math.min(255, Math.max(0, factor * data[i + 1] + offset))
              data[i + 2] = Math.min(255, Math.max(0, factor * data[i + 2] + offset))
            }
            
            ctx.putImageData(imageData, 0, 0)
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, { type: file.type })
              resolve(processedFile)
            } else {
              resolve(file)
            }
          }, file.type, 1.0)
        }
        
        img.src = URL.createObjectURL(file)
      })
      processedImages.push(contrastProcessed)
      
      return processedImages
    }

    // 다중 이미지 전처리 수행
    const processedImages = await preprocessImageMultiple(imageFile)
    console.log("[v4] Processed", processedImages.length, "image variants")

    // 다중 OCR 시도
    const ocrResults: string[] = []
    const confidences: number[] = []

    for (let i = 0; i < processedImages.length; i++) {
      try {
        const worker = await createWorker("kor+eng", 1, {
          logger: (m) => console.log(`[v4] Tesseract ${i}:`, m),
          errorHandler: (err) => console.error(`[v4] Tesseract ${i} Error:`, err),
        })

        // 다양한 OCR 설정 시도
        const settings = [
          {
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가-힣ㄱ-ㅎㅏ-ㅣ-',
            preserve_interword_spaces: '1',
            tessedit_do_invert: '0',
            textord_heavy_nr: '1',
            textord_min_linesize: '1.5',
          },
          {
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가-힣ㄱ-ㅎㅏ-ㅣ-',
            preserve_interword_spaces: '1',
            tessedit_do_invert: '1', // 반전 시도
            textord_heavy_nr: '0',
            textord_min_linesize: '2.0',
          },
          {
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가-힣ㄱ-ㅎㅏ-ㅣ-',
            preserve_interword_spaces: '0',
            tessedit_do_invert: '0',
            textord_heavy_nr: '1',
            textord_min_linesize: '1.0',
          }
        ]

        await worker.setParameters(settings[i % settings.length])

        const {
          data: { text, confidence },
        } = await worker.recognize(processedImages[i])
        await worker.terminate()

        if (text && confidence > 5) {
          ocrResults.push(text)
          confidences.push(confidence)
          console.log(`[v4] OCR ${i} result:`, text.substring(0, 200) + "...")
          console.log(`[v4] OCR ${i} confidence:`, confidence)
        }
      } catch (error) {
        console.error(`[v4] OCR ${i} failed:`, error)
      }
    }

    if (ocrResults.length === 0) {
      console.log("[v4] No OCR results obtained")
      return {
        brand: "",
        name: "",
        expiryDate: "",
        barcode: "",
        category: "",
        giftType: "exchange",
      }
    }

    // 최고 신뢰도 결과 선택
    const bestIndex = confidences.indexOf(Math.max(...confidences))
    const bestText = ocrResults[bestIndex]
    const bestConfidence = confidences[bestIndex]

    console.log("[v4] Best OCR result (confidence:", bestConfidence, "):", bestText)

    const correctedText = correctOCRErrors(bestText)
    console.log("[v4] Corrected text:", correctedText)

    // Parse the extracted text to identify gifticon information
    const lines = correctedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    console.log("[v4] Extracted lines:", lines)

    // 상단 라인(브랜드/로고 영역) 우선 탐색을 위해 상위 8줄 분리
    const topLines = lines.slice(0, 8)

    let brand = ""
    let name = ""
    let expiryDate = ""
    let barcode = ""

    // 1. 바코드 추출 (가장 정확한 패턴 매칭)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // 더 포괄적인 바코드 패턴
      const barcodePatterns = [
        /(\d{4}\s+\d{4}\s+\d{4}\s+\d{4})/, // 4-4-4-4 형식
        /(\d{3}\s+\d{4}\s+\d{4}\s+\d{2})/, // 3-4-4-2 형식
        /(\d{2}\s+\d{4}\s+\d{4}\s+\d{3})/, // 2-4-4-3 형식
        /(\d{4}\s+\d{4}\s+\d{4})/, // 4-4-4 형식
        /(\d{12,16})/, // 연속된 12-16자리 숫자
        /(\d{4}-\d{4}-\d{4}-\d{4})/, // 하이픈으로 구분된 형식
        /(\d{4}\.\d{4}\.\d{4}\.\d{4})/, // 점으로 구분된 형식
        /(\d{4}\d{4}\d{4}\d{4})/, // 연속된 16자리
        /(\d{3}\d{4}\d{4}\d{2})/, // 연속된 13자리
        /(\d{2}\d{4}\d{4}\d{3})/, // 연속된 13자리
      ]
      
      for (const pattern of barcodePatterns) {
        const match = line.match(pattern)
        if (match) {
          barcode = match[1]
          console.log("[v4] Found barcode:", barcode, "from line:", line)
          break
        }
      }
      
      if (barcode) break
    }

    // 2. 브랜드 추출 (상단 8줄 우선 → 전체 텍스트)
    const brandSearchOrder = [topLines, lines]
    for (const source of brandSearchOrder) {
      for (const line of source) {
        const matchedBrand = findBestMatchingBrand(line, correctedText)
        if (matchedBrand) {
          brand = matchedBrand
          console.log("[v4] Found brand:", brand, "from line:", line)
          break
        }
      }
      if (brand) break
    }

    // 3. 유효기간 추출 (키워드 힌트 라인 우선 → 전체)
    const dateHintKeywords = [
      /유효/,
      /만료/,
      /까지/,
      /기한/,
      /사용기간/,
      /VALID/i,
      /EXPIRE/i,
    ]
    const hintLines = lines.filter((l) => dateHintKeywords.some((k) => k.test(l)))

    const datePatterns: RegExp[] = [
      /\b(20\d{2})[.\-/\s]?(1?\d)[.\-/\s]?(3?\d)\b/, // 2025.08.31 / 2025-8-31 / 2025 8 31
      /\b(20\d{2})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일?\b/, // 2025년 8월 31일 / 2025년8월31일
      /\b(20\d{2})([01]\d)([0-3]\d)\b/, // 20250831
      /\b([01]?\d)[.\-/\s]([0-3]?\d)[.\-/\s](20\d{2})\b/, // 08/31/2025 / 8 31 2025
      /\b(\d{2})[.\-/]([01]?\d)[.\-/]([0-3]?\d)\b/, // 25.08.31 (yy.mm.dd)
      /\b(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(20\d{2})\b/, // 8. 31. 2025
      /\b(20\d{2})\s*-\s*(\d{1,2})\s*-\s*(\d{1,2})\b/, // 2025 - 8 - 31
      /\b(\d{1,2})\s*-\s*(\d{1,2})\s*-\s*(20\d{2})\b/, // 8 - 31 - 2025
      /\b(20\d{2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})\b/, // 2025 / 8 / 31
      /\b(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(20\d{2})\b/, // 8 / 31 / 2025
    ]

    const tryExtractDate = (sourceLines: string[]): string => {
      for (const line of sourceLines) {
        for (const pattern of datePatterns) {
          const dateMatch = line.match(pattern)
          if (dateMatch) {
            let year = ""
            let month = ""
            let day = ""

            // 패턴별 그룹 매핑
            if (
              pattern === datePatterns[0] ||
              pattern === datePatterns[1] ||
              pattern === datePatterns[6]
            ) {
              ;[, year, month, day] = dateMatch
            } else if (pattern === datePatterns[2]) {
              ;[, year, month, day] = dateMatch
            } else if (
              pattern === datePatterns[3] ||
              pattern === datePatterns[5] ||
              pattern === datePatterns[7] ||
              pattern === datePatterns[9]
            ) {
              ;[, month, day, year] = dateMatch as unknown as string[]
            } else if (pattern === datePatterns[4]) {
              // yy.mm.dd → 20yy
              let yy = dateMatch[1]
              ;[, , month, day] = dateMatch
              year = `20${yy}`
            } else if (pattern === datePatterns[8]) {
              ;[, year, month, day] = dateMatch
            }

            if (year && month && day) {
              const yearNum = Number.parseInt(year)
              const monthNum = Number.parseInt(month)
              const dayNum = Number.parseInt(day)
              if (
                yearNum >= 2020 && yearNum <= 2035 &&
                monthNum >= 1 && monthNum <= 12 &&
                dayNum >= 1 && dayNum <= 31
              ) {
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
              }
            }
          }
        }
      }
      return ""
    }

    // 힌트 라인 우선, 실패 시 전체 라인에서 추출
    expiryDate = tryExtractDate(hintLines) || tryExtractDate(lines)
    if (expiryDate) {
      console.log("[v4] Found expiry date:", expiryDate)
    }

    // 4. 쿠폰명 추출 (더 정확한 추출 로직)
    const productKeywords = [
      "상품권", "쿠폰", "모바일", "천원권", "만원권", "원권", "기프티콘",
      "아메리카노", "라떼", "커피", "음료", "버거", "치킨", "피자", "세트",
      "스타벅스", "투썸플레이스", "할리스", "이디야", "메가MGC", "빽다방",
      "커피빈", "탐앤탐스", "커피나무", "폴바셋", "엔제리너스", "파스쿠찌",
      "카페베네", "드롭탑", "커피스미스", "카페마마", "투썸", "할리스",
      "이디야", "메가", "빽다방", "커피빈", "탐앤탐스", "커피나무",
      "폴바셋", "엔제리너스", "파스쿠찌", "카페베네", "드롭탑", "커피스미스",
      "카페마마", "맥도날드", "버거킹", "롯데리아", "KFC", "서브웨이",
      "도미노", "피자헛", "배스킨라빈스", "하겐다즈", "베스킨", "31",
      "아이스크림", "빙수", "케이크", "디저트", "베이커리", "도넛",
      "떡", "음식", "한식", "중식", "일식", "패스트푸드", "패밀리",
      "뷔페", "퓨전", "외국", "펍", "분식", "죽", "도시락", "와인",
      "양주", "맥주", "뷰티", "패션", "건강", "화장품", "영화", "문화",
      "도서", "생활용품", "잡화", "올리브영", "다이소", "무인양품",
      "이케아", "홈플러스", "이마트", "롯데마트", "CU", "GS25", "세븐일레븐"
    ]

    const noisePatterns = [
      /^\d{2}:\d{2}/, // time patterns like "01:06"
      /^[<>®©×QB\s\\/]+$/, // special characters only
      /선물하기/, /추가결제/, /내꺼/, /퀴즈정답/, /나도/,
      /\bpay\b/i, /\ball\b/i, /mugger/i,
      /^[\\/\s]+$/, // only slashes and spaces
      /^[a-zA-Z\s]{1,3}$/, // short English-only text
      /^[#"LZ\s]+$/, // specific noise patterns
      /^fd\s*"/, /^hd\s*"/, /행운의\s*주인공/, /opuciuei/i, /Entre/i, /H7IMGCHL/i,
    ]

    // 브랜드와 바코드 위치 찾기
    let brandLineIndex = -1
    let barcodeLineIndex = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (brand && lines[i] && lines[i].includes(brand)) {
        brandLineIndex = i
      }
      if (barcode && lines[i] && lines[i].includes(barcode)) {
        barcodeLineIndex = i
      }
    }

    // 쿠폰명 추출 로직 개선
    const categorizeByLanguage = (line: string) => {
      if (!line || typeof line !== "string") return null

      const hasKorean = /[가-힣]/.test(line)
      const hasEnglish = /[a-zA-Z]/.test(line)
      const hasNumbers = /\d/.test(line)
      const isNoise = noisePatterns.some((pattern) => pattern.test(line))

      if (isNoise || line.length < 2 || line.length > 100) return null

      if (hasKorean) return { line, priority: 1, type: "korean" }
      if (hasEnglish && !hasNumbers) return { line, priority: 2, type: "english" }
      if (hasEnglish && hasNumbers) return { line, priority: 3, type: "mixed" }
      if (hasNumbers) return { line, priority: 4, type: "numbers" }

      return null
    }

    const categorizedLines = lines
      .map((line, index) => {
        const categorized = categorizeByLanguage(line)
        return categorized ? { ...categorized, index } : null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        // First priority: Korean text with product keywords
        const aHasKeyword = a.line ? productKeywords.some((keyword) => a.line.includes(keyword)) : false
        const bHasKeyword = b.line ? productKeywords.some((keyword) => b.line.includes(keyword)) : false

        if (a.priority === 1 && aHasKeyword && !(b.priority === 1 && bHasKeyword)) return -1
        if (b.priority === 1 && bHasKeyword && !(a.priority === 1 && aHasKeyword)) return 1

        // Second priority: Text between brand and barcode
        if (brandLineIndex >= 0 && barcodeLineIndex >= 0) {
          const aIsBetween = a.index > brandLineIndex && a.index < barcodeLineIndex
          const bIsBetween = b.index > brandLineIndex && b.index < barcodeLineIndex

          if (aIsBetween && !bIsBetween) return -1
          if (!aIsBetween && bIsBetween) return 1
        }

        // Third priority: Text above barcode (if barcode found)
        if (barcodeLineIndex >= 0) {
          const aIsAboveBarcode = a.index < barcodeLineIndex
          const bIsAboveBarcode = b.index < barcodeLineIndex

          if (aIsAboveBarcode && !bIsAboveBarcode) return -1
          if (!aIsAboveBarcode && bIsAboveBarcode) return 1

          // Among text above barcode, prefer closer to barcode
          if (aIsAboveBarcode && bIsAboveBarcode) {
            const aDistance = barcodeLineIndex - a.index
            const bDistance = barcodeLineIndex - b.index
            if (aDistance !== bDistance) return aDistance - bDistance
          }
        }

        // Fourth priority: Language priority (Korean first)
        if (a.priority !== b.priority) return a.priority - b.priority

        // Fifth priority: Lines near brand
        if (brandLineIndex >= 0) {
          const aDistance = Math.abs(a.index - brandLineIndex)
          const bDistance = Math.abs(b.index - brandLineIndex)
          if (aDistance !== bDistance) return aDistance - bDistance
        }

        return 0
      })

    // Select the best product name (더 정확한 필터링)
    for (const item of categorizedLines) {
      if (
        item.line &&
        item.line !== barcode &&
        !item.line.includes("유효기간") &&
        !item.line.includes("만료") &&
        !item.line.includes(brand) &&
        !item.line.includes("바코드") &&
        !item.line.includes("Barcode") &&
        !item.line.includes("Code") &&
        !item.line.includes("번호") &&
        !item.line.includes("No.") &&
        !item.line.includes("NO.") &&
        !item.line.includes("no.") &&
        !item.line.includes("날짜") &&
        !item.line.includes("Date") &&
        !item.line.includes("DATE") &&
        !item.line.includes("date") &&
        item.line.length > 1 && // 최소 2글자 이상
        item.line.length < 50 // 최대 50글자 이하
      ) {
        name = item.line
        console.log("[v4] Found product name:", name, "from line:", item.line)
        break
      }
    }

    console.log("[v4] Perfect OCR Results:", { brand, name, expiryDate, barcode })

    // 5. 카테고리 자동 추천 (브랜드 기반)
    const category = brand ? getCategoryFromBrand(brand) : ""
    
    // 6. 금액권/교환권 자동 판별
    const { giftType, refinedCategory } = analyzeGifticonType(name, brand, category)

    return {
      brand: brand || "",
      name: name || "",
      expiryDate: expiryDate || "",
      barcode: barcode || "",
      category: refinedCategory || category || "",
      giftType: giftType || "exchange",
    }
  } catch (error) {
    console.error("[v4] Perfect OCR Error:", error)
    console.error("[v4] Error details:", error instanceof Error ? error.message : String(error))

    // Fallback to empty results if OCR fails
    return {
      brand: "",
      name: "",
      expiryDate: "",
      barcode: "",
      category: "",
      giftType: "exchange",
    }
  }
}

export const simulateOCR = performOCR

// OCR 결과에 giftType을 포함하도록 타입 확장
export interface OCRResult {
  brand: string
  name: string
  expiryDate: string
  barcode: string
  category: string
  giftType?: "amount" | "exchange"
}

function getCategoryFromBrand(brandName: string): string {
  const brand = BRAND_DATABASE.find((b) => b.name === brandName)
  return brand?.category || "기타"
}

// 쿠폰명을 분석하여 금액권/교환권만 자동 구분 (카테고리는 수동 선택)
function analyzeGifticonType(name: string, brand: string, category: string): { giftType: "amount" | "exchange", refinedCategory: string } {
  const lowerName = name.toLowerCase()
  const lowerBrand = brand.toLowerCase()
  
  // 금액권 패턴 (상품권, 금액, 원, 포인트 등)
  const amountKeywords = [
    "상품권", "금액권", "문화상품권", "도서상품권", "모바일상품권", "온라인상품권", 
    "포인트", "캐시", "기프티콘", "상품권", "천원권", "만원권", "오천원권", "이천원권",
    "삼천원권", "사천원권", "육천원권", "칠천원권", "팔천원권", "구천원권",
    "원권", "원권", "원권", "원권", "원권", "원권", "원권", "원권", "원권", "원권",
    "모바일", "온라인", "디지털", "전자", "e-", "e", "이-", "이"
  ]
  
  // 교환권 패턴 (음식, 음료, 서비스 등) - 훨씬 더 포괄적으로
  const exchangeKeywords = [
    // 음료
    "아메리카노", "라떼", "카페라떼", "카푸치노", "모카", "에스프레소", "드립커피", "핸드드립",
    "커피", "음료", "주스", "스무디", "프라푸치노", "프라페", "밀크쉐이크", "버블티",
    "녹차", "홍차", "우롱차", "보이차", "허브티", "캐모마일", "페퍼민트", "루이보스",
    
    // 음식
    "버거", "햄버거", "치즈버거", "불고기버거", "새우버거", "치킨버거", "베지버거",
    "세트", "콤보", "피자", "치킨", "양념치킨", "후라이드", "간장치킨", "양념치킨",
    "족발", "보쌈", "삼겹살", "갈비", "불고기", "닭갈비", "닭볶음탕", "닭볶음",
    "아이스크림", "빙수", "빙고", "팥빙수", "인절미빙수", "초코빙수", "딸기빙수",
    "케이크", "디저트", "베이커리", "도넛", "크로아상", "베이글", "마카롱", "티라미수",
    "떡", "인절미", "송편", "백설기", "가래떡", "쑥떡", "단팥빵", "크림빵",
    
    // 식사
    "음식", "한식", "중식", "일식", "양식", "퓨전", "패스트푸드", "패밀리", "뷔페",
    "분식", "떡볶이", "김밥", "라면", "우동", "파스타", "스파게티", "리조또", "오믈렛",
    "도시락", "김치찌개", "된장찌개", "순두부찌개", "부대찌개", "찌개", "국", "탕",
    "죽", "밥", "비빔밥", "덮밥", "카레", "오므라이스", "볶음밥", "주먹밥",
    
    // 술
    "와인", "양주", "맥주", "소주", "막걸리", "청주", "막걸리", "사케", "위스키",
    "브랜디", "진", "럼", "보드카", "테킬라", "칵테일", "모히또", "피나콜라다",
    
    // 서비스
    "뷰티", "패션", "건강", "화장품", "마사지", "네일", "헤어", "미용", "피부관리",
    "영화", "문화", "도서", "공연", "전시", "박물관", "미술관", "극장", "콘서트",
    "생활용품", "잡화", "가전", "가구", "인테리어", "홈데코", "주방용품", "욕실용품",
    
    // 기타
    "세탁", "수선", "정비", "주차", "운송", "택시", "버스", "지하철", "기차",
    "호텔", "펜션", "리조트", "캠핑", "글램핑", "모텔", "게스트하우스"
  ]
  
  // 브랜드별 교환권 판별 (더 정확한 브랜드 기반 분류)
  const exchangeBrands = [
    "스타벅스", "투썸플레이스", "할리스", "이디야", "메가커피", "빽다방", "커피빈", 
    "탐앤탐스", "커피나무", "폴바셋", "엔제리너스", "파스쿠찌", "카페베네", "드롭탑",
    "커피스미스", "카페마마", "투썸", "메가", "빽다방", "커피빈", "탐앤탐스",
    "맥도날드", "버거킹", "롯데리아", "KFC", "서브웨이", "도미노", "피자헛",
    "배스킨라빈스", "하겐다즈", "베스킨", "31", "아이스크림", "빙수", "디저트",
    "올리브영", "다이소", "무인양품", "이케아", "홈플러스", "이마트", "롯데마트"
  ]
  
  const amountBrands = [
    "CU", "GS25", "세븐일레븐", "올리브영", "다이소", "네이버페이", "카카오페이",
    "토스", "페이코", "삼성페이", "애플페이", "구글페이", "문화상품권", "도서상품권"
  ]
  
  // 1. 브랜드 기반 우선 판별 (가장 정확)
  if (lowerBrand) {
    if (exchangeBrands.some(brand => lowerBrand.includes(brand.toLowerCase()))) {
      return { giftType: "exchange", refinedCategory: category }
    }
    if (amountBrands.some(brand => lowerBrand.includes(brand.toLowerCase()))) {
      return { giftType: "amount", refinedCategory: category }
    }
  }
  
  // 2. 쿠폰명 키워드 기반 판별
  const amountScore = amountKeywords.filter(keyword => lowerName.includes(keyword.toLowerCase())).length
  const exchangeScore = exchangeKeywords.filter(keyword => lowerName.includes(keyword.toLowerCase())).length
  
  // 3. 카테고리 기반 판별
  let categoryScore = 0
  if (category) {
    const exchangeCategories = ["카페", "음식", "디저트", "패스트푸드", "뷰티", "영화", "문화"]
    const amountCategories = ["편의점", "상품권", "생활용품"]
    
    if (exchangeCategories.includes(category)) {
      categoryScore = 1
    } else if (amountCategories.includes(category)) {
      categoryScore = -1
    }
  }
  
  // 4. 최종 판별 (점수 기반)
  const totalExchangeScore = exchangeScore + categoryScore
  const totalAmountScore = amountScore - categoryScore
  
  console.log(`[GiftType Analysis] Name: ${name}, Brand: ${brand}, Category: ${category}`)
  console.log(`[GiftType Analysis] Exchange Score: ${totalExchangeScore}, Amount Score: ${totalAmountScore}`)
  
  if (totalExchangeScore > totalAmountScore) {
    return { giftType: "exchange", refinedCategory: category }
  } else if (totalAmountScore > totalExchangeScore) {
    return { giftType: "amount", refinedCategory: category }
  }
  
  // 5. 기본값 (교환권이 더 일반적이므로 교환권을 기본값으로)
  return { giftType: "exchange", refinedCategory: category }
}

// 중복 검사 함수
export const checkDuplicateGifticon = (
  newGifticon: Pick<Gifticon, "barcode" | "brand" | "name">,
  existingGifticons: Gifticon[]
): { isDuplicate: boolean; duplicateType: string; duplicateGifticon?: Gifticon } => {
  const { barcode, brand, name } = newGifticon
  
  // 0) 보조: 바코드 숫자만 비교 (공백/구분자 제거)
  const normalizeBarcode = (b?: string) => (b ? b.replace(/\D/g, "") : "")

  // 0-1) 보조: 브랜드/별칭 제거 + 소문자 + 공백/특수문자 정리한 쿠폰명
  const normalizeName = (raw: string, brandText?: string) => {
    let s = (raw || "").toLowerCase().trim()
    // 공백 다중 → 단일
    s = s.replace(/\s+/g, " ")
    // 브랜드명과 별칭 제거 (앞/뒤/중간 모두)
    const brandTokens: string[] = []
    if (brandText) brandTokens.push(brandText.toLowerCase())
    for (const b of BRAND_DATABASE) {
      brandTokens.push(b.name.toLowerCase(), ...b.aliases.map((a) => a.toLowerCase()))
    }
    const tokenRegex = new RegExp(`\\b(${brandTokens.map(t => t.replace(/[-/\\.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi")
    s = s.replace(tokenRegex, " ")
    // 특수문자 제거
    s = s.replace(/[^a-z0-9가-힣\s]/g, " ")
    // 최종 트리밍
    s = s.replace(/\s+/g, " ").trim()
    return s
  }

  const newBarcode = normalizeBarcode(barcode)
  const newNameNorm = normalizeName(name, brand)
  
  // 1. 바코드 중복 검사 (가장 정확)
  if (newBarcode) {
    const barcodeDuplicate = existingGifticons.find(g => normalizeBarcode(g.barcode) === newBarcode)
    if (barcodeDuplicate) {
      return {
        isDuplicate: true,
        duplicateType: "바코드",
        duplicateGifticon: barcodeDuplicate
      }
    }
  }
  
  // 2. 이름(정규화) 완전 일치 검사 - 브랜드/카테고리 무관
  if (newNameNorm) {
    const exactNameDuplicate = existingGifticons.find(g => normalizeName(g.name, g.brand) === newNameNorm)
    if (exactNameDuplicate) {
      return {
        isDuplicate: true,
        duplicateType: "쿠폰명(정규화) 동일",
        duplicateGifticon: exactNameDuplicate
      }
    }
  }
  
  // 3. 기존 로직: 브랜드 + 쿠폰명 조합 (그대로 유지해 추가적인 안전망 제공)
  if (brand && name) {
    const nameBrandDuplicate = existingGifticons.find(g => 
      g.brand.toLowerCase() === brand.toLowerCase() &&
      g.name.toLowerCase() === name.toLowerCase()
    )
    if (nameBrandDuplicate) {
      return {
        isDuplicate: true,
        duplicateType: "브랜드 + 쿠폰명",
        duplicateGifticon: nameBrandDuplicate
      }
    }
  }
  
  // 4. 유사한 쿠폰명 검사 (브랜드/카테고리 무관, 임계 상향)
  if (name) {
    const similarNameDuplicate = existingGifticons.find(g => {
      const n1 = normalizeName(g.name, g.brand)
      const n2 = newNameNorm
      if (!n1 || !n2) return false
      const distance = levenshteinDistance(n1, n2)
      const maxLength = Math.max(n1.length, n2.length)
      const similarity = 1 - (distance / maxLength)
      return similarity >= 0.9 // 90% 이상 유사하면 중복으로 간주
    })
    if (similarNameDuplicate) {
      return {
        isDuplicate: true,
        duplicateType: "유사한 쿠폰명",
        duplicateGifticon: similarNameDuplicate
      }
    }
  }
  
  return { isDuplicate: false, duplicateType: "" }
}

// 향상된 OCR 결과 검증 및 정제 함수
export const validateAndRefineOCRResult = (
  ocrResult: {
    name?: string
    brand?: string
    expiryDate?: string
    barcode?: string
    category?: string
    giftType?: "amount" | "exchange"
  },
  existingGifticons: Gifticon[] = []
): {
  isValid: boolean
  refinedResult: typeof ocrResult
  validationErrors: string[]
  duplicateCheck: { isDuplicate: boolean; duplicateType: string; duplicateGifticon?: Gifticon }
} => {
  const validationErrors: string[] = []
  const refinedResult = { ...ocrResult }
  
  // 1. 쿠폰명 검증 및 정제 (자동 기본값 채우기 제거)
  if (!refinedResult.name || refinedResult.name.trim().length === 0) {
    // 이전: 브랜드명을 쿠폰명으로 사용 → 제거
    validationErrors.push("쿠폰명을 인식하지 못했습니다")
  } else {
    refinedResult.name = refinedResult.name.trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s가-힣]/g, '')
  }
  
  // 2. 브랜드 검증 및 정제 (자동 기본값 채우기 최소화)
  if (!refinedResult.brand || refinedResult.brand.trim().length === 0) {
    validationErrors.push("브랜드를 인식하지 못했습니다")
  } else {
    refinedResult.brand = refinedResult.brand.trim()
  }
  
  // 3. 유효기간 검증 및 정제 (자동 기본값 제거)
  if (!refinedResult.expiryDate || refinedResult.expiryDate.trim().length === 0) {
    validationErrors.push("유효기간을 인식하지 못했습니다")
  } else {
    const dateMatch = refinedResult.expiryDate.match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/)
    if (dateMatch) {
      const [, yy, mm, dd] = dateMatch
      const y = Number.parseInt(yy)
      const m = Number.parseInt(mm)
      const d = Number.parseInt(dd)
      if (y < 2020 || y > 2035 || m < 1 || m > 12 || d < 1 || d > 31) {
        validationErrors.push("유효기간이 올바르지 않습니다")
        refinedResult.expiryDate = ""
      } else {
        refinedResult.expiryDate = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
      }
    } else {
      // 형식이 맞지 않으면 공란 처리
      refinedResult.expiryDate = ""
      validationErrors.push("유효기간 형식을 인식하지 못했습니다")
    }
  }
  
  // 4. 바코드 검증 및 정제 (자동 기본값 제거)
  if (!refinedResult.barcode) {
    validationErrors.push("바코드 번호를 인식하지 못했습니다")
  } else {
    const cleanBarcode = refinedResult.barcode.replace(/[^\d\s]/g, '')
    if (cleanBarcode.replace(/\s/g, '').length < 4) {
      validationErrors.push("바코드 번호가 너무 짧습니다")
      refinedResult.barcode = ""
    } else {
      const digits = cleanBarcode.replace(/\s/g, '')
      refinedResult.barcode = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    }
  }
  
  // 5. 카테고리 자동 추천 (브랜드 기반)
  if (!refinedResult.category || refinedResult.category === "other") {
    refinedResult.category = getCategoryFromBrand(refinedResult.brand || "")
    console.log("[Validation] 카테고리 자동 설정:", refinedResult.category)
  }
  
  // 6. 금액권/교환권 자동 판별
  if (!refinedResult.giftType) {
    const { giftType } = analyzeGifticonType(
      refinedResult.name || "", 
      refinedResult.brand || "", 
      refinedResult.category || ""
    )
    refinedResult.giftType = giftType
    console.log("[Validation] 기프티콘 유형 자동 설정:", refinedResult.giftType)
  }
  
  // 7. 중복 검사
  const duplicateCheck = checkDuplicateGifticon(
    {
      barcode: refinedResult.barcode || "",
      brand: refinedResult.brand || "",
      name: refinedResult.name || ""
    },
    existingGifticons
  )
  
  if (duplicateCheck.isDuplicate) {
    validationErrors.push(`중복된 기프티콘입니다 (${duplicateCheck.duplicateType})`)
  }
  
  // 모든 필수 정보가 있으면 유효한 것으로 간주
  const isValid = !!(refinedResult.name && refinedResult.brand && refinedResult.expiryDate && refinedResult.barcode)
  
  console.log("[Validation] 최종 검증 결과:", {
    isValid,
    name: refinedResult.name,
    brand: refinedResult.brand,
    expiryDate: refinedResult.expiryDate,
    barcode: refinedResult.barcode,
    category: refinedResult.category,
    giftType: refinedResult.giftType
  })
  
  return {
    isValid: isValid && !duplicateCheck.isDuplicate,
    refinedResult,
    validationErrors,
    duplicateCheck
  }
}

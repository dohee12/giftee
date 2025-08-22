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

  console.log("[v0] Brand matching for text:", text)
  console.log("[v0] Normalized text:", normalizedText)

  if (normalizedText.length <= 2) {
    console.log("[v0] Skipping short text:", normalizedText)
    return ""
  }

  for (const brand of BRAND_DATABASE) {
    let score = 0

    // Exact match with brand name (highest priority)
    if (normalizedText.includes(brand.name.toUpperCase())) {
      console.log("[v0] Exact brand name match:", brand.name)
      return brand.name
    }

    for (const alias of brand.aliases) {
      if (
        alias.length >= 3 &&
        (normalizedText.includes(alias.toUpperCase()) || alias.toUpperCase().includes(normalizedText))
      ) {
        console.log("[v0] Alias match found:", alias, "->", brand.name)
        return brand.name
      }
    }

    // Exact match with codes
    for (const code of brand.codes) {
      if (normalizedText === code || allText.includes(code)) {
        console.log("[v0] Code match found:", code, "->", brand.name)
        return brand.name
      }
    }

    // Similarity matching for aliases only (no keyword matching)
    for (const alias of brand.aliases) {
      if (alias.length >= 3 && normalizedText.length >= 3) {
        if (normalizedText.includes(alias.toUpperCase())) {
          score += 0.9 // High score for containing alias
          console.log("[v0] Text contains alias:", alias, "score:", score, "brand:", brand.name)
        } else if (alias.toUpperCase().includes(normalizedText) && normalizedText.length >= 3) {
          score += 0.8 // High score if alias contains the text
          console.log("[v0] Alias contains text:", alias, "score:", score, "brand:", brand.name)
        } else {
          const distance = levenshteinDistance(normalizedText, alias.toUpperCase())
          const similarity = 1 - distance / Math.max(normalizedText.length, alias.length)
          if (similarity > 0.8) {
            score += similarity * 0.7
            console.log(
              "[v0] Similarity match:",
              alias,
              "similarity:",
              similarity,
              "score:",
              score,
              "brand:",
              brand.name,
            )
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = brand.name
      console.log("[v0] New best match:", brand.name, "score:", score)
    }
  }

  console.log("[v0] Final best match:", bestMatch, "score:", highestScore)
  return highestScore > 0.7 ? bestMatch : ""
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
  category?: string // Added category to OCR result
}> => {
  try {
    const { createWorker } = await import("tesseract.js")

    console.log("[v0] Starting Tesseract.js OCR...")

    const worker = await createWorker("kor+eng", 1, {
      logger: (m) => console.log("[v0] Tesseract:", m),
    })

    const {
      data: { text },
    } = await worker.recognize(imageFile)
    await worker.terminate()

    console.log("[v0] Tesseract.js OCR Raw Text:", text)

    if (!text) {
      console.log("[v0] No text detected in image")
      return {
        brand: "",
        name: "",
        expiryDate: "",
        barcode: "",
        category: "", // Added category to fallback result
      }
    }

    const correctedText = correctOCRErrors(text)
    console.log("[v0] OCR Corrected Text:", correctedText)

    // Parse the extracted text to identify gifticon information
    const lines = correctedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    let brand = ""
    let name = ""
    let expiryDate = ""
    let barcode = ""

    // Try to find brand using similarity matching
    for (const line of lines) {
      const matchedBrand = findBestMatchingBrand(line, correctedText)
      if (matchedBrand) {
        brand = matchedBrand
        break
      }
    }

    // If no brand found from individual lines, try the full text
    if (!brand) {
      brand = findBestMatchingBrand(correctedText, correctedText)
    }

    const originalLines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    let barcodeLineIndex = -1
    for (let i = 0; i < originalLines.length; i++) {
      const line = originalLines[i]

      // Look for spaced barcode patterns (already in 4-digit groups)
      const spacedBarcodeMatch = line.match(
        /(\d{4}\s+\d{4}\s+\d{4}\s+\d{4})|(\d{3}\s+\d{4}\s+\d{4}\s+\d{2})|(\d{2}\s+\d{4}\s+\d{4}\s+\d{3})/,
      )
      if (spacedBarcodeMatch) {
        barcode = spacedBarcodeMatch[0]
        barcodeLineIndex = i
        break
      }

      // Look for continuous digit patterns and format them
      const cleanLine = line.replace(/\s+/g, "")
      const barcodeMatch = cleanLine.match(/\d{12,16}/)
      if (barcodeMatch) {
        const digits = barcodeMatch[0]
        // Format as 4-digit groups with spaces
        barcode = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
        barcodeLineIndex = i
        break
      }
    }

    const productKeywords = [
      "상품권",
      "쿠폰",
      "모바일",
      "천원권",
      "만원권",
      "원권",
      "기프티콘",
      "사발면",
      "라면",
      "음료",
      "커피",
      "버거",
      "치킨",
      "라떼",
      "녹차",
      "아메리카노",
    ]
    const noisePatterns = [
      /^\d{2}:\d{2}/, // time patterns like "01:06"
      /^[<>®©×QB\s\\/]+$/, // special characters only
      /선물하기/,
      /추가결제/,
      /내꺼/,
      /퀴즈정답/,
      /나도/,
      /\bpay\b/i,
      /\ball\b/i,
      /mugger/i,
      /^[\\/\s]+$/, // only slashes and spaces
      /^[a-zA-Z\s]{1,3}$/, // short English-only text
      /^[#"LZ\s]+$/, // specific noise patterns
      /^fd\s*"/, // specific noise like "fd \"LZ"
      /^hd\s*"/, // specific noise like "hd \"행운의"
      /행운의\s*주인공/, // noise text
      /opuciuei/i, // OCR noise
      /Entre/i, // OCR noise
      /H7IMGCHL/i, // OCR noise
    ]

    // Find brand index to look for product name nearby
    let brandLineIndex = -1
    for (let i = 0; i < lines.length; i++) {
      if (brand && lines[i] && lines[i].includes(brand)) {
        brandLineIndex = i
        break
      }
    }

    // Helper function to categorize text by language
    const categorizeByLanguage = (line: string) => {
      if (!line || typeof line !== "string") return null

      const hasKorean = /[가-힣]/.test(line)
      const hasEnglish = /[a-zA-Z]/.test(line)
      const hasNumbers = /\d/.test(line)
      const isNoise = noisePatterns.some((pattern) => pattern.test(line))

      if (isNoise || line.length < 2 || line.length > 80) return null

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

        // Second priority: Text above barcode (if barcode found)
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

        // Third priority: Language priority (Korean first)
        if (a.priority !== b.priority) return a.priority - b.priority

        // Fourth priority: Lines near brand
        if (brandLineIndex >= 0) {
          const aDistance = Math.abs(a.index - brandLineIndex)
          const bDistance = Math.abs(b.index - brandLineIndex)
          if (aDistance !== bDistance) return aDistance - bDistance
        }

        return 0
      })

    // Select the best product name based on enhanced priority
    for (const item of categorizedLines) {
      if (
        item.line &&
        item.line !== barcode &&
        !item.line.includes("유효기간") &&
        !item.line.includes("만료") &&
        !item.line.includes(brand)
      ) {
        // Don't use brand name as product name
        name = item.line
        break
      }
    }

    for (const line of originalLines) {
      // Try multiple date patterns as suggested by user
      const datePatterns = [
        /\b(20\d{2})[.\-/\s]?(1?\d)[.\-/\s]?(3?\d)\b/, // 2025.08.31 / 2025-8-31
        /\b(20\d{2})\s*년\s*(1?\d)\s*월\s*(3?\d)\s*일\b/, // 2025년 8월 31일
        /\b(20\d{2})([01]\d)([0-3]\d)\b/, // 20250831
        /\b([01]?\d)[.\-/]([0-3]?\d)[.\-/](20\d{2})\b/, // 08/31/2025
        /\b(\d{2})([01]\d)([0-3]\d)\b/, // 250831 (6-digit format)
      ]

      for (const pattern of datePatterns) {
        const dateMatch = line.match(pattern)
        if (dateMatch) {
          let year: string = "", month: string = "", day: string = ""

          if (pattern === datePatterns[0] || pattern === datePatterns[1]) {
            // YYYY-MM-DD or YYYY년 MM월 DD일 format
            ;[, year, month, day] = dateMatch
          } else if (pattern === datePatterns[2]) {
            // YYYYMMDD format
            ;[, year, month, day] = dateMatch
            month = month.slice(0, 2)
            day = day.slice(0, 2)
          } else if (pattern === datePatterns[3]) {
            // MM/DD/YYYY format
            ;[, month, day, year] = dateMatch
          } else if (pattern === datePatterns[4]) {
            // YYMMDD format (6-digit)
            ;[, year, month, day] = dateMatch
            year = `20${year}` // Assume 20XX
          }

          // Validate date components
          if (year && month && day) {
            const yearNum = Number.parseInt(year)
            const monthNum = Number.parseInt(month)
            const dayNum = Number.parseInt(day)

            if (yearNum >= 2020 && yearNum <= 2030 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
              expiryDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
              console.log("[v0] Found expiry date:", expiryDate, "from line:", line)
              break
            }
          }
        }
      }

      if (expiryDate) break
    }

    console.log("[v0] Tesseract.js OCR Results:", { brand, name, expiryDate, barcode })

    const category = brand ? getCategoryFromBrand(brand) : ""
    
    // 쿠폰명을 분석하여 금액권/교환권과 카테고리 자동 구분
    const { giftType, refinedCategory } = analyzeGifticonType(name, brand, category)

    return {
      brand: brand || "",
      name: name || "",
      expiryDate: expiryDate || "",
      barcode: barcode || "",
      category: refinedCategory || category || "",
    }
  } catch (error) {
    console.error("[v0] Tesseract.js OCR Error:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))

    // Fallback to empty results if OCR fails
    return {
      brand: "",
      name: "",
      expiryDate: "",
      barcode: "",
      category: "", // Added category to fallback result
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
  
  // 금액권 패턴 (상품권, 금액, 원, 포인트 등)
  const amountKeywords = ["상품권", "금액권", "문화상품권", "도서상품권", "모바일상품권", "온라인상품권", "포인트", "캐시", "기프티콘"]
  
  // 교환권 패턴 (음식, 음료, 서비스 등)
  const exchangeKeywords = ["아메리카노", "라떼", "커피", "음료", "버거", "세트", "피자", "치킨", "족발", "보쌈", "아이스크림", "빙수", "케이크", "디저트", "베이커리", "도넛", "떡", "음식", "한식", "중식", "일식", "패스트푸드", "패밀리", "뷔페", "퓨전", "외국", "펍", "분식", "죽", "도시락", "와인", "양주", "맥주", "뷰티", "패션", "건강", "화장품", "영화", "문화", "도서", "생활용품", "잡화"]
  
  // 금액권인지 확인
  const isAmount = amountKeywords.some(keyword => lowerName.includes(keyword.toLowerCase()))
  
  // 교환권인지 확인
  const isExchange = exchangeKeywords.some(keyword => lowerName.includes(keyword.toLowerCase()))
  
  // 금액권 패턴이 더 강하면 금액권으로 분류
  if (isAmount && !isExchange) {
    return { giftType: "amount", refinedCategory: category }
  }
  
  // 교환권 패턴이 더 강하면 교환권으로 분류
  if (isExchange && !isAmount) {
    return { giftType: "exchange", refinedCategory: category }
  }
  
  // 브랜드 기반으로 판단
  if (brand) {
    const brandCategory = getCategoryFromBrand(brand)
    if (brandCategory === "편의점" || brandCategory === "상품권") {
      return { giftType: "amount", refinedCategory: category }
    } else if (brandCategory === "카페" || brandCategory === "음식" || brandCategory === "디저트") {
      return { giftType: "exchange", refinedCategory: category }
    }
  }
  
  // 기본값
  return { giftType: "amount", refinedCategory: category }
}

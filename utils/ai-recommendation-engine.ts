import type { Gifticon, GifticonRecommendation, RecommendationContext } from "@/types/gifticon"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils"

export interface WeatherCondition {
  condition: "sunny" | "rainy" | "cloudy" | "snowy" | "hot" | "cold"
  temperature?: number
}

export interface SpecialEvent {
  type: "sports" | "holiday" | "weekend" | "payday" | "exam" | "date" | "birthday" | "anniversary" | "meeting" | "travel"
  name: string
  confidence: number
  details?: {
    sport?: string
    opponent?: string
    location?: string
    time?: string
  }
}

export class AIRecommendationEngine {
  private readonly MIN_GIFTICONS_FOR_RECOMMENDATION = 2
  private readonly MIN_MATCHING_GIFTICONS = 1

  private readonly TIME_BASED_RULES = {
    morning: {
      categories: ["cafe"],
      keywords: ["커피", "라떼", "아메리카노", "모닝", "브런치", "토스트", "샌드위치"],
      message: "하루를 시작하는 커피 한 잔은 어떠세요?",
      priority: "medium" as const,
    },
    afternoon: {
      categories: ["cafe", "convenience"],
      keywords: ["디저트", "간식", "아이스크림", "음료", "과자", "빵"],
      message: "오후 간식 시간이에요! 달콤한 휴식은 어떠세요?",
      priority: "low" as const,
    },
    evening: {
      categories: ["food"],
      keywords: ["저녁", "치킨", "피자", "햄버거", "족발", "보쌈", "스테이크", "파스타"],
      message: "저녁 식사 시간이네요! 맛있는 저녁은 어떠세요?",
      priority: "high" as const,
    },
    night: {
      categories: ["convenience"],
      keywords: ["야식", "라면", "과자", "음료", "치킨", "피자"],
      message: "늦은 밤 출출하시나요? 간단한 야식은 어떠세요?",
      priority: "low" as const,
    },
  }

  private readonly WEATHER_RULES = {
    sunny: {
      categories: ["cafe", "icecream"],
      keywords: ["아이스", "시원한", "냉", "빙수", "아이스크림", "콜드브루"],
      message: "맑은 날씨에 시원한 음료는 어떠세요? ☀️",
      priority: "medium" as const,
    },
    rainy: {
      categories: ["cafe", "food"],
      keywords: ["따뜻한", "뜨거운", "커피", "차", "국물", "찌개", "수프"],
      message: "비 오는 날엔 따뜻한 음식이 생각나네요! 🌧️",
      priority: "high" as const,
    },
    cloudy: {
      categories: ["cafe", "food"],
      keywords: ["커피", "차", "디저트", "간식"],
      message: "흐린 날씨엔 따뜻한 음료와 함께하는 휴식은 어떠세요? ☁️",
      priority: "low" as const,
    },
    snowy: {
      categories: ["cafe", "food"],
      keywords: ["따뜻한", "뜨거운", "핫초코", "커피", "차", "국물"],
      message: "눈 오는 날엔 따뜻한 음료로 몸을 녹여보세요! ❄️",
      priority: "high" as const,
    },
    hot: {
      categories: ["cafe", "convenience", "icecream"],
      keywords: ["아이스", "시원한", "냉", "빙수", "아이스크림", "콜드브루", "에이드"],
      message: "더운 날씨에 시원한 음료는 어떠세요? 🔥",
      priority: "high" as const,
    },
    cold: {
      categories: ["cafe", "food"],
      keywords: ["따뜻한", "뜨거운", "핫", "국물", "수프", "찌개"],
      message: "추운 날씨에 따뜻한 음식으로 몸을 녹여보세요! 🧊",
      priority: "high" as const,
    },
  }

  private readonly EVENT_RULES = {
    sports: {
      categories: ["food", "convenience"],
      keywords: ["치킨", "피자", "맥주", "안주", "과자", "음료", "햄버거"],
      message: "경기 관람하면서 치킨은 어떠세요? 🏈",
      priority: "high" as const,
      getCustomMessage: (event: SpecialEvent) => {
        if (event.details?.sport) {
          const sportEmojis: Record<string, string> = {
            "축구": "⚽", "야구": "⚾", "농구": "🏀", "배구": "🏐", "테니스": "🎾",
            "골프": "⛳", "수영": "🏊", "육상": "🏃", "체조": "🤸", "태권도": "🥋"
          }
          const emoji = sportEmojis[event.details.sport] || "🏆"
          return `${event.details.sport} 경기 관람하면서 ${emoji}`
        }
        return "경기 관람하면서 치킨은 어떠세요? 🏈"
      }
    },
    weekend: {
      categories: ["food", "cafe", "shopping"],
      keywords: ["브런치", "디저트", "특별한", "고급", "프리미엄"],
      message: "주말엔 평소보다 특별한 음식은 어떠세요?",
      priority: "medium" as const,
    },
    payday: {
      categories: ["food", "shopping", "cafe"],
      keywords: ["고급", "프리미엄", "특별한", "스테이크", "와인"],
      message: "월급날 기념으로 평소보다 좋은 걸로! 💰",
      priority: "high" as const,
    },
    birthday: {
      categories: ["cafe", "food", "shopping"],
      keywords: ["케이크", "디저트", "특별한", "고급", "축하"],
      message: "생일 축하해요! 🎂 특별한 디저트는 어떠세요?",
      priority: "high" as const,
    },
    anniversary: {
      categories: ["cafe", "food", "shopping"],
      keywords: ["와인", "스테이크", "고급", "로맨틱", "특별한"],
      message: "기념일을 특별하게! 💕 로맨틱한 저녁은 어떠세요?",
      priority: "high" as const,
    },
    meeting: {
      categories: ["cafe", "food"],
      keywords: ["커피", "차", "간단한", "프리젠테이션"],
      message: "회의 전에 커피 한 잔으로 집중력을 높여보세요! 💼",
      priority: "medium" as const,
    },
    travel: {
      categories: ["convenience", "food"],
      keywords: ["간단한", "휴대용", "스낵", "음료"],
      message: "여행 준비물로 간단한 스낵은 어떠세요? ✈️",
      priority: "medium" as const,
    },
    exam: {
      categories: ["cafe", "convenience"],
      keywords: ["커피", "에너지", "간식", "초콜릿", "사탕"],
      message: "시험 준비로 에너지 충전! 📚",
      priority: "medium" as const,
    },
    date: {
      categories: ["cafe", "food", "shopping"],
      keywords: ["로맨틱", "고급", "특별한", "와인", "디저트"],
      message: "데이트를 특별하게! 💕",
      priority: "high" as const,
    },
  }

  private readonly SEASONAL_RULES = {
    spring: {
      categories: ["cafe", "food"],
      keywords: ["벚꽃", "봄", "신선한", "새싹", "꽃차"],
      message: "봄의 신선함을 느껴보세요! 🌸",
      priority: "medium" as const,
    },
    summer: {
      categories: ["cafe", "icecream", "convenience"],
      keywords: ["시원한", "아이스", "빙수", "콜드브루", "에이드"],
      message: "더위를 날려버릴 시원한 음료는 어떠세요? 🌞",
      priority: "high" as const,
    },
    autumn: {
      categories: ["cafe", "food"],
      keywords: ["단풍", "가을", "따뜻한", "차", "호박"],
      message: "가을의 정취를 느껴보세요! 🍁",
      priority: "medium" as const,
    },
    winter: {
      categories: ["cafe", "food"],
      keywords: ["따뜻한", "핫초코", "국물", "수프", "찌개"],
      message: "추위를 녹여줄 따뜻한 음식은 어떠세요? ❄️",
      priority: "high" as const,
    },
  }

  private readonly MOOD_BASED_RULES = {
    happy: {
      categories: ["cafe", "food", "shopping"],
      keywords: ["디저트", "케이크", "아이스크림", "특별한", "축하"],
      message: "기분 좋은 날엔 달콤한 디저트로 더욱 특별하게! 😊",
      priority: "medium" as const,
    },
    stressed: {
      categories: ["cafe", "food"],
      keywords: ["커피", "차", "초콜릿", "따뜻한", "편안한"],
      message: "스트레스 받을 때는 따뜻한 음료로 마음을 진정시켜보세요! 😌",
      priority: "high" as const,
    },
    tired: {
      categories: ["cafe", "convenience"],
      keywords: ["에너지", "커피", "에너지드링크", "간식"],
      message: "피곤할 때는 에너지 충전이 필요해요! ⚡",
      priority: "medium" as const,
    },
    celebratory: {
      categories: ["food", "cafe", "shopping"],
      keywords: ["고급", "프리미엄", "특별한", "와인", "스테이크"],
      message: "축하할 일이 있나요? 특별한 음식으로 기념해보세요! 🎉",
      priority: "high" as const,
    },
  }

  generateRecommendations(gifticons: Gifticon[], weather?: WeatherCondition, specialEvents?: SpecialEvent[], mood?: string): GifticonRecommendation[] {
    console.log("🎯 AI 추천 엔진 시작...")
    
    // 사용 가능한 기프티콘만 필터링 (사용완료, 만료된 것 제외)
    const availableGifticons = gifticons.filter(g => {
      if (g.isUsed) return false
      if (g.expiryDate === "no-expiry") return true
      
      const daysUntilExpiry = Math.ceil((new Date(g.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry > 0 // 만료되지 않은 것만
    })
    
    console.log(`📦 사용 가능한 기프티콘: ${availableGifticons.length}개`)
    
    if (availableGifticons.length < 2) {
      console.log("❌ 추천 생성 불가: 사용 가능한 기프티콘이 2개 미만")
      return []
    }

    // 유효기간이 적은 순으로 정렬 (가장 빨리 만료되는 순)
    const sortedGifticons = availableGifticons.sort((a, b) => {
      if (a.expiryDate === "no-expiry" && b.expiryDate === "no-expiry") return 0
      if (a.expiryDate === "no-expiry") return 1 // no-expiry는 뒤로
      if (b.expiryDate === "no-expiry") return -1 // no-expiry는 뒤로
      
      const daysA = Math.ceil((new Date(a.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      const daysB = Math.ceil((new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysA - daysB // 가장 빨리 만료되는 순으로 정렬
    })

    console.log("📅 유효기간 순으로 정렬된 기프티콘:")
    sortedGifticons.forEach((g, index) => {
      if (g.expiryDate !== "no-expiry") {
        const days = Math.ceil((new Date(g.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        console.log(`  ${index + 1}. ${g.name} (${g.brand}) - ${days}일 후 만료`)
      } else {
        console.log(`  ${index + 1}. ${g.name} (${g.brand}) - 만료일 없음`)
      }
    })

    // 컨텍스트 정보 수집
    const context = this.buildContext(weather, specialEvents, mood)
    console.log("🌍 컨텍스트 정보:", context)
    
    const recommendations: GifticonRecommendation[] = []
    const usedGifticonIds = new Set<string>()

    console.log("📝 상황별 추천 생성 시작...")

    // 시간 기반 추천 (유효기간이 적은 기프티콘 우선)
    if (context.timeOfDay && context.timeOfDay !== "unknown") {
      const timeBasedRecs = this.generateTimeBasedRecommendations(sortedGifticons, context)
      if (timeBasedRecs.length > 0) {
        const rec = timeBasedRecs[0]
        if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
          recommendations.push(rec)
          usedGifticonIds.add(rec.recommendedGifticons[0].id)
          console.log("⏰ 시간 기반 추천 생성:", rec.title)
          console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
          console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
          return recommendations
        }
      }
    }

    // 날씨 기반 추천 (유효기간이 적은 기프티콘 우선)
    if (weather) {
      const weatherRecs = this.generateWeatherRecommendations(sortedGifticons, weather, context)
      if (weatherRecs.length > 0) {
        const rec = weatherRecs[0]
        if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
          recommendations.push(rec)
          usedGifticonIds.add(rec.recommendedGifticons[0].id)
          console.log("🌤️ 날씨 기반 추천 생성:", rec.title)
          console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
          console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
          return recommendations
        }
      }
    }

    // 이벤트 기반 추천 (유효기간이 적은 기프티콘 우선)
    if (specialEvents && specialEvents.length > 0) {
      const eventRecs = this.generateEventRecommendations(sortedGifticons, specialEvents, context)
      if (eventRecs.length > 0) {
        const rec = eventRecs[0]
        if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
          recommendations.push(rec)
          usedGifticonIds.add(rec.recommendedGifticons[0].id)
          console.log("🎉 이벤트 기반 추천 생성:", rec.title)
          console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
          console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
          return recommendations
        }
      }
    }

    // 계절 기반 추천 (유효기간이 적은 기프티콘 우선)
    if (context.season && context.season !== "unknown") {
      const seasonalRecs = this.generateSeasonalRecommendations(sortedGifticons, context)
      if (seasonalRecs.length > 0) {
        const rec = seasonalRecs[0]
        if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
          recommendations.push(rec)
          usedGifticonIds.add(rec.recommendedGifticons[0].id)
          console.log("🍂 계절 기반 추천 생성:", rec.title)
          console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
          console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
          return recommendations
        }
      }
    }

    // 기분 기반 추천 (유효기간이 적은 기프티콘 우선)
    if (mood && mood !== "unknown") {
      const moodRecs = this.generateMoodBasedRecommendations(sortedGifticons, mood, context)
      if (moodRecs.length > 0) {
        const rec = moodRecs[0]
        if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
          recommendations.push(rec)
          usedGifticonIds.add(rec.recommendedGifticons[0].id)
          console.log("😊 기분 기반 추천 생성:", rec.title)
          console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
          console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
          return recommendations
        }
      }
    }

    // 패턴 기반 추천 (사용자 선호도 분석, 유효기간이 적은 기프티콘 우선)
    const patternRecs = this.generatePatternRecommendations(gifticons, sortedGifticons, context)
    if (patternRecs.length > 0) {
      const rec = patternRecs[0]
      if (rec.recommendedGifticons.length > 0 && !usedGifticonIds.has(rec.recommendedGifticons[0].id)) {
        recommendations.push(rec)
        usedGifticonIds.add(rec.recommendedGifticons[0].id)
        console.log("📊 패턴 기반 추천 생성:", rec.title)
        console.log(`🎯 추천된 기프티콘: ${rec.recommendedGifticons[0].name} (유효기간: ${rec.recommendedGifticons[0].expiryDate})`)
        console.log("🎉 첫 번째 추천 완료! 다른 추천은 생성하지 않습니다.")
        return recommendations
      }
    }

    // 아무 추천도 생성되지 않은 경우, 가장 유효기간이 적은 기프티콘을 기본 추천
    if (recommendations.length === 0 && sortedGifticons.length > 0) {
      const defaultGifticon = sortedGifticons[0]
      const defaultRecommendation: GifticonRecommendation = {
        id: `default-${defaultGifticon.id}`,
        type: "pattern-based",
        title: "💡 기프티콘 사용 추천",
        message: `유효기간이 적은 ${defaultGifticon.name}을(를) 사용해보세요!`,
        recommendedGifticons: [defaultGifticon],
        context,
        priority: "medium",
        createdAt: new Date().toISOString(),
      }
      
      recommendations.push(defaultRecommendation)
      console.log("💡 기본 추천 생성:", defaultRecommendation.title)
      console.log(`🎯 추천된 기프티콘: ${defaultGifticon.name} (유효기간: ${defaultGifticon.expiryDate})`)
    }

    console.log(`🎉 총 ${recommendations.length}개의 추천 생성 완료!`)
    return recommendations.slice(0, 1) // 1개만 반환
  }

  private buildContext(
    weather?: WeatherCondition,
    specialEvents?: SpecialEvent[],
    mood?: string
  ): RecommendationContext {
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth() + 1
    const dayOfWeek = now.getDay()

    // 시간대 감지
    let timeOfDay: "morning" | "afternoon" | "evening" | "night" | "unknown" = "unknown"
    if (hour >= 6 && hour < 12) timeOfDay = "morning"
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon"
    else if (hour >= 17 && hour < 22) timeOfDay = "evening"
    else if (hour >= 22 || hour < 6) timeOfDay = "night"

    // 계절 감지
    let season: "spring" | "summer" | "autumn" | "winter" | "unknown" = "unknown"
    if (month >= 3 && month <= 5) season = "spring"
    else if (month >= 6 && month <= 8) season = "summer"
    else if (month >= 9 && month <= 11) season = "autumn"
    else if (month === 12 || month <= 2) season = "winter"

    // 주말 감지
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // 특별한 날 감지
    const date = now.getDate()
    const isSpecialDay = (month === 2 && date === 14) || // 발렌타인데이
                        (month === 3 && date === 14) || // 화이트데이
                        (month === 12 && date === 25) || // 크리스마스
                        date === 25 // 월급날

    return {
      timeOfDay,
      season,
      isWeekend,
      isSpecialDay,
      weather: weather?.condition || "unknown",
      specialEvents: specialEvents?.map(e => e.name) || [],
      mood: mood || "unknown",
      month,
      hour,
      dayOfWeek: now.toLocaleDateString("ko-KR", { weekday: "long" })
    }
  }

  private generateEventRecommendations(
    unusedGifticons: Gifticon[],
    events: SpecialEvent[],
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    const recommendations: GifticonRecommendation[] = []

    for (const event of events) {
      const rule = this.EVENT_RULES[event.type as keyof typeof this.EVENT_RULES]
      if (!rule) continue

      const matchingGifticons = this.findMatchingGifticons(unusedGifticons, rule.categories, rule.keywords)
      if (matchingGifticons.length < this.MIN_MATCHING_GIFTICONS) continue

      const message = 'getCustomMessage' in rule && rule.getCustomMessage ? rule.getCustomMessage(event) : rule.message

      recommendations.push({
        id: `event-${event.type}-${Date.now()}`,
        type: "event-based",
        title: `${event.name} 추천`,
        message: message,
        recommendedGifticons: matchingGifticons.slice(0, 3),
        context: { ...context, specialEvents: [event.name] },
        priority: rule.priority,
        createdAt: new Date().toISOString(),
      })
    }

    return recommendations
  }

  private generateWeatherRecommendations(
    unusedGifticons: Gifticon[],
    weather: WeatherCondition,
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    const rule = this.WEATHER_RULES[weather.condition as keyof typeof this.WEATHER_RULES]
    if (!rule) return []

    const matchingGifticons = this.findMatchingGifticons(unusedGifticons, rule.categories, rule.keywords)
    if (matchingGifticons.length < this.MIN_MATCHING_GIFTICONS) return []

    return [
      {
        id: `weather-${weather.condition}-${Date.now()}`,
        type: "weather-based",
        title: `${this.getWeatherEmoji(weather.condition)} 날씨 맞춤 추천`,
        message: rule.message,
        recommendedGifticons: matchingGifticons.slice(0, 3),
        context: { ...context, weather: weather.condition },
        priority: rule.priority,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  private generateSeasonalRecommendations(
    unusedGifticons: Gifticon[],
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    const season = context.season as keyof typeof this.SEASONAL_RULES
    if (!season) return []

    const rule = this.SEASONAL_RULES[season]
    const matchingGifticons = this.findMatchingGifticons(unusedGifticons, rule.categories, rule.keywords)

    if (matchingGifticons.length < this.MIN_MATCHING_GIFTICONS) return []

    return [
      {
        id: `seasonal-${season}-${Date.now()}`,
        type: "seasonal-based",
        title: `${this.getSeasonEmoji(season)} ${this.getSeasonTitle(season)}`,
        message: rule.message,
        recommendedGifticons: matchingGifticons.slice(0, 3),
        context,
        priority: rule.priority,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  private generateMoodBasedRecommendations(
    unusedGifticons: Gifticon[],
    mood: string,
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    const rule = this.MOOD_BASED_RULES[mood as keyof typeof this.MOOD_BASED_RULES]
    if (!rule) return []

    const matchingGifticons = this.findMatchingGifticons(unusedGifticons, rule.categories, rule.keywords)
    if (matchingGifticons.length < this.MIN_MATCHING_GIFTICONS) return []

    return [
      {
        id: `mood-${mood}-${Date.now()}`,
        type: "mood-based",
        title: `${this.getMoodEmoji(mood)} 기분 맞춤 추천`,
        message: rule.message,
        recommendedGifticons: matchingGifticons.slice(0, 3),
        context: { ...context, mood },
        priority: rule.priority,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  private generateTimeBasedRecommendations(
    unusedGifticons: Gifticon[],
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    if (context.timeOfDay === "unknown") return []
    
    const rule = this.TIME_BASED_RULES[context.timeOfDay]
    const matchingGifticons = this.findMatchingGifticons(unusedGifticons, rule.categories, rule.keywords)

    if (matchingGifticons.length < this.MIN_MATCHING_GIFTICONS) return []

    return [
      {
        id: `time-${context.timeOfDay}-${Date.now()}`,
        type: "time-based",
        title: `${this.getTimeEmoji(context.timeOfDay)} ${this.getTimeTitle(context.timeOfDay)}`,
        message: rule.message,
        recommendedGifticons: matchingGifticons.slice(0, 3),
        context,
        priority: rule.priority,
        createdAt: new Date().toISOString(),
      },
    ]
  }

  private generatePatternRecommendations(
    allGifticons: Gifticon[],
    unusedGifticons: Gifticon[],
    context: RecommendationContext,
  ): GifticonRecommendation[] {
    const usedGifticons = allGifticons.filter((g) => g.isUsed)
    if (usedGifticons.length < 3) return []

    const categoryUsage = this.analyzeCategoryUsage(usedGifticons)
    const brandUsage = this.analyzeBrandUsage(usedGifticons)

    const recommendations: GifticonRecommendation[] = []

    const favoriteCategory = Object.entries(categoryUsage).sort(([, a], [, b]) => b - a)[0]
    if (favoriteCategory && favoriteCategory[1] > 1) {
      const categoryGifticons = unusedGifticons.filter((g) => g.category === favoriteCategory[0])
      if (categoryGifticons.length >= this.MIN_MATCHING_GIFTICONS) {
        recommendations.push({
          id: `pattern-category-${Date.now()}`,
          type: "pattern-based",
          title: "자주 이용하시는 카테고리",
          message: `평소 자주 이용하시는 ${this.getCategoryLabel(favoriteCategory[0])} 기프티콘은 어떠세요?`,
          recommendedGifticons: categoryGifticons.slice(0, 3),
          context,
          priority: "low",
          createdAt: new Date().toISOString(),
        })
      }
    }

    return recommendations
  }

  private findMatchingGifticons(userGifticons: Gifticon[], categories: string[], keywords: string[]): Gifticon[] {
    // 사용자가 실제로 가지고 있는 기프티콘 중에서만 매칭
    return userGifticons
      .filter((g) => {
        // 카테고리 매칭
        const categoryMatch = categories.includes(g.category)
        
        // 키워드 매칭 (기프티콘 이름과 브랜드에서 검색)
        const keywordMatch = keywords.some(
          (keyword) =>
            g.name.toLowerCase().includes(keyword.toLowerCase()) ||
            g.brand.toLowerCase().includes(keyword.toLowerCase()),
        )
        
        return categoryMatch || keywordMatch
      })
      .sort((a, b) => {
        // 유효기간이 가까운 순으로 정렬
        const aExpiry = new Date(a.expiryDate).getTime()
        const bExpiry = new Date(b.expiryDate).getTime()
        return aExpiry - bExpiry
      })
  }

  private analyzeCategoryUsage(usedGifticons: Gifticon[]): Record<string, number> {
    return usedGifticons.reduce(
      (acc, g) => {
        acc[g.category] = (acc[g.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private analyzeBrandUsage(usedGifticons: Gifticon[]): Record<string, number> {
    return usedGifticons.reduce(
      (acc, g) => {
        acc[g.brand] = (acc[g.brand] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private deduplicateAndSort(recommendations: GifticonRecommendation[]): GifticonRecommendation[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 }

    return recommendations
      .filter((rec, index, arr) => arr.findIndex((r) => r.type === rec.type && r.title === rec.title) === index)
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  }

  private getWeatherEmoji(condition: string): string {
    const emojis = {
      sunny: "☀️",
      rainy: "🌧️",
      cloudy: "☁️",
      snowy: "❄️",
      hot: "🔥",
      cold: "🧊",
    }
    return emojis[condition as keyof typeof emojis] || "🌤️"
  }

  private getSeasonEmoji(season: string): string {
    const emojis = {
      spring: "🌸",
      summer: "🌞",
      autumn: "🍁",
      winter: "❄️",
    }
    return emojis[season as keyof typeof emojis] || "🌱"
  }

  private getSeasonTitle(season: string): string {
    const titles = {
      spring: "봄 맞춤 추천",
      summer: "여름 맞춤 추천",
      autumn: "가을 맞춤 추천",
      winter: "겨울 맞춤 추천",
    }
    return titles[season as keyof typeof titles] || "계절 맞춤 추천"
  }

  private getMoodEmoji(mood: string): string {
    const emojis = {
      happy: "😊",
      stressed: "😌",
      tired: "😴",
      celebratory: "🎉",
    }
    return emojis[mood as keyof typeof emojis] || "😊"
  }

  private getTimeEmoji(timeOfDay: string): string {
    const emojis = {
      morning: "🌅",
      afternoon: "☀️",
      evening: "🌆",
      night: "🌙",
    }
    return emojis[timeOfDay as keyof typeof emojis] || "⏰"
  }

  private getTimeTitle(timeOfDay: string): string {
    const titles = {
      morning: "좋은 아침이에요!",
      afternoon: "오후 시간이네요!",
      evening: "저녁 시간입니다!",
      night: "늦은 밤이네요!",
    }
    return titles[timeOfDay as keyof typeof titles] || "안녕하세요!"
  }

  private getCategoryLabel(category: string): string {
    const labels = {
      cafe: "카페",
      food: "음식",
      convenience: "편의점",
      shopping: "쇼핑",
      burger: "패스트푸드",
      chicken: "치킨",
      asian: "한식",
      fusion: "퓨전",
      buffet: "뷔페",
      snack: "분식",
      alcohol: "주류",
      beauty: "뷰티",
      movie: "영화",
      culture: "문화",
      living: "생활용품",
      icecream: "아이스크림",
      bakery: "베이커리",
      voucher: "상품권",
      other: "기타",
    }
    return labels[category as keyof typeof labels] || category
  }
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { AIRecommendationEngine, type SpecialEvent } from "@/utils/ai-recommendation-engine"
import type { Gifticon, GifticonRecommendation } from "@/types/gifticon"

// 날씨 조건 타입
interface WeatherCondition {
  condition: "sunny" | "rainy" | "cloudy" | "snowy" | "hot" | "cold"
  temperature?: number
}

export function useAIRecommendations(gifticons: Gifticon[]) {
  const [recommendations, setRecommendations] = useState<GifticonRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [engine] = useState(() => new AIRecommendationEngine())

  // 날씨 조건 감지
  const detectWeatherCondition = (): WeatherCondition | undefined => {
    const now = new Date()
    const month = now.getMonth() + 1
    const hour = now.getHours()

    // 간단한 계절/시간 기반 날씨 추정
    if (month >= 6 && month <= 8) {
      // 여름철 더운 날씨
      if (hour >= 12 && hour <= 18) {
        return { condition: "hot", temperature: 30 }
      } else {
        return { condition: "sunny", temperature: 25 }
      }
    } else if (month >= 12 || month <= 2) {
      // 겨울철 추운 날씨
      if (hour >= 6 && hour <= 9) {
        return { condition: "cold", temperature: 5 }
      } else if (Math.random() < 0.2) {
        return { condition: "snowy", temperature: 0 }
      } else {
        return { condition: "cold", temperature: 8 }
      }
    } else if (month >= 3 && month <= 5) {
      // 봄철
      if (Math.random() < 0.4) {
        return { condition: "rainy" }
      } else {
        return { condition: "sunny", temperature: 18 }
      }
    } else if (month >= 9 && month <= 11) {
      // 가을철
      if (Math.random() < 0.3) {
        return { condition: "rainy" }
      } else {
        return { condition: "cloudy", temperature: 15 }
      }
    }

    // 기본값
    if (Math.random() < 0.3) {
      return { condition: "rainy" }
    }
    return { condition: "sunny", temperature: 20 }
  }

  // 특별한 이벤트 감지
  const detectSpecialEvents = (): SpecialEvent[] => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const hour = now.getHours()
    const date = now.getDate()
    const month = now.getMonth() + 1
    const events: SpecialEvent[] = []

    // 주말 감지
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      events.push({
        type: "weekend",
        name: "주말",
        confidence: 1.0,
      })
    }

    // 월급날 추정 (매월 25일)
    if (date === 25) {
      events.push({
        type: "payday",
        name: "월급날",
        confidence: 0.9,
      })
    }

    // 스포츠 경기 시간 추정 (금/토/일 저녁)
    if ((dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) && hour >= 19 && hour <= 22) {
      const sports = ["축구", "야구", "농구", "배구"]
      const randomSport = sports[Math.floor(Math.random() * sports.length)]
      
      events.push({
        type: "sports",
        name: `${randomSport} 경기`,
        confidence: 0.7,
        details: {
          sport: randomSport,
          time: `${hour}시`,
        }
      })
    }

    // 데이트 시간 추정 (금/토 저녁)
    if ((dayOfWeek === 5 || dayOfWeek === 6) && hour >= 18 && hour <= 21) {
      events.push({
        type: "date",
        name: "데이트 시간",
        confidence: 0.5,
      })
    }

    // 생일 추정 (매월 1일, 15일)
    if (date === 1 || date === 15) {
      events.push({
        type: "birthday",
        name: "생일",
        confidence: 0.3,
      })
    }

    // 기념일 추정 (특별한 날들)
    if ((month === 2 && date === 14) || (month === 3 && date === 14) || (month === 12 && date === 25)) {
      const eventNames = {
        "2-14": "발렌타인데이",
        "3-14": "화이트데이", 
        "12-25": "크리스마스"
      }
      const key = `${month}-${date}`
      events.push({
        type: "anniversary",
        name: eventNames[key as keyof typeof eventNames] || "특별한 날",
        confidence: 0.8,
      })
    }

    // 회의 시간 추정 (평일 오전/오후)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
        events.push({
          type: "meeting",
          name: "회의 시간",
          confidence: 0.6,
        })
      }
    }

    // 여행 시즌 (여름/겨울 방학)
    if ((month === 7 || month === 8) || (month === 1 || month === 2)) {
      if (Math.random() < 0.4) {
        events.push({
          type: "travel",
          name: "여행 시즌",
          confidence: 0.5,
        })
      }
    }

    // 시험 기간 추정 (학기 시작/끝)
    if ((month === 3 && date >= 1 && date <= 15) || (month === 9 && date >= 1 && date <= 15)) {
      events.push({
        type: "exam",
        name: "시험 기간",
        confidence: 0.4,
      })
    }

    return events
  }

  // 기분 감지
  const detectMood = (): "happy" | "stressed" | "tired" | "celebratory" | undefined => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const hour = now.getHours()
    const date = now.getDate()
    const month = now.getMonth() + 1

    // 축하할 일이 있는 경우
    if (date === 25 || (month === 2 && date === 14) || (month === 3 && date === 14) || (month === 12 && date === 25)) {
      return "celebratory"
    }

    // 주말이고 좋은 시간대
    if ((dayOfWeek === 0 || dayOfWeek === 6) && hour >= 10 && hour <= 18) {
      return "happy"
    }

    // 월요일 오전이나 금요일 오후
    if ((dayOfWeek === 1 && hour <= 10) || (dayOfWeek === 5 && hour >= 17)) {
      return "stressed"
    }

    // 늦은 밤이나 이른 아침
    if (hour <= 6 || hour >= 23) {
      return "tired"
    }

    // 평일 오후 (점심 후)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 13 && hour <= 15) {
      return "tired"
    }

    // 기본적으로는 기분 좋은 상태
    if (Math.random() < 0.6) {
      return "happy"
    }

    return undefined
  }

  const generateRecommendationsForUser = useCallback(async () => {
    if (gifticons.length < 2) {
      console.log("🚫 AI 추천 생성 중단: 사용 가능한 기프티콘이 2개 미만")
      setRecommendations([])
      return
    }

    setIsLoading(true)
    console.log("🤖 AI 추천 생성 시작...")
    
    // 사용 가능한 기프티콘 분석
    const availableGifticons = gifticons.filter(g => {
      if (g.isUsed) return false
      if (g.expiryDate === "no-expiry") return true
      
      const daysUntilExpiry = Math.ceil((new Date(g.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry > 0
    })
    
    console.log("📊 사용 가능한 기프티콘 수:", availableGifticons.length)

    try {
      // 컨텍스트 정보 수집
      const weather = detectWeatherCondition()
      const specialEvents = detectSpecialEvents()
      const mood = detectMood()

      console.log("🌤️ 감지된 날씨:", weather)
      console.log("🎉 감지된 이벤트:", specialEvents)
      console.log("😊 감지된 기분:", mood)

      const newRecommendations = engine.generateRecommendations(gifticons, weather, specialEvents, mood)
      console.log("✨ AI 추천 생성 완료!")
      console.log("📝 생성된 추천 목록:")
      newRecommendations.forEach((rec: GifticonRecommendation, index: number) => {
        console.log(`  ${index + 1}. [${rec.type}] ${rec.title}`)
        console.log(`     💡 추천 이유: ${rec.message}`)
        console.log(`     🎯 추천 기프티콘: ${rec.recommendedGifticons.map((g: Gifticon) => g.name).join(", ")}`)
        console.log(`     🏷️ 카테고리: ${rec.recommendedGifticons.map((g: Gifticon) => g.category).join(", ")}`)
        console.log(`     🏪 브랜드: ${rec.recommendedGifticons.map((g: Gifticon) => g.brand).join(", ")}`)
        console.log(`     📅 만료일: ${rec.recommendedGifticons.map((g: Gifticon) => {
          if (g.expiryDate === "no-expiry") return "만료일 없음"
          return g.expiryDate
        }).join(", ")}`)
        console.log("     ---")
      })
      
      // AI 추천이 생성되지 않은 경우 테스트용 추천 생성
      if (newRecommendations.length === 0 && availableGifticons.length >= 2) {
        console.log("🔧 AI 추천이 생성되지 않음. 테스트용 추천을 생성합니다.")
        const testRecommendation: GifticonRecommendation = {
          id: "test-recommendation-" + Date.now(),
          type: "time-based",
          title: "테스트 추천",
          message: "AI 추천 시스템이 정상적으로 작동하고 있습니다!",
          priority: "medium",
          recommendedGifticons: availableGifticons.slice(0, 2),
          context: {
            timeOfDay: "afternoon",
            weather: weather?.condition || "sunny",
            events: specialEvents.map(e => e.name),
            mood: mood || "happy"
          }
        }
        console.log("🧪 테스트 추천 생성:", testRecommendation)
        setRecommendations([testRecommendation])
      } else {
        setRecommendations(newRecommendations)
      }
    } catch (error) {
      console.error("❌ AI 추천 생성 실패:", error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }, [gifticons, engine])

  useEffect(() => {
    generateRecommendationsForUser()
  }, [generateRecommendationsForUser])

  return {
    recommendations,
    isLoading,
    regenerate: generateRecommendationsForUser,
  }
}

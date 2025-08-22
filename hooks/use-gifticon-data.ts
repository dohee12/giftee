"use client"

import { useState, useEffect, useCallback } from "react"
import type { Gifticon } from "@/types/gifticon"
import { getExpiringSoonGifticons, getBrandsByCategory } from "@/utils/gifticon-data-utils"
import { useSettings } from "@/hooks/use-app-settings"

const STORAGE_KEY = "gifticon-data"

export function useGifticons() {
  const [gifticons, setGifticons] = useState<Gifticon[]>([])
  const [notifications, setNotifications] = useState<Gifticon[]>([])
  const { settings } = useSettings()

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log("localStorage에서 데이터 불러옴:", parsedData)
          setGifticons(parsedData)
          return
        } catch (error) {
          console.error("localStorage 데이터 파싱 오류:", error)
        }
      }

      // 저장된 데이터가 없으면 샘플 데이터 사용
      const sampleData: Gifticon[] = [
        {
          id: "1",
          name: "아메리카노 Tall",
          brand: "스타벅스",
          category: "cafe",
          giftType: "exchange",
          expiryDate: "2024-12-31",
          isUsed: false,
          imageUrl: "/placeholder.svg?height=200&width=300",
          barcode: "1234567890123",
          memo: "생일 선물로 받음",
          registeredAt: "2024-01-15",
          price: 4500,
        },
        {
          id: "2",
          name: "아메리카노 Regular",
          brand: "스타벅스",
          category: "cafe",
          giftType: "exchange",
          expiryDate: "2024-02-28",
          isUsed: false,
          imageUrl: "/placeholder.svg?height=200&width=300",
          barcode: "1234567890124",
          registeredAt: "2024-01-10",
          price: 3500,
        },
        {
          id: "3",
          name: "아이스 아메리카노",
          brand: "메가커피",
          category: "cafe",
          giftType: "exchange",
          expiryDate: "2024-03-15",
          isUsed: false,
          imageUrl: "/placeholder.svg?height=200&width=300",
          barcode: "2234567890123",
          registeredAt: "2024-01-12",
          price: 2000,
        },
        {
          id: "4",
          name: "치킨버거 세트",
          brand: "맥도날드",
          category: "food",
          giftType: "exchange",
          expiryDate: "2024-01-25",
          isUsed: false,
          imageUrl: "/placeholder.svg?height=200&width=300",
          barcode: "9876543210987",
          registeredAt: "2024-01-05",
          price: 6500,
        },
        {
          id: "5",
          name: "상품권 5000원",
          brand: "CU",
          category: "convenience",
          giftType: "amount",
          expiryDate: "2024-06-30",
          isUsed: true,
          imageUrl: "/placeholder.svg?height=200&width=300",
          barcode: "5555666677778",
          memo: "이미 사용함",
          registeredAt: "2024-01-01",
          price: 5000,
        },
      ]
      console.log("초기 샘플 데이터 로드:", sampleData)
      setGifticons(sampleData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
    }
  }, [])

  // localStorage에 데이터 저장
  const saveToStorage = useCallback((data: Gifticon[]) => {
    console.log("=== saveToStorage 시작 ===")
    console.log("저장할 데이터:", data)
    console.log("데이터 길이:", data.length)
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        console.log("localStorage 저장 성공")
        
        // 저장된 데이터 확인
        const savedData = localStorage.getItem(STORAGE_KEY)
        const parsedData = savedData ? JSON.parse(savedData) : null
        console.log("저장 후 확인:", parsedData)
        console.log("저장된 데이터 길이:", parsedData ? parsedData.length : 0)
      } catch (error) {
        console.error("localStorage 저장 오류:", error)
      }
    } else {
      console.log("window 객체가 없음 (SSR)")
    }
    
    console.log("=== saveToStorage 완료 ===")
  }, [])

  // 유효기간 알림 체크 로직
  useEffect(() => {
    const expiringSoon = getExpiringSoonGifticons(gifticons, settings.expiryNotificationDays)
    setNotifications(expiringSoon)
  }, [gifticons, settings.expiryNotificationDays])

  const addGifticon = useCallback(
    (newGifticon: Omit<Gifticon, "id" | "registeredAt">) => {
      console.log("=== addGifticon 시작 ===")
      console.log("새 기프티콘 데이터:", newGifticon)
      
      const gifticon: Gifticon = {
        ...newGifticon,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString().split("T")[0],
      }
      
      console.log("생성된 기프티콘:", gifticon)
      
      setGifticons((prev) => {
        console.log("이전 기프티콘 목록:", prev)
        const updated = [...prev, gifticon]
        console.log("업데이트된 기프티콘 목록:", updated)
        
        // 즉시 localStorage에 저장
        saveToStorage(updated)
        
        // 강제로 리렌더링을 위해 새로운 배열 반환
        return [...updated]
      })
      
      console.log("=== addGifticon 완료 ===")
    },
    [saveToStorage],
  )

  const updateGifticon = useCallback(
    (updatedGifticon: Gifticon) => {
      setGifticons((prev) => {
        const updated = prev.map((g) => 
          g.id === updatedGifticon.id ? updatedGifticon : g
        )
        console.log("기프티콘 수정 후:", updated)
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage],
  )

  const deleteGifticon = useCallback(
    (id: string) => {
      setGifticons((prev) => {
        const updated = prev.filter((g) => g.id !== id)
        console.log("기프티콘 삭제 후:", updated)
        saveToStorage(updated)
        return updated
      })
    },
    [saveToStorage],
  )

  const toggleUsed = useCallback(
    (id: string) => {
      console.log("=== toggleUsed 함수 호출 ===")
      console.log("대상 ID:", id)

      setGifticons((prevGifticons) => {
        console.log("이전 상태:", prevGifticons)

        const targetGifticon = prevGifticons.find((g) => g.id === id)
        console.log("대상 기프티콘:", targetGifticon)

        if (!targetGifticon) {
          console.error("기프티콘을 찾을 수 없습니다:", id)
          return prevGifticons
        }

        const updatedGifticons = prevGifticons.map((g) => {
          if (g.id === id) {
            const updated = { ...g, isUsed: !g.isUsed }
            console.log("상태 변경:", g.isUsed, "->", updated.isUsed)
            return updated
          }
          return g
        })

        console.log("업데이트된 전체 상태:", updatedGifticons)
        console.log("=== toggleUsed 완료 ===")

        // localStorage에 저장
        saveToStorage(updatedGifticons)

        // 강제로 리렌더링을 위해 새로운 배열 반환
        return [...updatedGifticons]
      })
    },
    [saveToStorage],
  )

  const getGifticonsByBrand = useCallback(
    (brand: string) => {
      const result = gifticons.filter((g) => g.brand === brand)
      console.log(`브랜드 ${brand}의 기프티콘:`, result)
      return result
    },
    [gifticons],
  )

  const getGifticonsByCategory = useCallback(
    (category: string) => {
      return gifticons.filter((g) => g.category === category)
    },
    [gifticons],
  )

  const brandsByCategory = getBrandsByCategory(gifticons)

  const getUnusedGifticons = useCallback(() => {
    return gifticons.filter((g) => !g.isUsed)
  }, [gifticons])

  const getGifticonsByCriteria = useCallback(
    (criteria: {
      categories?: string[]
      brands?: string[]
      keywords?: string[]
      unusedOnly?: boolean
    }) => {
      return gifticons.filter((g) => {
        if (criteria.unusedOnly && g.isUsed) return false

        if (criteria.categories && !criteria.categories.includes(g.category)) return false

        if (criteria.brands && !criteria.brands.includes(g.brand)) return false

        if (criteria.keywords) {
          const hasKeyword = criteria.keywords.some(
            (keyword) =>
              g.name.toLowerCase().includes(keyword.toLowerCase()) ||
              g.brand.toLowerCase().includes(keyword.toLowerCase()),
          )
          if (!hasKeyword) return false
        }

        return true
      })
    },
    [gifticons],
  )

  // 현재 상태를 주기적으로 로그
  useEffect(() => {
    console.log("현재 기프티콘 상태:", gifticons)
    console.log(
      "사용된 기프티콘:",
      gifticons.filter((g) => g.isUsed),
    )
  }, [gifticons])

  return {
    gifticons,
    notifications,
    brandsByCategory,
    addGifticon,
    updateGifticon,
    deleteGifticon,
    toggleUsed,
    getGifticonsByBrand,
    getGifticonsByCategory,
    getUnusedGifticons,
    getGifticonsByCriteria,
  }
}

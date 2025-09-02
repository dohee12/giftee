"use client"

import { useState, useEffect } from "react"

export type ListView = "list" | "card"
export type SortBy = "brand" | "expiryDate" | "registeredAt"
export type SortOrder = "asc" | "desc"

interface AppSettings {
  listView: ListView
  sortBy: SortBy
  sortOrder: SortOrder
  barcodeBrightness: boolean
  expiryNotification: boolean
  autoCouponRecognition: boolean
  autoImageInput: boolean
  expiryNotificationDays: number
  aiRecommendations: boolean
  aiRecommendationFrequency: "realtime" | "15min" | "hourly" | "6hours" | "daily"
  showRecommendationBadges: boolean
  customEmojis: string[]
  hiddenDefaultEmojis: string[]
}

const DEFAULT_SETTINGS: AppSettings = {
  listView: "card",
  sortBy: "expiryDate",
  sortOrder: "asc",
  barcodeBrightness: true,
  expiryNotification: true,
  autoCouponRecognition: false,
  autoImageInput: true,
  expiryNotificationDays: 7,
  aiRecommendations: true,
  aiRecommendationFrequency: "6hours",
  showRecommendationBadges: true,
  customEmojis: [],
  hiddenDefaultEmojis: [],
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isHydrated, setIsHydrated] = useState(false)

  // 마운트 후 localStorage에서 불러오기 (SSR/초기 hydration과 동일 렌더 유지)
  useEffect(() => {
    if (typeof window === "undefined") return
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (e) {
        // 무시하고 기본값 유지
      }
    }
    setIsHydrated(true)
  }, [])

  // 설정 변경 시 localStorage에 저장 (초기 로드 이후에만)
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem("appSettings", JSON.stringify(settings))
  }, [settings, isHydrated])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return {
    settings,
    updateSetting,
  }
}

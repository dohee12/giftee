"use client"

import { useState, useEffect } from "react"

export type ListView = "list" | "card"
export type SortBy = "brand" | "expiryDate" | "registeredAt"
export type SortOrder = "asc" | "desc"

// AppSettings 인터페이스에 expiryNotificationDays 추가
interface AppSettings {
  listView: ListView
  sortBy: SortBy
  sortOrder: SortOrder
  barcodeBrightness: boolean
  expiryNotification: boolean
  autoCouponRecognition: boolean
  autoImageInput: boolean
  expiryNotificationDays: number // 새로 추가
}

// DEFAULT_SETTINGS에 기본값 추가
const DEFAULT_SETTINGS: AppSettings = {
  listView: "card",
  sortBy: "expiryDate",
  sortOrder: "asc",
  barcodeBrightness: true,
  expiryNotification: true,
  autoCouponRecognition: false,
  autoImageInput: true,
  expiryNotificationDays: 7, // 기본값 7일
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // 클라이언트 사이드에서 localStorage에서 설정 불러오기
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("appSettings")
      return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS
    }
    return DEFAULT_SETTINGS
  })

  // 설정 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("appSettings", JSON.stringify(settings))
    }
  }, [settings])

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return {
    settings,
    updateSetting,
  }
}

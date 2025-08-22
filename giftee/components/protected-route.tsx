"use client"

import type React from "react"

// 테스트를 위해 인증 체크를 비활성화
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // 바로 children을 반환하여 인증 체크 우회
  return <>{children}</>
}

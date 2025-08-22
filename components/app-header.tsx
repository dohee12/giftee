"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Search, Bell, Gift, History, Settings } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { useSettings } from "@/hooks/use-app-settings"
import { useAuth } from "@/contexts/auth-context"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils"
import type React from "react"

type AppHeaderProps = {
  searchTerm?: string
  setSearchTerm?: (v: string) => void
  rightExtra?: React.ReactNode
  pageTitle?: string
}

export function AppHeader({ searchTerm, setSearchTerm, rightExtra, pageTitle }: AppHeaderProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { notifications } = useGifticons()
  const { settings } = useSettings()
  const { isLoggedIn, login, logout } = useAuth()
  const [internalSearch, setInternalSearch] = useState("")
  const term = searchTerm ?? internalSearch
  const setTerm = setSearchTerm ?? setInternalSearch
  const searchEnabled = typeof setSearchTerm === "function" || typeof searchTerm === "string"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white overflow-hidden">
      {/* 왼쪽 섹션 */}
      <div className="flex items-center space-x-1">
        {/* 모바일에서만 사이드바 토글 표시 */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="메뉴 토글"
              >
                <Gift className="h-6 w-6 text-blue-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">메뉴</h3>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center space-x-2 w-full">
                    <Gift className="h-4 w-4" />
                    <span>기프티콘 관리</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history" className="flex items-center space-x-2 w-full">
                    <History className="h-4 w-4" />
                    <span>사용 내역</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center space-x-2 w-full">
                    <Settings className="h-4 w-4" />
                    <span>설정</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <h1 className="text-lg font-bold text-gray-900">Giftee</h1>
        </button>
        {pageTitle && (
          <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        )}
      </div>

      {/* 중앙 섹션 - PC 검색창 */}
      {searchEnabled && (
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="기프티콘 검색..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* 오른쪽 섹션 */}
      <div className="ml-auto flex items-center space-x-2">
        {/* 모바일 검색창 */}
        {searchEnabled && (
          <div className="md:hidden relative w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="기프티콘 검색..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* 알림 */}
        {settings.expiryNotification && notifications.length > 0 && (
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    만료 임박 기프티콘 ({notifications.length}개)
                  </h3>
                  <DropdownMenuSeparator />
                  {notifications.map((gifticon, index) => (
                    <DropdownMenuItem key={gifticon.id} className="flex flex-col items-start p-3 cursor-default">
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-sm font-medium text-red-600">{index + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{gifticon.brand} {gifticon.name}</p>
                          <p className="text-xs text-gray-500">{getDaysUntilExpiry(gifticon.expiryDate)}일 남음</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* 우측 추가 요소 */}
        {rightExtra}

        {/* 로그인/로그아웃 */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">U</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/settings")}>계정 설정</DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={() => router.push("/auth/login")}>로그인</Button>
        )}
      </div>
    </header>
  )
}



"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Gift, History, Settings, User2, ChevronUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
 

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const { toggleSidebar, state, setOpen, openMobile } = useSidebar()
  const isMobile = useIsMobile()
  const { isAuthenticated, user, logout } = useAuth()

  const handleGoHome = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("giftee:go-home"))
    } else {
      router.push("/")
    }
    if (isMobile) setOpen(false)
  }

  // 모바일에서 사이드바가 열려있으면 텍스트 라벨을 표시
  const showText = state === "expanded" || (isMobile && openMobile)

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader>
        <div className={state === "collapsed" ? "px-1 py-1" : "p-1.5"}>
          <button
            onClick={toggleSidebar}
            className={`relative flex items-center ${showText ? "space-x-3 p-1.5" : "justify-center px-0 py-1"} hover:bg-gray-100 rounded-lg transition-colors w-full`}
          >
            <div className="relative">
              <div className="group/icon relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-lg font-ydsnow font-black">G</span>
                {state === "collapsed" ? (
                  <ChevronRight className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                ) : (
                  <ChevronLeft className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                )}
              </div>
            </div>
            {showText && (
              <div className="min-w-0">
                <h2 className="text-xl font-black text-gray-900 truncate font-ydsnow">Giftee</h2>
              </div>
            )}
          </button>
        </div>

        {/* 모바일 상단 패널에서 검색/벨/검색버튼/로그아웃 버튼 제거 */}
      </SidebarHeader>
      

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={showText ? "px-2" : "sr-only"}>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={showText ? "" : "justify-center"} onClick={handleGoHome}>
                  <Gift className="h-5 w-5" />
                  {showText && <span>기프티콘 관리</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/history"} className={showText ? "" : "justify-center"}>
                  <Link href="/history">
                    <History className="h-5 w-5" />
                    {showText && <span>사용 내역</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/calendar"} className={showText ? "" : "justify-center"}>
                  <Link href="/calendar">
                    <CalendarIcon className="h-5 w-5" />
                    {showText && <span>캘린더</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"} className={showText ? "" : "justify-center"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    {showText && <span>설정</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className={showText ? "" : "justify-center"}>
                  {!isAuthenticated ? (
                    <User2 className="h-5 w-5" />
                  ) : (
                    <img
                      src={user?.photoUrl || "/avatar-placeholder.png"}
                      alt={user?.name || "user"}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  )}
                  {showText && (
                    <span>{isAuthenticated ? (user?.name || "사용자") : "로그인"}</span>
                  )}
                  {showText && <ChevronUp className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                {isAuthenticated ? (
                  <DropdownMenuItem onClick={logout}>로그아웃</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">
                      <span>로그인</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

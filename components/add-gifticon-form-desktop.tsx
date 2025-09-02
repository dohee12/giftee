"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gift, History, Settings, User2, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

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
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
 

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state, setOpen } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader>
        <div className={state === "collapsed" ? "px-1 py-1" : "p-1.5"}>
          <button
            onClick={toggleSidebar}
            className={`relative flex items-center ${state === "collapsed" ? "justify-center px-0 py-1" : "space-x-2 p-1.5"} hover:bg-gray-100 rounded-lg transition-colors w-full`}
          >
            <div className="relative">
              <div className="group/icon relative w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {/* 기본: 선물상자 아이콘, 호버 시 투명 */}
                <Gift className="h-4 w-4 text-white transition-opacity duration-150 group-hover/icon:opacity-0" />
                {/* 호버 시: 상태에 따라 > 또는 < 표시 */}
                {state === "collapsed" ? (
                  <ChevronRight className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                ) : (
                  <ChevronLeft className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 transition-opacity duration-150 group-hover/icon:opacity-100" />
                )}
              </div>
            </div>
            {state === "expanded" && (
              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate">Giftee</h2>
              </div>
            )}
          </button>
        </div>
      </SidebarHeader>
      

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "expanded" ? "px-2" : "sr-only"}>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} className={state === "expanded" ? "" : "justify-center"}>
                  <Link href="/">
                    <Gift className="h-5 w-5" />
                    {state === "expanded" && <span>기프티콘 관리</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/history"} className={state === "expanded" ? "" : "justify-center"}>
                  <Link href="/history">
                    <History className="h-5 w-5" />
                    {state === "expanded" && <span>사용 내역</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"} className={state === "expanded" ? "" : "justify-center"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    {state === "expanded" && <span>설정</span>}
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
                <SidebarMenuButton className={state === "expanded" ? "" : "justify-center"}>
                  <User2 className="h-5 w-5" />
                  {state === "expanded" && <span>사용자</span>}
                  {state === "expanded" && <ChevronUp className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>계정 설정</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>로그아웃</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">
                    <span>로그인</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

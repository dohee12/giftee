"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gift, History, Settings, User2, ChevronUp } from "lucide-react"

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

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-2">
          <button 
            onClick={toggleSidebar}
            className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors w-full cursor-pointer"
            title="사이드바 토글"
          >
            <Gift className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">Giftee</h2>
            </div>
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Gift className="h-5 w-5" />
                    <span>기프티콘 관리</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/history"}>
                  <Link href="/history">
                    <History className="h-5 w-5" />
                    <span>사용 내역</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>설정</span>
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
                <SidebarMenuButton>
                  <User2 className="h-5 w-5" />
                  <span>사용자</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
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
      <SidebarRail />
    </Sidebar>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Gift, Bell, Plus, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MobileHeaderProps {
  notificationCount: number
  onAddClick: () => void
}

export function MobileHeader({ notificationCount, onAddClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-2">
          <Gift className="h-8 w-8 text-blue-600" /> {/* 아이콘 크기 h-8 w-8로 변경 */}
          <h1 className="text-lg font-bold text-gray-900">기프티콘</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* 알림 버튼 */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-6 w-6" /> {/* 아이콘 크기 h-6 w-6으로 변경 */}
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* 추가 버튼 */}
          <Button onClick={onAddClick} size="sm" className="px-3">
            <Plus className="h-5 w-5 mr-1" /> {/* 아이콘 크기 h-5 w-5로 변경 */}
            추가
          </Button>

          {/* 메뉴 버튼 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-6 w-6" /> {/* 아이콘 크기 h-6 w-6으로 변경 */}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">메뉴</h2>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    설정
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    도움말
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    정보
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

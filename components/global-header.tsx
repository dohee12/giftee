"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils"

export function GlobalHeader() {
  const { notifications } = useGifticons()

  return (
    <div className="fixed top-3 right-3 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="알림 열기">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0">
          {notifications.length > 0 ? (
            <>
              <div className="p-2 text-xs text-amber-700 bg-amber-50">⏰ 곧 만료되는 기프티콘이 {notifications.length}개 있어요.</div>
              <div className="max-h-64 overflow-auto divide-y">
                {notifications.slice(0, 10).map((g) => (
                  <div key={g.id} className="p-3 text-sm">
                    <div className="font-medium text-gray-900 truncate">{g.brand} {g.name}</div>
                    <div className="text-xs text-gray-600">{getDaysUntilExpiry(g.expiryDate)}일 남음 · {g.expiryDate}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>알림이 없습니다</p>
            </div>
          )}
          <div className="p-2 border-t text-right">
            <Link href="/">
              <Button variant="outline" size="sm">메인으로</Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell } from "lucide-react"
import type { Gifticon } from "@/types/gifticon"
import { getDaysUntilExpiry } from "@/utils/gifticon-data-utils" // utils/utils.ts 대신 gifticon-utils.ts 사용
import { useSettings } from "@/hooks/use-app-settings" // useSettings 훅 임포트

interface NotificationAlertProps {
  notifications: Gifticon[]
}

export function NotificationAlert({ notifications }: NotificationAlertProps) {
  const { settings } = useSettings() // 설정 가져오기

  if (!settings.expiryNotification || notifications.length === 0) return null // 설정이 꺼져있거나 알림이 없으면 표시 안 함

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Bell className="h-4 w-4" />
      <AlertDescription>
        <strong>{notifications.length}개의 기프티콘</strong>이 곧 만료됩니다!
        {notifications.slice(0, 2).map((g) => (
          <span key={g.id} className="ml-2 text-sm">
            {g.name} ({getDaysUntilExpiry(g.expiryDate)}일 남음)
          </span>
        ))}
      </AlertDescription>
    </Alert>
  )
}

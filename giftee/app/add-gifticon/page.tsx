"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AddGifticonDialog } from "@/components/add-gifticon-dialog"
import { useGifticons } from "@/hooks/use-gifticon-data"

export default function AddGifticonPage() {
  const router = useRouter()
  const { addGifticon } = useGifticons()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [initialShareImage, setInitialShareImage] = useState<File | null>(null)

  useEffect(() => {
    // 이 페이지가 PWA 공유 대상으로 열렸는지 확인 (실제 구현에서는 서버에서 FormData를 처리 후 리다이렉트)
    // 여기서는 클라이언트 측에서 직접 FormData를 읽을 수 없으므로,
    // 실제 PWA에서는 Service Worker나 서버 라우트 핸들러를 통해 파일을 받아 처리하고
    // 그 결과를 쿼리 파라미터 등으로 이 페이지에 전달하는 방식이 사용됩니다.
    // 현재는 OCR 시뮬레이션을 위해 다이얼로그를 바로 띄우는 것으로 대체합니다.
    setIsDialogOpen(true)

    // 실제 공유된 파일이 있다면 이곳에서 처리 로직을 추가합니다.
    // 예: const formData = await request.formData(); const imageFile = formData.get('image');
    // setInitialShareImage(imageFile as File);
  }, [])

  const handleClose = () => {
    setIsDialogOpen(false)
    router.push("/") // 다이얼로그 닫으면 메인 페이지로 이동
  }

  return (
    <AddGifticonDialog
      isOpen={isDialogOpen}
      onClose={handleClose}
      onAdd={addGifticon}
      initialShareImage={initialShareImage}
    />
  )
}

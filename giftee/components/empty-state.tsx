"use client"

import { Button } from "@/components/ui/button"
import { Gift, Plus } from "lucide-react"

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">기프티콘이 없습니다</h3>
      <p className="text-gray-500 mb-4">새로운 기프티콘을 등록해보세요!</p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        기프티콘 등록
      </Button>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { categories, exchangeCategories, amountCategories } from "@/constants/gifticon-categories"
import { useToast } from "@/hooks/use-toast"
import type { Gifticon } from "@/types/gifticon"

interface BulkEditGifticonDialogProps {
  gifticons: Gifticon[]
  isOpen: boolean
  onClose: () => void
  onSave: (updatedGifticons: Gifticon[]) => void
}

export function BulkEditGifticonDialog({ gifticons, isOpen, onClose, onSave }: BulkEditGifticonDialogProps) {
  const [formData, setFormData] = useState<{
    name: string
    brand: string
    category: string
    expiryDate: string
    memo: string
    giftType: "amount" | "exchange"
  }>({
    name: "",
    brand: "",
    category: "",
    expiryDate: "",
    memo: "",
    giftType: "exchange"
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 선택된 기프티콘들의 공통 정보를 기반으로 초기값 설정
  useEffect(() => {
    if (gifticons.length > 0 && isOpen) {
      const firstGifticon = gifticons[0]
      
      // 모든 선택된 기프티콘의 giftType이 동일한지 확인
      const allSameType = gifticons.every(g => g.giftType === firstGifticon.giftType)
      
      // giftType이 모두 동일하면 해당 값 사용, 아니면 첫 번째 기프티콘의 값 사용
      const giftType = allSameType ? firstGifticon.giftType : firstGifticon.giftType
      
      setFormData({
        name: "",
        brand: "",
        category: "",
        expiryDate: "",
        memo: "",
        giftType: giftType || "exchange"
      })
    }
  }, [gifticons, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gifticons.length === 0) return

    setIsLoading(true)
    try {
      const updatedGifticons = gifticons.map(gifticon => ({
        ...gifticon,
        name: formData.name || gifticon.name,
        brand: formData.brand || gifticon.brand,
        category: (formData.category || gifticon.category) as Gifticon["category"],
        giftType: formData.giftType,
        expiryDate: formData.expiryDate?.trim() === "" ? gifticon.expiryDate : (formData.expiryDate || gifticon.expiryDate),
        memo: formData.memo || gifticon.memo,
      }))
      
      onSave(updatedGifticons)
      
      // 성공 메시지 표시
      toast({
        title: "일괄 수정 완료! 🎉",
        description: `${gifticons.length}개의 기프티콘이 성공적으로 수정되었습니다.`,
      })
      
      onClose()
    } catch (error) {
      console.error("기프티콘 일괄 수정 오류:", error)
      
      // 오류 메시지 표시
      toast({
        title: "일괄 수정 실패 ❌",
        description: "기프티콘을 일괄 수정하는 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      expiryDate: "",
      memo: "",
      giftType: "exchange"
    })
    onClose()
  }

  if (gifticons.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden bg-white p-0">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b shadow-sm px-6 pt-6 w-full">
          <div className="flex items-center justify-between">
            <DialogTitle>일괄 수정 ({gifticons.length}개)</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto bg-white px-6">
          <form onSubmit={handleSubmit} id="bulk-edit-form" className="space-y-4 pt-4">
            {/* 선택된 기프티콘 정보 */}
            <div className="text-center space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">선택된 기프티콘 {gifticons.length}개</h3>
              <div className="text-xs text-blue-500">
                {gifticons.slice(0, 3).map(g => g.name).join(", ")}
                {gifticons.length > 3 && ` 외 ${gifticons.length - 3}개`}
              </div>
              
              {/* 일괄 수정 경고 */}
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                ⚠️ 여기서 수정하면 선택된 모든 기프티콘({gifticons.length}개)에 동일하게 적용됩니다.
              </div>
            </div>

            {/* 수정 폼 */}
            <div className="space-y-4">
              {/* 금액권/교환권 선택 */}
              <div>
                <Label>기프티콘 유형 *</Label>
                <RadioGroup
                  value={formData.giftType}
                  onValueChange={(value: "amount" | "exchange") => {
                    setFormData({ ...formData, giftType: value, category: "" })
                  }}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exchange" id="exchange" />
                    <Label htmlFor="exchange">교환권</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="amount" />
                    <Label htmlFor="amount">금액권</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.giftType === "exchange" 
                      ? Object.entries(exchangeCategories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <category.icon className="h-4 w-4" />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))
                      : Object.entries(amountCategories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <category.icon className="h-4 w-4" />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">쿠폰명</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="쿠폰명을 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="brand">브랜드</Label>
                <Input
                  id="brand"
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="브랜드를 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">유효기간</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ""}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="memo">메모</Label>
                <Textarea
                  id="memo"
                  value={formData.memo || ""}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="메모를 입력하세요"
                  rows={3}
                />
              </div>
            </div>
          </form>
        </div>

        {/* 액션 버튼 - 고정 위치 */}
        <div className="sticky bottom-0 bg-white pt-4 border-t mt-4 shadow-sm px-6 pb-6 w-full">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" form="bulk-edit-form" className="flex-1" disabled={isLoading}>
              {isLoading ? "수정 중..." : `일괄 수정 (${gifticons.length}개)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

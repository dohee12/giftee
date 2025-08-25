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

interface EditGifticonDialogProps {
  gifticon: Gifticon | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedGifticon: Gifticon) => void
}

export function EditGifticonDialog({ gifticon, isOpen, onClose, onSave }: EditGifticonDialogProps) {
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

  useEffect(() => {
    if (gifticon && isOpen) {
      // 기존 카테고리를 기반으로 giftType 추론
      const isAmountType = gifticon.category === "voucher" || gifticon.category === "beauty" || 
                          gifticon.category === "movie" || gifticon.category === "culture" || 
                          gifticon.category === "living" || gifticon.category === "shopping"
      
      setFormData({
        name: gifticon.name,
        brand: gifticon.brand,
        category: gifticon.category,
        expiryDate: gifticon.expiryDate === "no-expiry" ? "" : gifticon.expiryDate,
        memo: gifticon.memo || "",
        giftType: gifticon.giftType || (isAmountType ? "amount" : "exchange")
      })
    }
  }, [gifticon, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gifticon) return

    setIsLoading(true)
    try {
      const updatedGifticon: Gifticon = {
        ...gifticon,
        name: formData.name,
        brand: formData.brand,
        category: formData.category as Gifticon["category"],
        giftType: formData.giftType,
        expiryDate: formData.expiryDate?.trim() === "" ? "no-expiry" : (formData.expiryDate || "no-expiry"),
        memo: formData.memo,
      }
      
      onSave(updatedGifticon)
      
      // 성공 메시지 표시
      toast({
        title: "수정 완료! 🎉",
        description: `"${updatedGifticon.name}" 기프티콘이 성공적으로 수정되었습니다.`,
      })
      
      onClose()
    } catch (error) {
      console.error("기프티콘 수정 오류:", error)
      
      // 오류 메시지 표시
      toast({
        title: "수정 실패 ❌",
        description: "기프티콘을 수정하는 중 오류가 발생했습니다. 다시 시도해주세요.",
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

  if (!gifticon) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden bg-white p-0">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b shadow-sm px-6 pt-6 w-full">
          <div className="flex items-center justify-between">
            <DialogTitle>기프티콘 수정</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              ✕
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto bg-white px-6">
          <form onSubmit={handleSubmit} id="edit-form" className="space-y-4 pt-4">
            {/* 기프티콘 정보 */}
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">{gifticon.name}</h3>
              <p className="text-sm text-gray-600">{gifticon.brand}</p>
            </div>

            {/* 수정 폼 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">쿠폰명 *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="쿠폰명을 입력하세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="brand">브랜드 *</Label>
                <Input
                  id="brand"
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="브랜드를 입력하세요"
                  required
                />
              </div>

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
                <Label htmlFor="category">카테고리 *</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => {
                    // 예: 카페(카페 카테고리) 상태에서 '아트박스'(뷰티/패션/건강 등 금액권)로 변경하려 하면 금지
                    if (formData.giftType === "exchange" && value === "beauty") {
                      // 카페 교환권에서는 뷰티/패션/건강(아트박스 등) 금액권 카테고리를 금지
                      alert("해당 브랜드는 선택한 카테고리와 호환되지 않습니다.")
                      return
                    }
                    setFormData({ ...formData, category: value })
                  }}
                  required
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
                <Label htmlFor="expiryDate">유효기간</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ""}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  placeholder="유효기간을 선택하세요"
                />
                <p className="text-xs text-gray-500 mt-1">비워두면 만료일 없음으로 설정됩니다</p>
              </div>

              {/* 읽기 전용 정보 */}
              {gifticon.barcode && (
                <div>
                  <Label>바코드 번호</Label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border text-sm text-gray-600">
                    {gifticon.barcode}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">바코드 번호는 수정할 수 없습니다</p>
                </div>
              )}

              {gifticon.price && (
                <div>
                  <Label>가격</Label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border text-sm text-gray-600">
                    {gifticon.price.toLocaleString()}원
                  </div>
                  <p className="text-xs text-gray-500 mt-1">가격은 수정할 수 없습니다</p>
                </div>
              )}

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
            <Button type="submit" form="edit-form" className="flex-1" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, X } from "lucide-react"
import type { Gifticon, GifticonFormData } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"
import { EmojiTagPicker } from "@/components/emoji-tag-picker"

import { Info } from "lucide-react"
import clsx from "clsx"

interface AddGifticonFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  )
}

type CouponType = "exchange" | "amount"

export function AddGifticonFormDialog({ isOpen, onClose, onAdd }: AddGifticonFormDialogProps) {
  const [formData, setFormData] = useState<GifticonFormData>({
    name: "",
    brand: "",
    category: "other",
    expiryDate: "",
    barcode: "",
    memo: "",
    isUsed: false,
    emojiTags: [],
  })

  const [couponType, setCouponType] = useState<CouponType>("exchange")
  const [wallet, setWallet] = useState<string>("default")
  const [noExpiry, setNoExpiry] = useState<boolean>(false)

  const isBarcodeFilled = useMemo(() => formData.barcode.trim().length > 0, [formData.barcode])

  const disabledInfo = !isBarcodeFilled
  const canSubmit =
    isBarcodeFilled &&
    (noExpiry || !!formData.expiryDate) &&
    formData.name.trim() !== "" &&
    formData.brand.trim() !== ""

  const updateFormData = (field: keyof GifticonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
  }

  const handleClose = () => {
    setFormData({
      name: "",
      brand: "",
      category: "other",
      expiryDate: "",
      barcode: "",
      memo: "",
      isUsed: false,
      emojiTags: [],
    })
    setCouponType("exchange")
    setWallet("default")
    setNoExpiry(false)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const payload: Omit<Gifticon, "id" | "registeredAt"> = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category as Gifticon["category"], // ← 유니온 맞추기
      expiryDate: formData.expiryDate,
      barcode: formData.barcode || undefined,
      memo: formData.memo || undefined,
      isUsed: formData.isUsed,
      imageUrl: "/placeholder.svg?height=200&width=300",
      // price: formData.price ? Number(formData.price) : undefined, // 폼에 price가 string이면 이렇게
      // emojiTags: formData.emojiTags, // Gifticon 타입에 추가한 경우만 주석 해제
    }

    onAdd(payload)

    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            새 기프티콘 등록
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
        <form id="add-gifticon-form-basic" onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">수동 입력</TabsTrigger>
              <TabsTrigger value="camera">카메라</TabsTrigger>
              <TabsTrigger value="upload">이미지 업로드</TabsTrigger>
            </TabsList>

            {/*수동 입력*/}
            <TabsContent value="manual" className="space-y-4">
              {/* 1) 바코드 */}
              <div>
                <Label htmlFor="barcode">바코드 번호</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => updateFormData("barcode", e.target.value)}
                  placeholder="바코드 번호를 입력해 주세요."
                  inputMode="numeric"
                />
              </div>

              {/*2)바코드 없을 경우 -> 아래 정보 입력 안하게 하는거  */}
              <div className={clsx("space-y-4", disabledInfo && "opacity-60 pointer-events-none")}>
                <div>
                  <Label htmlFor="brand">사용처 (예. 스타벅스) *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => updateFormData("brand", e.target.value)}
                    placeholder="예: 스타벅스"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">쿠폰명 (예. 아이스 아메리카노 Tall) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="예: 아이스 아메리카노 Tall"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate" className="flex items-center gap-1">
                    만료일 *
                    <button
                      type="button"
                      onClick={() => alert("만료일 알림은 기본 7일/3일/당일에 제공됩니다. 설정에서 변경 가능해요.")}
                      className="text-muted-foreground"
                      aria-label="만료일 알림 안내"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => updateFormData("expiryDate", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={formData.category} onValueChange={(value: any) => updateFormData("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택">
                        {formData.category && formData.category !== "other" 
                          ? categories[formData.category]?.label || "-"
                          : "-"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="memo">메모</Label>
                  <Textarea
                    id="memo"
                    value={formData.memo}
                    onChange={(e) => updateFormData("memo", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>이모지 태그</Label>
                  <EmojiTagPicker
                    value={formData.emojiTags}
                    onChange={(next) => setFormData((prev) => ({ ...prev, emojiTags: next }))}
                  />
                </div>
              </div>
            </TabsContent>

            {/*카메라 */}
            <TabsContent value="camera" className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">카메라로 기프티콘 촬영</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Camera className="h-4 w-4 mr-2" />
                  카메라 열기
                </Button>
              </div>
            </TabsContent>
            {/*업로드탭 */}
            <TabsContent value="upload" className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">이미지 파일을 업로드하세요</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="hidden"></div>
        </form>
        </div>

        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent h-11">
              취소
            </Button>
            <Button type="submit" form="add-gifticon-form-basic" className="flex-1 h-11" disabled={!canSubmit}>
              등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

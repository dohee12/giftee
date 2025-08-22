"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload } from "lucide-react"
import type { Gifticon, GifticonFormData } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"

interface AddGifticonFormProps {
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
}

export function AddGifticonForm({ onAdd }: AddGifticonFormProps) {
  const [formData, setFormData] = useState<GifticonFormData>({
    name: "",
    brand: "",
    category: "other",
    expiryDate: "",
    barcode: "",
    memo: "",
    isUsed: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.brand && formData.expiryDate) {
      onAdd({
        ...formData,
        imageUrl: "/placeholder.svg?height=200&width=300",
      })
      setFormData({
        name: "",
        brand: "",
        category: "other",
        expiryDate: "",
        barcode: "",
        memo: "",
        isUsed: false,
      })
    }
  }

  const updateFormData = (field: keyof GifticonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">수동 입력</TabsTrigger>
          <TabsTrigger value="camera">카메라</TabsTrigger>
          <TabsTrigger value="upload">이미지 업로드</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div>
            <Label htmlFor="name">기프티콘 이름 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="예: 아메리카노"
              required
            />
          </div>

          <div>
            <Label htmlFor="brand">브랜드 *</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => updateFormData("brand", e.target.value)}
              placeholder="예: 스타벅스"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select value={formData.category} onValueChange={(value: any) => updateFormData("category", value)}>
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="expiryDate">만료일 *</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => updateFormData("expiryDate", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="barcode">바코드 번호</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => updateFormData("barcode", e.target.value)}
              placeholder="바코드 번호 (선택사항)"
            />
          </div>

          <div>
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              value={formData.memo}
              onChange={(e) => updateFormData("memo", e.target.value)}
              placeholder="메모 (선택사항)"
              rows={3}
            />
          </div>
        </TabsContent>

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

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          등록하기
        </Button>
      </div>
    </form>
  )
}

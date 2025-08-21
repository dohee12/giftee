"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X } from "lucide-react"
import type { Gifticon, GifticonFormData } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"

interface MobileAddFormProps {
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
  onClose: () => void
}

export function MobileAddForm({ onAdd, onClose }: MobileAddFormProps) {
  const [formData, setFormData] = useState<GifticonFormData>({
    name: "",
    brand: "",
    category: "other",
    expiryDate: "",
    barcode: "",
    memo: "",
    isUsed: false,
  })

  const [activeTab, setActiveTab] = useState<"manual" | "camera" | "upload">("manual")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onClose()
    }
  }

  const updateFormData = (field: keyof GifticonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCameraClick = () => {
    // 모바일에서 카메라 열기
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">기프티콘 등록</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex border-b">
        {[
          { key: "manual", label: "수동 입력" },
          { key: "camera", label: "카메라" },
          { key: "upload", label: "갤러리" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "manual" && (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                기프티콘 이름 *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="예: 아메리카노"
                className="mt-1 h-11"
                required
              />
            </div>

            <div>
              <Label htmlFor="brand" className="text-sm font-medium">
                브랜드 *
              </Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => updateFormData("brand", e.target.value)}
                placeholder="예: 스타벅스"
                className="mt-1 h-11"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium">카테고리</Label>
              <Select value={formData.category} onValueChange={(value: any) => updateFormData("category", value)}>
                <SelectTrigger className="mt-1 h-11">
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
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                만료일 *
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateFormData("expiryDate", e.target.value)}
                className="mt-1 h-11"
                required
              />
            </div>

            <div>
              <Label htmlFor="barcode" className="text-sm font-medium">
                바코드 번호
              </Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => updateFormData("barcode", e.target.value)}
                placeholder="바코드 번호 (선택사항)"
                className="mt-1 h-11"
              />
            </div>

            <div>
              <Label htmlFor="memo" className="text-sm font-medium">
                메모
              </Label>
              <Textarea
                id="memo"
                value={formData.memo}
                onChange={(e) => updateFormData("memo", e.target.value)}
                placeholder="메모 (선택사항)"
                rows={3}
                className="mt-1"
              />
            </div>
          </form>
        )}

        {activeTab === "camera" && (
          <div className="p-4">
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">카메라로 기프티콘 촬영</p>
              <Button onClick={handleCameraClick} className="w-full max-w-xs">
                <Camera className="h-4 w-4 mr-2" />
                카메라 열기
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  // 파일 처리 로직
                  console.log("Camera file:", e.target.files?.[0])
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="p-4">
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">갤러리에서 이미지 선택</p>
              <Button className="w-full max-w-xs">
                <Upload className="h-4 w-4 mr-2" />
                이미지 선택
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {activeTab === "manual" && (
        <div className="p-4 border-t bg-white">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-base font-medium"
            disabled={!formData.name || !formData.brand || !formData.expiryDate}
          >
            등록하기
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, X } from "lucide-react"
import type { Gifticon } from "@/types/gifticon"
import { categories } from "@/constants/gifticon-categories"
import { simulateOCR } from "@/utils/gifticon-data-utils"
import { useSettings } from "@/hooks/use-app-settings" // useSettings 훅 임포트

interface AddGifticonDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
  initialShareImage?: File | null // 새로 추가된 prop
}

export function AddGifticonDialog({ isOpen, onClose, onAdd, initialShareImage }: AddGifticonDialogProps) {
  const { settings } = useSettings() // 설정 가져오기

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "other" as const,
    expiryDate: "",
    price: "",
    barcode: "",
    memo: "",
    isUsed: false,
  })

  const [isOCRProcessing, setIsOCRProcessing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload") // 기본 탭을 'upload'로 설정

  // initialShareImage prop이 변경될 때 처리
  useEffect(() => {
    if (initialShareImage) {
      handleImageUpload(initialShareImage)
      setActiveTab("upload") // 공유 이미지 있으면 업로드 탭으로
    }
  }, [initialShareImage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.brand && formData.expiryDate) {
      onAdd({
        ...formData,
        price: formData.price ? Number.parseInt(formData.price) : undefined,
        imageUrl: previewUrl || "/placeholder.svg?height=200&width=300",
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      brand: "",
      category: "other",
      expiryDate: "",
      price: "",
      barcode: "",
      memo: "",
      isUsed: false,
    })
    setSelectedImage(null)
    setPreviewUrl("")
    setIsOCRProcessing(false)
    setActiveTab("upload") // 닫을 때 기본 탭 초기화
    onClose()
  }

  const handleImageUpload = async (file: File) => {
    setSelectedImage(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // OCR 처리 (설정이 켜져 있을 때만)
    if (settings.autoImageInput) {
      setIsOCRProcessing(true)
      try {
        const ocrResult = await simulateOCR(file)
        setFormData((prev) => ({
          ...prev,
          name: ocrResult.name || prev.name,
          brand: ocrResult.brand || prev.brand,
          expiryDate: ocrResult.expiryDate || prev.expiryDate,
          barcode: ocrResult.barcode || prev.barcode,
        }))
      } catch (error) {
        console.error("OCR 처리 중 오류:", error)
      } finally {
        setIsOCRProcessing(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            새 기프티콘 등록
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" /> {/* 아이콘 크기 h-5 w-5로 변경 */}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">이미지 업로드</TabsTrigger>
            <TabsTrigger value="manual">수동 입력</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {/* 이미지 업로드 영역 */}
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="업로드된 이미지"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-500">다른 이미지를 업로드하려면 클릭하세요</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto" /> {/* 아이콘 크기 h-6 w-6으로 변경 */}
                    <p className="text-gray-500">기프티콘 이미지를 업로드하세요</p>
                    <p className="text-sm text-gray-400">JPG, PNG 파일을 지원합니다</p>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              {isOCRProcessing && (
                <div className="flex items-center justify-center py-4 text-blue-600">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> {/* 아이콘 크기 h-6 w-6으로 변경 */}
                  이미지에서 정보를 인식하고 있습니다...
                </div>
              )}
            </div>

            {/* OCR 결과 또는 수동 입력 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>카테고리</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">금액</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">바코드 번호</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => updateFormData("barcode", e.target.value)}
                    placeholder="바코드 번호"
                  />
                </div>
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

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!formData.name || !formData.brand || !formData.expiryDate || isOCRProcessing}
                >
                  등록하기
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-name">기프티콘 이름 *</Label>
                  <Input
                    id="manual-name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="예: 아메리카노"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="manual-brand">브랜드 *</Label>
                  <Input
                    id="manual-brand"
                    value={formData.brand}
                    onChange={(e) => updateFormData("brand", e.target.value)}
                    placeholder="예: 스타벅스"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>카테고리</Label>
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
                  <Label htmlFor="manual-expiryDate">만료일 *</Label>
                  <Input
                    id="manual-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => updateFormData("expiryDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manual-price">금액</Label>
                  <Input
                    id="manual-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="manual-barcode">바코드 번호</Label>
                  <Input
                    id="manual-barcode"
                    value={formData.barcode}
                    onChange={(e) => updateFormData("barcode", e.target.value)}
                    placeholder="바코드 번호"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="manual-memo">메모</Label>
                <Textarea
                  id="manual-memo"
                  value={formData.memo}
                  onChange={(e) => updateFormData("memo", e.target.value)}
                  placeholder="메모 (선택사항)"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  등록하기
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Loader2, Info } from "lucide-react"
import type { Gifticon, GifticonFormData } from "@/types/gifticon"
import { categories, exchangeCategories, amountCategories } from "@/constants/gifticon-categories"
import { simulateOCR } from "@/utils/gifticon-data-utils"
import { useSettings } from "@/hooks/use-app-settings"
import { EmojiTagPicker } from "@/components/emoji-tag-picker"
import { useToast } from "@/hooks/use-toast"

interface AddGifticonDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
  initialShareImage?: File | null
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

export function AddGifticonDialog({ isOpen, onClose, onAdd, initialShareImage }: AddGifticonDialogProps) {
  const { settings } = useSettings()
  const { toast } = useToast()

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

  const [giftType, setGiftType] = useState<"amount" | "exchange">("amount")
  const [isOCRProcessing, setIsOCRProcessing] = useState(false)
  const [isOCRCompleted, setIsOCRCompleted] = useState(false)
  const [ocrFailedFields, setOcrFailedFields] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 다이얼로그가 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      // 다이얼로그가 열릴 때는 OCR 관련 상태만 초기화
      // 폼 데이터는 handleClose에서 초기화됨
      setIsOCRProcessing(false)
      setIsOCRCompleted(false)
      setOcrFailedFields([])
    }
  }, [isOpen])

  const canSubmit =
    selectedImage &&
    formData.barcode.trim() !== "" &&
    formData.name.trim() !== "" &&
    formData.brand.trim() !== "" &&
    formData.category.trim() !== ""

  // 디버깅용 로그
  useEffect(() => {
    console.log("Form submission state:", {
      selectedImage: !!selectedImage,
      barcode: formData.barcode.trim() !== "",
      name: formData.name.trim() !== "",
      brand: formData.brand.trim() !== "",
      category: formData.category.trim() !== "",
      canSubmit,
      formData
    })
  }, [canSubmit, formData, selectedImage])

  // 이미지가 없을 때는 라디오박스만 수정 가능
  const isFormDisabled = !selectedImage

  useEffect(() => {
    if (initialShareImage && isOpen) {
      handleImageUpload(initialShareImage)
    }
  }, [initialShareImage, isOpen])

  const handleImageUpload = useCallback(async (file: File) => {
    // 이미 처리 중이면 중복 실행 방지
    if (isOCRProcessing) return
    
    setSelectedImage(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setIsOCRCompleted(false) // 새로운 이미지 업로드 시 완료 상태 초기화
    setOcrFailedFields([]) // 실패한 필드 초기화

    if (settings.autoImageInput) {
      setIsOCRProcessing(true)
      try {
        const ocrResult = await simulateOCR(file)
        
        // OCR 결과에서 실패한 필드들 추적
        const failedFields: string[] = []
        if (!ocrResult.name) failedFields.push("쿠폰명")
        if (!ocrResult.brand) failedFields.push("브랜드")
        if (!ocrResult.expiryDate) failedFields.push("유효기간")
        if (!ocrResult.barcode) failedFields.push("바코드")
        if (!ocrResult.category) failedFields.push("카테고리")
        
        setOcrFailedFields(failedFields)
        
        // OCR 결과에서 giftType만 자동 설정 (카테고리는 수동 선택)
        if (ocrResult.giftType) {
          setGiftType(ocrResult.giftType as "amount" | "exchange")
        }
        
        setFormData((prev) => ({
          ...prev,
          name: ocrResult.name || prev.name,
          brand: ocrResult.brand || prev.brand,
          expiryDate: ocrResult.expiryDate || prev.expiryDate,
          barcode: ocrResult.barcode || prev.barcode,
          // 카테고리는 자동 설정하지 않음 - 사용자가 수동으로 선택
        }))
        setIsOCRCompleted(true) // OCR 처리 완료 후 완료 상태 설정
      } catch (error) {
        console.error("OCR 처리 중 오류:", error)
        setIsOCRCompleted(false)
        setOcrFailedFields(["전체"]) // 전체 실패 시
      } finally {
        setIsOCRProcessing(false)
      }
    }
  }, [isOCRProcessing, settings.autoImageInput])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && !isOCRProcessing) {
      handleImageUpload(file)
    }
  }

  const updateFormData = (field: keyof GifticonFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
  }

  const handleClose = () => {
    console.log("=== HANDLE CLOSE START ===")
    console.log("Setting OCR states to false...")
    setIsOCRCompleted(false)
    setIsOCRProcessing(false)
    setOcrFailedFields([])
    
    // 폼 데이터 초기화
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
    
    // 기타 상태 초기화
    setGiftType("amount")
    setSelectedImage(null)
    setPreviewUrl("")
    setValidationErrors({})
    
    console.log("Calling onClose...")
    onClose()
    console.log("onClose called successfully")
    console.log("=== HANDLE CLOSE END ===")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    console.log("=== FORM SUBMIT START ===")
    console.log("Form submitted with data:", formData)
    console.log("canSubmit value:", canSubmit)
    console.log("selectedImage:", !!selectedImage)
    
    // 폼 검증
    const validationErrors: string[] = []
    
    if (!selectedImage) {
      validationErrors.push("이미지를 업로드해주세요")
    }
    
    if (!formData.barcode.trim()) {
      validationErrors.push("바코드 번호를 입력해주세요")
    }
    
    if (!formData.name.trim()) {
      validationErrors.push("쿠폰명을 입력해주세요")
    }
    
    if (!formData.brand.trim()) {
      validationErrors.push("브랜드를 입력해주세요")
    }
    
    if (!formData.category || formData.category === "other") {
      validationErrors.push("카테고리를 선택해주세요")
    }
    
    // 검증 오류가 있으면 경고 메시지 표시하고 등록 중단
    if (validationErrors.length > 0) {
      // 검증 오류 상태 업데이트
      const errorState: Record<string, boolean> = {}
      if (!selectedImage) errorState.image = true
      if (!formData.barcode.trim()) errorState.barcode = true
      if (!formData.name.trim()) errorState.name = true
      if (!formData.brand.trim()) errorState.brand = true
      if (!formData.category || formData.category === "other") errorState.category = true
      
      setValidationErrors(errorState)
      
      toast({
        title: "⚠️ 필수 정보를 입력해주세요",
        description: validationErrors.join(", "),
        variant: "destructive",
        duration: 5000,
      })
      return
    }
    
    // 이미지를 Base64로 변환
    const convertImageToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }
    
    // 이미지 변환 후 데이터 제출
    convertImageToBase64(selectedImage).then(base64Image => {
      // 유효기간이 입력되지 않았으면 "no-expiry"로 설정
      const submitData = {
        ...formData,
        expiryDate: formData.expiryDate.trim() === "" ? "no-expiry" : formData.expiryDate,
        imageUrl: base64Image
      }
      
      console.log("Submitting data:", submitData)
      console.log("onAdd function:", onAdd)
      
      try {
        console.log("Calling onAdd...")
        onAdd(submitData)
        console.log("onAdd called successfully")
        
        // 등록 성공 알림 표시
        toast({
          title: "🎉 기프티콘 등록 완료!",
          description: `${submitData.name}이(가) 성공적으로 등록되었습니다.`,
          duration: 3000,
        })
        
        console.log("Calling handleClose...")
        // 등록 성공 후 다이얼로그 닫기
        handleClose()
        console.log("handleClose called successfully")
        console.log("=== FORM SUBMIT END ===")
      } catch (error) {
        console.error("Error adding gifticon:", error)
        toast({
          title: "❌ 등록 실패",
          description: "기프티콘 등록 중 오류가 발생했습니다.",
          variant: "destructive",
          duration: 5000,
        })
      }
    }).catch(error => {
      console.error("Error converting image:", error)
      toast({
        title: "❌ 이미지 변환 실패",
        description: "이미지를 처리하는 중 오류가 발생했습니다.",
        variant: "destructive",
        duration: 5000,
      })
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>새 기프티콘 등록</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 h-[calc(90vh-120px)]">
          <div className="space-y-4 flex flex-col">
            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors min-h-[400px] flex items-center justify-center flex-1"
              >
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-3">기프티콘 이미지 업로드</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG의 이미지파일만 등록할 수 있습니다.</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4"
                      disabled={isOCRProcessing}
                    >
                      {isOCRProcessing ? "처리 중..." : "파일 선택"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="text-center flex-1 flex flex-col">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">업로드된 이미지</h3>
                  <div className="border rounded-lg p-1 bg-gray-50 flex-1 flex items-center justify-center min-h-[300px]">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="업로드된 기프티콘"
                      className="w-auto h-auto max-w-full max-h-full object-scale-down rounded"
                      style={{ maxHeight: '280px', maxWidth: '100%' }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3"
                    disabled={isOCRProcessing}
                  >
                    {isOCRProcessing ? "처리 중..." : "다른 이미지 선택"}
                  </Button>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="overflow-y-auto pr-2">
            <div className="space-y-4">
              {previewUrl && (
                <div className="text-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">자동 인식된 정보</h3>
                  {isOCRProcessing ? (
                    <div className="flex items-center justify-center py-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">이미지에서 텍스트를 인식하고 있습니다...</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* AI 자동 인식 안내 메시지 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      🚀 AI 자동 인식 시스템
                    </h3>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      이미지를 업로드하면 <span className="font-semibold">AI가 자동으로 기프티콘 정보를 추출</span>합니다.<br/>
                      브랜드, 상품명, 만료일 등을 스마트하게 인식해 드려요!
                    </p>
                  </div>
                </div>
              </div>

              {/* OCR 성공 시 메시지 - 실패한 필드가 없을 때만 표시 */}
              {previewUrl && !isOCRProcessing && isOCRCompleted && ocrFailedFields.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700 text-center">
                    ✅ 이미지에서 자동으로 정보를 추출했습니다. 필요시 수정해 주세요.
                  </p>
                </div>
              )}

              {/* OCR 실패 시 수동 입력 안내 메시지 - 실패한 필드가 있을 때만 표시 */}
              {previewUrl && !isOCRProcessing && isOCRCompleted && ocrFailedFields.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-2">⚠️ 자동 추출에 실패한 항목이 있습니다</p>
                    <p className="text-xs mb-2">
                      다음 항목들을 수동으로 입력해 주세요: <strong>{ocrFailedFields.join(", ")}</strong>
                    </p>
                    <p className="text-xs text-amber-600">
                      이미지 품질이나 텍스트가 명확하지 않을 때 발생할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Section title="기프티콘 유형" subtitle="금액권 또는 교환권을 선택해 주세요">
                  <RadioGroup value={giftType} onValueChange={(value: "amount" | "exchange") => setGiftType(value)}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exchange" id="exchange" />
                        <Label htmlFor="exchange" className="cursor-pointer">
                          교환권
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount" id="amount" />
                        <Label htmlFor="amount" className="cursor-pointer">
                          금액권
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </Section>

                <Section title="바코드 번호 *">
                  <div>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => {
                        updateFormData("barcode", e.target.value)
                        // 입력 시 검증 오류 제거
                        if (e.target.value.trim()) {
                          setValidationErrors(prev => ({ ...prev, barcode: false }))
                        }
                      }}
                      placeholder="바코드 번호를 입력해 주세요."
                      inputMode="numeric"
                      required
                      disabled={isFormDisabled}
                      className={`${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${
                        validationErrors.barcode ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {validationErrors.barcode && (
                      <p className="text-red-500 text-xs mt-1">⚠️ 바코드 번호를 입력해주세요</p>
                    )}
                  </div>
                </Section>

                <Section title="쿠폰 정보" subtitle="기프티콘의 기본 정보를 입력해 주세요">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">카테고리 *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: any) => {
                          updateFormData("category", value)
                          // 선택 시 검증 오류 제거
                          if (value && value !== "other") {
                            setValidationErrors(prev => ({ ...prev, category: false }))
                          }
                        }}
                        disabled={isFormDisabled}
                      >
                        <SelectTrigger className={`${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${
                          validationErrors.category ? "border-red-500 focus:border-red-500" : ""
                        }`}>
                          <SelectValue placeholder="카테고리 선택">
                            {formData.category && formData.category !== "other" 
                              ? (giftType === "exchange" ? exchangeCategories : amountCategories)[formData.category]?.label || "-"
                              : "-"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(giftType === "exchange" ? exchangeCategories : amountCategories).map(
                            ([key, category]) => (
                              <SelectItem key={key} value={key}>
                                {category.label}
                              </SelectItem>
                            ),
                          )}
                                                  </SelectContent>
                        </Select>
                        {validationErrors.category && (
                          <p className="text-red-500 text-xs mt-1">⚠️ 카테고리를 선택해주세요</p>
                        )}
                      </div>

                    <div>
                      <Label htmlFor="brand">브랜드 *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => {
                          updateFormData("brand", e.target.value)
                          // 입력 시 검증 오류 제거
                          if (e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, brand: false }))
                          }
                        }}
                        placeholder="브랜드명을 입력해 주세요"
                        required
                        disabled={isFormDisabled}
                        className={`${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${
                          validationErrors.brand ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {validationErrors.brand && (
                        <p className="text-red-500 text-xs mt-1">⚠️ 브랜드를 입력해주세요</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="name">쿠폰명 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          updateFormData("name", e.target.value)
                          // 입력 시 검증 오류 제거
                          if (e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, name: false }))
                          }
                        }}
                        placeholder="쿠폰명을 입력해 주세요"
                        required
                        disabled={isFormDisabled}
                        className={`${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${
                          validationErrors.name ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-xs mt-1">⚠️ 쿠폰명을 입력해주세요</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="expiryDate" className="flex items-center gap-1">
                        유효기간
                        <button
                          type="button"
                          onClick={() => alert("유효기간 알림은 기본 7일/3일/당일에 제공됩니다. 설정에서 변경 가능해요.")}
                          className="text-muted-foreground"
                          aria-label="유효기간 알림 안내"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => updateFormData("expiryDate", e.target.value)}
                        disabled={isFormDisabled}
                        className={isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="추가 정보" subtitle="태그와 메모를 설정해 주세요">
                  <div className="space-y-4">
                    <div>
                      <Label>이모지 태그</Label>
                      <EmojiTagPicker
                        value={formData.emojiTags[0] || ""}
                        onChange={(tag) => setFormData((prev) => ({ ...prev, emojiTags: tag ? [tag] : [] }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="memo">메모</Label>
                      <Textarea
                        id="memo"
                        value={formData.memo}
                        onChange={(e) => updateFormData("memo", e.target.value)}
                        placeholder="간단한 메모를 입력해 주세요"
                        rows={2}
                      />
                    </div>
                  </div>
                </Section>

                <div className="flex space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                    취소
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!canSubmit || isOCRProcessing}>
                    등록하기
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

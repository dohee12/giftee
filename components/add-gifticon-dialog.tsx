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
import { isBefore, parseISO, startOfDay } from "date-fns"
import type { Gifticon, GifticonFormData } from "@/types/gifticon"
import { categories, exchangeCategories, amountCategories } from "@/constants/gifticon-categories"
import { simulateOCR, validateAndRefineOCRResult, checkDuplicateGifticon } from "@/utils/gifticon-data-utils"
import { useSettings } from "@/hooks/use-app-settings"
import { useGifticons } from "@/hooks/use-gifticon-data"
import { EmojiTagPicker } from "@/components/emoji-tag-picker"
import { useToast } from "@/hooks/use-toast"
import { createGifticon } from "@/lib/api"

interface AddGifticonDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (gifticon: Omit<Gifticon, "id" | "registeredAt">) => void
  initialShareImage?: File | null
  initialExpiryDate?: string
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
    <div className="rounded-2xl border bg-white p-3 sm:p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  )
}

export function AddGifticonDialog({ isOpen, onClose, onAdd, initialShareImage, initialExpiryDate }: AddGifticonDialogProps) {
  const { settings } = useSettings()
  const { toast } = useToast()
  const { gifticons } = useGifticons()

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
  const [isDragOver, setIsDragOver] = useState(false)
  const [duplicateInfo, setDuplicateInfo] = useState<{
    isDuplicate: boolean
    duplicateType: string
    duplicateGifticon?: Gifticon
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 다이얼로그가 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      // 다이얼로그가 열릴 때는 OCR 관련 상태만 초기화
      // 폼 데이터는 handleClose에서 초기화됨
      setIsOCRProcessing(false)
      setIsOCRCompleted(false)
      setOcrFailedFields([])
      // 캘린더 등 외부에서 전달된 초기 유효기간 적용
      if (initialExpiryDate) {
        setFormData((prev) => ({
          ...prev,
          expiryDate: initialExpiryDate,
        }))
      }
    }
  }, [isOpen, initialExpiryDate])

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
    
    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ 파일 크기 초과",
        description: "10MB 이하의 이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    
    // 파일 형식 검증
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ 지원하지 않는 파일 형식",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    
    setSelectedImage(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setIsOCRCompleted(false) // 새로운 이미지 업로드 시 완료 상태 초기화
    setOcrFailedFields([]) // 실패한 필드 초기화

    if (settings.autoImageInput) {
      setIsOCRProcessing(true)
      try {
        const ocrResult = await simulateOCR(file)
        
        // 향상된 OCR 결과 검증 및 정제
        const validation = validateAndRefineOCRResult(ocrResult, gifticons)
        
        setOcrFailedFields(validation.validationErrors)
        
        // OCR 결과에서 giftType 자동 설정
        if (validation.refinedResult.giftType) {
          const detectedGiftType = validation.refinedResult.giftType as "amount" | "exchange"
          setGiftType(detectedGiftType)
          
          // 교환권/금액권 판별 결과 알림
          toast({
            title: `🎯 자동 판별 완료`,
            description: `AI가 이 기프티콘을 ${detectedGiftType === "exchange" ? "교환권" : "금액권"}으로 판별했습니다.`,
            duration: 3000,
          })
        }
        
        // 검증된 결과를 폼에 적용 (무조건 적용)
        setFormData((prev) => ({
          ...prev,
          name: validation.refinedResult.name || prev.name,
          brand: validation.refinedResult.brand || prev.brand,
          expiryDate: validation.refinedResult.expiryDate || prev.expiryDate,
          barcode: validation.refinedResult.barcode || prev.barcode,
          category: validation.refinedResult.category || prev.category,
        }))
        
        // 추출된 정보 로그
        console.log("=== OCR 추출 결과 ===")
        console.log("쿠폰명:", validation.refinedResult.name)
        console.log("브랜드:", validation.refinedResult.brand)
        console.log("유효기간:", validation.refinedResult.expiryDate)
        console.log("바코드:", validation.refinedResult.barcode)
        console.log("카테고리:", validation.refinedResult.category)
        console.log("기프티콘 유형:", validation.refinedResult.giftType)
        console.log("====================")
        
        // 추출 결과를 사용자에게 더 명확하게 표시
        if (validation.refinedResult.name && validation.refinedResult.brand) {
          toast({
            title: "🎯 완벽한 정보 추출 완료",
            description: `브랜드: ${validation.refinedResult.brand}, 쿠폰명: ${validation.refinedResult.name}`,
            duration: 5000,
          })
        } else {
          toast({
            title: "⚠️ 부분 정보 추출",
            description: "일부 정보만 추출되었습니다. 수동으로 확인해주세요.",
            duration: 5000,
          })
        }
        
        setIsOCRCompleted(true) // OCR 처리 완료 후 완료 상태 설정
        
        // 중복 검사 결과 처리
        setDuplicateInfo(validation.duplicateCheck)
        if (validation.duplicateCheck.isDuplicate) {
          toast({
            title: "⚠️ 중복된 기프티콘 발견",
            description: `${validation.duplicateCheck.duplicateType}이 일치하는 기프티콘이 이미 등록되어 있습니다.`,
            variant: "destructive",
            duration: 5000,
          })
        }
        
        // 성공/실패 알림
        if (validation.isValid) {
          toast({
            title: "🎉 AI 인식 완료!",
            description: "모든 정보를 성공적으로 추출했습니다.",
            duration: 3000,
          })
        } else {
          // 모든 필수 정보가 있으면 성공으로 간주
          const hasAllRequiredInfo = validation.refinedResult.name && 
                                   validation.refinedResult.brand && 
                                   validation.refinedResult.expiryDate && 
                                   validation.refinedResult.barcode
          
          if (hasAllRequiredInfo) {
            toast({
              title: "🎉 AI 인식 완료!",
              description: "모든 필수 정보를 추출했습니다. 필요시 수정해 주세요.",
              duration: 4000,
            })
          } else {
            toast({
              title: "⚠️ 부분 인식 완료",
              description: "일부 정보를 추출했습니다. 나머지는 수동으로 입력해 주세요.",
              duration: 4000,
            })
          }
        }
        
      } catch (error) {
        console.error("OCR 처리 중 오류:", error)
        setIsOCRCompleted(false)
        setOcrFailedFields(["전체"]) // 전체 실패 시
        
        toast({
          title: "❌ OCR 처리 실패",
          description: "이미지 분석 중 오류가 발생했습니다. 수동으로 입력해 주세요.",
          variant: "destructive",
          duration: 4000,
        })
      } finally {
        setIsOCRProcessing(false)
      }
    }
  }, [isOCRProcessing, settings.autoImageInput, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && !isOCRProcessing) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile && !isOCRProcessing) {
      handleImageUpload(imageFile)
    } else if (isOCRProcessing) {
      toast({
        title: "⏳ 처리 중",
        description: "이미지가 처리 중입니다. 잠시만 기다려주세요.",
        duration: 2000,
      })
    } else {
      toast({
        title: "❌ 지원하지 않는 파일 형식",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
        duration: 3000,
      })
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
    setDuplicateInfo(null)
    
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
    
    // 최종 중복 검사
    const finalDuplicateCheck = checkDuplicateGifticon(
      {
        barcode: formData.barcode.trim(),
        brand: formData.brand.trim(),
        name: formData.name.trim()
      },
      gifticons
    )
    
    if (finalDuplicateCheck.isDuplicate) {
      validationErrors.push(`중복된 기프티콘입니다 (${finalDuplicateCheck.duplicateType})`)
      setDuplicateInfo(finalDuplicateCheck)
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
    if (!selectedImage) {
      return
    }
    convertImageToBase64(selectedImage as File).then(async base64Image => {
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
        const submitDataForAdd: Omit<Gifticon, "id" | "registeredAt"> = ({ ...submitData, giftType } as unknown) as Omit<Gifticon, "id" | "registeredAt">
        onAdd(submitDataForAdd)
        console.log("onAdd called successfully")
        
        // 백엔드로도 전송 (환경에 따라 실패해도 앱 흐름은 유지)
        try {
          await createGifticon({
            name: submitData.name,
            brand: submitData.brand,
            category: submitData.category,
            giftType,
            expiryDate: submitData.expiryDate,
            barcode: submitData.barcode,
            memo: submitData.memo,
            isUsed: submitData.isUsed,
            emojiTags: submitData.emojiTags,
            imageBase64: base64Image,
            source: isOCRCompleted ? "ocr" : "manual",
          })
        } catch (e) {
          console.warn("createGifticon API failed or not configured", e)
        }

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
      <DialogContent className="sm:max-w-4xl sm:max-h-[90vh] max-w-full h-[100svh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>새 기프티콘 등록</DialogTitle>
        </DialogHeader>

        {/* 본문: 모바일에서는 전체 스크롤, 데스크톱에서는 우측만 스크롤 */}
        <div className="flex-1 overflow-y-auto sm:overflow-visible p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4 flex flex-col md:sticky md:top-4 md:self-start">
            {!previewUrl ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-all duration-200 min-h-[280px] md:min-h-[400px] flex items-center justify-center flex-1 ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50 scale-105' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-3">
                  <Upload className={`h-8 w-8 mx-auto ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-3">
                      {isDragOver ? '여기에 이미지를 놓으세요!' : '기프티콘 이미지 업로드'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {isDragOver 
                        ? '마우스를 놓으면 이미지가 업로드됩니다' 
                        : 'JPG, PNG의 이미지파일만 등록할 수 있습니다. 드래그 앤 드롭도 지원합니다.'
                      }
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 h-10"
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
                  <div className="border rounded-lg p-1 bg-gray-50 flex-1 flex items-center justify-center min-h-[220px] md:min-h-[300px]">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="업로드된 기프티콘"
                      className="w-auto h-auto max-w-full max-h-full object-scale-down rounded"
                      style={{ maxHeight: '260px', maxWidth: '100%' }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 h-10"
                    disabled={isOCRProcessing}
                  >
                    {isOCRProcessing ? "처리 중..." : "다른 이미지 선택"}
                  </Button>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div className="md:pr-2 md:max-h-[calc(100svh-110px)] md:overflow-y-auto">
            <div className="space-y-4">
              {previewUrl && (
                <div className="text-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">자동 인식된 정보</h3>
                  {isOCRProcessing ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center py-2 text-blue-600">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm font-medium">AI가 이미지를 분석하고 있습니다...</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">텍스트 추출 중...</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* AI 자동 인식 안내 메시지 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
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

              {/* OCR 성공 시 메시지 - 모든 필수 정보가 있을 때 표시 */}
              {previewUrl && !isOCRProcessing && isOCRCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        🎉 AI 인식 완료!
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        모든 필수 정보를 추출했습니다. 필요시 수정해 주세요.
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        <p>• 쿠폰명: {formData.name || "추출됨"}</p>
                        <p>• 브랜드: {formData.brand || "추출됨"}</p>
                        <p>• 유효기간: {formData.expiryDate || "추출됨"}</p>
                        <p>• 바코드: {formData.barcode || "추출됨"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR 부분 성공 시 메시지 - 일부 필드만 실패한 경우 */}
              {previewUrl && !isOCRProcessing && isOCRCompleted && ocrFailedFields.length > 0 && ocrFailedFields.length < 5 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        ⚠️ 부분 인식 완료
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        다음 항목들을 수동으로 입력해 주세요: <strong>{ocrFailedFields.join(", ")}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR 실패 시 수동 입력 안내 메시지 - 대부분 실패한 경우 */}
              {previewUrl && !isOCRProcessing && isOCRCompleted && ocrFailedFields.length >= 5 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✗</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        ❌ 자동 인식 실패
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        이미지 품질이나 텍스트가 명확하지 않아 자동 인식에 실패했습니다. 수동으로 입력해 주세요.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 중복 검사 결과 표시 */}
              {duplicateInfo && duplicateInfo.isDuplicate && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800">
                        ⚠️ 중복된 기프티콘 발견
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        {duplicateInfo.duplicateType}이 일치하는 기프티콘이 이미 등록되어 있습니다.
                      </p>
                      {duplicateInfo.duplicateGifticon && (
                        <div className="mt-2 p-2 bg-orange-100 rounded text-xs">
                          <p><strong>기존 기프티콘:</strong> {duplicateInfo.duplicateGifticon.brand} - {duplicateInfo.duplicateGifticon.name}</p>
                          <p><strong>등록일:</strong> {new Date(duplicateInfo.duplicateGifticon.registeredAt).toLocaleDateString()}</p>
                          <p><strong>상태:</strong> {duplicateInfo.duplicateGifticon.isUsed ? "사용됨" : "미사용"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form id="add-gifticon-form" onSubmit={handleSubmit} className="space-y-4">
                <Section title="기프티콘 유형" subtitle="금액권/교환권을 선택해 주세요">
                  <RadioGroup value={giftType} onValueChange={(value: "amount" | "exchange") => setGiftType(value)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exchange" id="exchange" />
                        <Label htmlFor="exchange" className="cursor-pointer">교환권</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount" id="amount" />
                        <Label htmlFor="amount" className="cursor-pointer">금액권</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {/* 자동 판별 결과 표시 */}
                  {previewUrl && !isOCRProcessing && isOCRCompleted && (
                    <div className="mt-2 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-xs md:text-sm">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">AI</span>
                        </div>
                        <span className="text-blue-800">
                          AI가 <strong>{giftType === "exchange" ? "교환권" : "금액권"}</strong>으로 자동 판별했습니다
                        </span>
                      </div>
                    </div>
                  )}
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
                          // 예시 룰: 교환권(카페 등) 상태에서 금액권 카테고리(뷰티/패션/건강=아트박스 등) 선택 금지
                          if (giftType === "exchange" && value === "beauty") {
                            alert("선택한 기프티콘 유형과 호환되지 않는 카테고리입니다.")
                            return
                          }
                          updateFormData("category", value)
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
                      {formData.expiryDate && isBefore(parseISO(formData.expiryDate), startOfDay(new Date())) && (
                        <p className="text-amber-600 text-xs mt-1">⚠️ 선택한 유효기간이 오늘보다 이전입니다. 등록은 가능하지만 사용에 유의해 주세요.</p>
                      )}
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

                <div className="hidden sm:flex space-x-2 pt-4">
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
        </div>

        <div className="sm:hidden p-3 border-t bg-white">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent h-11">
              취소
            </Button>
            <Button type="submit" form="add-gifticon-form" className="flex-1 h-11" disabled={!canSubmit || isOCRProcessing}>
              등록하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

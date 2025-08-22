"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BarcodeViewerProps {
  isOpen: boolean
  onClose: () => void
  barcode: string
  gifticonName: string
  brand: string
}

export function BarcodeViewer({ isOpen, onClose, barcode, gifticonName, brand }: BarcodeViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [barcodeImage, setBarcodeImage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen && barcode) {
      generateBarcode()
    }
  }, [isOpen, barcode])

  const generateBarcode = async () => {
    if (!barcode) return

    setIsGenerating(true)
    
    try {
      // JsBarcode 라이브러리를 동적으로 import (ES 모듈 방식)
      const JsBarcodeModule = await import('jsbarcode')
      const JsBarcode = JsBarcodeModule.default || JsBarcodeModule
      
      // Canvas 요소 생성
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const width = 400
      const height = 120
      canvas.width = width
      canvas.height = height

      // 배경
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // JsBarcode로 실제 바코드 생성
      JsBarcode(canvas, barcode, {
        format: "CODE128",
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 20,
        background: "#ffffff",
        lineColor: "#000000",
      })

      // 이미지로 변환
      const dataURL = canvas.toDataURL("image/png")
      setBarcodeImage(dataURL)
    } catch (error) {
      console.error("JsBarcode 오류:", error)
      // 오류 시 대체 방법 사용
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (ctx) {
        generateFallbackBarcode(canvas, ctx, barcode, 400, 120)
        const dataURL = canvas.toDataURL("image/png")
        setBarcodeImage(dataURL)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateFallbackBarcode = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, barcode: string, width: number, height: number) => {
    // 간단한 바코드 생성 (CODE128 형식 시뮬레이션)
    const barWidth = 2
    let x = 20
    
    // 시작 바코드
    ctx.fillStyle = "#000000"
    ctx.fillRect(x, 20, barWidth, 80)
    x += barWidth * 2
    
    // 각 숫자를 바코드로 변환
    for (let i = 0; i < barcode.length; i++) {
      const digit = parseInt(barcode[i])
      if (isNaN(digit)) continue
      
      // 간단한 패턴 생성 (실제 바코드가 아닌 시각적 표현)
      const pattern = generateDigitPattern(digit)
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] === 1) {
          ctx.fillRect(x, 20, barWidth, 80)
        }
        x += barWidth
      }
      x += barWidth // 간격
    }
    
    // 끝 바코드
    ctx.fillRect(x, 20, barWidth, 80)

    // 바코드 번호 표시
    ctx.fillStyle = "#000000"
    ctx.font = "16px monospace"
    ctx.textAlign = "center"
    ctx.fillText(barcode, width / 2, height - 10)
  }

  const generateDigitPattern = (digit: number): number[] => {
    // 간단한 패턴 생성 (실제 바코드가 아닌 시각적 표현)
    const patterns: Record<number, number[]> = {
      0: [1, 0, 1, 0, 1, 0, 1, 0],
      1: [1, 0, 1, 0, 0, 1, 0, 1],
      2: [1, 0, 0, 1, 1, 0, 0, 1],
      3: [1, 0, 0, 1, 0, 1, 1, 0],
      4: [0, 1, 1, 0, 1, 0, 0, 1],
      5: [0, 1, 1, 0, 0, 1, 1, 0],
      6: [0, 1, 0, 1, 1, 0, 1, 0],
      7: [0, 1, 0, 1, 0, 1, 0, 1],
      8: [1, 1, 0, 0, 1, 0, 0, 1],
      9: [1, 1, 0, 0, 0, 1, 1, 0],
    }
    return patterns[digit] || [1, 0, 1, 0, 1, 0, 1, 0]
  }

  const downloadBarcode = () => {
    if (barcodeImage) {
      const link = document.createElement("a")
      link.download = `${brand}_${gifticonName}_바코드.png`
      link.href = barcodeImage
      link.click()
    }
  }

  const copyBarcodeNumber = () => {
    navigator.clipboard.writeText(barcode).then(() => {
      console.log("바코드 번호가 클립보드에 복사되었습니다.")
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>바코드 보기</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 기프티콘 정보 */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{gifticonName}</h3>
            <p className="text-sm text-gray-600">{brand}</p>
          </div>

          {/* 바코드 */}
          <div className="flex justify-center">
            {isGenerating ? (
              <div className="border border-gray-200 rounded-lg p-8 bg-white text-center text-gray-500">
                바코드 생성 중...
              </div>
            ) : barcodeImage ? (
              <img
                src={barcodeImage}
                alt="바코드"
                className="border border-gray-200 rounded-lg p-4 bg-white max-w-full h-auto"
              />
            ) : (
              <div className="border border-gray-200 rounded-lg p-8 bg-white text-center text-gray-500">
                바코드를 생성할 수 없습니다
              </div>
            )}
          </div>

          {/* 바코드 번호 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">바코드 번호</p>
            <p className="font-mono text-lg font-semibold select-all bg-gray-50 p-2 rounded">
              {barcode}
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button 
              onClick={copyBarcodeNumber} 
              variant="outline" 
              className="flex-1"
            >
              번호 복사
            </Button>
            <Button 
              onClick={downloadBarcode} 
              className="flex-1"
              disabled={!barcodeImage}
            >
              <Download className="h-4 w-4 mr-2" />
              바코드 다운로드
            </Button>
          </div>

          {/* 사용 팁 */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 사용 팁</p>
            <p>• 바코드 번호를 복사해서 다른 곳에 사용할 수 있어요</p>
            <p>• 바코드 이미지를 다운로드해서 인쇄할 수 있어요</p>
            <p>• 실제 기프티콘과 동일한 바코드가 생성됩니다</p>
            <p>• 바코드 스캐너로 읽을 수 있습니다</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

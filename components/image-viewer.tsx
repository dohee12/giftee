import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { useState } from "react"

interface ImageViewerProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function ImageViewer({ imageUrl, isOpen, onClose, title }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 [&>button]:hidden bg-black/90">
        {/* 헤더 */}
        <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-black/80 text-white">
          <h3 className="text-lg font-semibold">{title || "이미지 보기"}</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 이미지 컨테이너 */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={imageUrl}
              alt="기프티콘 이미지"
              className="max-w-full max-h-full object-contain"
              style={{
                maxWidth: `${90 / scale}vw`,
                maxHeight: `${80 / scale}vh`,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

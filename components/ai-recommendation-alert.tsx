"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, X, Clock, Calendar, Zap } from "lucide-react"
import type { GifticonRecommendation } from "@/types/gifticon"
import { useState } from "react"

interface AIRecommendationAlertProps {
  recommendation: GifticonRecommendation
  onDismiss: () => void
  onUseGifticon?: (gifticonId: string) => void
}

export function AIRecommendationAlert({ recommendation, onDismiss, onUseGifticon }: AIRecommendationAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = () => {
    switch (recommendation.type) {
      case "time-based":
        return <Clock className="h-4 w-4" />
      case "event-based":
        return <Calendar className="h-4 w-4" />
      case "expiry-based":
        return <Zap className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case "high":
        return "border-red-200 bg-red-50 text-red-800"
      case "medium":
        return "border-amber-200 bg-amber-50 text-amber-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  return (
    <Alert className={`relative ${getPriorityColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="flex-1">
            <AlertTitle className="flex items-center gap-2">
              {recommendation.title}
              <Badge variant="secondary" className="text-xs">
                AI 추천
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-1">{recommendation.message}</AlertDescription>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {recommendation.recommendedGifticons.length > 0 && (
        <div className="mt-3">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-xs p-1 h-auto">
            {isExpanded ? "접기" : `추천 기프티콘 ${recommendation.recommendedGifticons.length}개 보기`}
          </Button>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              {recommendation.recommendedGifticons.slice(0, 3).map((gifticon) => (
                <Card key={gifticon.id} className="bg-white/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{gifticon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {gifticon.brand} • {gifticon.expiryDate}까지
                        </p>
                      </div>
                      {onUseGifticon && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUseGifticon(gifticon.id)}
                          className="text-xs h-7"
                        >
                          사용하기
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recommendation.recommendedGifticons.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{recommendation.recommendedGifticons.length - 3}개 더
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Alert>
  )
}

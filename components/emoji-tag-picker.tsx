"use client"

interface EmojiTagPickerProps {
  value: string
  onChange: (tag: string) => void
}
import { DEFAULT_EMOJI_OPTIONS } from "@/constants/emoji-options"

import { useSettings } from "@/hooks/use-app-settings"

export function EmojiTagPicker({ value, onChange }: EmojiTagPickerProps) {
  const { settings } = useSettings()
  const base = DEFAULT_EMOJI_OPTIONS.filter((e) => !(settings.hiddenDefaultEmojis || []).includes(e))
  const merged = Array.from(new Set([...base, ...(settings.customEmojis || [])]))
  const handleEmojiClick = (emoji: string) => {
    if (value === emoji) {
      onChange("")
    } else {
      onChange(emoji)
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            <span>{value}</span>
            <button type="button" onClick={() => onChange("")} className="hover:bg-blue-200 rounded-full p-0.5">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-8 gap-2">
        {merged.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleEmojiClick(emoji)}
            className={`
              p-2 text-lg rounded-lg border transition-colors hover:bg-gray-100
              ${value === emoji ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"}
            `}
          >
            {emoji}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">이모지 태그를 하나 선택해주세요</p>
    </div>
  )
}

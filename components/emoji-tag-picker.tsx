"use client"

interface EmojiTagPickerProps {
  value: string
  onChange: (tag: string) => void
}

const EMOJI_OPTIONS = [
  "☕", // 카페/음료
  "🍔", // 패스트푸드
  "🍕", // 피자
  "🍰", // 디저트/베이커리
  "🧊", // 아이스크림/음료
  "🛍️", // 쇼핑/백화점
  "👕", // 의류/패션
  "💄", // 뷰티/화장품
  "📱", // 전자제품/통신
  "🎬", // 영화/엔터테인먼트
  "🎵", // 음악/오디오
  "🎮", // 게임
  "🎁", // 선물/기프트카드
  "❤️", // 좋아하는/특별한
  "⭐", // 추천/인기
  "🔥", // 핫한/트렌드
]

export function EmojiTagPicker({ value, onChange }: EmojiTagPickerProps) {
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
        {EMOJI_OPTIONS.map((emoji) => (
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

export interface CreateGifticonPayload {
  name: string
  brand: string
  category: string
  giftType: "amount" | "exchange"
  expiryDate: string
  barcode?: string
  memo?: string
  isUsed?: boolean
  emojiTags?: string[]
  imageBase64?: string
  source?: "ocr" | "manual"
}

interface ApiError extends Error {
  status?: number
}

const getBaseUrl = (): string | null => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base || base.trim() === "") return null
  return base.replace(/\/$/, "")
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    // Backend not configured; skip network
    throw Object.assign(new Error("API base URL is not configured"), { status: 0 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      const err: ApiError = Object.assign(new Error(text || `Request failed: ${res.status}`), {
        status: res.status,
      })
      throw err
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      return (await res.json()) as T
    }
    // @ts-expect-error: allow non-JSON
    return (await res.text()) as T
  } finally {
    clearTimeout(timeout)
  }
}

export async function createGifticon(payload: CreateGifticonPayload) {
  try {
    return await apiFetch<any>("/gifticons", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Surface but don't crash callers who may fallback to local storage
    // eslint-disable-next-line no-console
    console.warn("createGifticon failed:", err)
    return null
  }
}



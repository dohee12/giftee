"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-12 w-12 text-blue-600" />
            </div>
            <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>

            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 페이지로
            </Button>

            <Link href="/help" className="block">
              <Button variant="ghost" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                도움말 보기
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              문제가 지속되면{" "}
              <Link href="/help" className="text-blue-600 hover:underline">
                고객지원
              </Link>
              에 문의해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

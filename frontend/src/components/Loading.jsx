import { Loader2 } from "lucide-react"

export function Loading() {
  return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="animate-spin text-red-500" size={48} />
    </div>
  )
}

export function LoadingFullScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] flex justify-center items-center">
      <Loader2 className="animate-spin text-red-500" size={48} />
    </div>
  )
}

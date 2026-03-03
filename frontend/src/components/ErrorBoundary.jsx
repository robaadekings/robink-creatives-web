import { Component } from "react"
import { AlertTriangle } from "lucide-react"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] flex items-center justify-center px-6">
          <div className="max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

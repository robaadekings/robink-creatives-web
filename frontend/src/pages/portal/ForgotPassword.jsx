import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"
import api from "../../utils/axios"

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState("email") // "email" or "reset"
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data } = await api.post("/auth/forgot-password", { email })
      setToken(data.resetToken)
      setSuccess("Reset token sent! (Check console or use the token shown)")
      setStep("reset")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request password reset")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password })
      setSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => navigate("/portal/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/portal/login")}
            className="text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>

        {step === "email" ? (
          <>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email address and we'll send you a token to reset your password
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-5">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-lg font-semibold hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Sending..." : "Send Reset Token"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">
              Enter your new password
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/40 text-green-400 text-sm p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {/* Show reset token for dev mode */}
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg mb-4 text-xs text-blue-300 break-all">
              <p className="font-semibold mb-1">Reset Token:</p>
              {token}
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <input
                type="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 py-3 rounded-lg font-semibold hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-gray-400 text-sm text-center mt-6">
          Remember your password?{" "}
          <Link to="/portal/login" className="text-red-400 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

import { useState } from "react"
import { Loader2, Save } from "lucide-react"
import api from "../../utils/axios"

export default function AdminSettings() {
  const [form, setForm] = useState({
    companyName: "Robink Creatives",
    email: "contact@robink.com",
    phone: "+254700000000",
    address: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const saveSettings = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess(false)

      await api.post("/admin/settings", form)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">

      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Settings</h2>
        <p className="text-gray-400">Manage your company information and preferences</p>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500/40 text-green-400 p-4 rounded-lg">
          Settings saved successfully
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={saveSettings} className="space-y-6">

        {/* Company Information */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Company Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Address"
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          <Save size={18} />
          {loading ? "Saving..." : "Save Settings"}
        </button>

      </form>

    </div>
  )
}
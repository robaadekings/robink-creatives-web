import { useEffect, useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"
import api from "../../utils/axios"

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/quotes")
      setQuotes(data.data || [])
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load quotes")
      console.error("Quotes error:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus, response) => {
    try {
      await api.patch(`/admin/quotes/${id}/status`, {
        status: newStatus,
        adminResponse: response
      })
      fetchQuotes()
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-red-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quotes</h2>
        <span className="text-sm text-gray-400">{quotes.length} total</span>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {quotes.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          No quotes yet
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-gray-400 text-sm">
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quotes.map((quote, idx) => (
                <tr
                  key={quote._id}
                  className={`border-b border-white/5 ${
                    idx % 2 === 0 ? "bg-white/[2%]" : ""
                  } hover:bg-white/10 transition`}
                >
                  <td className="px-6 py-4 text-sm font-semibold">{quote.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{quote.clientEmail}</td>
                  <td className="px-6 py-4 text-sm capitalize">
                    {quote.serviceCategory?.replace("_", " ") || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={quote.status}
                      onChange={(e) => updateStatus(quote._id, e.target.value, quote.adminResponse)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none cursor-pointer ${
                        quote.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : quote.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : quote.status === "reviewed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
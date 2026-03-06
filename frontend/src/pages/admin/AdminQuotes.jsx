import { useEffect, useState } from "react"
import { Loader2, Search, Filter, Eye, Mail, Calendar, FileText } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../utils/axios"

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [responseMessage, setResponseMessage] = useState("")

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
        adminResponse: response || ""
      })
      setSelectedQuote(null)
      setResponseMessage("")
      fetchQuotes()
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.serviceCategory || "").toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && quote.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status.toLowerCase() === "pending").length,
    reviewed: quotes.filter(q => q.status.toLowerCase() === "reviewed").length,
    approved: quotes.filter(q => q.status.toLowerCase() === "approved").length,
    rejected: quotes.filter(q => q.status.toLowerCase() === "rejected").length
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "approved":
        return "from-green-600/20 to-green-700/10 border-green-600/30 text-green-400"
      case "pending":
        return "from-yellow-600/20 to-yellow-700/10 border-yellow-600/30 text-yellow-400"
      case "reviewed":
        return "from-blue-600/20 to-blue-700/10 border-blue-600/30 text-blue-400"
      case "rejected":
        return "from-red-600/20 to-red-700/10 border-red-600/30 text-red-400"
      default:
        return "from-gray-600/20 to-gray-700/10 border-gray-600/30 text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Quotes Management</h2>
        <p className="text-gray-400 mt-1">Review and manage all quote requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Total Quotes</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/10 border border-yellow-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Reviewed</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.reviewed}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by client name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <Filter size={20} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          {error}
        </motion.div>
      )}

      {/* Quotes Table */}
      {filteredQuotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <FileText className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">
            {searchTerm || statusFilter !== "all" ? "No quotes match your filters" : "No quotes yet"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-gray-400 text-sm font-semibold">
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotes.map((quote, idx) => (
                <tr
                  key={quote._id}
                  className={`border-b border-white/5 ${
                    idx % 2 === 0 ? "bg-white/[2%]" : ""
                  } hover:bg-white/10 transition`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white">{quote.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{quote.clientEmail}</td>
                  <td className="px-6 py-4 text-sm capitalize text-white">
                    {quote.serviceCategory?.replace("_", " ") || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-br ${getStatusColor(quote.status)}`}>
                      {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedQuote(quote)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Quote Details Modal */}
      {selectedQuote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedQuote(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full backdrop-blur-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedQuote.clientName}</h3>
                  <p className="text-gray-400 mt-1">{selectedQuote.clientEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-sm">Service Category</p>
                  <p className="text-white capitalize flex items-center gap-2 mt-2">
                    <FileText size={16} className="text-red-600" />
                    {selectedQuote.serviceCategory?.replace("_", " ") || "—"}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 text-sm">Request Date</p>
                  <p className="text-white flex items-center gap-2 mt-2">
                    <Calendar size={16} className="text-red-600" />
                    {new Date(selectedQuote.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:col-span-2">
                  <p className="text-gray-400 text-sm">Client Message</p>
                  <p className="text-white mt-2 text-sm leading-relaxed">
                    {selectedQuote.message || "No message provided"}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-3">Update Status</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["pending", "reviewed", "approved", "rejected"].map(status => (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateStatus(selectedQuote._id, status, responseMessage)}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs transition capitalize ${
                          selectedQuote.status === status
                            ? status === "approved"
                              ? "bg-green-600 text-white"
                              : status === "pending"
                              ? "bg-yellow-600 text-white"
                              : status === "reviewed"
                              ? "bg-blue-600 text-white"
                              : "bg-red-600 text-white"
                            : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-2">Admin Response (Optional)</label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Add a message to send to the client..."
                    className="w-full px-4 py-3 bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500 rounded-xl resize-none"
                    rows="3"
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  )
}
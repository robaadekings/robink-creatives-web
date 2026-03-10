import { useEffect, useState } from "react"
import { Loader2, Search, Filter, Eye, Calendar, FileText, User, Mail, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

  const stats = [
    { label: "Total", val: quotes.length, color: "text-white", bg: "bg-white/5" },
    { label: "Pending", val: quotes.filter(q => q.status === "pending").length, color: "text-yellow-400", bg: "bg-yellow-600/20" },
    { label: "Reviewed", val: quotes.filter(q => q.status === "reviewed").length, color: "text-blue-400", bg: "bg-blue-600/20" },
    { label: "Approved", val: quotes.filter(q => q.status === "approved").length, color: "text-green-400", bg: "bg-green-600/20" },
    { label: "Rejected", val: quotes.filter(q => q.status === "rejected").length, color: "text-red-400", bg: "bg-red-600/20" },
  ]

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "approved": return "border-green-600/30 text-green-400 bg-green-600/10"
      case "pending": return "border-yellow-600/30 text-yellow-400 bg-yellow-600/10"
      case "reviewed": return "border-blue-600/30 text-blue-400 bg-blue-600/10"
      case "rejected": return "border-red-600/30 text-red-400 bg-red-600/10"
      default: return "border-gray-600/30 text-gray-400 bg-gray-600/10"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <p className="text-gray-400 animate-pulse">Fetching latest requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Quote Requests</h2>
        <p className="text-sm text-gray-400 mt-1">Review and approve incoming service requests</p>
      </div>

      {/* Stats - Scrollable on mobile */}
      <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar md:grid md:grid-cols-5">
        {stats.map((s, i) => (
          <div key={i} className={`min-w-[140px] flex-1 border border-white/10 rounded-2xl p-4 ${s.bg}`}>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search client or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-600 outline-none text-sm text-white"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <Filter size={18} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-white outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Client Info</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredQuotes.map((quote) => (
              <tr key={quote._id} className="hover:bg-white/[3%] transition">
                <td className="px-6 py-4">
                  <p className="text-white font-semibold text-sm">{quote.clientName}</p>
                  <p className="text-gray-500 text-xs">{quote.clientEmail}</p>
                </td>
                <td className="px-6 py-4 text-sm text-white capitalize">
                  {quote.serviceCategory?.replace("_", " ")}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedQuote(quote)}
                    className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredQuotes.map((quote) => (
          <div key={quote._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-white font-bold">{quote.clientName}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Mail size={12} /> {quote.clientEmail}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(quote.status)}`}>
                {quote.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs py-3 border-y border-white/5">
              <div className="text-gray-400">
                <p className="text-[10px] uppercase font-bold text-gray-600 mb-1">Service</p>
                <span className="text-white capitalize">{quote.serviceCategory?.replace("_", " ")}</span>
              </div>
              <div className="text-right text-gray-400">
                <p className="text-[10px] uppercase font-bold text-gray-600 mb-1">Date</p>
                <span className="text-white">{new Date(quote.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedQuote(quote)}
              className="w-full py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Eye size={16} /> View & Respond
            </button>
          </div>
        ))}
      </div>

      {/* Modals & Empty States (Same logic as yours, slightly cleaner styling) */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              className="bg-[#0f0f0f] border-t md:border border-white/10 w-full max-w-2xl rounded-t-3xl md:rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Content */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Quote Details</h3>
                <button onClick={() => setSelectedQuote(null)} className="text-gray-500 hover:text-white text-2xl">×</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DetailCard icon={<User size={16}/>} label="Client" value={selectedQuote.clientName} />
                <DetailCard icon={<Mail size={16}/>} label="Email" value={selectedQuote.clientEmail} />
                <DetailCard icon={<FileText size={16}/>} label="Service" value={selectedQuote.serviceCategory?.replace("_", " ")} />
                <DetailCard icon={<Calendar size={16}/>} label="Requested" value={new Date(selectedQuote.createdAt).toLocaleDateString()} />
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Message</p>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{selectedQuote.message || "No message provided"}"</p>
              </div>

              {/* Status Update Section */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-white">Action & Response</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["pending", "reviewed", "approved", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedQuote._id, s, responseMessage)}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase transition border ${
                        selectedQuote.status === s 
                        ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/40" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type admin response for the client..."
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-red-600 outline-none resize-none h-24"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3">
      <p className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-2 mb-1">
        {icon} {label}
      </p>
      <p className="text-white text-sm font-medium capitalize truncate">{value}</p>
    </div>
  )
}
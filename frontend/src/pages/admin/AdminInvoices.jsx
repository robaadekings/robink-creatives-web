import { useEffect, useState } from "react"
import { Loader2, Download, Filter, Search, CheckCircle, AlertCircle, Clock, DollarSign, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../../utils/axios"

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDownloading, setIsDownloading] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/invoices")
      setInvoices(data.data || [])
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load invoices")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/invoices/${id}/status`, { status: newStatus })
      fetchInvoices()
    } catch (err) {
      console.error("Update error:", err)
    }
  }

  const downloadPDF = async (id) => {
    try {
      setIsDownloading(id)
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setIsDownloading(null)
    }
  }

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    if (statusFilter === "all") return matchesSearch
    return matchesSearch && inv.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const getStatusStyles = (status) => {
    switch(status.toLowerCase()) {
      case "paid": return "bg-green-500/10 text-green-400 border-green-500/20"
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "overdue": return "bg-red-500/10 text-red-400 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status.toLowerCase() === "paid").length,
    pending: invoices.filter(i => i.status.toLowerCase() === "pending").length,
    overdue: invoices.filter(i => i.status.toLowerCase() === "overdue").length,
    totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading financial records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Invoices</h2>
          <p className="text-sm text-gray-400 mt-1">Track payments and manage billing</p>
        </div>
      </div>

      {/* Stats Grid - Responsive Column sizing */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: "Total", val: stats.total, color: "bg-white/5 text-white" },
          { label: "Paid", val: stats.paid, color: "bg-green-600/10 text-green-400 border-green-600/20" },
          { label: "Pending", val: stats.pending, color: "bg-yellow-600/10 text-yellow-400 border-yellow-600/20" },
          { label: "Overdue", val: stats.overdue, color: "bg-red-600/10 text-red-400 border-red-600/20" },
          { label: "Value", val: `$${stats.totalAmount.toLocaleString()}`, color: "bg-blue-600/10 text-blue-400 border-blue-600/20", span: "col-span-2 lg:col-span-1" }
        ].map((s, i) => (
          <div key={i} className={`${s.color} ${s.span || ""} border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10`}>
            <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">{s.label}</p>
            <p className="text-xl font-bold mt-1 truncate">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search invoice or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-600/50 outline-none text-white text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[160px]">
          <Filter size={18} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-white outline-none w-full cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto text-gray-500 mb-4" size={40} />
          <p className="text-gray-400 text-sm">No invoices found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice #</th>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-white/[3%] transition-colors">
                    <td className="px-6 py-4 font-mono text-red-400 font-bold">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-white font-medium">{inv.clientName}</td>
                    <td className="px-6 py-4 text-white">${inv.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={inv.status}
                        onChange={(e) => updateStatus(inv._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border outline-none cursor-pointer ${getStatusStyles(inv.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadPDF(inv._id)}
                        disabled={isDownloading === inv._id}
                        className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all disabled:opacity-30"
                      >
                        {isDownloading === inv._id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="lg:hidden space-y-4">
            {filteredInvoices.map((inv) => (
              <div key={inv._id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">#{inv.invoiceNumber}</span>
                    <h3 className="font-bold text-white text-base">{inv.clientName}</h3>
                  </div>
                  <button 
                    onClick={() => downloadPDF(inv._id)}
                    className="p-3 bg-red-600/20 text-red-400 rounded-xl active:scale-90 transition-transform"
                  >
                    <Download size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Amount Due</p>
                    <p className="text-white font-bold text-lg">${inv.total?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Status</p>
                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv._id, e.target.value)}
                      className={`w-full px-2 py-1 rounded-lg text-xs font-bold border outline-none ${getStatusStyles(inv.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-red-500" />
                    <span>Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "No date"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
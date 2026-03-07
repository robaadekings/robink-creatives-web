import { useEffect, useState } from "react"
import { Loader2, Download, Filter, Search, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../utils/axios"

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDownloading, setIsDownloading] = useState(null);

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
      console.error("Invoices error:", err)
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

  // FIXED DOWNLOAD FUNCTION
  const downloadPDF = async (id) => {
    try {
      setIsDownloading(id);
      // We use '/invoices' because your backend routes this via invoiceRoutes
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download PDF. Please ensure the backend controller is working.");
    } finally {
      setIsDownloading(null);
    }
  }

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (statusFilter === "all") return matchesSearch
    return matchesSearch && inv.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "paid":
        return <CheckCircle size={16} className="text-green-400" />
      case "pending":
        return <Clock size={16} className="text-yellow-400" />
      case "overdue":
        return <AlertCircle size={16} className="text-red-400" />
      default:
        return <Clock size={16} className="text-gray-400" />
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
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading invoices...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Invoices Management</h2>
        <p className="text-gray-400 mt-1">Track and manage all client invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Invoices</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Paid</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.paid}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/10 border border-yellow-600/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-600/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.overdue}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-600/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">${(stats.totalAmount || 0).toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by invoice number or client..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          {error}
        </motion.div>
      )}

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">{searchTerm || statusFilter !== "all" ? "No invoices match your filters" : "No invoices yet"}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-gray-400 text-sm font-semibold">
                <th className="px-6 py-4 text-left">Invoice #</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv, idx) => (
                <tr key={inv._id} className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-white/[2%]" : ""} hover:bg-white/10 transition`}>
                  <td className="px-6 py-4 text-sm font-mono text-red-400 font-semibold">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-white">{inv.clientName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-white">${(inv.total || 0).toLocaleString()} {inv.currency || "USD"}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inv.status)}
                      <select
                        value={inv.status}
                        onChange={(e) => updateStatus(inv._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none cursor-pointer transition-all ${
                          inv.status === "paid" ? "bg-green-500/20 text-green-400" : 
                          inv.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadPDF(inv._id)}
                      disabled={isDownloading === inv._id}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition disabled:opacity-50"
                      title="Download PDF"
                    >
                      {isDownloading === inv._id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
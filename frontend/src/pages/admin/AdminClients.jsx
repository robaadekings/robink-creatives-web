import { useEffect, useState } from "react"
import { Loader2, Search, Eye, Mail, Calendar, Building2, Phone, X, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../../utils/axios"

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientDetails, setClientDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/admin/clients")
      setClients(data.data || [])
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const fetchClientDetails = async (clientId) => {
    try {
      setDetailsLoading(true)
      const { data } = await api.get(`/admin/clients/${clientId}`)
      setClientDetails(data.data)
    } catch (err) {
      console.error("Error fetching client details:", err)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    fetchClientDetails(client._id)
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
        <p className="text-gray-400 animate-pulse">Fetching client database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Clients</h2>
          <p className="text-sm text-gray-400 mt-1">Directory of all registered customers</p>
        </div>
        <div className="bg-red-600/10 px-4 py-2 rounded-lg border border-red-600/30 w-full sm:w-auto text-center">
          <p className="text-red-400 text-sm font-bold flex items-center justify-center gap-2">
            <Users size={16} /> {clients.length} Total
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 focus:outline-none transition-all text-white placeholder-gray-500 text-sm md:text-base"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Results Section */}
      {filteredClients.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <Building2 className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400 text-sm">No clients found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Table for Desktop */}
          <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Client Name</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Company</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-white/[3%] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{client.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{client.email}</p>
                      <p className="text-xs text-gray-500">{client.phone || "No phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{client.company || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="p-2 bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile/Tablet */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <div key={client._id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">{client.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 break-all">{client.email}</p>
                  </div>
                  <button 
                    onClick={() => handleViewClient(client)}
                    className="p-2.5 bg-red-600/20 text-red-400 rounded-lg"
                  >
                    <Eye size={18} />
                  </button>
                </div>
                <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Building2 size={14} className="text-red-500" />
                    <span className="truncate">{client.company || "Personal"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Calendar size={14} className="text-red-500" />
                    <span>{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#111827] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold">Client Profile</h3>
                <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {detailsLoading ? (
                  <div className="py-12 flex flex-col items-center">
                    <Loader2 className="animate-spin text-red-600 mb-2" />
                    <p className="text-sm text-gray-500">Loading profile data...</p>
                  </div>
                ) : clientDetails && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-900/20">
                          {clientDetails.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{clientDetails.name}</h4>
                          <p className="text-sm text-gray-400">{clientDetails.company || "Independent Client"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Email Address</p>
                          <div className="flex items-center gap-2 text-sm text-gray-200">
                            <Mail size={14} className="text-red-500" />
                            <span className="break-all">{clientDetails.email}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Phone Number</p>
                          <div className="flex items-center gap-2 text-sm text-gray-200">
                            <Phone size={14} className="text-red-500" />
                            <span>{clientDetails.phone || "Not provided"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-red-600/10 border border-red-600/20 p-3 rounded-xl text-center">
                        <p className="text-[10px] text-red-400 font-bold uppercase">Projects</p>
                        <p className="text-xl font-bold mt-1">{clientDetails.projects || 0}</p>
                      </div>
                      <div className="bg-amber-600/10 border border-amber-600/20 p-3 rounded-xl text-center">
                        <p className="text-[10px] text-amber-400 font-bold uppercase">Invoices</p>
                        <p className="text-xl font-bold mt-1">{clientDetails.invoices || 0}</p>
                      </div>
                      <div className="bg-green-600/10 border border-green-600/20 p-3 rounded-xl text-center">
                        <p className="text-[10px] text-green-400 font-bold uppercase">Total Spend</p>
                        <p className="text-lg font-bold mt-1">${(clientDetails.totalSpent || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedClient(null)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/20"
                    >
                      Close Profile
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
import { useEffect, useState } from "react"
import { Loader2, Search, Eye, Mail, Calendar, Building2, Phone } from "lucide-react"
import { motion } from "framer-motion"
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
      console.error("Clients error:", err)
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
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Clients Management</h2>
          <p className="text-gray-400 mt-1">Manage and view all your clients</p>
        </div>
        <div className="bg-red-600/20 px-4 py-2 rounded-full border border-red-600/40">
          <p className="text-red-400 font-semibold">{clients.length} Total Clients</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
        />
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

      {/* Clients Grid/Table */}
      {filteredClients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <Building2 className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">
            {searchTerm ? "No clients match your search" : "No clients yet"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/5">
                <tr className="text-gray-400 text-sm font-semibold">
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client, idx) => (
                  <tr
                    key={client._id}
                    className={`border-b border-white/5 ${
                      idx % 2 === 0 ? "bg-white/[2%]" : ""
                    } hover:bg-white/10 transition`}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-white">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{client.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{client.company || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{client.phone || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewClient(client)}
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredClients.map((client) => (
              <motion.div
                key={client._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{client.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleViewClient(client)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    <Eye size={18} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {client.company && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 size={14} />
                      <span>{client.company}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone size={14} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedClient(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full backdrop-blur-xl"
          >
            {detailsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto text-red-600 mb-2" size={32} />
                <p className="text-gray-400">Loading details...</p>
              </div>
            ) : clientDetails ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{clientDetails.name}</h3>
                    <p className="text-gray-400 mt-1">{clientDetails.email}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white flex items-center gap-2 mt-2">
                      <Mail size={16} className="text-red-600" />
                      {clientDetails.email}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white flex items-center gap-2 mt-2">
                      <Phone size={16} className="text-red-600" />
                      {clientDetails.phone || "—"}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Company</p>
                    <p className="text-white flex items-center gap-2 mt-2">
                      <Building2 size={16} className="text-red-600" />
                      {clientDetails.company || "—"}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white flex items-center gap-2 mt-2">
                      <Calendar size={16} className="text-red-600" />
                      {new Date(clientDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-600/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-red-400 mt-2">{clientDetails.projects || 0}</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/10 border border-amber-600/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Total Invoices</p>
                    <p className="text-2xl font-bold text-amber-400 mt-2">{clientDetails.invoices || 0}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">${(clientDetails.totalSpent || 0).toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                Failed to load client details
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

    </div>
  )
}
import { useEffect, useState } from "react"
import { Loader2, MoreVertical, ExternalLink } from "lucide-react"
import api from "../../utils/axios"

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
        <h2 className="text-2xl font-bold">Clients</h2>
        <span className="text-sm text-gray-400">{clients.length} total</span>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {clients.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          No clients yet
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-gray-400 text-sm">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Company</th>
                <th className="px-6 py-4 text-left">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client, idx) => (
                <tr
                  key={client._id}
                  className={`border-b border-white/5 ${
                    idx % 2 === 0 ? "bg-white/[2%]" : ""
                  } hover:bg-white/10 transition`}
                >
                  <td className="px-6 py-4 text-sm font-semibold">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{client.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{client.company || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition">
                      <MoreVertical size={18} />
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
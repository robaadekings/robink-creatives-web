import { useEffect, useState } from "react"
import { Loader2, Download, CheckCircle } from "lucide-react"
import api from "../../utils/axios"

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  const downloadPDF = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/admin/invoices/${id}/pdf`)
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
        <h2 className="text-2xl font-bold">Invoices</h2>
        <span className="text-sm text-gray-400">{invoices.length} total</span>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-400">
          No invoices yet
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-gray-400 text-sm">
                <th className="px-6 py-4 text-left">Invoice #</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv, idx) => (
                <tr
                  key={inv._id}
                  className={`border-b border-white/5 ${
                    idx % 2 === 0 ? "bg-white/[2%]" : ""
                  } hover:bg-white/10 transition`}
                >
                  <td className="px-6 py-4 text-sm font-mono text-red-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">{inv.clientName}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    ${inv.total?.toLocaleString()} {inv.currency}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none cursor-pointer ${
                        inv.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : inv.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => downloadPDF(inv._id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition text-red-400"
                      title="Download PDF"
                    >
                      <Download size={18} />
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
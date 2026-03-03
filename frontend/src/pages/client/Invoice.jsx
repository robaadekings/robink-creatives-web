import { useEffect, useState } from "react"
import { Loader2, Download, Eye } from "lucide-react"
import api from "../../utils/axios"

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/client/invoices")
      .then(res => setInvoices(res.data.data || []))
      .catch(err => console.error("Invoices error:", err))
      .finally(() => setLoading(false))
  }, [])

  const downloadPDF = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/client/invoice/${id}/pdf`)
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No invoices yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">My Invoices</h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-white/5">
            <tr className="text-gray-400 text-sm">
              <th className="px-6 py-4 text-left">Invoice #</th>
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
                <td className="px-6 py-4 text-sm font-semibold">
                  ${inv.total?.toLocaleString()} {inv.currency}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : inv.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => downloadPDF(inv._id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition text-red-400"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
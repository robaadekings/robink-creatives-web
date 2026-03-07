import { useEffect, useState } from "react"
import { Loader2, Download, CheckCircle } from "lucide-react"
import api from "../../utils/axios"

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    api.get("/client/invoices")
      .then(res => setInvoices(res.data.data || []))
      .catch(err => console.error("Invoices error:", err))
      .finally(() => setLoading(false))
  }, [])

  const downloadPDF = async (inv) => {
    if (!inv.portalToken) {
      alert("Portal token not found for this invoice.");
      return;
    }

    try {
      const response = await api.get(`/client/invoice/${inv.portalToken}/pdf`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${inv.invoiceNumber || 'Invoice'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  const approveInvoice = async (invoiceId) => {
    try {
      setApproving(invoiceId)
      await api.put(`/client/invoice/${invoiceId}/approve`)
      setInvoices(invoices.map(invoice => 
        invoice._id === invoiceId 
          ? { ...invoice, clientApproved: true, approvedAt: new Date() }
          : invoice
      ))
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setApproving(null)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

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
              <th className="px-6 py-4 text-left">Approval</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b border-white/5 hover:bg-white/10 transition">
                <td className="px-6 py-4 text-sm font-mono text-red-400">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm font-semibold">${inv.total?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "Paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {inv.clientApproved ? (
                    <div className="flex items-center gap-2 text-green-400"><CheckCircle size={16} /><span>Approved</span></div>
                  ) : (
                    <button 
                       onClick={() => approveInvoice(inv._id)} 
                       className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2"
                    >
                      {approving === inv._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => downloadPDF(inv)} className="p-2 hover:bg-white/10 rounded-lg transition text-red-400">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
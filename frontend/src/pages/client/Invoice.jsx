import { useEffect, useState } from "react"
import { Loader2, Download, CheckCircle, FileText } from "lucide-react"
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
    if (!inv.portalToken) return alert("Token not found");
    try {
      const response = await api.get(`/client/invoice/${inv.portalToken}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${inv.invoiceNumber || 'Invoice'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error("Download failed:", err); }
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
    } catch (error) { console.error('Approval failed:', error)
    } finally { setApproving(null) }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Invoices</h2>
        <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 lg:hidden">
          {invoices.length} total
        </span>
      </div>

      {/* MOBILE VIEW: List of Cards (Hidden on Desktop) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {invoices.map((inv) => (
          <div key={inv._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <FileText className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-mono">{inv.invoiceNumber}</p>
                  <p className="text-lg font-bold text-white">${inv.total?.toLocaleString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.status === "Paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {inv.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex-1">
                {inv.clientApproved ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <CheckCircle size={16} /> Approved
                  </div>
                ) : (
                  <button 
                    onClick={() => approveInvoice(inv._id)} 
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20"
                  >
                    {approving === inv._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Approve Invoice
                  </button>
                )}
              </div>
              <button 
                onClick={() => downloadPDF(inv)} 
                className="ml-4 p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-red-400 transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Traditional Table (Hidden on Mobile) */}
      <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-white/10 transition group">
                <td className="px-6 py-4 text-sm font-mono text-red-400">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm font-semibold text-white">${inv.total?.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "Paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {inv.clientApproved ? (
                    <div className="flex items-center gap-2 text-green-400"><CheckCircle size={16} /><span>Approved</span></div>
                  ) : (
                    <button 
                      onClick={() => approveInvoice(inv._id)} 
                      className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all"
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

      {invoices.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <FileText className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">No invoices found yet.</p>
        </div>
      )}
    </div>
  )
}
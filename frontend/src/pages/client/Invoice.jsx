import { useEffect, useState } from "react"
import { Loader2, Download, CheckCircle, FileText, AlertCircle } from "lucide-react"
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
    if (!inv.portalToken) return alert("Download token not available");
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
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not download PDF. Please try again.");
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

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <Loader2 className="animate-spin text-red-500" size={40} />
      <p className="text-gray-400 text-sm animate-pulse">Loading invoices...</p>
    </div>
  )

  return (
    <div className="space-y-6 pb-12 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">My Invoices</h2>
          <p className="text-gray-400 text-sm mt-1">Review and approve your billings</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs text-gray-300 font-medium">{invoices.length} Invoices</span>
        </div>
      </div>

      {/* MOBILE VIEW: Card Stack (Visible < 1024px) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {invoices.map((inv) => (
          <div key={inv._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <FileText className="text-red-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{inv.invoiceNumber}</p>
                  <p className="text-xl font-bold text-white">${inv.total?.toLocaleString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${inv.status === "Paid" ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"}`}>
                {inv.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <div className="flex-1">
                {inv.clientApproved ? (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-green-400 bg-green-400/5 py-3 rounded-xl border border-green-400/10 text-sm font-bold">
                    <CheckCircle size={18} /> Approved
                  </div>
                ) : (
                  <button 
                    onClick={() => approveInvoice(inv._id)} 
                    disabled={approving === inv._id}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20"
                  >
                    {approving === inv._id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    Approve Invoice
                  </button>
                )}
              </div>
              <button 
                onClick={() => downloadPDF(inv)} 
                className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors active:bg-white/20"
              >
                <Download size={18} className="text-red-500" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table (Visible > 1024px) */}
      <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-widest bg-white/5">
              <th className="px-6 py-5 text-left font-bold">Invoice Number</th>
              <th className="px-6 py-5 text-left font-bold">Total Amount</th>
              <th className="px-6 py-5 text-left font-bold">Status</th>
              <th className="px-6 py-5 text-left font-bold">Approval</th>
              <th className="px-6 py-5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-white/[0.07] transition-colors group">
                <td className="px-6 py-4 text-sm font-mono text-red-400 font-medium">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm font-bold text-white">${inv.total?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase ${inv.status === "Paid" ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {inv.clientApproved ? (
                    <div className="flex items-center gap-2 text-green-400 font-semibold text-xs animate-in fade-in duration-500">
                      <CheckCircle size={16} />
                      <span>Approved</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => approveInvoice(inv._id)} 
                      disabled={approving === inv._id}
                      className="px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all text-xs font-bold disabled:opacity-50"
                    >
                      {approving === inv._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => downloadPDF(inv)} 
                    className="p-2.5 bg-transparent hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-red-500 group-hover:scale-110"
                    title="Download PDF"
                  >
                    <Download size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
          <div className="p-5 bg-white/5 rounded-full mb-4">
            <FileText className="text-gray-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-white">No invoices yet</h3>
          <p className="text-gray-500 mt-2 text-center max-w-xs">
            As soon as an invoice is generated for your projects, it will appear here for your review.
          </p>
        </div>
      )}
    </div>
  )
}
import { useEffect, useState } from "react"
import { Loader2, Download, FileText, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import api from "../../utils/axios"

export default function ClientQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    api.get("/client/quotes")
      .then(res => setQuotes(res.data.data || []))
      .catch(err => console.error("Quotes error:", err))
      .finally(() => setLoading(false))
  }, [])

  const downloadPDF = (id) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    window.open(`${apiUrl}/client/quote/${id}/pdf`)
  }

  const approveQuote = async (quoteId) => {
    try {
      setApproving(quoteId)
      await api.put(`/client/quote/${quoteId}/approve`)
      
      setQuotes(quotes.map(quote => 
        quote._id === quoteId 
          ? { ...quote, clientApproved: true, approvedAt: new Date(), status: 'approved' }
          : quote
      ))
    } catch (error) {
      console.error('Approval failed:', error)
      alert('Failed to approve quote. Please try again.')
    } finally {
      setApproving(null)
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 border-green-500/30 text-green-400"
      case "pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      case "reviewed":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400"
      case "rejected":
        return "bg-red-500/10 border-red-500/30 text-red-400"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400"
    }
  }

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <Loader2 className="animate-spin text-[#8B1C24]" size={40} />
      <p className="text-gray-500 text-sm">Fetching your quotes...</p>
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-8 px-2 sm:px-0 pb-10">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-white">My Quotes</h2>
        <p className="text-gray-400 mt-1 text-sm md:text-base">View and track your project estimates</p>
      </header>

      {quotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 md:p-12 max-w-md mx-auto">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Quotes Yet</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Quotes will appear here once the team generates an estimate for your requests.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {quotes.map(quote => (
            <motion.div
              key={quote._id}
              whileHover={{ y: -4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {quote.serviceId?.title || "Project Quote"}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      Created: {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`w-fit px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </div>
                </div>

                {quote.description && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                    "{quote.description}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Budget Range</p>
                    <p className="text-[#8B1C24] font-bold text-sm md:text-base">{quote.budgetRange || "Negotiable"}</p>
                  </div>
                  {quote.attachments?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Files Included</p>
                      <p className="text-white font-bold text-sm">{quote.attachments.length} Attachment(s)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-auto">
                <button
                  onClick={() => downloadPDF(quote._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-sm font-semibold border border-white/10"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                
                {!quote.clientApproved ? (
                  <button
                    onClick={() => approveQuote(quote._id)}
                    disabled={approving === quote._id}
                    className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 bg-[#8B1C24] hover:bg-[#A62A32] disabled:opacity-50 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-red-900/20"
                  >
                    {approving === quote._id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Approve Quote
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold">
                    <CheckCircle2 size={18} />
                    Approved {quote.approvedAt && `on ${new Date(quote.approvedAt).toLocaleDateString()}`}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
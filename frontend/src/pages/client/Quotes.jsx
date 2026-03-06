import { useEffect, useState } from "react"
import { Loader2, Download, Eye, FileText } from "lucide-react"
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
      
      // Update the quote status locally
      setQuotes(quotes.map(quote => 
        quote._id === quoteId 
          ? { ...quote, clientApproved: true, approvedAt: new Date() }
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
        return "from-green-600/20 to-green-700/10 border-green-600/30 text-green-400"
      case "pending":
        return "from-yellow-600/20 to-yellow-700/10 border-yellow-600/30 text-yellow-400"
      case "reviewed":
        return "from-blue-600/20 to-blue-700/10 border-blue-600/30 text-blue-400"
      case "rejected":
        return "from-red-600/20 to-red-700/10 border-red-600/30 text-red-400"
      default:
        return "from-gray-600/20 to-gray-700/10 border-gray-600/30 text-gray-400"
    }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-[#8B1C24]" size={32} /></div>

  if (quotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
          <FileText className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No Quotes Yet</h3>
          <p className="text-gray-400">Quotes will appear here once your admin creates them for your projects.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">My Quotes</h2>
        <p className="text-gray-400 mt-1">View and track your project quotes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quotes.map(quote => (
          <motion.div
            key={quote._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {quote.serviceId?.title || "Project Quote"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(quote.status)}`}>
                  {quote.status}
                  {quote.clientApproved && (
                    <span className="ml-2 text-green-400">✓ Approved</span>
                  )}
                </div>
              </div>

              {quote.description && (
                <p className="text-gray-300 text-sm line-clamp-3">
                  {quote.description}
                </p>
              )}

              {quote.budgetRange && (
                <div className="text-sm">
                  <span className="text-gray-400">Budget Range: </span>
                  <span className="text-[#8B1C24] font-semibold">{quote.budgetRange}</span>
                </div>
              )}

              {quote.attachments && quote.attachments.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-400">Attachments: </span>
                  <span className="text-white">{quote.attachments.length} file(s)</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => downloadPDF(quote._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8B1C24] hover:bg-[#6B1520] text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                
                {!quote.clientApproved && (
                  <button
                    onClick={() => approveQuote(quote._id)}
                    disabled={approving === quote._id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    {approving === quote._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        ✓ Approve Quote
                      </>
                    )}
                  </button>
                )}
                
                {quote.clientApproved && quote.approvedAt && (
                  <div className="text-green-400 text-sm font-medium">
                    Approved on {new Date(quote.approvedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
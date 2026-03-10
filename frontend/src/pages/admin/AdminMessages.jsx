import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, MessageCircle, Send, X, Check, Inbox, Calendar, User } from "lucide-react"
import api from "../../utils/axios"

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [replying, setReplying] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/contact")
      setMessages(data.data || [])
      setError("")
    } catch (err) {
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return
    try {
      setReplying(true)
      await api.post(`/contact/${messageId}/reply`, { replyMessage: replyText })
      setMessages(messages.map(m => m._id === messageId ? { ...m, status: "replied" } : m))
      setReplyText("")
      setSelectedMessage(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reply")
    } finally {
      setReplying(false)
    }
  }

  const filteredMessages = filter === "all" 
    ? messages 
    : messages.filter(m => m.status === filter)

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === "new").length,
    replied: messages.filter(m => m.status === "replied").length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading inbox...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Mail size={28} className="text-red-600" />
          Inbox
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage and respond to customer inquiries</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total", val: stats.total, color: "bg-white/5 text-white" },
          { label: "Unread", val: stats.new, color: "bg-red-600/10 text-red-400 border-red-600/20" },
          { label: "Replied", val: stats.replied, color: "bg-green-600/10 text-green-400 border-green-600/20" }
        ].map((s, i) => (
          <div key={i} className={`${s.color} border border-white/10 rounded-xl p-4`}>
            <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-0.5">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        {["all", "new", "replied"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all border ${
              filter === status
                ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            {status === "all" ? "All" : status === "new" ? "Unread" : "Replied"}
            <span className="ml-2 opacity-60">({stats[status === "all" ? "total" : status]})</span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <Inbox className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400 text-sm">No {filter !== "all" ? filter : ""} messages found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg._id}
              layoutId={msg._id}
              onClick={() => setSelectedMessage(msg)}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl cursor-pointer hover:border-red-500/40 transition-all active:scale-[0.98] group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{msg.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                      msg.status === "new" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {msg.status === "new" ? "Unread" : "Replied"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate max-w-[250px] md:max-w-none">{msg.email}</p>
                </div>
                <MessageCircle size={18} className="text-gray-600 group-hover:text-red-500" />
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-200 line-clamp-1">{msg.subject}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{msg.message}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-gray-600 font-medium">
                  {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Message →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#0a0a0a] border-t sm:border border-white/10 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-white line-clamp-1">{selectedMessage.name}</h2>
                    <p className="text-[11px] text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{selectedMessage.subject}</h4>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/[3%] border border-white/5 p-5 rounded-2xl">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.status === "new" ? (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response..."
                      rows={5}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-red-600 outline-none text-sm transition-all"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReply(selectedMessage._id)}
                        disabled={replying || !replyText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all"
                      >
                        {replying ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-600/10 border border-green-600/20 p-4 rounded-2xl flex items-center gap-3 text-green-400">
                    <Check size={20} />
                    <span className="text-sm font-bold">Inquiry Replied</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
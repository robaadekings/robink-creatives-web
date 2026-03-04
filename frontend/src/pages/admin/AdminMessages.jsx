import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Mail, MessageCircle, Send, X, Check } from "lucide-react"
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
      console.error("Failed to load messages", err)
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return

    try {
      setReplying(true)
      await api.post(`/contact/${messageId}/reply`, {
        replyMessage: replyText,
      })

      // Update message status
      setMessages(messages.map(m => 
        m._id === messageId ? { ...m, status: "replied" } : m
      ))

      setReplyText("")
      setSelectedMessage(null)
    } catch (err) {
      console.error("Failed to send reply", err)
      setError(err.response?.data?.message || "Failed to send reply")
    } finally {
      setReplying(false)
    }
  }

  const filteredMessages = filter === "all" 
    ? messages 
    : messages.filter(m => m.status === filter)

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Mail size={32} className="text-red-500" />
            Messages
          </h1>
          <p className="text-gray-400">Manage customer inquiries and respond directly</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {["all", "new", "replied"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full transition ${
                filter === status
                  ? "bg-gradient-to-r from-red-600 to-yellow-500 text-white"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {status === "all" ? "All Messages" : status === "new" ? "New" : "Replied"}
              <span className="ml-2 font-bold">
                ({messages.filter(m => status === "all" || m.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No messages yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMessages.map((message, idx) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedMessage(message)}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-600/15 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                
                <div className="relative bg-gradient-to-br from-white/6 to-white/2 border border-white/10 p-6 rounded-2xl hover:border-red-500/40 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-yellow-300 transition">
                          {message.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          message.status === "new"
                            ? "bg-red-500/20 border border-red-500/30 text-red-200"
                            : "bg-green-500/20 border border-green-500/30 text-green-200"
                        }`}>
                          {message.status === "new" ? "🔴 New" : "✓ Replied"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">{message.email}</p>
                      
                      <p className="text-white font-semibold mb-2">{message.subject}</p>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {message.message}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <MessageCircle 
                      size={24} 
                      className="text-red-500 group-hover:scale-110 transition" 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedMessage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-[#0f1219] to-[#1a1f2e] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-white">
                    {selectedMessage.subject}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    selectedMessage.status === "new"
                      ? "bg-red-500/20 border border-red-500/30 text-red-200"
                      : "bg-green-500/20 border border-green-500/30 text-green-200 flex items-center gap-2"
                  }`}>
                    {selectedMessage.status === "new" ? "🔴 New" : <><Check size={16} /> Replied</>}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">From:</span> <span className="text-white font-semibold">{selectedMessage.name}</span></p>
                  <p><span className="text-gray-400">Email:</span> <a href={`mailto:${selectedMessage.email}`} className="text-red-400 hover:text-red-300">{selectedMessage.email}</a></p>
                  <p><span className="text-gray-400">Date:</span> <span className="text-gray-300">{new Date(selectedMessage.createdAt).toLocaleString()}</span></p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Message</h3>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Reply Section */}
              {selectedMessage.status === "new" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white">Send Reply</h3>
                  <div className="space-y-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition resize-none"
                    />
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReply(selectedMessage._id)}
                        disabled={replying || !replyText.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 px-6 py-3 rounded-full font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {replying ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Reply
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="px-6 py-3 rounded-full font-semibold border border-white/30 hover:bg-white/10 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedMessage.status === "replied" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-green-300">
                    <Check size={20} />
                    <span className="font-semibold">You've already replied to this message</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

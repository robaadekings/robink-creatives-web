import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Mail, MessageCircle, Send, X, Check, Inbox } from "lucide-react"
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

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === "new").length,
    replied: messages.filter(m => m.status === "replied").length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mail size={32} className="text-red-600" />
          Messages Management
        </h1>
        <p className="text-gray-400">Manage customer inquiries and respond directly</p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Total Messages</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Unread</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.new}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-600/30 rounded-xl p-4"
        >
          <p className="text-gray-400 text-sm">Replied</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.replied}</p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {["all", "new", "replied"].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full transition font-semibold ${
              filter === status
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            {status === "all" ? "All Messages" : status === "new" ? "Unread" : "Replied"}
            <span className="ml-2 font-bold">({stats[status === "all" ? "total" : status]})</span>
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/40 text-red-400 p-4 rounded-xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          {error}
        </motion.div>
      )}

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <Inbox className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">
            {filter === "all" ? "No messages yet" : `No ${filter} messages`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
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
              
              <div className="relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-red-500/40 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-yellow-300 transition">
                        {message.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        message.status === "new"
                          ? "bg-red-500/20 border border-red-500/30 text-red-200"
                          : "bg-green-500/20 border border-green-500/30 text-green-200"
                      }`}>
                        {message.status === "new" ? "🔴 Unread" : <>✓ Replied</>}
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
                    className="text-red-500 group-hover:scale-110 transition flex-shrink-0" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
            className="relative bg-white/5 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl"
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="sticky top-0 right-0 float-right p-6 hover:bg-white/10 rounded-lg transition z-10"
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
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                    selectedMessage.status === "new"
                      ? "bg-red-500/20 border border-red-500/30 text-red-200"
                      : "bg-green-500/20 border border-green-500/30 text-green-200"
                  }`}>
                    {selectedMessage.status === "new" ? "🔴 Unread" : <><Check size={16} /> Replied</>}
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
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReply(selectedMessage._id)}
                        disabled={replying || !replyText.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMessage(null)}
                        className="px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/10 transition"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {selectedMessage.status === "replied" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-3 text-green-300"
                >
                  <Check size={24} />
                  <span className="font-semibold">You've already replied to this message</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

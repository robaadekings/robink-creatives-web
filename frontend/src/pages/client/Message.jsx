import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2, Send } from "lucide-react"
import api from "../../utils/axios"
import { useAuth } from "../../context/AuthContext"

export default function ClientMessages() {
  const { projectId } = useParams()
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [projectId])

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/client/project/${projectId}/messages`)
      setMessages(data.data || [])
    } catch (err) {
      console.error("Messages error:", err)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const { data } = await api.post(`/client/project/${projectId}/messages`, {
        message: newMessage
      })
      setMessages([data.data, ...messages])
      setNewMessage("")
    } catch (err) {
      console.error("Send error:", err)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="text-gray-400">Loading messages...</div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold">Project Messages</h2>

      {/* Messages List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="space-y-4 h-[400px] overflow-y-auto mb-6">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet. Send the first message!</p>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                className={`p-4 rounded-lg ${
                  msg.sender._id === user?.id
                    ? "bg-red-600/20 border border-red-600/40 ml-12"
                    : "bg-white/5 border border-white/10 mr-12"
                }`}
              >
                <p className="text-sm font-semibold text-gray-300">
                  {msg.sender.name}
                  <span className="text-xs text-gray-500 ml-2">({msg.sender.role})</span>
                </p>
                <p className="mt-2 text-white">{msg.text}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            {sending && <Loader2 className="animate-spin" size={18} />}
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  )
}
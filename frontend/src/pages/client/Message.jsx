import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { Loader2, Send, MessageSquare } from "lucide-react"
import api from "../../utils/axios"
import { useAuth } from "../../context/AuthContext"

export default function ClientMessages() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const scrollRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [projectId])

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/client/project/${projectId}/messages`)
      // Assuming data.data is the array. Note: if you want oldest at top, 
      // you might need to .reverse() depending on your API sort.
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
      // Append new message to the list
      setMessages(prev => [...prev, data.data])
      setNewMessage("")
    } catch (err) {
      console.error("Send error:", err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="animate-spin text-red-500" size={32} />
        <p className="text-gray-400 text-sm">Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-2 sm:px-4 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-600/10 rounded-lg">
          <MessageSquare className="text-red-500" size={20} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Project Messages</h2>
      </div>

      {/* Messages Container */}
      <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden flex-1 shadow-xl">
        
        {/* Messages List - Flexible height */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto h-[50vh] md:h-[500px] scrollbar-thin scrollbar-thumb-white/10"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
              <MessageSquare size={40} className="text-gray-600 opacity-20" />
              <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.sender._id === user?.id
              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-red-600 text-white rounded-tr-none"
                        : "bg-white/10 text-gray-100 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">
                        {msg.sender.name} • {msg.sender.role}
                      </p>
                    )}
                    <p className="text-sm md:text-base leading-relaxed break-words">
                      {msg.text}
                    </p>
                    <p className={`text-[10px] mt-2 opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message Input - Sticks to bottom */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 p-3 md:px-6 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-red-600/20"
            >
              {sending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="hidden md:inline">Send</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
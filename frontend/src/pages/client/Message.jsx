import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function ClientMessages() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    api.get("/client/messages").then(res => setMessages(res.data))
  }, [])

  const sendMessage = async () => {
    await api.post("/client/messages", { message: newMessage })
    setNewMessage("")
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Messages</h2>

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg._id} className="bg-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-400">{msg.sender}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  )
}
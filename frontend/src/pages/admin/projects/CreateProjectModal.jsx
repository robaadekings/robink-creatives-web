import { useState } from "react"
import api from "../../../utils/axios"

export default function CreateProjectModal({ open, onClose, clients, refresh }) {
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    budget: "",
    deadline: "",
    status: "pending"
  })

  if (!open) return null

  const handleSubmit = async () => {
    await api.post("/admin/projects", form)
    refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#111] p-8 rounded-2xl w-[500px] space-y-4">
        <h3 className="text-xl font-semibold">Create Project</h3>

        <input
          placeholder="Project Name"
          className="input"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="input"
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
        >
          <option value="">Select Client</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget"
          className="input"
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />

        <input
          type="date"
          className="input"
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-red-600 px-4 py-2 rounded-lg w-full"
        >
          Create
        </button>
      </div>
    </div>
  )
}
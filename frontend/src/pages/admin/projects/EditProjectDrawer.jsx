import { useState, useEffect } from "react"
import api from "../../../lib/axios"

export default function EditProjectDrawer({ open, onClose, project, clients, refresh }) {
  const [form, setForm] = useState({})

  useEffect(() => {
    if (project) setForm(project)
  }, [project])

  if (!open || !project) return null

  const handleUpdate = async () => {
    await api.put(`/admin/projects/${project._id}`, form)
    refresh()
    onClose()
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-[#111] p-6 shadow-xl">
      <h3 className="text-lg font-semibold mb-4">Edit Project</h3>

      <input
        value={form.name || ""}
        className="input mb-3"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        className="input mb-3"
        value={form.clientId}
        onChange={(e) => setForm({ ...form, clientId: e.target.value })}
      >
        {clients.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        className="bg-red-600 w-full py-2 rounded-lg"
      >
        Update
      </button>
    </div>
  )
}
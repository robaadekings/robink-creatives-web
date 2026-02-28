import { useState } from "react"
import api from "../../lib/axios"

export default function AdminSettings() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    address: ""
  })

  const saveSettings = async () => {
    await api.post("/admin/settings", form)
    alert("Saved")
  }

  return (
    <div className="space-y-6 max-w-xl">

      <h2 className="text-2xl font-bold">Company Settings</h2>

      <input
        placeholder="Company Name"
        className="input"
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
      />

      <input
        placeholder="Email"
        className="input"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <textarea
        placeholder="Address"
        className="input"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <button
        onClick={saveSettings}
        className="bg-red-600 px-6 py-2 rounded-lg"
      >
        Save Settings
      </button>

    </div>
  )
}
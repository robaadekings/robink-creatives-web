import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function AdminClients() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data } = await api.get("/admin/clients")
    setClients(data)
  }

  const deleteClient = async (id) => {
    await api.delete(`/admin/clients/${id}`)
    fetchClients()
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Clients</h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th>Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clients.map(client => (
              <tr key={client._id} className="border-b border-white/5">
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  <button
                    onClick={() => deleteClient(client._id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
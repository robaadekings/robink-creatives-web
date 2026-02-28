import { useEffect, useState } from "react"
import api from "../../lib/axios"

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    api.get("/admin/quotes").then(res => setQuotes(res.data))
  }, [])

  const convertToInvoice = async (id) => {
    await api.post(`/admin/quotes/${id}/convert`)
    alert("Converted to Invoice")
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Quotes</h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th>Quote #</th>
              <th>Client</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {quotes.map(q => (
              <tr key={q._id} className="border-b border-white/5">
                <td>{q.quoteNumber}</td>
                <td>{q.clientName}</td>
                <td>${q.total}</td>
                <td>
                  <button
                    onClick={() => convertToInvoice(q._id)}
                    className="text-green-400"
                  >
                    Convert
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
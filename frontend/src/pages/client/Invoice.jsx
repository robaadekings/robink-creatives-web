import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    api.get("/client/invoices").then(res => setInvoices(res.data))
  }, [])

  const downloadPDF = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/client/invoices/${id}/pdf`)
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">My Invoices</h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th>#</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id} className="border-b border-white/5">
                <td>{inv.invoiceNumber}</td>
                <td>${inv.total}</td>
                <td>{inv.status}</td>
                <td>
                  <button
                    onClick={() => downloadPDF(inv._id)}
                    className="text-blue-400"
                  >
                    Download
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
import { useEffect, useState } from "react"
import { FileDown, Folder } from "lucide-react"
import api from "../../utils/axios"

export default function ClientFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/client/files")
      .then(res => setFiles(res.data.data || []))
      .catch(err => console.error("Files error:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-400">Loading files...</div>

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">No files available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">My Files</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <a
            key={file._id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition flex items-center gap-4"
          >
            <FileDown size={24} className="text-red-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{file.projectName}</p>
              <p className="text-xs text-gray-500 capitalize">{file.type}</p>
            </div>
          </a>
        ))}
      </div>

    </div>
  )
}
import { useEffect, useState } from "react"
import { FileDown, Folder, Loader2, FileText, ImageIcon, FileJson } from "lucide-react"
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

  // Helper to show different icons based on file extension/type
  const getFileIcon = (type) => {
    if (type?.includes('image')) return <ImageIcon size={24} className="text-blue-400" />
    if (type?.includes('pdf')) return <FileText size={24} className="text-red-400" />
    return <FileDown size={24} className="text-emerald-400" />
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <Loader2 className="animate-spin text-red-500" size={32} />
        <p className="text-gray-400 animate-pulse">Fetching your documents...</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Folder size={40} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-white">No files yet</h3>
        <p className="text-gray-400 mt-2 max-w-xs mx-auto">
          Once your project assets or deliverables are ready, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-white">My Files</h2>
        <p className="text-gray-400 text-sm md:text-base">Download and manage your project deliverables.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {files.map(file => (
          <a
            key={file._id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] flex items-center gap-4 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Folder size={80} />
            </div>

            <div className="bg-white/5 p-3 rounded-xl group-hover:bg-white/10 transition-colors flex-shrink-0">
              {getFileIcon(file.type)}
            </div>

            <div className="flex-1 min-w-0 z-10">
              <p className="font-semibold text-white truncate text-sm md:text-base group-hover:text-red-400 transition-colors">
                {file.name}
              </p>
              <div className="flex flex-col mt-0.5">
                <span className="text-xs text-gray-400 truncate">
                   Project: {file.projectName || 'General'}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-medium">
                  {file.type?.split('/')[1] || file.type || 'file'}
                </span>
              </div>
            </div>

            <FileDown size={18} className="text-gray-500 group-hover:text-white transition-colors flex-shrink-0 sm:opacity-0 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  )
}
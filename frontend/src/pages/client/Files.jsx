import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function ClientFiles() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    api.get("/client/files").then(res => setFiles(res.data))
  }, [])

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Files</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {files.map(file => (
          <a
            key={file._id}
            href={file.url}
            target="_blank"
            className="bg-white/5 border border-white/10 p-4 rounded-xl"
          >
            {file.name}
          </a>
        ))}
      </div>

    </div>
  )
}
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2, MessageSquare, FileText } from "lucide-react"
import api from "../../utils/axios"

export default function ClientProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/client/project/${id}`)
      .then(res => setProject(res.data.data))
      .catch(err => console.error("Project error:", err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Project not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-lg font-semibold mt-1">
              <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 capitalize">
                {project.status}
              </span>
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Deadline</p>
            <p className="text-lg font-semibold mt-1">
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : "Not set"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Budget</p>
            <p className="text-lg font-semibold mt-1">
              ${project.budget?.toLocaleString() || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Progress</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {project.description && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-4">Description</h3>
          <p className="text-gray-300">{project.description}</p>
        </div>
      )}

      {project.assets && project.assets.length > 0 && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} />
            Assets
          </h3>
          <div className="space-y-2">
            {project.assets.map((asset, idx) => (
              <a
                key={idx}
                href={asset}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg text-red-400 hover:underline transition"
              >
                {asset.split('/').pop()}
              </a>
            ))}
          </div>
        </div>
      )}

      {project.deliverables && project.deliverables.length > 0 && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} />
            Deliverables
          </h3>
          <div className="space-y-2">
            {project.deliverables.map((deliverable, idx) => (
              <a
                key={idx}
                href={deliverable}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg text-red-400 hover:underline transition"
              >
                {deliverable.split('/').pop()}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/client/projects/${id}/messages`)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          <MessageSquare size={20} />
          View Messages
        </button>
      </div>

    </div>
  )
}
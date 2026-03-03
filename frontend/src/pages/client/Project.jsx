import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import api from "../../utils/axios"

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/client/projects")
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error("Projects error:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">My Projects</h2>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div
              key={project._id}
              onClick={() => navigate(`/client/projects/${project._id}`)}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition"
            >
              <h3 className="font-semibold text-lg text-white">{project.title}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Status: <span className="capitalize font-medium text-red-400">{project.status}</span>
              </p>

              {project.description && (
                <p className="text-gray-500 text-sm mt-3 line-clamp-2">{project.description}</p>
              )}

              {project.deadline && (
                <p className="text-gray-500 text-xs mt-3">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}

              <ProgressBar value={project.progress || 0} />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
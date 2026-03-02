import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/axios"

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/client/projects").then(res => setProjects(res.data))
  }, [])

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">My Projects</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div
            key={project._id}
            onClick={() => navigate(`/client/projects/${project._id}`)}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl cursor-pointer hover:bg-white/10 transition"
          >
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-gray-400 text-sm mt-2">
              Status: {project.status}
            </p>

            <ProgressBar value={project.progress || 0} />
          </div>
        ))}
      </div>

    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="mt-4 w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-red-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
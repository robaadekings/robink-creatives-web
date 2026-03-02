import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../utils/axios"

export default function ClientProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)

  useEffect(() => {
    api.get(`/client/projects/${id}`).then(res => setProject(res.data))
  }, [id])

  if (!project) return <div>Loading...</div>

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">{project.name}</h2>

      <p>Status: {project.status}</p>
      <p>Deadline: {project.deadline && new Date(project.deadline).toLocaleDateString()}</p>

      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-400">{project.description}</p>
      </div>

    </div>
  )
}
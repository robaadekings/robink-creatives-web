import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../lib/axios"

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)

  useEffect(() => {
    api.get(`/admin/projects/${id}`).then(res => setProject(res.data))
  }, [id])

  if (!project) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{project.name}</h2>
      <p>Client: {project.clientName}</p>
      <p>Budget: ${project.budget}</p>
      <p>Status: {project.status}</p>
      <p>Progress: {project.progress}%</p>
      <p>Description: {project.description}</p>
    </div>
  )
}
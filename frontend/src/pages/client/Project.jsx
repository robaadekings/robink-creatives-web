import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Plus } from "lucide-react"
import api from "../../utils/axios"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"

export default function ClientProjects() {
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceId: '',
    budget: '',
    deadline: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
    fetchServices()
  }, [])

  const fetchProjects = () => {
    api.get("/client/projects")
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error("Projects error:", err))
      .finally(() => setLoading(false))
  }

  const fetchServices = () => {
    api.get("/services")
      .then(res => setServices(res.data.data || []))
      .catch(err => console.error("Services error:", err))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post("/client/projects", formData)
      setModalOpen(false)
      setFormData({ title: '', description: '', budget: '', deadline: '' })
      fetchProjects()
    } catch (err) {
      console.error("Create project error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-500" size={32} /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Request New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Request New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="serviceId">Service</Label>
                <select
                  id="serviceId"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service._id} value={service._id}>{service.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline (optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-700">
                {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Submit Request'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No projects yet. Request one to get started!</p>
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
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2, MessageSquare, FileText, ArrowLeft, Download, Calendar, DollarSign, Activity } from "lucide-react"
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

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <Loader2 className="animate-spin text-red-500" size={40} />
      <p className="text-gray-400 animate-pulse text-sm">Loading project details...</p>
    </div>
  )

  if (!project) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-gray-400 mb-6">Project details could not be found.</p>
        <button onClick={() => navigate('/client/projects')} className="text-red-500 flex items-center gap-2 mx-auto">
          <ArrowLeft size={18} /> Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/client/projects')}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">{project.title}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          label="Status" 
          value={project.status} 
          icon={<Activity size={16} className="text-blue-400" />} 
          isStatus 
        />
        <StatCard 
          label="Deadline" 
          value={project.deadline ? new Date(project.deadline).toLocaleDateString() : "TBD"} 
          icon={<Calendar size={16} className="text-purple-400" />} 
        />
        <StatCard 
          label="Budget" 
          value={`$${project.budget?.toLocaleString() || "0"}`} 
          icon={<DollarSign size={16} className="text-green-400" />} 
        />
        <div className="col-span-2 lg:col-span-1 bg-white/5 border border-white/10 p-4 rounded-2xl">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-2">Current Progress</p>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">{project.progress || 0}%</span>
            <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-red-600 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Description */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl shadow-xl">
            <h3 className="font-bold text-lg text-white mb-4">Project Overview</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {project.description || "No description provided for this project."}
            </p>
          </div>
        </div>

        {/* Right: Files/Assets */}
        <div className="space-y-6">
          <FileSection title="Project Assets" files={project.assets} color="text-blue-400" />
          <FileSection title="Final Deliverables" files={project.deliverables} color="text-green-400" />
        </div>
      </div>

      {/* Floating Mobile Action Bar / Desktop Actions */}
      <div className="fixed bottom-6 left-0 right-0 px-4 md:relative md:bottom-0 md:px-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/client/projects/${id}/messages`)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/30"
          >
            <MessageSquare size={20} />
            Open Project Chat
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, isStatus }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{label}</p>
      </div>
      <p className={`text-lg font-bold truncate ${isStatus ? 'text-red-400 capitalize' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}

function FileSection({ title, files, color }) {
  if (!files || files.length === 0) return null;
  
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
      <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
        <FileText size={18} className={color} />
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {files.map((file, idx) => (
          <a
            key={idx}
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group overflow-hidden"
          >
            <span className="text-xs text-gray-300 truncate group-hover:text-white break-all pr-2">
              {file.split('/').pop()}
            </span>
            <Download size={14} className="text-red-500 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
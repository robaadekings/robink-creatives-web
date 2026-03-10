import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Save, Bell, Shield, Palette, Loader2, ChevronRight } from "lucide-react"
import api from "../../utils/axios"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("business")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [businessInfo, setBusinessInfo] = useState({
    companyName: "Robink Creatives",
    email: "contact@robinkcreatives.com",
    phone: "+1 (555) 000-0000",
    address: "123 Creative Street, Design City, DC 12345",
    website: "https://robinkcreatives.com",
    description: "Premium creative design and development services"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    messageNotifications: true,
    weeklyReports: false
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60
  })

  const handleBusinessChange = (e) => {
    const { name, value } = e.target
    setBusinessInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveSettings = async (section) => {
    try {
      setSaving(true)
      // await api.patch(`/admin/settings/${section}`, {...})
      setMessage({
        type: "success",
        text: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save settings." })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "business", label: "Business", icon: Settings },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Design", icon: Palette }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 px-1 md:px-0">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Settings size={28} className="text-red-600 md:w-8 md:h-8" />
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">Configure your workspace and global preferences</p>
      </motion.div>

      {/* Responsive Toast Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl ${
              message.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === "success" ? "bg-green-400" : "bg-red-400"}`} />
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Container - Scrollable on mobile */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 sticky top-0 z-10 backdrop-blur-md">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap flex-1 md:flex-none text-xs md:text-sm ${
                isActive 
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "business" && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <InputGroup label="Company Name" name="companyName" value={businessInfo.companyName} onChange={handleBusinessChange} />
                <InputGroup label="Email Address" type="email" name="email" value={businessInfo.email} onChange={handleBusinessChange} />
                <InputGroup label="Phone Number" type="tel" name="phone" value={businessInfo.phone} onChange={handleBusinessChange} />
                <InputGroup label="Website URL" type="url" name="website" value={businessInfo.website} onChange={handleBusinessChange} />
                <div className="md:col-span-2">
                  <InputGroup label="Physical Address" name="address" value={businessInfo.address} onChange={handleBusinessChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 ml-1">Business Description</label>
                  <textarea
                    name="description"
                    value={businessInfo.description}
                    onChange={handleBusinessChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-red-600 outline-none transition text-white text-sm resize-none"
                  />
                </div>
              </div>
              <SaveButton saving={saving} onClick={() => handleSaveSettings("business")} />
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { key: "emailNotifications", label: "Email Notifications", desc: "Critical updates sent to your inbox" },
                { key: "invoiceReminders", label: "Invoice Reminders", desc: "Automated follow-ups for clients" },
                { key: "messageNotifications", label: "Direct Messages", desc: "Instant alerts for new chat activity" },
                { key: "weeklyReports", label: "Weekly Reports", desc: "Summary of business performance" }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition group">
                  <div className="pr-4">
                    <h3 className="text-sm md:text-base font-bold text-white">{item.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(item.key)}
                    className={`relative w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors flex items-center px-1 ${
                      notificationSettings[item.key] ? "bg-red-600" : "bg-white/10"
                    }`}
                  >
                    <motion.div
                      animate={{ x: notificationSettings[item.key] ? (window.innerWidth < 768 ? 24 : 28) : 0 }}
                      className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
              ))}
              <div className="pt-4">
                <SaveButton saving={saving} onClick={() => handleSaveSettings("notifications")} label="Update Alerts" />
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-6 md:p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400 mt-1">Use an authenticator app to protect your login.</p>
                  </div>
                  <button className="px-6 py-2.5 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition text-sm">
                    {securitySettings.twoFactorAuth ? "Manage 2FA" : "Set Up 2FA"}
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-6">Session Preferences</h3>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-medium">Auto Logout Timeout</span>
                      <span className="text-red-500 font-bold">{securitySettings.sessionTimeout} minutes</span>
                    </div>
                    <input
                      type="range" min="15" max="240" step="15"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(p => ({ ...p, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                </div>
              </div>
              <SaveButton saving={saving} onClick={() => handleSaveSettings("security")} label="Secure Settings" />
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Dark", "Light", "System"].map(mode => (
                  <button key={mode} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-600/50 transition text-center group">
                    <div className={`w-12 h-12 mx-auto rounded-full mb-3 flex items-center justify-center ${mode === 'Dark' ? 'bg-black border border-white/20' : 'bg-white text-black'}`}>
                      <Palette size={20} />
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-red-500">{mode} Mode</span>
                  </button>
                ))}
              </div>
              
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl">
                <h3 className="text-lg font-bold text-white mb-6">Brand Identity</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { n: "Primary", c: "#8B1C24" },
                    { n: "Accent", c: "#A67C2D" },
                    { n: "Surface", c: "#1A1A1A" },
                    { n: "Text", c: "#FFFFFF" }
                  ].map(color => (
                    <div key={color.n} className="p-3 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: color.c }} />
                      <span className="text-xs font-bold text-gray-400">{color.n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <SaveButton saving={saving} onClick={() => handleSaveSettings("appearance")} label="Update Design" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Sub-components for cleaner responsive code
const InputGroup = ({ label, type = "text", ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2 ml-1 tracking-wider">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition text-white text-sm"
      {...props}
    />
  </div>
)

const SaveButton = ({ saving, onClick, label = "Save Changes" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={saving}
    className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-2xl transition disabled:opacity-50 text-sm"
  >
    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
    {saving ? "Processing..." : label}
  </motion.button>
)
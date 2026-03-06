import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Bell, Shield, Palette, Loader2 } from "lucide-react"
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
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSaveSettings = async (section) => {
    try {
      setSaving(true)
      // This would typically call an API endpoint
      // await api.patch(`/admin/settings/${section}`, {...})
      
      setMessage({
        type: "success",
        text: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`
      })

      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to save settings. Please try again."
      })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: "business", label: "Business Info", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette }
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings size={32} className="text-red-600" />
          Settings
        </h1>
        <p className="text-gray-400">Manage your admin preferences and business information</p>
      </motion.div>

      {/* Success/Error Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/20 border-green-500/40 text-green-400"
              : "bg-red-500/20 border-red-500/40 text-red-400"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current"></div>
          {message.text}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition flex-1 md:flex-none ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="hidden md:inline">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* Business Info Tab */}
        {activeTab === "business" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-amber-100 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={businessInfo.companyName}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-100 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={businessInfo.email}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-100 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={businessInfo.phone}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-100 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={businessInfo.website}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-amber-100 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={businessInfo.address}
                  onChange={handleBusinessChange}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-amber-100 mb-2">Business Description</label>
                <textarea
                  name="description"
                  value={businessInfo.description}
                  onChange={handleBusinessChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-red-900/30 focus:border-red-600 focus:outline-none transition text-white placeholder-gray-500 resize-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSaveSettings("business")}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-4">
              {[
                { key: "emailNotifications", label: "Email Notifications", description: "Receive email updates for important events" },
                { key: "invoiceReminders", label: "Invoice Reminders", description: "Get reminded about pending invoices" },
                { key: "messageNotifications", label: "Message Notifications", description: "Be notified when new messages arrive" },
                { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly business reports" }
              ].map(setting => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl hover:bg-black/30 transition"
                >
                  <div>
                    <h3 className="font-semibold text-white">{setting.label}</h3>
                    <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNotificationChange(setting.key)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      notificationSettings[setting.key]
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={{
                        x: notificationSettings[setting.key] ? 24 : 4
                      }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full"
                    />
                  </motion.button>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSaveSettings("notifications")}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Preferences
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-6">
              <div className="p-6 bg-black/20 border border-white/10 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-400 mb-4">Add an extra layer of security to your account</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    securitySettings.twoFactorAuth
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {securitySettings.twoFactorAuth ? "Disable 2FA" : "Enable 2FA"}
                </motion.button>
              </div>

              <div className="p-6 bg-black/20 border border-white/10 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-2">Session Timeout</h3>
                <p className="text-gray-400 mb-4">Automatically log out after inactive time</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      sessionTimeout: parseInt(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-white font-semibold min-w-[60px]">
                    {securitySettings.sessionTimeout} min
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSaveSettings("security")}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Security Settings
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-6">
              <div className="p-6 bg-black/20 border border-white/10 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Theme</h3>
                <div className="flex gap-4">
                  {["Dark", "Light", "Auto"].map(theme => (
                    <motion.button
                      key={theme}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg font-semibold transition bg-red-600 text-white"
                    >
                      {theme}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-black/20 border border-white/10 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Brand Colors</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Primary Red", color: "#8B1C24" },
                    { name: "Gold", color: "#A67C2D" },
                    { name: "Dark", color: "#1A1A1A" }
                  ].map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-white/20"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white font-semibold">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSaveSettings("appearance")}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Preferences
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

    </div>
  )
}
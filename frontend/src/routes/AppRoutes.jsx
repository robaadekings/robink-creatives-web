import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import PublicLayout from "../layouts/PublicLayout"
import Landing from "../pages/public/Landing"
import Services from "../pages/public/Services"
import Portfolio from "../pages/public/Portfolio"
import Contact from "../pages/public/Contact"

import Login from "../pages/portal/Login"
import Register from "../pages/portal/Register"

import AdminLayout from "../layouts/AdminLayout"
import ClientLayout from "../layouts/ClientLayout"

import AdminDashboard from "../pages/admin/Dashboard"
import AdminProjects from "../pages/admin/AdminProjects"
import AdminClients from "../pages/admin/AdminClients"
import AdminInvoices from "../pages/admin/AdminInvoices"
import AdminQuotes from "../pages/admin/AdminQuotes"
import AdminSettings from "../pages/admin/AdminSettings"
import ProjectDetail from "../pages/admin/ProjectDetail"

import ClientDashboard from "../pages/client/Dashboard"

import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        </Route>

        {/* AUTH */}
        <Route path="/portal/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/portal/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "superadmin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          <Route path="projects" element={<PageWrapper><AdminProjects /></PageWrapper>} />
          <Route path="projects/:id" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
          <Route path="clients" element={<PageWrapper><AdminClients /></PageWrapper>} />
          <Route path="invoices" element={<PageWrapper><AdminInvoices /></PageWrapper>} />
          <Route path="quotes" element={<PageWrapper><AdminQuotes /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />

        </Route>

        {/* CLIENT */}
        <Route
          path="/client"
          element={
            <ProtectedRoute roles={["client"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PageWrapper><ClientDashboard /></PageWrapper>} />
        </Route>

      </Routes>
    </AnimatePresence>
  )
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
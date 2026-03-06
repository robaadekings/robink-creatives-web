import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import PublicLayout from "../layouts/PublicLayout"
import Landing from "../pages/public/Landing"
import Services from "../pages/public/Services"
import Portfolio from "../pages/public/Portfolio"
import Contact from "../pages/public/Contact"
import About from "../pages/public/About"
import QuoteRequest from "../pages/public/QuoteRequest"

import Login from "../pages/portal/Login"
import Register from "../pages/portal/Register"
import ForgotPassword from "../pages/portal/ForgotPassword"

import AdminLayout from "../layouts/AdminLayout"
import ClientLayout from "../layouts/ClientLayout"

import AdminDashboard from "../pages/admin/Dashboard"
import AdminProjects from "../pages/admin/AdminProjects"
import AdminClients from "../pages/admin/AdminClients"
import AdminInvoices from "../pages/admin/AdminInvoices"
import AdminQuotes from "../pages/admin/AdminQuotes"
import AdminSettings from "../pages/admin/AdminSettings"
import AdminMessages from "../pages/admin/AdminMessages"
import ProjectDetail from "../pages/admin/ProjectDetail"

import ClientDashboard from "../pages/client/Dashboard"
import ClientProjects from "../pages/client/Project"
import ClientProjectDetail from "../pages/client/ProjectDetail"
import ClientInvoices from "../pages/client/Invoice"
import ClientQuotes from "../pages/client/Quotes"
import ClientFiles from "../pages/client/Files"
import ClientMessages from "../pages/client/Message"

import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ================= PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/quote" element={<PageWrapper><QuoteRequest /></PageWrapper>} />
        </Route>

        {/* ================= AUTH ================= */}
        <Route path="/portal/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/portal/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/portal/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />

        {/* ================= ADMIN ================= */}
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
          <Route path="messages" element={<PageWrapper><AdminMessages /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />
        </Route>

        {/* ================= CLIENT ================= */}
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
          <Route path="projects" element={<PageWrapper><ClientProjects /></PageWrapper>} />
          <Route path="projects/:id" element={<PageWrapper><ClientProjectDetail /></PageWrapper>} />
          <Route path="projects/:projectId/messages" element={<PageWrapper><ClientMessages /></PageWrapper>} />
          <Route path="invoices" element={<PageWrapper><ClientInvoices /></PageWrapper>} />
          <Route path="quotes" element={<PageWrapper><ClientQuotes /></PageWrapper>} />
          <Route path="files" element={<PageWrapper><ClientFiles /></PageWrapper>} />
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
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import PublicLayout from "../layouts/PublicLayout"
import Landing from "../pages/public/Landing"
import Services from "../pages/public/Services"
import Portfolio from "../pages/public/Portfolio"
import Contact from "../pages/public/Contact"

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={
              <PageWrapper>
                <Landing />
              </PageWrapper>
            }
          />

          <Route
            path="/services"
            element={
              <PageWrapper>
                <Services />
              </PageWrapper>
            }
          />
          <Route
  path="portfolio"
  element={
    <PageWrapper>
      <Portfolio />
    </PageWrapper>
  }
/>
<Route
  path="/contact"
  element={
    <PageWrapper>
      <Contact />
    </PageWrapper>
  }
/>
        
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
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
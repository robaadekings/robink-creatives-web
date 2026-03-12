import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, Facebook, Linkedin, Github, MessageCircle, ChevronUp } from "lucide-react"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
      setShowBackToTop(scrollTop > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-[#0a0e14] text-slate-200 font-sans antialiased">
      
      {/* NAVBAR */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
          ? "py-3 bg-[#0a0e14]/80 backdrop-blur-md border-b border-white/5 shadow-sm" 
          : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="transition-transform active:scale-95">
            <img src={logo} alt="Robink" className="h-8 md:h-10 object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-semibold text-white transition-all duration-200"
            >
              Client Portal
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 md:hidden bg-[#0a0e14] transition-all duration-300 z-40 ${
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-xl font-medium hover:text-red-500"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="bg-[#070a0f] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            
            {/* Brand and Socials */}
            <div className="space-y-6">
              <img src={logo} alt="Robink" className="h-8 object-contain" />
              <div className="flex gap-4">
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Get in Touch</h4>
              <div className="text-gray-400 text-sm space-y-1">
                <p>info@robinkcreatives.com</p>
                <p>+254 769 505 060</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Links</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center md:text-left">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Robink Creatives. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={scrollToTop}
          className={`p-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full transition-all duration-300 hover:bg-white/10 ${
            showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronUp size={20} />
        </button>

        <a 
          href="https://wa.me/254769505060" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} />
        </a>
      </div>
    </div>
  )
}

function NavItem({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-red-500' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { Menu, X, Facebook, Linkedin, Github, MessageCircle, ChevronUp } from "lucide-react"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setScrollProgress(progress)
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
    <div className="dark min-h-screen flex flex-col bg-[#0a0e14] text-white overflow-x-hidden relative selection:bg-red-500/30 font-sans">
      
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-red-600 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* NAVBAR */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || mobileOpen
          ? "py-3 bg-[#0a0e14] border-b border-white/5 shadow-xl" 
          : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="relative group transition-transform active:scale-95">
            <img src={logo} alt="Robink Creatives" className="h-10 sm:h-12 md:h-14 lg:h-16 object-contain relative" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/portfolio">Portfolio</NavItem>
            <NavItem to="/contact">Contact</NavItem>

            <Link
              to="/portal/login"
              className="ml-4 group relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full font-bold text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Client Portal
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors z-[60]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div 
          className={`fixed inset-0 md:hidden bg-[#0a0e14] transition-all duration-500 ease-in-out z-50 ${
            mobileOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-2xl font-bold hover:text-red-500 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              to="/portal/login"
              className="mt-4 w-full max-w-xs text-center bg-red-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-600/20"
              onClick={() => setMobileOpen(false)}
            >
              Client Login
            </Link>
          </div>
        </div>
      </header>

      <div className="h-20 md:h-28" />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        <Outlet />
      </main>

      {/* PREMIUM FOOTER */}
      <footer className="relative z-20 bg-[#070a0f] border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            
            {/* Column 1: Brand & Identity */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <img src={logo} alt="Robink Creatives" className="h-10 md:h-12 object-contain" />
              <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left max-w-xs">
                Elevating digital experiences through innovative design and strategic creativity.
              </p>
              <div className="flex gap-3">
                <SocialIcon icon={<Linkedin size={18} />} href="https://linkedin.com/company/robink-creatives" bg="bg-white/5 hover:bg-[#0A66C2]" />
                <SocialIcon icon={<Facebook size={18} />} href="https://facebook.com/robinkcreatives" bg="bg-white/5 hover:bg-[#1877F2]" />
                <SocialIcon icon={<Github size={18} />} href="https://github.com/robinkcreatives" bg="bg-white/5 hover:bg-gray-800" />
              </div>
            </div>

            {/* Column 2: Quick Links (Desktop Only) */}
            <div className="hidden md:flex flex-col items-center">
              <div className="text-left">
                <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Links</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
                  <li><Link to="/about" className="hover:text-red-500 transition-colors">About</Link></li>
                  <li><Link to="/services" className="hover:text-red-500 transition-colors">Services</Link></li>
                  <li><Link to="/portfolio" className="hover:text-red-500 transition-colors">Portfolio</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Contact Details */}
            <div className="flex flex-col items-center md:items-end">
              <div className="text-center md:text-right">
                <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-[10px]">Get in Touch</h4>
                <div className="space-y-4 text-sm text-gray-400">
                  <a href="mailto:info@robinkcreatives.com" className="block text-white hover:text-red-500 transition-colors">
                    info@robinkcreatives.com
                  </a>
                  <p className="hover:text-white transition-colors cursor-default">+254 769 505 060</p>
                  <p className="hover:text-white transition-colors cursor-default">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-[10px] sm:text-xs tracking-wider">
              © {new Date().getFullYear()} ROBINK CREATIVES. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-widest">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ACTION BUTTONS GROUP */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col gap-3">
        <button
          onClick={scrollToTop}
          className={`p-3 sm:p-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full shadow-2xl transition-all duration-500 hover:bg-white/20 hover:scale-110 active:scale-95 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
          aria-label="Back to Top"
        >
          <ChevronUp size={24} className="sm:w-7 sm:h-7" />
        </button>

        <a 
          href="https://wa.me/254769505060" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group relative"
        >
          <span className="absolute right-full mr-3 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block whitespace-nowrap pointer-events-none shadow-xl">
            Chat with us!
          </span>
          <MessageCircle size={24} className="sm:w-7 sm:h-7" />
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
      className={`relative px-4 py-2 rounded-full transition-all duration-300 font-medium ${
        isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

function SocialIcon({ icon, href, bg }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-2.5 rounded-xl text-white transition-all duration-300 shadow-lg flex items-center justify-center border border-white/5 ${bg}`}
    >
      {icon}
    </a>
  )
}
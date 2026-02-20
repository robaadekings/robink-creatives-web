import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import logo from "../assets/robink-logo.png"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-200 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Robink Creatives"
              className="h-30 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-lg font-medium">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
 
          {/* CTA */}
          <Button className="bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-white px-6">
            Client Portal
          </Button>

        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Robink Creatives. All rights reserved.
        </div>
      </footer>

    </div>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative group text-neutral-700 hover:text-[var(--brand-red)] transition"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[var(--brand-red)] transition-all group-hover:w-full"></span>
    </Link>
  )
}
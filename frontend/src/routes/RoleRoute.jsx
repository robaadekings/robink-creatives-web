import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RoleRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />
  }

  // Check role if specified
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
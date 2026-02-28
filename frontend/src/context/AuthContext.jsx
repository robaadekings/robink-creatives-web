import { createContext, useContext, useEffect, useState } from "react"
import api from "../utils/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get("/auth/me")
        setUser(data.data)
      } catch (err) {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token])

  const login = (token, userData) => {
    localStorage.setItem("token", token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/portal/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
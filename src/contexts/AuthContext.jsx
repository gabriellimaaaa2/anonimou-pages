import { createContext, useContext, useState, useEffect } from 'react'
import mockApi from '../services/mockApi'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar se usuário está logado ao carregar a aplicação
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await mockApi.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      // Usuário não está logado
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await mockApi.login(email, password)
      setUser(response.user)
      
      return { success: true, user: response.user }
    } catch (error) {
      const errorMessage = error.message || 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await mockApi.register(userData)
      
      return { success: true, message: response.message }
    } catch (error) {
      const errorMessage = error.message || 'Erro ao criar conta'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await mockApi.logout()
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const updateUser = (updatedUser) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUser }))
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

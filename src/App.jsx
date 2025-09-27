import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Inbox from './components/Inbox'
import PublicPage from './components/PublicPage'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  return (
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <AuthProvider>
        <Router basename="/anonimou-pages">
          <Routes>
            {/* Página inicial */}
            <Route path="/" element={<Home />} />
            
            {/* Autenticação */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard do usuário */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Páginas públicas - deve ser a última rota */}
            <Route path="/:slug" element={<PublicPage />} />
            
            {/* Redirect para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App

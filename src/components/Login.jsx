import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, ArrowLeft, AlertCircle, User, Lock } from 'lucide-react'

const Login = () => {
  const { user, login, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Limpar erro quando componente monta
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro quando usuário começar a digitar
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Erro no login:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoCredentials = (type) => {
    if (type === 'demo') {
      setFormData({
        email: 'demo@anonimou.test',
        password: 'Demo!12345'
      })
    } else if (type === 'premium') {
      setFormData({
        email: 'premium@anonimou.test',
        password: 'Premium!12345'
      })
    }
    clearError()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-3xl font-bold text-white">Anônimou</span>
          </div>
          
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            🧪 Versão Demo - GitHub Pages
          </Badge>
        </div>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Entrar na sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Acesse seu dashboard e veja suas mensagens anônimas
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-300 font-semibold mb-3">Contas Demo Disponíveis:</h4>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('demo')}
                  className="w-full text-left justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Usuário Demo (Gratuito)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('premium')}
                  className="w-full text-left justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Usuário Premium
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isSubmitting || loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/register" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Não tem uma conta? Criar conta
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="#" 
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info sobre demo */}
        <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h4 className="text-white font-semibold mb-2">ℹ️ Sobre esta demo:</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Dados salvos no localStorage do navegador</li>
            <li>• Funcionalidades completas simuladas</li>
            <li>• Geração real de imagens para Stories</li>
            <li>• Pronto para migração para backend real</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login

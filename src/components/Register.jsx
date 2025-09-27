import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  User,
  Mail,
  Lock,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'

const Register = () => {
  const { user, register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    slug: '',
    dob: '',
    acceptTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  })
  const [slugAvailable, setSlugAvailable] = useState(null)
  const [success, setSuccess] = useState('')

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

  // Validar força da senha
  useEffect(() => {
    const password = formData.password
    setPasswordStrength({
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?\":{}|<>]/.test(password)
    })
  }, [formData.password])

  // Gerar slug automaticamente baseado no nome
  useEffect(() => {
    if (formData.displayName) {
      const generatedSlug = formData.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20)
      
      if (!formData.slug || formData.slug === generatedSlug) {
        setFormData(prev => ({ ...prev, slug: generatedSlug }))
      }
    }
  }, [formData.displayName])

  // Verificar disponibilidade do slug (simulado)
  useEffect(() => {
    if (formData.slug && formData.slug.length >= 3) {
      const timer = setTimeout(() => {
        // Simular verificação - slugs 'admin', 'api', 'www' não disponíveis
        const unavailableSlug = ['admin', 'api', 'www', 'demo', 'premium'].includes(formData.slug)
        setSlugAvailable(!unavailableSlug)
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      setSlugAvailable(null)
    }
  }, [formData.slug])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpar mensagens quando usuário começar a digitar
    if (error) clearError()
    if (success) setSuccess('')
  }

  const validateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16
    }
    
    return age >= 16
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações
    if (!formData.email || !formData.password || !formData.displayName || !formData.slug || !formData.dob) {
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      clearError()
      return
    }
    
    if (!Object.values(passwordStrength).every(Boolean)) {
      return
    }
    
    if (!validateAge(formData.dob)) {
      return
    }
    
    if (!formData.acceptTerms) {
      return
    }
    
    if (slugAvailable === false) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await register(formData)
      
      if (result.success) {
        setSuccess('Conta criada com sucesso! Você pode fazer login agora.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      console.error('Erro no registro:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPasswordValid = Object.values(passwordStrength).every(Boolean)
  const isFormValid = formData.email && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.displayName && 
                     formData.slug && 
                     formData.dob && 
                     formData.acceptTerms &&
                     isPasswordValid &&
                     formData.password === formData.confirmPassword &&
                     validateAge(formData.dob) &&
                     slugAvailable === true

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
            <CardTitle className="text-2xl text-white">Criar sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Comece a receber mensagens anônimas agora mesmo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
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

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Nome de exibição
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Como você quer ser chamado"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-white flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Seu link personalizado
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                    anonimou.me/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="seulink"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-l-none"
                    pattern="[a-z0-9]+"
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </div>
                {formData.slug && (
                  <div className="text-sm">
                    {slugAvailable === true && (
                      <span className="text-green-400 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Link disponível!
                      </span>
                    )}
                    {slugAvailable === false && (
                      <span className="text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Link não disponível
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Data de nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-white flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Data de nascimento
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                  required
                />
                {formData.dob && !validateAge(formData.dob) && (
                  <span className="text-red-400 text-sm">
                    Você deve ter pelo menos 16 anos
                  </span>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Sua senha segura"
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
                
                {/* Indicadores de força da senha */}
                {formData.password && (
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center ${passwordStrength.length ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordStrength.length ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      Pelo menos 10 caracteres
                    </div>
                    <div className={`flex items-center ${passwordStrength.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordStrength.uppercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      Uma letra maiúscula
                    </div>
                    <div className={`flex items-center ${passwordStrength.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordStrength.lowercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      Uma letra minúscula
                    </div>
                    <div className={`flex items-center ${passwordStrength.number ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordStrength.number ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      Um número
                    </div>
                    <div className={`flex items-center ${passwordStrength.symbol ? 'text-green-400' : 'text-red-400'}`}>
                      {passwordStrength.symbol ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      Um símbolo (!@#$%^&*)
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Digite a senha novamente"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="text-red-400 text-sm">
                    As senhas não coincidem
                  </span>
                )}
              </div>

              {/* Termos */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked }))}
                  className="border-gray-600"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-gray-300">
                  Eu aceito os{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300">
                    termos de uso
                  </Link>
                  {' '}e{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300">
                    política de privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
              >
                {isSubmitting || loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Já tem uma conta? Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info sobre demo */}
        <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h4 className="text-white font-semibold mb-2">ℹ️ Sobre esta demo:</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Conta criada será salva localmente</li>
            <li>• Todas as validações funcionam normalmente</li>
            <li>• Dados persistem entre sessões</li>
            <li>• Pronto para backend real</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register

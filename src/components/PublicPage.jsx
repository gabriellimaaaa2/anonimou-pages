import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageCircle, 
  Send, 
  Shield, 
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react'
import mockApi from '../services/mockApi'

const PublicPage = () => {
  const { slug } = useParams()
  const [userProfile, setUserProfile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUserProfile()
  }, [slug])

  const loadUserProfile = async () => {
    try {
      const response = await mockApi.getUserProfile(slug)
      setUserProfile(response)
    } catch (error) {
      setError('Usuário não encontrado')
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      return
    }

    setSending(true)
    setResult(null)
    setError(null)

    try {
      const response = await mockApi.sendMessage(slug, message.trim())
      setResult(response)
      setMessage('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (error && !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-700 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
              Usuário não encontrado
            </CardTitle>
            <CardDescription className="text-gray-400">
              O link que você está tentando acessar não existe ou foi removido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">Anônimou</span>
            </Link>
            
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Página Pública
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* User Profile */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">
                {userProfile?.displayName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {userProfile?.displayName}
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              Mande uma mensagem anônima para mim!
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {userProfile?.stats?.messagesCount || 0}
                </div>
                <div className="text-gray-400 text-sm">Mensagens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">100%</div>
                <div className="text-gray-400 text-sm">Anônimo</div>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Mensagem Anônima
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sua mensagem será completamente anônima. Seja respeitoso!
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {result && (
                <Alert className={`mb-6 ${
                  result.status === 'queued' 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-red-500/50 bg-red-500/10'
                }`}>
                  {result.status === 'queued' ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  <AlertDescription className={
                    result.status === 'queued' ? 'text-green-300' : 'text-red-300'
                  }>
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem anônima aqui... (máximo 500 caracteres)"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 min-h-32"
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-sm text-gray-400 mt-1">
                    {message.length}/500 caracteres
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!message.trim() || sending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {sending ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem Anônima
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Sua Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Sua mensagem é completamente anônima</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Não coletamos informações pessoais</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Sistema de moderação automática</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>Limite de 5 mensagens por hora</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Account CTA */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Quer receber mensagens também?
              </CardTitle>
              <CardDescription className="text-gray-300">
                Crie sua conta gratuita e comece a receber mensagens anônimas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/register">
                <Button className="bg-white text-purple-900 hover:bg-gray-100 font-semibold">
                  <Users className="w-4 h-4 mr-2" />
                  Criar Minha Conta Grátis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">🧪 Versão Demo - GitHub Pages</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Esta é uma demonstração funcional</li>
              <li>• Mensagens são salvas localmente</li>
              <li>• Rate limiting e moderação funcionam</li>
              <li>• Pronto para backend real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicPage

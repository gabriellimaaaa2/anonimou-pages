import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageCircle, 
  Users, 
  Share2, 
  Download, 
  Instagram,
  Copy,
  ExternalLink,
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react'
import mockApi from '../services/mockApi'
import { generateStoryImage, downloadStoryImage, shareToInstagram } from '../services/storyGenerator'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generatingStory, setGeneratingStory] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadDashboard()
  }, [user, navigate])

  const loadDashboard = async () => {
    try {
      const response = await mockApi.getDashboard()
      setStats(response.stats)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const copyLink = async () => {
    const link = `${window.location.origin}/anonimou-pages/${user.slug}`
    try {
      await navigator.clipboard.writeText(link)
      alert('Link copiado!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  const generateLinkStory = async () => {
    setGeneratingStory(true)
    try {
      const blob = await generateStoryImage('link', {})
      shareToInstagram(blob)
    } catch (error) {
      console.error('Erro ao gerar story:', error)
      alert('Erro ao gerar imagem para story')
    } finally {
      setGeneratingStory(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-white">Anônimou</span>
              </Link>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-300">Olá, {user?.displayName}</span>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Bem-vindo, {user?.displayName}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Seu link personalizado: <code className="bg-gray-800 px-2 py-1 rounded text-purple-300">
                anonimou.me/{user?.slug}
              </code>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Total de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats?.messagesCount || 0}</div>
                <p className="text-gray-400 text-sm">Todas as mensagens recebidas</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats?.todayMessages || 0}</div>
                <p className="text-gray-400 text-sm">Mensagens recebidas hoje</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Reveals Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {user?.planType === 'free' ? '0' : '∞'}
                </div>
                <p className="text-gray-400 text-sm">
                  {user?.planType === 'free' ? 'Plano gratuito' : 'Plano premium'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar seu Link
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Divulgue seu link para começar a receber mensagens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Button onClick={copyLink} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </Button>
                  <Button 
                    onClick={generateLinkStory}
                    disabled={generatingStory}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    {generatingStory ? 'Gerando...' : 'Story Instagram'}
                  </Button>
                </div>
                <Button 
                  onClick={() => window.open(`/anonimou-pages/${user.slug}`, '_blank')}
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visualizar Página Pública
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Suas Mensagens
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Veja e responda suas mensagens anônimas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/inbox')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ver Caixa de Entrada ({stats?.messagesCount || 0})
                </Button>
                <div className="text-sm text-gray-400">
                  {stats?.messagesCount > 0 ? 
                    'Você tem mensagens para ler!' : 
                    'Nenhuma mensagem ainda. Compartilhe seu link!'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Info */}
          {user?.planType === 'free' && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-300">
                <strong>Plano Gratuito:</strong> Você está no plano gratuito. 
                Faça upgrade para Premium (R$ 24,99/mês) e tenha reveals ilimitados, 
                templates premium e muito mais!
                <Button className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-black">
                  Fazer Upgrade
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Demo Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">🧪 Versão Demo - GitHub Pages</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Todas as funcionalidades estão simuladas</li>
              <li>• Dados salvos no localStorage do navegador</li>
              <li>• Geração de imagens para Stories funciona normalmente</li>
              <li>• Pronto para migração para backend real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

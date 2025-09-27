import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MessageCircle, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Settings,
  BarChart3,
  ArrowLeft
} from 'lucide-react'

const AdminPanel = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalMessages: 8932,
    totalPayments: 156
  })

  useEffect(() => {
    // Simular verificação de admin (simplificado para demo)
    if (!user || !user.email.includes('admin')) {
      navigate('/dashboard')
      return
    }
  }, [user, navigate])

  useEffect(() => {
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 2),
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        totalPayments: prev.totalPayments + Math.floor(Math.random() * 1)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-white">Admin Panel</span>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Acesso Administrativo
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Estatísticas Gerais */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-green-400 text-sm">+12 hoje</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Total de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalMessages.toLocaleString()}</div>
                <p className="text-green-400 text-sm">+47 hoje</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total de Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalPayments.toLocaleString()}</div>
                <p className="text-green-400 text-sm">R$ 2.340 hoje</p>
              </CardContent>
            </Card>
          </div>

          {/* Ações Administrativas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-700 hover:border-blue-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualizar, banir e gerenciar contas de usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-yellow-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Moderação
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Revisar mensagens reportadas e aplicar moderação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-green-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pagamentos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualizar transações e gerenciar reembolsos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-purple-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analytics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Relatórios detalhados e métricas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-red-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Logs de Auditoria
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visualizar logs de ações administrativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-400 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configurações
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configurações gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Notificações */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Alertas do Sistema</CardTitle>
              <CardDescription className="text-gray-400">
                Notificações importantes que requerem atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-semibold">Mensagens Pendentes</p>
                    <p className="text-gray-400 text-sm">5 mensagens aguardando moderação manual</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-semibold">Sistema Funcionando</p>
                    <p className="text-gray-400 text-sm">Todos os serviços estão operacionais</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Receita do Dia</p>
                    <p className="text-gray-400 text-sm">R$ 2.340,00 em pagamentos processados hoje</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">🧪 Admin Panel Demo</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Estatísticas simuladas com atualizações em tempo real</li>
              <li>• Interface completa de administração</li>
              <li>• Todas as funcionalidades prontas para implementação</li>
              <li>• Acesso restrito por email (admin@anonimou.test)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

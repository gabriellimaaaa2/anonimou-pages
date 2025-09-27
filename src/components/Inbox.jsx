import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  MessageCircle, 
  ArrowLeft, 
  Reply, 
  MapPin, 
  Trash2,
  Instagram,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react'
import mockApi from '../services/mockApi'
import { generateStoryImage, shareToInstagram } from '../services/storyGenerator'

const Inbox = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [response, setResponse] = useState('')
  const [generatingStory, setGeneratingStory] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadMessages()
  }, [user, navigate])

  const loadMessages = async () => {
    try {
      const response = await mockApi.getInbox()
      setMessages(response.messages)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (messageId) => {
    if (!confirm('Tem certeza que deseja deletar esta mensagem?')) {
      return
    }

    try {
      await mockApi.deleteMessage(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      alert('Erro ao deletar mensagem')
    }
  }

  const handleReveal = async (messageId) => {
    try {
      const response = await mockApi.initiateReveal(messageId)
      
      if (response.requiresPayment) {
        if (confirm(`Revelar localização custa R$ ${response.price.toFixed(2)}. Continuar?`)) {
          // Simular pagamento
          await mockApi.createPayment({ type: 'reveal', messageId, amount_cents: response.priceCents })
          const revealData = await mockApi.getReveal(messageId)
          alert(`Localização revelada: ${revealData.city}, ${revealData.region} (${revealData.confidence}% de confiança)`)
        }
      } else {
        alert(`Localização: ${response.city}, ${response.region} (${response.confidence}% de confiança)`)
      }
    } catch (error) {
      console.error('Erro ao revelar localização:', error)
      alert('Erro ao revelar localização')
    }
  }

  const handleResponseSubmit = async () => {
    if (!response.trim() || !selectedMessage) return

    setGeneratingStory(true)
    try {
      const blob = await generateStoryImage('response', {
        message: selectedMessage.text,
        response: response.trim()
      })
      
      shareToInstagram(blob)
      setResponse('')
      setSelectedMessage(null)
    } catch (error) {
      console.error('Erro ao gerar story de resposta:', error)
      alert('Erro ao gerar story de resposta')
    } finally {
      setGeneratingStory(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Agora há pouco'
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    return date.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando mensagens...</div>
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
              <Link to="/dashboard" className="flex items-center text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">Caixa de Entrada</span>
              </div>
            </div>
            
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {messages.length} mensagens
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhuma mensagem ainda
                </h3>
                <p className="text-gray-400 mb-6">
                  Compartilhe seu link para começar a receber mensagens anônimas!
                </p>
                <Link to="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {message.isSystemMessage && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Sistema
                            </Badge>
                          )}
                          {message.vpnFlag && (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              VPN
                            </Badge>
                          )}
                          {message.moderationStatus === 'blocked' && (
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Bloqueada
                            </Badge>
                          )}
                          {message.moderationStatus === 'approved' && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Aprovada
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-lg leading-relaxed">
                          {message.text}
                        </CardTitle>
                        <CardDescription className="text-gray-400 flex items-center mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(message.createdAt)}
                          {message.geoCity && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="w-4 h-4 mr-1" />
                              {message.geoCity}, {message.geoRegion}
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {!message.isSystemMessage && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Reply className="w-4 h-4 mr-2" />
                                Responder Publicamente
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-gray-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Responder Publicamente</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Sua resposta será transformada em um story para Instagram
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                  <p className="text-gray-300 text-sm mb-1">Mensagem original:</p>
                                  <p className="text-white">"{selectedMessage?.text}"</p>
                                </div>
                                <Textarea
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  placeholder="Digite sua resposta..."
                                  className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Button 
                                  onClick={handleResponseSubmit}
                                  disabled={!response.trim() || generatingStory}
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                  <Instagram className="w-4 h-4 mr-2" />
                                  {generatingStory ? 'Gerando Story...' : 'Gerar Story de Resposta'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                            onClick={() => handleReveal(message.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Revelar Localização
                            {user?.planType === 'free' && (
                              <span className="ml-1 text-yellow-400">(R$ 5,00)</span>
                            )}
                          </Button>
                        </>
                      )}

                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Demo Info */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">🧪 Funcionalidades da Demo</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Resposta pública gera story real para Instagram</li>
              <li>• Reveal de localização funciona (simulado para usuários free)</li>
              <li>• Moderação automática detecta conteúdo inadequado</li>
              <li>• Todas as ações são persistidas no localStorage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inbox

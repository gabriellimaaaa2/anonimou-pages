import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Shield, 
  MapPin, 
  Instagram, 
  Star,
  Users,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalMessages: 8932,
    totalReveals: 456
  })

  useEffect(() => {
    // Simular atualizações em tempo real das estatísticas
    const interval = setInterval(() => {
      setStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
        totalReveals: prev.totalReveals + Math.floor(Math.random() * 2)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const features = [
    {
      icon: MessageCircle,
      title: 'Mensagens Anônimas',
      description: 'Receba mensagens completamente anônimas através do seu link personalizado'
    },
    {
      icon: Shield,
      title: 'Moderação Automática',
      description: 'Sistema inteligente de moderação que filtra conteúdo inadequado automaticamente'
    },
    {
      icon: MapPin,
      title: 'Reveals de Localização',
      description: 'Descubra a cidade aproximada de quem enviou a mensagem por apenas R$ 5,00'
    },
    {
      icon: Instagram,
      title: 'Integração Instagram',
      description: 'Compartilhe respostas diretamente nos Stories com templates personalizados'
    }
  ]

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'Mensagens anônimas ilimitadas',
        'Moderação automática',
        'Link personalizado',
        'Compartilhamento básico'
      ],
      buttonText: 'Começar Grátis',
      popular: false
    },
    {
      name: 'Premium',
      price: 'R$ 24,99',
      period: '/mês',
      description: 'Para quem quer mais recursos',
      features: [
        'Tudo do plano gratuito',
        'Reveals ilimitados',
        'Templates premium',
        'Analytics avançados',
        'Suporte prioritário'
      ],
      buttonText: 'Assinar Premium',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-2xl font-bold text-white">Anônimou</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">Olá, {user.displayName}</span>
                  <Button onClick={() => navigate('/dashboard')} className="bg-purple-600 hover:bg-purple-700">
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:bg-gray-800">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              🚀 Versão Demo - GitHub Pages
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Receba Mensagens
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}Anônimas
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubra o que as pessoas realmente pensam sobre você. 
              Crie seu link personalizado e comece a receber mensagens anônimas agora mesmo!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg"
                >
                  Ver Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-gray-400">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">{stats.totalMessages.toLocaleString()}</div>
                <div className="text-gray-400">Mensagens Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.totalReveals.toLocaleString()}</div>
                <div className="text-gray-400">Localizações Reveladas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Anônimou?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A plataforma mais completa e segura para mensagens anônimas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-300">
              Comece grátis e evolua quando precisar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-purple-900/50 to-gray-800/50 border-purple-500' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    <span className="text-lg text-gray-400">{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-300">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleGetStarted}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para descobrir o que pensam sobre você?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de pessoas que já estão usando o Anônimou
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Criar Minha Conta Grátis
              <Heart className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-2xl font-bold text-white">Anônimou</span>
            </div>
            <p className="text-gray-400 mb-4">
              A plataforma mais segura para mensagens anônimas
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">
                © 2024 Anônimou. Todos os direitos reservados.
              </p>
              <Badge className="mt-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                🧪 Versão Demo - Dados simulados para demonstração
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

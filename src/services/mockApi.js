// Mock API para GitHub Pages - Simula backend completo
import { generateStoryImage } from './storyGenerator'

// Configurações mock
const MOCK_CONFIG = {
  REVEAL_PRICE_CENTS: 500,
  MONTHLY_PLAN_PRICE_CENTS: 2499,
  RATE_LIMIT_MESSAGES_PER_HOUR: 5,
  JWT_EXPIRATION_DAYS: 7
}

// Simulação de delay de rede
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Simulação de geolocalização
const mockGeoData = [
  { country: 'BR', region: 'São Paulo', city: 'São Paulo', lat: -23.5505, lon: -46.6333, confidence: 85 },
  { country: 'BR', region: 'Rio de Janeiro', city: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, confidence: 78 },
  { country: 'BR', region: 'Minas Gerais', city: 'Belo Horizonte', lat: -19.9167, lon: -43.9345, confidence: 82 },
  { country: 'BR', region: 'Bahia', city: 'Salvador', lat: -12.9714, lon: -38.5014, confidence: 75 },
  { country: 'BR', region: 'Paraná', city: 'Curitiba', lat: -25.4284, lon: -49.2733, confidence: 88 }
]

// Simulação de mensagens do sistema
const systemMessages = [
  "Você tem um sorriso lindo! 😊",
  "Adorei sua vibe, continue assim! ✨",
  "Gostaria de me aproximar mais de você, vamos tomar um sorvete? 🍦",
  "Você é uma pessoa incrível! 🌟",
  "Tenho admirado você de longe... 👀"
]

// Simulação de usuários
const mockUsers = {
  'demo@anonimou.test': {
    id: 'user-demo-123',
    email: 'demo@anonimou.test',
    displayName: 'Usuário Demo',
    slug: 'demo',
    planType: 'free',
    profileImage: null,
    systemMessagesEnabled: true,
    createdAt: new Date('2024-01-01').toISOString()
  },
  'premium@anonimou.test': {
    id: 'user-premium-456',
    email: 'premium@anonimou.test',
    displayName: 'Usuário Premium',
    slug: 'premium',
    planType: 'monthly24_99',
    profileImage: null,
    systemMessagesEnabled: false,
    createdAt: new Date('2024-01-15').toISOString()
  }
}

// Função para gerar mensagens mock
const generateMockMessages = (slug, count = 10) => {
  const messages = []
  const sampleTexts = [
    "Você é uma pessoa incrível! Continue sendo assim! ✨",
    "Adorei seu último post no Instagram, muito inspirador!",
    "Tenho uma crush em você há muito tempo... 😍",
    "Você tem um sorriso lindo que ilumina qualquer ambiente!",
    "Gostaria de te conhecer melhor, vamos tomar um café?",
    "Você é muito talentoso(a), admiro muito seu trabalho!",
    "Sua personalidade é cativante, você é especial!",
    "Quero dizer que você faz a diferença na vida das pessoas",
    "Você tem uma energia muito positiva, obrigado por existir!",
    "Sempre quis te falar isso: você é demais! 🔥"
  ]

  for (let i = 0; i < count; i++) {
    const geo = mockGeoData[Math.floor(Math.random() * mockGeoData.length)]
    const isSystem = i < 3 && slug === 'demo' // 3 mensagens do sistema para demo
    
    messages.push({
      id: `msg-${slug}-${i}`,
      text: isSystem ? systemMessages[i] : sampleTexts[i % sampleTexts.length],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      isSystemMessage: isSystem,
      vpnFlag: Math.random() > 0.8,
      reportsCount: Math.floor(Math.random() * 3),
      isLocked: false,
      lockedPriceCents: 0,
      revealCount: Math.floor(Math.random() * 5),
      moderationStatus: 'approved',
      geoCity: geo.city,
      geoRegion: geo.region,
      geoCountry: geo.country,
      geoLat: geo.lat,
      geoLon: geo.lon,
      providerConfidence: geo.confidence
    })
  }

  return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// Simulação de localStorage para persistência
const getStorageKey = (key) => `anonimou_${key}`

const storage = {
  get: (key) => {
    try {
      const data = localStorage.getItem(getStorageKey(key))
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(getStorageKey(key))
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error)
    }
  }
}

// Mock API Class
class MockAPI {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    // Inicializar dados mock se não existirem
    if (!storage.get('users')) {
      storage.set('users', mockUsers)
    }
    
    if (!storage.get('messages_demo')) {
      storage.set('messages_demo', generateMockMessages('demo', 10))
    }
    
    if (!storage.get('messages_premium')) {
      storage.set('messages_premium', generateMockMessages('premium', 7))
    }
  }

  // Autenticação
  async register(userData) {
    await delay()
    
    const users = storage.get('users') || {}
    
    if (users[userData.email]) {
      throw new Error('Email já cadastrado')
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      displayName: userData.displayName,
      slug: userData.slug,
      planType: 'free',
      profileImage: null,
      systemMessagesEnabled: false,
      createdAt: new Date().toISOString()
    }
    
    users[userData.email] = newUser
    storage.set('users', users)
    
    // Criar mensagens iniciais para o novo usuário
    storage.set(`messages_${userData.slug}`, generateMockMessages(userData.slug, 3))
    
    return {
      message: 'Conta criada com sucesso!',
      userId: newUser.id
    }
  }

  async login(email, password) {
    await delay()
    
    const users = storage.get('users') || {}
    const user = users[email]
    
    if (!user) {
      throw new Error('Email ou senha incorretos')
    }
    
    // Simular token JWT
    const token = `mock_jwt_${user.id}_${Date.now()}`
    storage.set('auth_token', token)
    storage.set('current_user', user)
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        slug: user.slug,
        planType: user.planType,
        profileImage: user.profileImage
      }
    }
  }

  async getCurrentUser() {
    await delay(200)
    
    const token = storage.get('auth_token')
    const user = storage.get('current_user')
    
    if (!token || !user) {
      throw new Error('Usuário não autenticado')
    }
    
    return { user }
  }

  async logout() {
    storage.remove('auth_token')
    storage.remove('current_user')
    return { message: 'Logout realizado com sucesso' }
  }

  // Dashboard
  async getDashboard() {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    const today = new Date().toDateString()
    const todayMessages = messages.filter(m => 
      new Date(m.createdAt).toDateString() === today
    ).length
    
    return {
      stats: {
        messagesCount: messages.length,
        todayMessages,
        revealsAvailable: user.planType === 'free' ? 0 : 999
      },
      systemMessagesEnabled: user.systemMessagesEnabled
    }
  }

  // Mensagens
  async getInbox() {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    
    return { messages }
  }

  async getMessage(messageId) {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    const message = messages.find(m => m.id === messageId)
    
    if (!message) {
      throw new Error('Mensagem não encontrada')
    }
    
    return message
  }

  async deleteMessage(messageId) {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    const filteredMessages = messages.filter(m => m.id !== messageId)
    
    storage.set(`messages_${user.slug}`, filteredMessages)
    
    return { message: 'Mensagem deletada com sucesso' }
  }

  // Público
  async getUserProfile(slug) {
    await delay()
    
    const users = storage.get('users') || {}
    const user = Object.values(users).find(u => u.slug === slug)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    
    const messages = storage.get(`messages_${slug}`) || []
    
    return {
      displayName: user.displayName,
      slug: user.slug,
      profileImage: user.profileImage,
      stats: {
        messagesCount: messages.length
      }
    }
  }

  async sendMessage(slug, text) {
    await delay()
    
    const users = storage.get('users') || {}
    const user = Object.values(users).find(u => u.slug === slug)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    
    // Verificar rate limit (simulado)
    const rateLimitKey = `rate_limit_${slug}`
    const rateLimitData = storage.get(rateLimitKey) || { count: 0, timestamp: Date.now() }
    
    const hourAgo = Date.now() - (60 * 60 * 1000)
    if (rateLimitData.timestamp > hourAgo && rateLimitData.count >= MOCK_CONFIG.RATE_LIMIT_MESSAGES_PER_HOUR) {
      throw new Error('Muitas mensagens enviadas. Tente novamente em 1 hora.')
    }
    
    // Simular moderação
    const blockedWords = ['spam', 'scam', 'hack']
    const isBlocked = blockedWords.some(word => text.toLowerCase().includes(word))
    
    const geo = mockGeoData[Math.floor(Math.random() * mockGeoData.length)]
    
    const newMessage = {
      id: `msg-${slug}-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      isSystemMessage: false,
      vpnFlag: Math.random() > 0.8,
      reportsCount: 0,
      isLocked: isBlocked,
      lockedPriceCents: isBlocked ? MOCK_CONFIG.REVEAL_PRICE_CENTS : 0,
      revealCount: 0,
      moderationStatus: isBlocked ? 'blocked' : 'approved',
      geoCity: geo.city,
      geoRegion: geo.region,
      geoCountry: geo.country,
      geoLat: geo.lat,
      geoLon: geo.lon,
      providerConfidence: geo.confidence
    }
    
    const messages = storage.get(`messages_${slug}`) || []
    messages.unshift(newMessage)
    storage.set(`messages_${slug}`, messages)
    
    // Atualizar rate limit
    storage.set(rateLimitKey, {
      count: rateLimitData.timestamp > hourAgo ? rateLimitData.count + 1 : 1,
      timestamp: Date.now()
    })
    
    return {
      status: isBlocked ? 'blocked' : 'queued',
      messageId: newMessage.id,
      message: isBlocked ? 'Mensagem foi bloqueada pela moderação' : 'Mensagem enviada com sucesso!'
    }
  }

  // Reveals
  async initiateReveal(messageId) {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    const message = messages.find(m => m.id === messageId)
    
    if (!message) {
      throw new Error('Mensagem não encontrada')
    }
    
    if (message.isSystemMessage) {
      throw new Error('Não é possível revelar localização de mensagens do sistema')
    }
    
    if (user.planType === 'monthly24_99' || user.planType === 'premium') {
      return {
        requiresPayment: false,
        city: message.geoCity,
        region: message.geoRegion,
        confidence: message.providerConfidence,
        vpnDetected: message.vpnFlag
      }
    } else {
      return {
        requiresPayment: true,
        price: MOCK_CONFIG.REVEAL_PRICE_CENTS / 100,
        priceCents: MOCK_CONFIG.REVEAL_PRICE_CENTS,
        paymentMethods: ['pix', 'card']
      }
    }
  }

  async getReveal(messageId) {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const messages = storage.get(`messages_${user.slug}`) || []
    const message = messages.find(m => m.id === messageId)
    
    if (!message) {
      throw new Error('Mensagem não encontrada')
    }
    
    // Simular pagamento para usuários free
    if (user.planType === 'free') {
      const reveals = storage.get('user_reveals') || []
      const hasReveal = reveals.some(r => r.messageId === messageId && r.userId === user.id)
      
      if (!hasReveal) {
        throw new Error('Pagamento necessário para reveal')
      }
    }
    
    const confidence = message.vpnFlag ? 
      Math.max(0, message.providerConfidence - 30) : 
      message.providerConfidence
    
    const mapData = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [message.geoLon, message.geoLat]
      },
      properties: {
        city: message.geoCity,
        region: message.geoRegion
      }
    }
    
    return {
      city: message.geoCity,
      region: message.geoRegion,
      country: message.geoCountry,
      confidence,
      vpnDetected: message.vpnFlag,
      mapData,
      revealedAt: new Date().toISOString()
    }
  }

  // Pagamentos (simulado)
  async createPayment(paymentData) {
    await delay(1000)
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    // Simular sucesso do pagamento
    const paymentId = `payment-${Date.now()}`
    
    if (paymentData.type === 'reveal') {
      const reveals = storage.get('user_reveals') || []
      reveals.push({
        messageId: paymentData.messageId,
        userId: user.id,
        paymentId,
        createdAt: new Date().toISOString()
      })
      storage.set('user_reveals', reveals)
    }
    
    return {
      paymentId,
      status: 'completed',
      message: 'Pagamento processado com sucesso!'
    }
  }

  // Configurações
  async updateSettings(settings) {
    await delay()
    
    const user = storage.get('current_user')
    if (!user) throw new Error('Usuário não autenticado')
    
    const users = storage.get('users') || {}
    const updatedUser = { ...users[user.email], ...settings }
    users[user.email] = updatedUser
    
    storage.set('users', users)
    storage.set('current_user', updatedUser)
    
    return { message: 'Configurações atualizadas com sucesso' }
  }

  // Geração de Stories
  async generateStory(type, data) {
    await delay(500)
    
    try {
      const imageBlob = await generateStoryImage(type, data)
      return { imageBlob, success: true }
    } catch (error) {
      throw new Error('Erro ao gerar imagem para story')
    }
  }
}

// Instância singleton
const mockApi = new MockAPI()

export default mockApi
export { MOCK_CONFIG }

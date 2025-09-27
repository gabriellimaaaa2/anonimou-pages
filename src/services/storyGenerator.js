// Gerador de imagens para Instagram Stories
import responderImg from '../assets/RESPONDER.jpg'
import linkImg from '../assets/LINK.jpg'

// Função para carregar imagem
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Função para quebrar texto em linhas
const wrapText = (ctx, text, maxWidth, lineHeight) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

// Função para desenhar texto com sombra
const drawTextWithShadow = (ctx, text, x, y, shadowColor = 'rgba(0,0,0,0.8)', shadowBlur = 4) => {
  // Sombra
  ctx.save()
  ctx.shadowColor = shadowColor
  ctx.shadowBlur = shadowBlur
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillText(text, x, y)
  ctx.restore()
  
  // Texto principal
  ctx.fillText(text, x, y)
}

// Função principal para gerar imagem do story
export const generateStoryImage = async (type, data) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Dimensões do Instagram Story (9:16)
  canvas.width = 1080
  canvas.height = 1920
  
  try {
    // Carregar imagem de fundo baseada no tipo
    const backgroundImg = await loadImage(type === 'link' ? linkImg : responderImg)
    
    // Desenhar imagem de fundo
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
    
    // Configurar fonte
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    
    if (type === 'link') {
      // Story para compartilhar link
      ctx.font = 'bold 48px Arial, sans-serif'
      
      // Título
      drawTextWithShadow(ctx, 'MANDE UMA MENSAGEM', canvas.width / 2, 1200)
      drawTextWithShadow(ctx, 'ANÔNIMA PARA MIM!', canvas.width / 2, 1260)
      
      // Instruções
      ctx.font = '36px Arial, sans-serif'
      drawTextWithShadow(ctx, 'Clique no link do meu perfil', canvas.width / 2, 1350)
      drawTextWithShadow(ctx, 'e me mande uma mensagem secreta!', canvas.width / 2, 1400)
      
      // Call to action
      ctx.font = 'bold 42px Arial, sans-serif'
      drawTextWithShadow(ctx, '👆 TOQUE AQUI 👆', canvas.width / 2, 1500)
      
    } else if (type === 'response') {
      // Story para resposta
      const { message, response } = data
      
      // Título
      ctx.font = 'bold 44px Arial, sans-serif'
      drawTextWithShadow(ctx, 'RESPONDENDO MENSAGEM', canvas.width / 2, 1100)
      
      // Mensagem recebida
      ctx.font = '32px Arial, sans-serif'
      ctx.fillStyle = '#FFD700' // Dourado
      drawTextWithShadow(ctx, 'MENSAGEM RECEBIDA:', canvas.width / 2, 1180)
      
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '36px Arial, sans-serif'
      
      // Quebrar texto da mensagem
      const messageLines = wrapText(ctx, `"${message}"`, 900, 40)
      let yPos = 1230
      
      messageLines.forEach(line => {
        drawTextWithShadow(ctx, line, canvas.width / 2, yPos)
        yPos += 45
      })
      
      // Resposta
      yPos += 30
      ctx.fillStyle = '#00FF88' // Verde
      ctx.font = 'bold 32px Arial, sans-serif'
      drawTextWithShadow(ctx, 'MINHA RESPOSTA:', canvas.width / 2, yPos)
      
      yPos += 50
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '38px Arial, sans-serif'
      
      // Quebrar texto da resposta
      const responseLines = wrapText(ctx, `"${response}"`, 900, 42)
      
      responseLines.forEach(line => {
        drawTextWithShadow(ctx, line, canvas.width / 2, yPos)
        yPos += 47
      })
      
    } else if (type === 'reveal') {
      // Story para reveal de localização
      const { city, region, confidence } = data
      
      // Título
      ctx.font = 'bold 48px Arial, sans-serif'
      drawTextWithShadow(ctx, 'LOCALIZAÇÃO REVELADA!', canvas.width / 2, 1150)
      
      // Localização
      ctx.font = 'bold 52px Arial, sans-serif'
      ctx.fillStyle = '#FF6B6B' // Vermelho
      drawTextWithShadow(ctx, `📍 ${city}`, canvas.width / 2, 1250)
      
      ctx.font = '40px Arial, sans-serif'
      ctx.fillStyle = '#FFFFFF'
      drawTextWithShadow(ctx, region, canvas.width / 2, 1310)
      
      // Confiança
      ctx.font = '32px Arial, sans-serif'
      drawTextWithShadow(ctx, `Confiança: ${confidence}%`, canvas.width / 2, 1380)
      
      // Aviso
      ctx.font = '28px Arial, sans-serif'
      ctx.fillStyle = '#FFD700'
      drawTextWithShadow(ctx, 'Localização aproximada baseada no IP', canvas.width / 2, 1450)
    }
    
    // Adicionar marca d'água
    ctx.font = '24px Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.textAlign = 'right'
    drawTextWithShadow(ctx, 'anonimou.me', canvas.width - 50, canvas.height - 50)
    
    // Converter canvas para blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9)
    })
    
  } catch (error) {
    console.error('Erro ao gerar imagem:', error)
    throw error
  }
}

// Função para baixar imagem
export const downloadStoryImage = (blob, filename = 'anonimou-story.jpg') => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Função para compartilhar no Instagram (mobile)
export const shareToInstagram = (blob) => {
  if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile - usar Web Share API
    const file = new File([blob], 'anonimou-story.jpg', { type: 'image/jpeg' })
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Compartilhar no Instagram',
        text: 'Story gerado pelo Anônimou'
      }).catch(console.error)
    } else {
      // Fallback: baixar imagem
      downloadStoryImage(blob)
      // Tentar abrir Instagram
      window.open('instagram://story-camera', '_blank')
    }
  } else {
    // Desktop - baixar e tentar abrir Instagram Web
    downloadStoryImage(blob)
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank')
    }, 1000)
  }
}

export default {
  generateStoryImage,
  downloadStoryImage,
  shareToInstagram
}

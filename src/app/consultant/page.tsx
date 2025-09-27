'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Guitar, Volume2, DollarSign, MapPin, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  rigRecommendation?: RigRecommendation
}

interface RigRecommendation {
  name: string
  budget: string
  description: string
  gear: Array<{
    type: string
    brand: string
    model: string
    price: number
    description: string
  }>
  totalPrice: number
}

export default function ConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! 👋 Sou seu consultor pessoal de equipamentos de guitarra. Vou te ajudar a encontrar o setup perfeito baseado no seu orçamento, estilo e necessidades. Vamos começar?',
      timestamp: new Date(),
      suggestions: [
        'Quero montar meu primeiro setup',
        'Preciso melhorar meu som para igreja',
        'Busco pedais para rock/metal',
        'Tenho R$ 1.500 para gastar'
      ]
    }
  ])
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState({
    budget: null as number | null,
    location: '',
    style: '',
    experience: '',
    currentGear: [] as string[]
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Call real OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: `session-${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: data.message,
        timestamp: new Date(),
        rigRecommendation: data.rigRecommendation
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Update user profile if available
      if (data.userProfile) {
        setUserProfile(data.userProfile)
      }

    } catch (error) {
      console.error('Chat error:', error)
      // Fallback to simulated response
      const aiResponse = generateAIResponse(content, messages.length)
      setMessages(prev => [...prev, aiResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const generateAIResponse = (userInput: string, messageCount: number): Message => {
    const input = userInput.toLowerCase()
    
    // Detect budget
    const budgetMatch = input.match(/r?\$?\s*(\d+(?:\.\d+)?(?:k|mil)?)/i)
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1])
      if (budgetMatch[1].includes('k') || budgetMatch[1].includes('mil')) {
        budget *= 1000
      }
      setUserProfile(prev => ({ ...prev, budget }))
    }

    // Detect location/context
    if (input.includes('igreja') || input.includes('church')) {
      setUserProfile(prev => ({ ...prev, location: 'igreja' }))
    }
    if (input.includes('casa') || input.includes('home')) {
      setUserProfile(prev => ({ ...prev, location: 'casa' }))
    }
    if (input.includes('banda') || input.includes('ensaio')) {
      setUserProfile(prev => ({ ...prev, location: 'banda' }))
    }

    // Detect style
    if (input.includes('rock') || input.includes('metal')) {
      setUserProfile(prev => ({ ...prev, style: 'rock/metal' }))
    }
    if (input.includes('limpo') || input.includes('clean') || input.includes('jazz')) {
      setUserProfile(prev => ({ ...prev, style: 'clean/jazz' }))
    }
    if (input.includes('blues')) {
      setUserProfile(prev => ({ ...prev, style: 'blues' }))
    }

    // Generate contextual responses
    if (messageCount <= 2) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Perfeito! Para te dar as melhores recomendações, preciso saber mais sobre você. Qual é seu orçamento disponível para investir em equipamentos?',
        timestamp: new Date(),
        suggestions: [
          'Até R$ 1.000',
          'Entre R$ 1.000 e R$ 3.000',
          'Entre R$ 3.000 e R$ 5.000',
          'Acima de R$ 5.000'
        ]
      }
    }

    if (messageCount <= 4 && userProfile.budget) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Ótimo! Com R$ ${userProfile.budget?.toLocaleString('pt-BR')} temos boas opções. Onde você costuma tocar mais?`,
        timestamp: new Date(),
        suggestions: [
          'Em casa (apartamento/casa)',
          'Na igreja',
          'Ensaios com banda',
          'Shows e apresentações'
        ]
      }
    }

    if (messageCount <= 6 && userProfile.location) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Entendi! E que tipo de som você busca? Que artistas ou estilos te inspiram?',
        timestamp: new Date(),
        suggestions: [
          'Som limpo e cristalino',
          'Crunch e overdrive',
          'Distorção pesada',
          'Versatilidade (limpo + distorcido)'
        ]
      }
    }

    // Generate rig recommendation
    if (userProfile.budget && userProfile.location && userProfile.style) {
      const rig = generateRigRecommendation(userProfile)
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Baseado no seu perfil, criei algumas opções de setup para você! Aqui está minha recomendação principal:`,
        timestamp: new Date(),
        rigRecommendation: rig
      }
    }

    // Default responses
    const responses = [
      'Interessante! Me conte mais sobre isso.',
      'Entendi. Que outros detalhes você pode compartilhar?',
      'Perfeito! Isso me ajuda a entender melhor suas necessidades.',
      'Ótima informação! Vamos continuar montando seu perfil.'
    ]

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    }
  }

  const generateRigRecommendation = (profile: typeof userProfile): RigRecommendation => {
    const budget = profile.budget || 2000
    
    if (profile.location === 'igreja' && profile.style === 'clean/jazz') {
      return {
        name: 'Setup Igreja - Som Limpo',
        budget: `R$ ${budget.toLocaleString('pt-BR')}`,
        description: 'Setup ideal para tocar na igreja com som limpo e cristalino',
        gear: [
          {
            type: 'Amplificador',
            brand: 'Fender',
            model: 'Blues Junior IV',
            price: 1200,
            description: 'Amp valvulado com excelente som limpo'
          },
          {
            type: 'Pedal',
            brand: 'Boss',
            model: 'CS-3 Compression Sustainer',
            price: 280,
            description: 'Compressor para equalizar o sinal'
          },
          {
            type: 'Pedal',
            brand: 'Boss',
            model: 'DD-3T Digital Delay',
            price: 320,
            description: 'Delay digital versátil'
          },
          {
            type: 'Pedal',
            brand: 'TC Electronic',
            model: 'Hall of Fame 2',
            price: 200,
            description: 'Reverb de alta qualidade'
          }
        ],
        totalPrice: 2000
      }
    }

    // Default recommendation
    return {
      name: 'Setup Versátil',
      budget: `R$ ${budget.toLocaleString('pt-BR')}`,
      description: 'Setup versátil para diversos estilos musicais',
      gear: [
        {
          type: 'Amplificador',
          brand: 'Orange',
          model: 'Crush 35RT',
          price: 800,
          description: 'Amp com boa versatilidade'
        },
        {
          type: 'Pedal',
          brand: 'Boss',
          model: 'OD-3 OverDrive',
          price: 250,
          description: 'Overdrive clássico'
        },
        {
          type: 'Pedal',
          brand: 'Boss',
          model: 'DS-1 Distortion',
          price: 200,
          description: 'Distorção versátil'
        },
        {
          type: 'Pedal',
          brand: 'Boss',
          model: 'RV-6 Reverb',
          price: 300,
          description: 'Reverb digital'
        }
      ],
      totalPrice: 1550
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Guitar className="h-6 w-6 text-primary" />
            <span className="font-bold">Hub do Guitarrista</span>
          </Link>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4" />
            <span>Consultor IA</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="gear-card sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Seu Perfil
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {userProfile.budget 
                      ? `R$ ${userProfile.budget.toLocaleString('pt-BR')}`
                      : 'Orçamento não definido'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {userProfile.location || 'Local não definido'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {userProfile.style || 'Estilo não definido'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="gear-card h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`chat-bubble ${message.type}`}>
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && (
                            <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          {message.type === 'user' && (
                            <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            
                            {/* Rig Recommendation */}
                            {message.rigRecommendation && (
                              <div className="mt-4 p-4 bg-background/50 rounded-lg border">
                                <h4 className="font-semibold text-foreground mb-2">
                                  {message.rigRecommendation.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {message.rigRecommendation.description}
                                </p>
                                
                                <div className="space-y-2">
                                  {message.rigRecommendation.gear.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs">
                                      <div>
                                        <span className="font-medium text-foreground">
                                          {item.brand} {item.model}
                                        </span>
                                        <p className="text-muted-foreground">{item.description}</p>
                                      </div>
                                      <span className="font-semibold text-foreground">
                                        R$ {item.price.toLocaleString('pt-BR')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="border-t mt-3 pt-3 flex justify-between items-center">
                                  <span className="font-semibold text-foreground">Total:</span>
                                  <span className="font-bold text-primary">
                                    R$ {message.rigRecommendation.totalPrice.toLocaleString('pt-BR')}
                                  </span>
                                </div>
                                
                                <div className="mt-3 flex space-x-2">
                                  <Link href="/pedalboard">
                                    <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs hover:bg-primary/90">
                                      Testar no Pedalboard
                                    </button>
                                  </Link>
                                  <Link href="/marketplace">
                                    <button className="border border-border px-3 py-1 rounded text-xs hover:bg-muted">
                                      Ver Preços
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            )}
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="bg-background/50 hover:bg-background border border-border px-3 py-1 rounded-full text-xs text-foreground transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="chat-bubble ai">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

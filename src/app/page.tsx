'use client'

import { useState } from 'react'
import { Guitar, Zap, Users, ShoppingCart, Mic, Star, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginModal } from '@/components/auth/LoginModal'

function AuthButton() {
  const { user, signOut, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span>{user.user_metadata?.name || user.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Entrar
      </button>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}

export default function HomePage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const features = [
    {
      id: 'ai-consultant',
      icon: Zap,
      title: 'Consultor IA',
      description: 'Assistente inteligente que te ajuda a encontrar o setup perfeito baseado no seu orçamento e estilo',
      href: '/consultant'
    },
    {
      id: 'pedalboard',
      icon: Guitar,
      title: 'Pedalboard Builder',
      description: 'Monte e simule sua pedalboard com drag & drop. Ouça como vai soar antes de comprar',
      href: '/pedalboard'
    },
    {
      id: 'marketplace',
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Compre e venda equipamentos com segurança. Compare preços e encontre as melhores ofertas',
      href: '/marketplace'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Comunidade',
      description: 'Compartilhe seus rigs, ouça setups de outros guitarristas e aprenda com a comunidade',
      href: '/community'
    }
  ]

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Guitarrista de Igreja',
      content: 'A IA me ajudou a montar um setup incrível para tocar na igreja com apenas R$ 1.500. Som limpo perfeito!',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Músico Profissional',
      content: 'O pedalboard builder é fantástico. Consegui testar várias combinações antes de investir nos pedais.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Iniciante',
      content: 'Como iniciante, o consultor IA foi essencial. Me orientou desde a primeira guitarra até o amp ideal.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Guitar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Hub do Guitarrista</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/consultant" className="text-muted-foreground hover:text-foreground transition-colors">
              Consultor IA
            </Link>
            <Link href="/pedalboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Pedalboard
            </Link>
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
              Comunidade
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="guitar-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              🎸 Hub do Guitarrista
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Seu consultor pessoal de IA para descobrir timbres, montar pedalboards e encontrar os melhores equipamentos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultant">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Começar com IA
                </button>
              </Link>
              <Link href="/pedalboard">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  Montar Pedalboard
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desde a descoberta do seu som até a compra dos equipamentos, nossa IA te guia em cada passo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setIsHovered(feature.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Link href={feature.href}>
                  <div className={`gear-card cursor-pointer transition-all duration-300 ${
                    isHovered === feature.id ? 'scale-105 shadow-lg' : ''
                  }`}>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground">
              Em 3 passos simples, você encontra seu som ideal
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Conte seu estilo</h3>
              <p className="text-muted-foreground">
                Nossa IA pergunta sobre seu orçamento, estilo musical e onde você toca
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba sugestões</h3>
              <p className="text-muted-foreground">
                Receba rigs personalizados com opções econômica, média e premium
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Teste e compre</h3>
              <p className="text-muted-foreground">
                Simule o som no pedalboard builder e encontre os melhores preços
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que dizem nossos usuários</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="gear-card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 guitar-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para encontrar seu som?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Comece agora mesmo com nosso consultor IA e descubra o setup perfeito para você
          </p>
          <Link href="/consultant">
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Começar Agora - É Grátis
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Guitar className="h-6 w-6 text-primary" />
                <span className="font-bold">Hub do Guitarrista</span>
              </div>
              <p className="text-muted-foreground">
                Sua plataforma completa para descobrir, testar e comprar equipamentos de guitarra.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/consultant" className="hover:text-foreground">Consultor IA</Link></li>
                <li><Link href="/pedalboard" className="hover:text-foreground">Pedalboard Builder</Link></li>
                <li><Link href="/marketplace" className="hover:text-foreground">Marketplace</Link></li>
                <li><Link href="/community" className="hover:text-foreground">Comunidade</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Central de Ajuda</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contato</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacidade</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Conecte-se</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground">YouTube</a></li>
                <li><a href="#" className="hover:text-foreground">Discord</a></li>
                <li><a href="#" className="hover:text-foreground">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Hub do Guitarrista. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
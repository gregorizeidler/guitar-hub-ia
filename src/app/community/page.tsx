'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, Guitar, Star, Clock, Eye, User } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Rig {
  id: string
  name: string
  author: {
    name: string
    avatar: string
    verified: boolean
    followers: number
  }
  genre: string
  description: string
  gear: Array<{
    type: string
    brand: string
    model: string
  }>
  audioClip?: {
    url: string
    duration: number
  }
  likes: number
  comments: number
  views: number
  createdAt: Date
  tags: string[]
  featured: boolean
}

const mockRigs: Rig[] = [
  {
    id: '1',
    name: 'Setup Igreja - Som Limpo Cristalino',
    author: {
      name: 'João Worship',
      avatar: '/api/placeholder/40/40',
      verified: true,
      followers: 1250
    },
    genre: 'Worship',
    description: 'Setup perfeito para tocar na igreja. Som limpo, cristalino e cheio de presença. Ideal para acordes e arpejos.',
    gear: [
      { type: 'Guitarra', brand: 'Fender', model: 'Telecaster' },
      { type: 'Compressor', brand: 'Boss', model: 'CS-3' },
      { type: 'Delay', brand: 'Strymon', model: 'Timeline' },
      { type: 'Reverb', brand: 'Strymon', model: 'BigSky' },
      { type: 'Amplificador', brand: 'Fender', model: 'Twin Reverb' }
    ],
    audioClip: {
      url: '/audio/worship-clean.mp3',
      duration: 45
    },
    likes: 156,
    comments: 23,
    views: 1240,
    createdAt: new Date('2024-01-20'),
    tags: ['worship', 'limpo', 'igreja', 'delay', 'reverb'],
    featured: true
  },
  {
    id: '2',
    name: 'Rock Clássico - Marshall Crunch',
    author: {
      name: 'Carlos Rock',
      avatar: '/api/placeholder/40/40',
      verified: false,
      followers: 890
    },
    genre: 'Rock',
    description: 'O som clássico do rock dos anos 70/80. Marshall no ponto certo com um Tube Screamer para dar aquela mordida extra.',
    gear: [
      { type: 'Guitarra', brand: 'Gibson', model: 'Les Paul' },
      { type: 'Overdrive', brand: 'Ibanez', model: 'TS9' },
      { type: 'Amplificador', brand: 'Marshall', model: 'JCM800' },
      { type: 'Caixa', brand: 'Marshall', model: '1960A' }
    ],
    audioClip: {
      url: '/audio/rock-crunch.mp3',
      duration: 38
    },
    likes: 89,
    comments: 15,
    views: 567,
    createdAt: new Date('2024-01-18'),
    tags: ['rock', 'marshall', 'crunch', 'overdrive'],
    featured: false
  },
  {
    id: '3',
    name: 'Blues Vintage - Fender Clean + Pedais',
    author: {
      name: 'Ana Blues',
      avatar: '/api/placeholder/40/40',
      verified: true,
      followers: 2100
    },
    genre: 'Blues',
    description: 'Setup para blues tradicional. Fender limpo com pedais vintage para aquele tom quente e expressivo.',
    gear: [
      { type: 'Guitarra', brand: 'Fender', model: 'Stratocaster' },
      { type: 'Overdrive', brand: 'Boss', model: 'Blues Driver' },
      { type: 'Chorus', brand: 'Boss', model: 'CE-2' },
      { type: 'Delay', brand: 'Boss', model: 'DM-2' },
      { type: 'Amplificador', brand: 'Fender', model: 'Blues Junior' }
    ],
    likes: 203,
    comments: 31,
    views: 1890,
    createdAt: new Date('2024-01-15'),
    tags: ['blues', 'vintage', 'fender', 'strat'],
    featured: true
  },
  {
    id: '4',
    name: 'Metal Moderno - High Gain Setup',
    author: {
      name: 'Pedro Metal',
      avatar: '/api/placeholder/40/40',
      verified: false,
      followers: 650
    },
    genre: 'Metal',
    description: 'Setup para metal moderno com muito ganho e definição. Perfeito para riffs pesados e solos cortantes.',
    gear: [
      { type: 'Guitarra', brand: 'ESP', model: 'Eclipse' },
      { type: 'Noise Gate', brand: 'Boss', model: 'NS-2' },
      { type: 'Distortion', brand: 'Boss', model: 'MT-2' },
      { type: 'Amplificador', brand: 'Mesa Boogie', model: 'Dual Rectifier' }
    ],
    likes: 67,
    comments: 8,
    views: 423,
    createdAt: new Date('2024-01-22'),
    tags: ['metal', 'high-gain', 'mesa', 'distortion'],
    featured: false
  }
]

function RigCard({ rig }: { rig: Rig }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Aqui integraria com o sistema de áudio
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`gear-card group ${rig.featured ? 'ring-2 ring-primary/20' : ''}`}
    >
      {rig.featured && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
          Destaque
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{rig.author.name}</span>
              {rig.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {rig.author.followers.toLocaleString()} seguidores
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{rig.createdAt.toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-2">{rig.name}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              {rig.genre}
            </span>
            {rig.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{rig.description}</p>
        </div>

        {/* Gear List */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Guitar className="h-4 w-4 mr-2" />
            Equipamentos
          </h4>
          <div className="space-y-1">
            {rig.gear.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.type}:</span>
                <span className="font-medium">{item.brand} {item.model}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Player */}
        {rig.audioClip && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Preview do Som</span>
              <span className="text-xs text-muted-foreground">{rig.audioClip.duration}s</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-1/3"></div>
              </div>
              
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-sm">{rig.likes + (isLiked ? 1 : 0)}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{rig.comments}</span>
            </button>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{rig.views}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href={`/pedalboard?import=${rig.id}`}>
              <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors">
                Importar
              </button>
            </Link>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommunityPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'liked'>('popular')

  const genres = ['all', 'worship', 'rock', 'blues', 'metal', 'jazz', 'pop']
  const genreLabels = {
    all: 'Todos',
    worship: 'Worship',
    rock: 'Rock',
    blues: 'Blues',
    metal: 'Metal',
    jazz: 'Jazz',
    pop: 'Pop'
  }

  const filteredRigs = mockRigs
    .filter(rig => selectedGenre === 'all' || rig.genre.toLowerCase() === selectedGenre)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views
        case 'liked':
          return b.likes - a.likes
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Guitar className="h-6 w-6 text-primary" />
            <span className="font-bold">Hub do Guitarrista</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/community/share">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Compartilhar Rig
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Comunidade</h1>
          <p className="text-muted-foreground">
            Descubra setups incríveis compartilhados pela comunidade de guitarristas
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {genreLabels[genre as keyof typeof genreLabels]}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
            >
              <option value="popular">Mais populares</option>
              <option value="liked">Mais curtidos</option>
              <option value="newest">Mais recentes</option>
            </select>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            Rigs em Destaque
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRigs.filter(rig => rig.featured).map((rig) => (
              <RigCard key={rig.id} rig={rig} />
            ))}
          </div>
        </div>

        {/* All Rigs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Todos os Rigs ({filteredRigs.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRigs.map((rig) => (
              <RigCard key={rig.id} rig={rig} />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredRigs.length === 0 && (
          <div className="text-center py-12">
            <Guitar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum rig encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente selecionar um gênero diferente ou seja o primeiro a compartilhar um rig deste estilo!
            </p>
            <Link href="/community/share">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Compartilhar Meu Rig
              </button>
            </Link>
          </div>
        )}

        {/* Load More */}
        {filteredRigs.length > 0 && (
          <div className="text-center mt-12">
            <button className="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors">
              Carregar mais rigs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

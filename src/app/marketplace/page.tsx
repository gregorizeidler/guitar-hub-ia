'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Heart, Star, MapPin, Clock, Guitar, DollarSign, Eye, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Listing {
  id: string
  title: string
  brand: string
  model: string
  type: 'guitar' | 'amp' | 'pedal' | 'cabinet' | 'accessory'
  price: number
  originalPrice?: number
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
  location: string
  seller: {
    name: string
    rating: number
    reviewCount: number
    verified: boolean
  }
  images: string[]
  description: string
  createdAt: Date
  views: number
  likes: number
  featured: boolean
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Fender Player Stratocaster',
    brand: 'Fender',
    model: 'Player Stratocaster',
    type: 'guitar',
    price: 2800,
    originalPrice: 3200,
    condition: 'excellent',
    location: 'São Paulo, SP',
    seller: {
      name: 'João Silva',
      rating: 4.8,
      reviewCount: 23,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    description: 'Guitarra em excelente estado, pouco uso. Acompanha case original.',
    createdAt: new Date('2024-01-15'),
    views: 156,
    likes: 12,
    featured: true
  },
  {
    id: '2',
    title: 'Boss DS-1 Distortion',
    brand: 'Boss',
    model: 'DS-1',
    type: 'pedal',
    price: 180,
    condition: 'good',
    location: 'Rio de Janeiro, RJ',
    seller: {
      name: 'Ana Costa',
      rating: 4.9,
      reviewCount: 45,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    description: 'Pedal clássico, funcionando perfeitamente. Pequenos sinais de uso.',
    createdAt: new Date('2024-01-20'),
    views: 89,
    likes: 8,
    featured: false
  },
  {
    id: '3',
    title: 'Marshall JCM800 2203',
    brand: 'Marshall',
    model: 'JCM800 2203',
    type: 'amp',
    price: 4500,
    condition: 'good',
    location: 'Belo Horizonte, MG',
    seller: {
      name: 'Carlos Drummer',
      rating: 4.7,
      reviewCount: 18,
      verified: false
    },
    images: ['/api/placeholder/300/200'],
    description: 'Cabeçote valvulado lendário. Revisado recentemente.',
    createdAt: new Date('2024-01-18'),
    views: 234,
    likes: 28,
    featured: true
  },
  {
    id: '4',
    title: 'TC Electronic Hall of Fame 2',
    brand: 'TC Electronic',
    model: 'Hall of Fame 2',
    type: 'pedal',
    price: 320,
    originalPrice: 450,
    condition: 'new',
    location: 'Curitiba, PR',
    seller: {
      name: 'Music Store PR',
      rating: 4.9,
      reviewCount: 156,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    description: 'Pedal de reverb novo, lacrado. Última unidade em estoque.',
    createdAt: new Date('2024-01-22'),
    views: 67,
    likes: 5,
    featured: false
  },
  {
    id: '5',
    title: 'Gibson Les Paul Studio',
    brand: 'Gibson',
    model: 'Les Paul Studio',
    type: 'guitar',
    price: 5200,
    condition: 'excellent',
    location: 'Porto Alegre, RS',
    seller: {
      name: 'Pedro Guitarrista',
      rating: 4.6,
      reviewCount: 12,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    description: 'Les Paul Studio 2019, cor Wine Red. Captadores originais.',
    createdAt: new Date('2024-01-19'),
    views: 198,
    likes: 22,
    featured: false
  },
  {
    id: '6',
    title: 'Orange Crush 35RT',
    brand: 'Orange',
    model: 'Crush 35RT',
    type: 'amp',
    price: 1100,
    condition: 'good',
    location: 'Salvador, BA',
    seller: {
      name: 'Música Bahia',
      rating: 4.8,
      reviewCount: 89,
      verified: true
    },
    images: ['/api/placeholder/300/200'],
    description: 'Amplificador combo 35W com reverb e tuner. Ótimo para ensaios.',
    createdAt: new Date('2024-01-21'),
    views: 123,
    likes: 15,
    featured: false
  }
]

const conditionLabels = {
  new: 'Novo',
  excellent: 'Excelente',
  good: 'Bom',
  fair: 'Regular',
  poor: 'Ruim'
}

const conditionColors = {
  new: 'bg-green-100 text-green-800',
  excellent: 'bg-blue-100 text-blue-800',
  good: 'bg-yellow-100 text-yellow-800',
  fair: 'bg-orange-100 text-orange-800',
  poor: 'bg-red-100 text-red-800'
}

const typeLabels = {
  guitar: 'Guitarra',
  amp: 'Amplificador',
  pedal: 'Pedal',
  cabinet: 'Caixa',
  accessory: 'Acessório'
}

function ListingCard({ listing }: { listing: Listing }) {
  const [isLiked, setIsLiked] = useState(false)

  const discount = listing.originalPrice 
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`gear-card group cursor-pointer hover:shadow-lg transition-all ${
        listing.featured ? 'ring-2 ring-primary/20' : ''
      }`}
    >
      {listing.featured && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
          Destaque
        </div>
      )}

      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-muted">
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          <Guitar className="h-12 w-12 text-muted-foreground/50" />
        </div>
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex space-x-2">
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{listing.views}</span>
          </div>
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>{listing.likes}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground capitalize">
              {typeLabels[listing.type]}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${conditionColors[listing.condition]}`}>
              {conditionLabels[listing.condition]}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">
              R$ {listing.price.toLocaleString('pt-BR')}
            </div>
            {listing.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                R$ {listing.originalPrice.toLocaleString('pt-BR')}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{listing.location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">
                {listing.seller.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">{listing.seller.name}</span>
                {listing.seller.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{listing.seller.rating}</span>
                <span>({listing.seller.reviewCount})</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{listing.createdAt.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const filteredListings = useMemo(() => {
    let filtered = mockListings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           listing.model.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedType === 'all' || listing.type === selectedType
      const matchesCondition = selectedCondition === 'all' || listing.condition === selectedCondition
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]
      
      return matchesSearch && matchesType && matchesCondition && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    // Featured items first
    return filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [searchQuery, selectedType, selectedCondition, priceRange, sortBy])

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
            <Link href="/marketplace/sell">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Vender
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar equipamentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="gear-card"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="all">Todos</option>
                    <option value="guitar">Guitarras</option>
                    <option value="amp">Amplificadores</option>
                    <option value="pedal">Pedais</option>
                    <option value="cabinet">Caixas</option>
                    <option value="accessory">Acessórios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Condição</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="all">Todas</option>
                    <option value="new">Novo</option>
                    <option value="excellent">Excelente</option>
                    <option value="good">Bom</option>
                    <option value="fair">Regular</option>
                    <option value="poor">Ruim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="newest">Mais recentes</option>
                    <option value="price-low">Menor preço</option>
                    <option value="price-high">Maior preço</option>
                    <option value="popular">Mais populares</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              {filteredListings.length} equipamentos encontrados
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Guitar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('all')
                setSelectedCondition('all')
                setPriceRange([0, 10000])
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredListings.length > 0 && (
          <div className="text-center mt-12">
            <button className="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors">
              Carregar mais equipamentos
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/marketplace/sell">
        <button className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50">
          <DollarSign className="h-6 w-6" />
        </button>
      </Link>
    </div>
  )
}

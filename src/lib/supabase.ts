import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          city: string | null
          skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
          budget: number | null
          playing_style: string | null
          playing_location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          city?: string | null
          skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
          budget?: number | null
          playing_style?: string | null
          playing_location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          city?: string | null
          skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
          budget?: number | null
          playing_style?: string | null
          playing_location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gear: {
        Row: {
          id: string
          type: 'GUITAR' | 'AMP' | 'PEDAL' | 'CABINET' | 'ACCESSORY'
          brand: string
          model: string
          description: string | null
          specs: any | null
          average_price: number | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'GUITAR' | 'AMP' | 'PEDAL' | 'CABINET' | 'ACCESSORY'
          brand: string
          model: string
          description?: string | null
          specs?: any | null
          average_price?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'GUITAR' | 'AMP' | 'PEDAL' | 'CABINET' | 'ACCESSORY'
          brand?: string
          model?: string
          description?: string | null
          specs?: any | null
          average_price?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rigs: {
        Row: {
          id: string
          user_id: string
          name: string
          genre: string | null
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          genre?: string | null
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          genre?: string | null
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      signal_chains: {
        Row: {
          id: string
          rig_id: string
          gear_id: string
          order: number
          settings: any | null
        }
        Insert: {
          id?: string
          rig_id: string
          gear_id: string
          order: number
          settings?: any | null
        }
        Update: {
          id?: string
          rig_id?: string
          gear_id?: string
          order?: number
          settings?: any | null
        }
      }
      audio_clips: {
        Row: {
          id: string
          rig_id: string
          url: string
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          rig_id: string
          url: string
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          rig_id?: string
          url?: string
          duration?: number | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          gear_id: string
          rating: number
          pros: string | null
          cons: string | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gear_id: string
          rating: number
          pros?: string | null
          cons?: string | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gear_id?: string
          rating?: number
          pros?: string | null
          cons?: string | null
          comment?: string | null
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          gear_id: string
          price: number
          condition: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
          status: 'ACTIVE' | 'SOLD' | 'INACTIVE'
          description: string | null
          image_urls: any | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gear_id: string
          price: number
          condition: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
          status?: 'ACTIVE' | 'SOLD' | 'INACTIVE'
          description?: string | null
          image_urls?: any | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gear_id?: string
          price?: number
          condition?: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
          status?: 'ACTIVE' | 'SOLD' | 'INACTIVE'
          description?: string | null
          image_urls?: any | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          messages: any
          context: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: any
          context?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: any
          context?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

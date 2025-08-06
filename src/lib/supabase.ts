import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Типи для таблиці clients
export interface Client {
  id: number
  full_name: string
  tax_id: string
  account_opening_date: string
  account_activation_date: string | null
  card_status: 'на виготовленні' | 'на відділенні' | 'на організації' | 'видана'
  account_status: 'очікує активації' | 'активний' | 'заблокований' | 'закритий'
  has_id_card: boolean
  has_tax_card: boolean
  has_photo: boolean
  has_signature: boolean
  comments?: string
  created_at?: string
}

export type CardStatus = 'на виготовленні' | 'на відділенні' | 'на організації' | 'видана'

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: number
          full_name: string
          tax_id: string
          account_opening_date: string
          account_activation_date: string | null
          card_status: 'на виготовленні' | 'на відділенні' | 'на організації' | 'видана'
          contract_available: boolean | null
          questionnaire_available: boolean | null
          passport_available: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          full_name: string
          tax_id: string
          account_opening_date: string
          account_activation_date?: string | null
          card_status?: 'на виготовленні' | 'на відділенні' | 'на організації' | 'видана'
          contract_available?: boolean | null
          questionnaire_available?: boolean | null
          passport_available?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          full_name?: string
          tax_id?: string
          account_opening_date?: string
          account_activation_date?: string | null
          card_status?: 'на виготовленні' | 'на відділенні' | 'на організації' | 'видана'
          contract_available?: boolean | null
          questionnaire_available?: boolean | null
          passport_available?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

'use client'

import { useState, useEffect } from 'react'
import { supabase, Client } from '@/lib/supabase'
import ClientTable from '@/components/ClientTable'
import ClientModal from '@/components/ClientModal'
import AddClientModal from '@/components/AddClientModal'
import { ToastContainer, useToast } from '@/components/Toast'

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching clients:', error)
        addToast('Помилка завантаження даних', 'error')
      } else {
        setClients(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      addToast('Помилка підключення до бази даних', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClient(null)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          full_name: updatedClient.full_name,
          tax_id: updatedClient.tax_id,
          account_opening_date: updatedClient.account_opening_date,
          card_status: updatedClient.card_status,
          account_status: updatedClient.account_status,
          has_id_card: updatedClient.has_id_card,
          has_tax_card: updatedClient.has_tax_card,
          has_photo: updatedClient.has_photo,
          has_signature: updatedClient.has_signature
        })
        .eq('id', updatedClient.id)

      if (error) {
        console.error('Error updating client:', error)
        addToast('Помилка оновлення даних клієнта', 'error')
        return false
      }

      setClients(prev => prev.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      ))
      addToast('Дані клієнта успішно оновлено', 'success')
      return true
    } catch (error) {
      console.error('Error:', error)
      addToast('Помилка підключення до бази даних', 'error')
      return false
    }
  }

    const handleAddClient = async (clientData: Omit<Client, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()

      if (error) {
        console.error('Error adding client:', error)
        addToast('Помилка додавання клієнта', 'error')
        return false
      }

      if (data && data.length > 0) {
        setClients(prev => [data[0], ...prev])
        setIsAddModalOpen(false)
        addToast('Клієнта успішно додано', 'success')
        return true
      }
    } catch (error) {
      console.error('Error:', error)
      addToast('Помилка підключення до бази даних', 'error')
    }
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg animate-pulse">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium text-gray-700">Завантаження даних...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Система обліку карт</h1>
                <p className="text-blue-100">Управління клієнтами та картками</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Додати клієнта</span>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover-lift transition-all-smooth animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Всього клієнтів</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover-lift transition-all-smooth animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Активні рахунки</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.account_status === 'активний').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover-lift transition-all-smooth animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Очікують активації</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.account_status === 'очікує активації').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover-lift transition-all-smooth animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Видані картки</p>
                    <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.card_status === 'видана').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <ClientTable clients={clients} onViewClient={handleViewClient} />
        </div>
      </div>
      
      {isModalOpen && selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={handleCloseModal}
          onUpdate={handleUpdateClient}
        />
      )}

      {isAddModalOpen && (
        <AddClientModal
          onClose={handleCloseAddModal}
          onAdd={handleAddClient}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

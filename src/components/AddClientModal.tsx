'use client'

import { useState } from 'react'
import { Client, CardStatus } from '@/lib/supabase'

interface AddClientModalProps {
  onClose: () => void
  onAdd: (client: Omit<Client, 'id' | 'created_at'>) => Promise<boolean>
}

export default function AddClientModal({ onClose, onAdd }: AddClientModalProps) {
  const [newClient, setNewClient] = useState({
    full_name: '',
    tax_id: '',
    account_opening_date: '',
    account_activation_date: null as string | null,
    card_status: 'на виготовленні' as CardStatus,
    account_status: 'очікує активації' as Client['account_status'],
    has_id_card: false,
    has_tax_card: false,
    has_photo: false,
    has_signature: false,
    comments: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardStatuses: CardStatus[] = ['на виготовленні', 'на відділенні', 'на організації', 'видана']
  const accountStatuses: Array<Client['account_status']> = ['очікує активації', 'активний', 'заблокований', 'закритий']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newClient.full_name || !newClient.tax_id || !newClient.account_opening_date) {
      alert('Будь ласка, заповніть обов\'язкові поля: ПІБ, ІПН та дату відкриття рахунку')
      return
    }

    setIsSubmitting(true)
    const success = await onAdd(newClient)
    if (success) {
      onClose()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Додати нового клієнта</h2>
                <p className="text-green-100">Заповніть дані для створення профілю</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Основна інформація */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Основна інформація
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ПІБ клієнта <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.full_name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Введіть повне ім'я"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ІПН <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.tax_id}
                    onChange={(e) => setNewClient(prev => ({ ...prev, tax_id: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                    placeholder="0000000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата відкриття рахунку <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newClient.account_opening_date}
                    onChange={(e) => setNewClient(prev => ({ ...prev, account_opening_date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата активації рахунку
                  </label>
                  <input
                    type="date"
                    value={newClient.account_activation_date || ''}
                    onChange={(e) => setNewClient(prev => ({ ...prev, account_activation_date: e.target.value || null }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Статуси
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стан картки</label>
                  <select
                    value={newClient.card_status}
                    onChange={(e) => setNewClient(prev => ({ ...prev, card_status: e.target.value as CardStatus }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    {cardStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Стан рахунку</label>
                  <select
                    value={newClient.account_status}
                    onChange={(e) => setNewClient(prev => ({ ...prev, account_status: e.target.value as Client['account_status'] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    {accountStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Документи */}
          <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Документи
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {newClient.has_id_card ? (
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="flex-1 text-sm font-medium text-gray-700">Паспорт/ID картка</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClient.has_id_card}
                    onChange={(e) => setNewClient(prev => ({ ...prev, has_id_card: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {newClient.has_tax_card ? (
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="flex-1 text-sm font-medium text-gray-700">Довідка про ІПН</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClient.has_tax_card}
                    onChange={(e) => setNewClient(prev => ({ ...prev, has_tax_card: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {newClient.has_photo ? (
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="flex-1 text-sm font-medium text-gray-700">Фотографія</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClient.has_photo}
                    onChange={(e) => setNewClient(prev => ({ ...prev, has_photo: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {newClient.has_signature ? (
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="flex-1 text-sm font-medium text-gray-700">Зразок підпису</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClient.has_signature}
                    onChange={(e) => setNewClient(prev => ({ ...prev, has_signature: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Блок коментарів */}
          <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Коментарі
            </h3>
            <textarea
              value={newClient.comments}
              onChange={(e) => setNewClient(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Додайте коментарі або додаткову інформацію про клієнта..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover-lift"
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  <span>Збереження...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Додати клієнта</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

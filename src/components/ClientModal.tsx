'use client'

import { useState } from 'react'
import { Client, CardStatus } from '@/lib/supabase'
import StatusBadge from './StatusBadge'

interface ClientModalProps {
  client: Client
  onClose: () => void
  onUpdate: (client: Client) => Promise<boolean>
}

export default function ClientModal({ client, onClose, onUpdate }: ClientModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingClient, setEditingClient] = useState<Client>(client)

  const cardStatuses: CardStatus[] = ['на виготовленні', 'на відділенні', 'на організації', 'видана']
  const accountStatuses: Array<'очікує активації' | 'активний' | 'заблокований' | 'закритий'> = ['очікує активації', 'активний', 'заблокований', 'закритий']

  const handleSave = async () => {
    const success = await onUpdate(editingClient)
    if (success) {
      setIsEditing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA')
  }

  const documentList = [
    { key: 'has_id_card', label: 'Паспорт' },
    { key: 'has_tax_card', label: 'Податкова картка' },
    { key: 'has_photo', label: 'Фото' },
    { key: 'has_signature', label: 'Підпис' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Інформація про клієнта</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Редагувати
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Основна інформація */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Основна інформація</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  ПІБ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingClient.full_name}
                    onChange={(e) => setEditingClient({...editingClient, full_name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{client.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  ІПН
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingClient.tax_id}
                    onChange={(e) => setEditingClient({...editingClient, tax_id: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{client.tax_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Дата відкриття рахунку
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingClient.account_opening_date}
                    onChange={(e) => setEditingClient({...editingClient, account_opening_date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{formatDate(client.account_opening_date)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Дата активації рахунку
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingClient.account_activation_date || ''}
                    onChange={(e) => setEditingClient({...editingClient, account_activation_date: e.target.value || null})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {client.account_activation_date ? formatDate(client.account_activation_date) : 'Не активовано'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Статуси */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Статуси</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Статус картки
                </label>
                {isEditing ? (
                  <select
                    value={editingClient.card_status}
                    onChange={(e) => setEditingClient({...editingClient, card_status: e.target.value as CardStatus})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cardStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={client.card_status} type="card" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Статус рахунку
                </label>
                {isEditing ? (
                  <select
                    value={editingClient.account_status}
                    onChange={(e) => setEditingClient({...editingClient, account_status: e.target.value as Client['account_status']})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {accountStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={client.account_status} type="account" />
                )}
              </div>
            </div>
          </div>

          {/* Документи */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Документи</h3>
            <div className="space-y-3">
              {documentList.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {(isEditing ? editingClient : client)[key as keyof Client] ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">{label}</span>
                  </div>
                  {isEditing && (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingClient[key as keyof Client] as boolean}
                        onChange={(e) => setEditingClient({
                          ...editingClient,
                          [key]: e.target.checked
                        })}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Коментарі */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Коментарі</h3>
            {isEditing ? (
              <textarea
                value={editingClient.comments || ''}
                onChange={(e) => setEditingClient({...editingClient, comments: e.target.value})}
                placeholder="Введіть коментарі..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            ) : (
              <div className="min-h-[100px] p-3 bg-white rounded-lg border">
                {client.comments ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{client.comments}</p>
                ) : (
                  <p className="text-gray-400 italic">Коментарі відсутні</p>
                )}
              </div>
            )}
          </div>

          {/* Кнопки редагування */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditingClient(client)
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Зберегти
              </button>
            </div>
          )}

          {/* Дата створення */}
          <div className="text-sm text-gray-500 pt-4 border-t">
            Створено: {client.created_at ? formatDate(client.created_at) : 'Невідомо'}
          </div>
        </div>
      </div>
    </div>
  )
}

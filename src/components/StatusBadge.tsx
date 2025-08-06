'use client'

import React from 'react'

interface StatusBadgeProps {
  status: string
  type: 'card' | 'account'
  className?: string
}

export default function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === 'card') {
      switch (status) {
        case 'на виготовленні':
          return {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            text: 'Виготовлення'
          }
        case 'на відділенні':
          return {
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
            text: 'На відділенні'
          }
        case 'на організації':
          return {
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            text: 'На організації'
          }
        case 'видана':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ),
            text: 'Видана'
          }
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: null,
            text: status
          }
      }
    } else {
      // account status
      switch (status) {
        case 'активний':
          return {
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ),
            text: 'Активний'
          }
        case 'заблокований':
          return {
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ),
            text: 'Заблокований'
          }
        case 'закритий':
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ),
            text: 'Закритий'
          }
        default:
          return {
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: null,
            text: status
          }
      }
    }
  }

  const config = getStatusConfig()

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}>
      {config.icon}
      {config.text}
    </span>
  )
}

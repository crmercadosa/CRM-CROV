"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  icon?: React.ReactNode
}

interface RoleSwitcherProps {
  roles: Role[]
  currentRole: string
  onRoleChange: (roleId: string) => void
}

export function RoleSwitcher({ roles, currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const current = roles.find(r => r.id === currentRole)

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{current?.name}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase">Cambiar Rol</p>
          </div>

          <div className="p-2 space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  onRoleChange(role.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  currentRole === role.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                {/* Checkmark */}
                {currentRole === role.id && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {currentRole !== role.id && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 mt-0.5" />
                )}

                {/* Content */}
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-gray-900">{role.name}</p>
                  <p className="text-xs text-gray-600">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-xs text-gray-600">
              Cambios se aplicarán inmediatamente
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

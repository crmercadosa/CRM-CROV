'use client';

import { useState } from 'react';
import { useHeader } from '@/contexts/headerContexts';

export function UserHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { title } = useHeader();

  // Datos estáticos de ejemplo
  const user = {
    email: 'usuario@ejemplo.com',
    nombre: 'Juan Pérez',
    tipo: 'admin',
    avatar: null,
  };

  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    alert('Cerrando sesión...');
    // Aquí irá la lógica real de logout
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Título dinámico */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>
            
            {/* User Info - oculto en móvil */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user.tipo === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>

            {/* Dropdown Icon */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay para cerrar el dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              ></div>

              {/* Menu Content */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.nombre}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {user.tipo === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert('Ir a perfil');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    👤 Ver perfil
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert('Editar perfil');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ✏️ Editar perfil
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert('Configuración');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    ⚙️ Configuración
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
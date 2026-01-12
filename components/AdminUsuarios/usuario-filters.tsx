"use client"

/**
 * --------------------------------------------------------------------------
 * Componente de Filtros Avanzados de Usuarios
 * --------------------------------------------------------------------------
 *
 * Este componente proporciona una interfaz para filtrar usuarios con opciones:
 * - Búsqueda por email o nombre
 * - Filtro por rol
 * - Filtro por estado
 * - Filtro para usuarios sin negocios
 */

import { Search, X } from "lucide-react";
import { Button } from "./button";

interface UsuarioFiltersProps {
  filtros: {
    sinSucursal: boolean;
    rol: string;
    estado: string;
    busqueda: string;
  };
  rolesDisponibles: string[];
  onFiltrosChange: (filtros: any) => void;
  onLimpiar: () => void;
}

export function UsuarioFilters({
  filtros,
  rolesDisponibles,
  onFiltrosChange,
  onLimpiar,
}: UsuarioFiltersProps) {
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      busqueda: e.target.value,
    });
  };

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      rol: e.target.value,
    });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      estado: e.target.value,
    });
  };

  const handleSinSucursalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      sinSucursal: e.target.checked,
    });
  };

  const tieneFiltrosActivos =
    filtros.busqueda || filtros.rol !== 'todos' || filtros.estado !== 'todos' || filtros.sinSucursal;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
        {tieneFiltrosActivos && (
          <button
            onClick={onLimpiar}
            className="flex items-center text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Email o nombre..."
              value={filtros.busqueda}
              onChange={handleBusquedaChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Filtro por Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Rol
          </label>
          <select
            value={filtros.rol}
            onChange={handleRolChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todos">Todos los roles</option>
            {rolesDisponibles.map((rol) => (
              <option key={rol} value={rol}>
                {rol === 'sin_rol' 
                  ? 'Sin rol asignado' 
                  : rol.charAt(0).toUpperCase() + rol.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={handleEstadoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Filtro Sin Negocio */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.sinSucursal}
              onChange={handleSinSucursalChange}
              className="w-4 h-4 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Sin negocios
            </span>
          </label>
        </div>

        {/* Botón de búsqueda (opcional) */}
        <div className="flex items-end">
          <Button
            variant="default"
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}

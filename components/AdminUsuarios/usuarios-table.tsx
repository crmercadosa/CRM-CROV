"use client"

/**
 * --------------------------------------------------------------------------
 * Componente de Tabla de Usuarios
 * --------------------------------------------------------------------------
 *
 * Este componente renderiza una tabla con todos los usuarios activos y
 * proporciona información sobre su estado, rol, negocio asignado, etc.
 */

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/AdminUsuarios/dropdown-menu";
import { Shield, User, Headphones, ChevronDown } from "lucide-react";
import { UsuarioConNegocio } from "@/services/usuarios/usuario.service";

interface UsuariosTableProps {
  usuarios: UsuarioConNegocio[];
  isLoading?: boolean;
  onUpdateRole?: (id: string, newRole: 'cliente' | 'admin') => void;
}

export function UsuariosTable({ usuarios, isLoading, onUpdateRole }: UsuariosTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-gray-500 mb-2">No se encontraron usuarios</p>
          <p className="text-sm text-gray-400">
            Ajusta los filtros e intenta de nuevo
          </p>
        </div>
      </div>
    );
  }

  const getEstadoBadge = (estado: string | null) => {
    if (!estado) return <Badge variant="secondary">Indefinido</Badge>;
    if (estado === "activo")
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
    if (estado === "inactivo")
      return <Badge variant="destructive">Inactivo</Badge>;
    return <Badge variant="secondary">{estado}</Badge>;
  };

  const getRolBadge = (rol: string | null) => {
    if (!rol) return <Badge className="bg-gray-100 text-gray-800">Sin rol</Badge>;
    if (rol === "admin")
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    if (rol === "cliente")
      return <Badge className="bg-blue-100 text-blue-800">Cliente</Badge>;
    if (rol === "agente")
      return <Badge className="bg-green-100 text-green-800">Agente</Badge>;
    return <Badge variant="secondary">{rol}</Badge>;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Negocio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Registrado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">
                        {usuario.nombre
                          ? usuario.nombre.charAt(0).toUpperCase()
                          : usuario.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nombre || "Sin nombre"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{usuario.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-1">
                        {getRolBadge(usuario.tipo)}
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Asignar Rol</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup 
                        value={usuario.tipo || "cliente"} 
                        onValueChange={(val) => onUpdateRole && onUpdateRole(String(usuario.id), val as 'cliente' | 'admin')}
                      >
                        <DropdownMenuRadioItem value="admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4 text-purple-500" />
                          <span>Administrador</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="cliente" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Cliente</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="agente" className="cursor-pointer">
                          <Headphones className="mr-2 h-4 w-4 text-green-500" />
                          <span>Agente</span>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(usuario.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {usuario.sucursal ? (
                    <div>
                      <p className="text-sm text-gray-900">
                        {usuario.sucursal.nombre_negocio}
                      </p>
                      <Badge
                        className={usuario.sucursal.estado ? "bg-green-100 text-green-800 mt-1" : "bg-red-100 text-red-800 mt-1"}
                      >
                        {usuario.sucursal.estado ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                      Sin negocio
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.fecha_creacion
                    ? formatDistanceToNow(new Date(usuario.fecha_creacion), {
                        addSuffix: true,
                        locale: es,
                      })
                    : "Desconocida"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total de usuarios mostrados: <span className="font-semibold">{usuarios.length}</span>
        </p>
      </div>
    </div>
  );
}

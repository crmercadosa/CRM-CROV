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
import { useState, useEffect } from "react";
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
  onUpdateRole?: (id: string, newRole: 'cliente' | 'admin' | 'agente') => void;
  paginaActual?: number;
  totalPages?: number;
  onPaginaChange?: (pagina: number) => void;
  totalUsuarios?: number;
}

export function UsuariosTable({ 
  usuarios, 
  isLoading, 
  onUpdateRole,
  paginaActual = 1,
  totalPages = 1,
  onPaginaChange,
  totalUsuarios = 0
}: UsuariosTableProps) {
  const [usuariosLocales, setUsuariosLocales] = useState<UsuarioConSucursal[]>(usuarios);
  const [confirmDialog, setConfirmDialog] = useState<{ usuarioId: bigint; nuevoRol: 'cliente' | 'admin' | 'agente' } | null>(null);

  // Sincronizar usuarios cuando cambien los props
  useEffect(() => {
    setUsuariosLocales(usuarios);
  }, [usuarios]);

  const handleRoleChange = (usuarioId: bigint, nuevoRol: 'cliente' | 'admin' | 'agente') => {
    // Mostrar diálogo de confirmación
    setConfirmDialog({ usuarioId, nuevoRol });
  };

  const confirmarCambioRol = () => {
    if (!confirmDialog) return;

    const { usuarioId, nuevoRol } = confirmDialog;

    // Actualizar el estado local inmediatamente
    setUsuariosLocales(prevUsuarios =>
      prevUsuarios.map(u =>
        u.id_usuario === usuarioId ? { ...u, tipo: nuevoRol } : u
      )
    );

    // Llamar al callback del padre
    if (onUpdateRole) {
      onUpdateRole(String(usuarioId), nuevoRol);
    }

    // Cerrar el diálogo
    setConfirmDialog(null);
  };
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
            {usuariosLocales.map((usuario) => (
              <tr key={usuario.id_usuario} className="hover:bg-gray-50 transition-colors">
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
                        onValueChange={(val) => handleRoleChange(usuario.id_usuario, val as 'cliente' | 'admin' | 'agente')}
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
                  {usuario.created_at
                    ? formatDistanceToNow(new Date(usuario.created_at), {
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total de usuarios: <span className="font-semibold">{totalUsuarios}</span>
          </p>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Página <span className="font-semibold">{paginaActual}</span> de <span className="font-semibold">{totalPages}</span>
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onPaginaChange && onPaginaChange(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                
                <button
                  onClick={() => onPaginaChange && onPaginaChange(paginaActual + 1)}
                  disabled={paginaActual === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página siguiente"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar cambio de rol</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas cambiar el rol de este usuario a <span className="font-semibold">{confirmDialog.nuevoRol}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioRol}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Sucursal } from '@/types/sucursal';
import { Edit, Trash, Ban, CheckCircle, MapPin, Clock, Building2, ExternalLink, Tag } from 'lucide-react';

interface SucursalCardsProps {
  sucursales: Sucursal[];
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  loadingStatusId?: string | null;
}

export default function SucursalCards({
  sucursales,
  onEdit,
  onDelete,
  onToggleStatus,
  loadingStatusId,
}: SucursalCardsProps) {
  if (sucursales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se encontraron sucursales
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sucursales.map((sucursal) => (
        <div
          key={sucursal.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          {/* Header con nombre y estado */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                    {sucursal.nombre_negocio}
                  </h3>
                </div>
                <p className="text-xs text-gray-600">
                  ID Usuario: {sucursal.id_usuario}
                </p>
              </div>
              
              {/* Estado */}
              <div className="ml-2">
                {loadingStatusId === sucursal.id ? (
                  <div className="flex justify-center items-center h-6">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sucursal.estado === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sucursal.estado}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 space-y-3">
            {/* Giro */}
            {/* Ciudad */}
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Giro</p>
                <p className="font-medium text-gray-900">{sucursal.giro}</p>
              </div>
            </div>

            {/* Ciudad */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="font-medium text-gray-900">{sucursal.ciudad}</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Horarios</p>
                <p className="font-medium text-gray-900">{sucursal.horarios}</p>
              </div>
            </div>

            {/* Redes sociales */}
            {sucursal.url_redes_sociales && (
              <div className="pt-2 border-t border-gray-100">
                <a
                  href={sucursal.url_redes_sociales}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver redes sociales</span>
                </a>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={() => onEdit(sucursal)}
              className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition-colors cursor-pointer"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>

            {sucursal.estado === 'activo' ? (
              <button
                onClick={() => onToggleStatus(sucursal.id, sucursal.estado)}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors cursor-pointer"
                title="Desactivar"
              >
                <Ban className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(sucursal.id, sucursal.estado)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors cursor-pointer"
                title="Activar"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onDelete(sucursal.id)}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
              title="Eliminar"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
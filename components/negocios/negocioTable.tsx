import { Negocio } from '@/types/negocio';
import { Edit, Trash, Ban, CheckCircle } from 'lucide-react';

interface NegocioTableProps {
  negocios: Negocio[];
  onEdit: (negocio: Negocio) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  loadingStatusId?: string | null;
}

export default function NegocioTable({
  negocios,
  onEdit,
  onDelete,
  onToggleStatus,
  loadingStatusId,
}: NegocioTableProps) {
  if (negocios.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se encontraron negocios
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Negocio
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giro
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ciudad
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horarios
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {negocios.map((negocio) => (
            <tr key={negocio.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {negocio.nombre_negocio}
                </div>
                <div className="text-sm text-gray-500">
                  ID Usuario: {negocio.id_usuario}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {negocio.giro}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {negocio.ciudad}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                {negocio.horarios}
              </td>
              <td className="px-6 py-4 text-center">
                {loadingStatusId === negocio.id ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      negocio.estado === 'activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {negocio.estado}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(negocio)}
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {/* Botón condicional: Desactivar o Activar */}
                  {negocio.estado === 'activo' ? (
                    <button
                      onClick={() => onToggleStatus(negocio.id, negocio.estado)}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors cursor-pointer"
                      title="Desactivar"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleStatus(negocio.id, negocio.estado)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors cursor-pointer"
                      title="Activar"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(negocio.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
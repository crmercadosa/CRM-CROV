import { Sucursal } from '@/types/sucursal';

interface SucursalTableProps {
  sucursales: Sucursal[];
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (id: string) => void;
}

export default function SucursalTable({
  sucursales,
  onEdit,
  onDelete,
}: SucursalTableProps) {
  if (sucursales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se encontraron sucursales
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Negocio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ciudad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horarios
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sucursales.map((sucursal) => (
            <tr key={sucursal.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {sucursal.nombre_negocio}
                </div>
                <div className="text-sm text-gray-500">
                  ID Usuario: {sucursal.id_usuario}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {sucursal.giro}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {sucursal.ciudad}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {sucursal.horarios}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    sucursal.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {sucursal.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button
                  onClick={() => onEdit(sucursal)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(sucursal.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Negocio } from '@/types/negocio';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';

interface NegocioModalProps {
  negocio: Negocio | null;
  onClose: () => void;
  onSave: (data: Negocio) => void;
}

export default function NegocioModal({
  negocio,
  onClose,
  onSave,
}: NegocioModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Negocio>({
    id: '',
    id_usuario: '',
    nombre_negocio: '',
    giro: '',
    ciudad: '',
    horarios: '',
    url_redes_sociales: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (negocio) {
      setFormData(negocio);
    } else {
      setFormData(prev => ({
        ...prev,
        id_usuario: session?.user?.id || session?.user?.email || '',
      }));
    }
  }, [negocio]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Cerrar modal al hacer clic en el fondo
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {negocio ? 'Editar Negocio' : 'Nuevo Negocio'}
          </h2>
          <button
            onClick={onClose}
            className=" cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {negocio && (
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Usuario
              </label>
              <input
                type="text"
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="USR001"
              />
            </div>
          )}
            <div className={negocio ? '' : 'md:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                name="nombre_negocio"
                value={formData.nombre_negocio}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Café Central"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giro
              </label>
              <input
                type="text"
                name="giro"
                value={formData.giro}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Restaurante, Comercio, Servicios..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Guadalajara"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horarios
              </label>
              <input
                type="text"
                name="horarios"
                value={formData.horarios}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lun-Vie 9:00-18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Redes Sociales
              </label>
              <input
                type="url"
                name="url_redes_sociales"
                value={formData.url_redes_sociales}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/tu-negocio"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {negocio ? 'Guardar Cambios' : 'Crear Negocio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

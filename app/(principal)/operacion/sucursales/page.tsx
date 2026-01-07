'use client';

import { useState } from 'react';
import SucursalModal from '@/components/sucursales/sucursalModal';
import SucursalTable from '@/components/sucursales/sucursalTable';
import { Sucursal } from '@/types/sucursal';

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([
    {
      id: '1',
      id_usuario: 'USR001',
      nombre_negocio: 'Café Central',
      giro: 'Restaurante',
      ciudad: 'Guadalajara',
      horarios: 'Lun-Dom 8:00-22:00',
      url_redes_sociales: 'https://facebook.com/cafecentral',
      estado: 'activo',
    },
    {
      id: '2',
      id_usuario: 'USR002',
      nombre_negocio: 'Librería El Saber',
      giro: 'Comercio',
      ciudad: 'Zapopan',
      horarios: 'Lun-Sab 9:00-20:00',
      url_redes_sociales: 'https://instagram.com/libreria_elsaber',
      estado: 'activo',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setEditingSucursal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      setSucursales(sucursales.filter((s) => s.id !== id));
    }
  };

  const handleSave = (data: Sucursal) => {
    if (editingSucursal) {
      setSucursales(
        sucursales.map((s) => (s.id === editingSucursal.id ? data : s))
      );
    } else {
      setSucursales([...sucursales, { ...data, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingSucursal(null);
  };

  const filteredSucursales = sucursales.filter(
    (s) =>
      s.nombre_negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.giro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Sucursales
          </h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar sucursales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Nueva Sucursal
              </button>
            </div>
          </div>

          <SucursalTable
            sucursales={filteredSucursales}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {isModalOpen && (
        <SucursalModal
          sucursal={editingSucursal}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSucursal(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useHeader } from '@/contexts/headerContexts';
import SucursalModal from '@/components/sucursales/sucursalModal';
import SucursalTable from '@/components/sucursales/sucursalTable';
import { Sucursal } from '@/types/sucursal';
import { RefreshCw } from 'lucide-react';

export default function SucursalesPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle('Gestión de Sucursales');
  }, [setTitle]);

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las sucursales
  const fetchSucursales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Intentar cargar desde sessionStorage primero
      const cachedSucursales = sessionStorage.getItem('sucursales');
      
      if (cachedSucursales) {
        // Si hay datos en caché, usarlos con un pequeño delay para la animación
        console.log('Cargando sucursales desde caché de sesión...');
        await new Promise(resolve => setTimeout(resolve, 800));
        setSucursales(JSON.parse(cachedSucursales));
        setIsLoading(false);
        return;
      }
      
      // Si no hay caché, hacer la petición a la API
      console.log('Cargando sucursales desde la API...');
      const [data] = await Promise.all([
        fetch('/api/sucursales').then(async (response) => {
          if (!response.ok) {
            throw new Error('Error al cargar las sucursales');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000)) // Delay de 1 segundo
      ]);
      
      // Guardar en sessionStorage y en el estado
      sessionStorage.setItem('sucursales', JSON.stringify(data));
      setSucursales(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar las sucursales');
      setIsLoading(false);
    }
  };

  // Función para refrescar los datos desde la API
  const refreshSucursales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [data] = await Promise.all([
        fetch('/api/sucursales').then(async (response) => {
          if (!response.ok) {
            throw new Error('Error al cargar las sucursales');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      sessionStorage.setItem('sucursales', JSON.stringify(data));
      setSucursales(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar las sucursales');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar sucursales al montar el componente
  useEffect(() => {
    fetchSucursales();
  }, []);

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
      const updatedSucursales = sucursales.filter((s) => s.id !== id);
      setSucursales(updatedSucursales);
      // Actualizar sessionStorage
      sessionStorage.setItem('sucursales', JSON.stringify(updatedSucursales));
      // TODO: Aquí deberías hacer una petición DELETE a tu API
    }
  };

  const handleSave = (data: Sucursal) => {
    let updatedSucursales;
    
    if (editingSucursal) {
      updatedSucursales = sucursales.map((s) => (s.id === editingSucursal.id ? data : s));
    } else {
      updatedSucursales = [...sucursales, { ...data, id: Date.now().toString() }];
    }
    
    setSucursales(updatedSucursales);
    // Actualizar sessionStorage
    sessionStorage.setItem('sucursales', JSON.stringify(updatedSucursales));
    
    setIsModalOpen(false);
    setEditingSucursal(null);
    // TODO: Aquí deberías hacer una petición POST/PUT a tu API
  };

  const filteredSucursales = sucursales.filter(
    (s) =>
      s.nombre_negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.giro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            <div className="flex gap-2">
              <button
                onClick={refreshSucursales}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Nueva Sucursal
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center p-12 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Cargando sucursales...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : (
          <SucursalTable
            sucursales={filteredSucursales}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

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
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useHeader } from '@/contexts/headerContexts';
import SucursalModal from '@/components/sucursales/sucursalModal';
import SucursalTable from '@/components/sucursales/sucursalTable';
import SucursalCards from '@/components/sucursales/sucursalCards';
import DeleteConfirmationModal from '@/components/sucursales/DeleteConfirmationModal';
import { Sucursal } from '@/types/sucursal';
import { RefreshCw, Plus, LayoutGrid, Table } from 'lucide-react';

export default function SucursalesPage() {
  const { setTitle } = useHeader();
  const { data: session, status } = useSession();

  useEffect(() => {
    setTitle('Gestión de Sucursales');
  }, [setTitle]);

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sucursalToDelete, setSucursalToDelete] = useState<Sucursal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Crear clave única por usuario para el almacenamiento en sesión
  const getUserStorageKey = () => {
    const userId = session?.user?.id || session?.user?.email || 'guest';
    return `sucursales_${userId}`;
  };

  // Limpiar cachés de otros usuarios
  const clearOtherUsersCache = () => {
    const currentKey = getUserStorageKey();
    const allKeys = Object.keys(sessionStorage);
    
    allKeys.forEach(key => {
      if (key.startsWith('sucursales_') && key !== currentKey) {
        sessionStorage.removeItem(key);
        console.log(`Caché limpiado: ${key}`);
      }
    });
  };

  // Función para cargar las sucursales
  const fetchSucursales = async () => {
    if (status === 'loading') return;

    try {
      setIsLoading(true);
      setError(null);
      
      const storageKey = getUserStorageKey();
      const cachedSucursales = sessionStorage.getItem(storageKey);
      
      if (cachedSucursales) {
        console.log(`Cargando sucursales desde caché (${storageKey})...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        setSucursales(JSON.parse(cachedSucursales));
        setIsLoading(false);
        return;
      }
      
      const [data] = await Promise.all([
        fetch('/api/sucursales').then(async (response) => {
          if (!response.ok) {
            throw new Error('Error al cargar las sucursales');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      sessionStorage.setItem(storageKey, JSON.stringify(data));
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
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      setSucursales(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar las sucursales');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar sucursales cuando la sesión esté lista o cambie el usuario
  useEffect(() => {
    if (status === 'authenticated') {
      clearOtherUsersCache();
      fetchSucursales();
    }
  }, [status, session?.user?.id, session?.user?.email]);

  const handleCreate = () => {
    setEditingSucursal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const sucursal = sucursales.find(s => s.id === id);
    if (sucursal) {
      setSucursalToDelete(sucursal);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!sucursalToDelete) return;

    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/sucursales/${sucursalToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      const updatedSucursales = sucursales.filter((s) => s.id !== sucursalToDelete.id);
      setSucursales(updatedSucursales);
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(updatedSucursales));
      
      setIsDeleteModalOpen(false);
      setSucursalToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la sucursal');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus: 'activo' | 'inactivo' = currentStatus === 'activo' ? 'inactivo' : 'activo';
    
    try {
      setLoadingStatusId(id);
      
      const [response] = await Promise.all([
        fetch(`/api/sucursales/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: newStatus }),
        }),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      if (!response.ok) throw new Error('Error al cambiar estado');

      const sucursalActualizada = await response.json();
      const updatedSucursales = sucursales.map((s) => 
        s.id === id ? sucursalActualizada : s
      );
      
      setSucursales(updatedSucursales);
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(updatedSucursales));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado');
    } finally {
      setLoadingStatusId(null);
    }
  };

  const handleSave = async (data: Sucursal) => {
    try {
      if (editingSucursal) {
        const response = await fetch(`/api/sucursales/${editingSucursal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al actualizar');

        const sucursalActualizada = await response.json();
        const updatedSucursales = sucursales.map((s) => 
          s.id === editingSucursal.id ? sucursalActualizada : s
        );
        setSucursales(updatedSucursales);
        
        const storageKey = getUserStorageKey();
        sessionStorage.setItem(storageKey, JSON.stringify(updatedSucursales));
      } else {
        const response = await fetch('/api/sucursales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al crear');

        const nuevaSucursal = await response.json();
        const updatedSucursales = [...sucursales, nuevaSucursal];
        setSucursales(updatedSucursales);
        
        const storageKey = getUserStorageKey();
        sessionStorage.setItem(storageKey, JSON.stringify(updatedSucursales));
      }
      
      setIsModalOpen(false);
      setEditingSucursal(null);
    } catch (error) {
      console.error('Error al guardar la sucursal:', error);
    }
  };

  const filteredSucursales = sucursales.filter(
    (s) =>
      s.nombre_negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.giro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-12">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Verificando sesión...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
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
              {/* Toggle de vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista de tabla"
                >
                  <Table className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium"></span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Vista de tarjetas"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium"></span>
                </button>
              </div>

              <button
                onClick={refreshSucursales}
                className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                title="Refrescar sucursales"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleCreate}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                title="Agregar nueva sucursal"
              > 
                <Plus className="w-4 h-4" />
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
        ) : viewMode === 'table' ? (
          <SucursalTable
            sucursales={filteredSucursales}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            loadingStatusId={loadingStatusId}
          />
        ) : (
          <SucursalCards
            sucursales={filteredSucursales}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            loadingStatusId={loadingStatusId}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSucursalToDelete(null);
        }}
        onConfirm={confirmDelete}
        sucursalName={sucursalToDelete?.nombre_negocio || ''}
        isDeleting={isDeleting}
      /> 
    </main>
  );
}
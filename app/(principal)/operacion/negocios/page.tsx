'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useHeader } from '@/contexts/headerContexts';
import NegocioModal from '@/components/negocios/negocioModal';
import NegocioTable from '@/components/negocios/negocioTable';
import NegocioCards from '@/components/negocios/negocioCards';
import DeleteConfirmationModal from '@/components/negocios/DeleteConfirmationModal';
import { Negocio } from '@/types/negocio';
import { RefreshCw, Plus, LayoutGrid, Table } from 'lucide-react';

export default function NegociosPage() {
  const { setTitle } = useHeader();
  const { data: session, status } = useSession();

  useEffect(() => {
    setTitle('Gestión de Negocios');
  }, [setTitle]);

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNegocio, setEditingNegocio] = useState<Negocio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [negocioToDelete, setNegocioToDelete] = useState<Negocio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Crear clave única por usuario para el almacenamiento en sesión
  const getUserStorageKey = () => {
    const userId = session?.user?.id_usuario || session?.user?.email || 'guest';
    return `negocios_${userId}`;
  };

  // Limpiar cachés de otros usuarios
  const clearOtherUsersCache = () => {
    const currentKey = getUserStorageKey();
    const allKeys = Object.keys(sessionStorage);
    
    allKeys.forEach(key => {
      if (key.startsWith('negocios_') && key !== currentKey) {
        sessionStorage.removeItem(key);
        console.log(`Caché limpiado: ${key}`);
      }
    });
  };

  // Función para cargar los negocios
  const fetchNegocios = async () => {
    if (status === 'loading') return;

    try {
      setIsLoading(true);
      setError(null);
      
      const storageKey = getUserStorageKey();
      const cachedNegocios = sessionStorage.getItem(storageKey);
      
      if (cachedNegocios) {
        console.log(`Cargando negocios desde caché (${storageKey})...`);
        await new Promise(resolve => setTimeout(resolve, 800));
        setNegocios(JSON.parse(cachedNegocios));
        setIsLoading(false);
        return;
      }
      
      const [data] = await Promise.all([
        fetch('/api/negocios').then(async (response) => {
          if (!response.ok) {
            throw new Error('Error al cargar los negocios');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      setNegocios(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los negocios');
      setIsLoading(false);
    }
  };

  // Función para refrescar los datos desde la API
  const refreshNegocios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [data] = await Promise.all([
        fetch('/api/negocios').then(async (response) => {
          if (!response.ok) {
            throw new Error('Error al cargar los negocios');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      setNegocios(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los negocios');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar negocios cuando la sesión esté lista o cambie el usuario
  useEffect(() => {
    if (status === 'authenticated') {
      clearOtherUsersCache();
      fetchNegocios();
    }
  }, [status, session?.user?.id, session?.user?.email]);

  const handleCreate = () => {
    setEditingNegocio(null);
    setIsModalOpen(true);
  };

  const handleEdit = (negocio: Negocio) => {
    setEditingNegocio(negocio);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const negocio = negocios.find((item) => item.id === id);
    if (negocio) {
      setNegocioToDelete(negocio);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!negocioToDelete) return;

    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/negocios/${negocioToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      const updatedNegocios = negocios.filter((item) => item.id !== negocioToDelete.id);
      setNegocios(updatedNegocios);
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(updatedNegocios));
      
      setIsDeleteModalOpen(false);
      setNegocioToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el negocio');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus: 'activo' | 'inactivo' = currentStatus === 'activo' ? 'inactivo' : 'activo';
    
    try {
      setLoadingStatusId(id);
      
      const [response] = await Promise.all([
        fetch(`/api/negocios/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: newStatus }),
        }),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      if (!response.ok) throw new Error('Error al cambiar estado');

      const negocioActualizado = await response.json();
      const updatedNegocios = negocios.map((item) => 
        item.id === id ? negocioActualizado : item
      );
      
      setNegocios(updatedNegocios);
      
      const storageKey = getUserStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(updatedNegocios));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado');
    } finally {
      setLoadingStatusId(null);
    }
  };

  const handleSave = async (data: Negocio) => {
    try {
      if (editingNegocio) {
        const response = await fetch(`/api/negocios/${editingNegocio.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al actualizar');

        const negocioActualizado = await response.json();
        const updatedNegocios = negocios.map((item) => 
          item.id === editingNegocio.id ? negocioActualizado : item
        );
        setNegocios(updatedNegocios);
        
        const storageKey = getUserStorageKey();
        sessionStorage.setItem(storageKey, JSON.stringify(updatedNegocios));
      } else {
        const response = await fetch('/api/negocios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al crear');

        const nuevoNegocio = await response.json();
        const updatedNegocios = [...negocios, nuevoNegocio];
        setNegocios(updatedNegocios);
        
        const storageKey = getUserStorageKey();
        sessionStorage.setItem(storageKey, JSON.stringify(updatedNegocios));
      }
      
      setIsModalOpen(false);
      setEditingNegocio(null);
    } catch (error) {
      console.error('Error al guardar el negocio:', error);
    }
  };

  const filteredNegocios = negocios.filter(
    (item) =>
      item.nombre_negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.giro.toLowerCase().includes(searchTerm.toLowerCase())
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
                placeholder="Buscar negocios..."
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
                onClick={refreshNegocios}
                className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                title="Refrescar negocios"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleCreate}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                title="Agregar nuevo negocio"
              > 
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center p-12 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Cargando negocios...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : viewMode === 'table' ? (
          <NegocioTable
            negocios={filteredNegocios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            loadingStatusId={loadingStatusId}
          />
        ) : (
          <NegocioCards
            negocios={filteredNegocios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            loadingStatusId={loadingStatusId}
          />
        )}
      </div>

      {isModalOpen && (
        <NegocioModal
          negocio={editingNegocio}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNegocio(null);
          }}
          onSave={handleSave}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNegocioToDelete(null);
        }}
        onConfirm={confirmDelete}
        negocioName={negocioToDelete?.nombre_negocio || ''}
        isDeleting={isDeleting}
      /> 
    </main>
  );
}

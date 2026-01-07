'use client';
 
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function DashboardPage() {

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Redirigir a login si no está autenticado
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const kpis = [
    { label: 'Sucursales Activas', value: '24', change: '+12%', icon: '🏪' },
    { label: 'Conversaciones Hoy', value: '156', change: '+8%', icon: '💬' },
    { label: 'Oportunidades', value: '48', change: '+23%', icon: '📊' },
    { label: 'Tasa de Conversión', value: '67%', change: '+5%', icon: '🎯' },
  ];

  const actividadReciente = [
    { tipo: 'conversacion', titulo: 'Nueva conversación - WhatsApp', tiempo: 'Hace 5 min', icono: '💬' },
    { tipo: 'prospecto', titulo: 'Nuevo prospecto: María García', tiempo: 'Hace 12 min', icono: '👤' },
    { tipo: 'demo', titulo: 'Demo agendada para mañana 10:00', tiempo: 'Hace 1 hora', icono: '📅' },
    { tipo: 'automatizacion', titulo: 'Automatización ejecutada exitosamente', tiempo: 'Hace 2 horas', icono: '🔄' },
  ];

  const canalesPorEstado = [
    { nombre: 'WhatsApp Business', estado: 'conectado', mensajes: 89 },
    { nombre: 'Facebook Messenger', estado: 'conectado', mensajes: 45 },
    { nombre: 'Instagram DM', estado: 'desconectado', mensajes: 0 },
    { nombre: 'Web Chat', estado: 'conectado', mensajes: 22 },
  ];

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenido de nuevo, aquí está tu resumen del día</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 overflow-y-auto">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{kpi.icon}</span>
                <span className="text-sm font-semibold text-green-600">{kpi.change}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividad Reciente */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {actividadReciente.map((actividad, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <span className="text-2xl">{actividad.icono}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{actividad.titulo}</p>
                      <p className="text-xs text-gray-500 mt-1">{actividad.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                + Nueva Conversación
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                + Agregar Prospecto
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                📅 Agendar Demo
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                📊 Ver Reportes
              </button>
            </div>
          </div>
        </div>

        {/* Canales de Comunicación */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Estado de Canales</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {canalesPorEstado.map((canal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{canal.nombre}</h3>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        canal.estado === 'conectado' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 capitalize">{canal.estado}</p>
                  <p className="text-2xl font-bold text-gray-900">{canal.mensajes}</p>
                  <p className="text-xs text-gray-500">mensajes hoy</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfica Simple de Conversiones */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Conversiones de la Semana</h2>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {[65, 78, 85, 72, 90, 88, 95].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
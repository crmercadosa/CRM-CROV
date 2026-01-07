export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/dashboard',
  },
  {
    id: 'operacion',
    label: 'Operación',
    icon: '🏢',
    children: [
      {
        id: 'sucursales',
        label: 'Sucursales',
        icon: '🏪',
        href: '/operacion/sucursales',
      },
      {
        id: 'usuarios-roles',
        label: 'Usuarios & Roles',
        icon: '👥',
        href: '/operacion/usuarios-roles',
      },
    ],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación',
    icon: '📡',
    children: [
      {
        id: 'conversaciones',
        label: 'Conversaciones',
        icon: '💬',
        href: '/comunicacion/conversaciones',
      },
      {
        id: 'canales',
        label: 'Canales',
        icon: '🔌',
        href: '/comunicacion/canales',
      },
    ],
  },
  {
    id: 'ia',
    label: 'Inteligencia Artificial',
    icon: '🤖',
    children: [
      {
        id: 'asistentes',
        label: 'Asistentes IA',
        icon: '🤖',
        href: '/ia/asistentes',
      },
      {
        id: 'prompt-builder',
        label: 'Prompt Builder',
        icon: '🧩',
        href: '/ia/prompt-builder',
      },
      {
        id: 'intenciones',
        label: 'Intenciones',
        icon: '🎯',
        href: '/ia/intenciones',
      },
      {
        id: 'automatizaciones',
        label: 'Automatizaciones',
        icon: '🔄',
        href: '/ia/automatizaciones',
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: '📈',
    children: [
      {
        id: 'prospectos',
        label: 'Prospectos',
        icon: '👤',
        href: '/ventas/prospectos',
      },
      {
        id: 'oportunidades',
        label: 'Oportunidades',
        icon: '📊',
        href: '/ventas/oportunidades',
      },
      {
        id: 'agenda-demos',
        label: 'Agenda & Demos',
        icon: '📅',
        href: '/ventas/agenda-demos',
      },
    ],
  },
  {
    id: 'analitica',
    label: 'Analítica',
    icon: '📊',
    children: [
      {
        id: 'reportes',
        label: 'Reportes',
        icon: '📈',
        href: '/analitica/reportes',
      },
      {
        id: 'logs',
        label: 'Logs',
        icon: '📝',
        href: '/analitica/logs',
      },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: '⚙️',
    href: '/configuracion',
  },
];
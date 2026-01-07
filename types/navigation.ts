import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Radio,
  Bot,
  TrendingUp,
  BarChart3,
  Settings,
  Store,
  Users,
  MessageSquare,
  Plug,
  Sparkles,
  Target,
  Zap,
  UserPlus,
  Calendar,
  FileText,
  ScrollText,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'operacion',
    label: 'Operación',
    icon: Building2,
    children: [
      {
        id: 'sucursales',
        label: 'Sucursales',
        icon: Store,
        href: '/operacion/sucursales',
      },
      {
        id: 'usuarios-roles',
        label: 'Usuarios & Roles',
        icon: Users,
        href: '/operacion/usuarios-roles',
      },
    ],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación',
    icon: Radio,
    children: [
      {
        id: 'conversaciones',
        label: 'Conversaciones',
        icon: MessageSquare,
        href: '/comunicacion/conversaciones',
      },
      {
        id: 'canales',
        label: 'Canales',
        icon: Plug,
        href: '/comunicacion/canales',
      },
    ],
  },
  {
    id: 'ia',
    label: 'Inteligencia Artificial',
    icon: Bot,
    children: [
      {
        id: 'asistentes',
        label: 'Asistentes IA',
        icon: Bot,
        href: '/ia/asistentes',
      },
      {
        id: 'prompt-builder',
        label: 'Prompt Builder',
        icon: Sparkles,
        href: '/ia/prompt-builder',
      },
      {
        id: 'intenciones',
        label: 'Intenciones',
        icon: Target,
        href: '/ia/intenciones',
      },
      {
        id: 'automatizaciones',
        label: 'Automatizaciones',
        icon: Zap,
        href: '/ia/automatizaciones',
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: TrendingUp,
    children: [
      {
        id: 'prospectos',
        label: 'Prospectos',
        icon: UserPlus,
        href: '/ventas/prospectos',
      },
      {
        id: 'oportunidades',
        label: 'Oportunidades',
        icon: BarChart3,
        href: '/ventas/oportunidades',
      },
      {
        id: 'agenda-demos',
        label: 'Agenda & Demos',
        icon: Calendar,
        href: '/ventas/agenda-demos',
      },
    ],
  },
  {
    id: 'analitica',
    label: 'Analítica',
    icon: BarChart3,
    children: [
      {
        id: 'reportes',
        label: 'Reportes',
        icon: FileText,
        href: '/analitica/reportes',
      },
      {
        id: 'logs',
        label: 'Logs',
        icon: ScrollText,
        href: '/analitica/logs',
      },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: Settings,
    href: '/configuracion',
  },
];
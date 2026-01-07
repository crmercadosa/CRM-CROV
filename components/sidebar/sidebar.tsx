'use client';

import { useState } from 'react';
import Image from 'next/image';
import NavItem from './navitem';
import { navigationItems } from '@/types/navigation';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const isExpanded = !isCollapsed || (isCollapsed && isHovering);

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${
        isExpanded ? 'w-56' : 'w-16'
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Header con logo y botón hamburguesa */}
      <div className="p-3 border-b border-gray-200">
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo_Crov.webp" 
                alt="Logo" 
                width={28} 
                height={28}
                className="rounded"
              />
              <h2 className="text-sm font-bold text-gray-800 whitespace-nowrap">Mi App</h2>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              aria-label="Colapsar sidebar"
            >
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 cursor-pointer"
              aria-label="Expandir sidebar"
            >
              <Image 
                src="/logo_Crov.webp" 
                alt="Logo" 
                width={28} 
                height={28}
                className="rounded"
              />
            </button>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navigationItems.map((item) => (
          <NavItem key={item.id} item={item} isCollapsed={!isExpanded} />
        ))}
      </nav>
    </aside>
  );
}
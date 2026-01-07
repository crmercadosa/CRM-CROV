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
        isExpanded ? 'w-64' : 'w-20'
      } h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Header con logo y botón hamburguesa */}
      <div className="p-4 border-b border-gray-200">
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo_crov.webp" 
                alt="Logo" 
                width={40} 
                height={40}
                className="rounded"
              />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Colapsar sidebar"
            >
              <svg
                className="w-6 h-6 text-black"
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
              className="p-2 cursor-pointer"
              aria-label="Expandir sidebar"
            >
              <Image 
                src="/logo_crov.webp" 
                alt="Logo" 
                width={40} 
                height={40}
                className="rounded"
              />
            </button>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => (
          <NavItem key={item.id} item={item} isCollapsed={!isExpanded} />
        ))}
      </nav>
    </aside>
  );
}
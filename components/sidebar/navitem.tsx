'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavItem as NavItemType } from '@/types/navigation';

interface NavItemProps {
  item: NavItemType;
  isCollapsed: boolean;
}

export default function NavItem({ item, isCollapsed }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  if (item.href && !hasChildren) {
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
      </Link>
    );
  }

  const Icon = item.icon;
  
  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
        </div>
        {!isCollapsed && hasChildren && (
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {hasChildren && isOpen && !isCollapsed && (
        <div className="ml-3 mt-0.5 space-y-0.5">
          {item.children?.map((child) => {
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.id}
                href={child.href || '#'}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
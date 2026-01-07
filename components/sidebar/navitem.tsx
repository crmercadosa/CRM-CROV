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
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{item.icon}</span>
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </div>
        {!isCollapsed && hasChildren && (
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {hasChildren && isOpen && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children?.map((child) => (
            <Link
              key={child.id}
              href={child.href || '#'}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-lg">{child.icon}</span>
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
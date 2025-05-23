
import React from 'react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  badge?: number;
  phase?: 1 | 2 | 3;
}

interface MobileBottomNavProps {
  items: NavItem[];
  onItemClick: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  onItemClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-neutral-200 bg-white">
      <div className="grid h-full grid-cols-5">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onItemClick(item.path)}
            className={`flex flex-col items-center justify-center ${
              item.isActive ? 'text-primary-600' : 'text-neutral-600'
            } ${item.phase ? 'relative' : ''}`}
          >
            <div className="flex h-6 w-6 items-center justify-center">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs text-white">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="mt-1 text-xs">{item.label}</span>
            {item.phase && (
              <span className="absolute -right-1 -top-0.5 rounded-full bg-info-100 px-1.5 py-0.5 text-[10px] text-info-800">
                P{item.phase}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

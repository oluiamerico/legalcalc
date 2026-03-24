'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Novo Cálculo', href: '/', icon: 'plus' },
  { label: 'Histórico', href: '/historico', icon: 'clock' },
];

const icons: Record<string, React.ReactNode> = {
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[220px] md:min-h-screen flex flex-col md:flex-col bg-bg-secondary border-b md:border-b-0 md:border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between md:justify-start gap-3 px-5 py-3 md:py-5 border-b md:border-border">
        <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-text-primary">LegalCalc</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 md:py-4 overflow-x-auto">
        <ul className="flex flex-row md:flex-col gap-2 md:gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center flex-row gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 no-underline whitespace-nowrap ${
                    isActive
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-transparent'
                  }`}
                >
                  <span className="shrink-0">{icons[item.icon]}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer divider */}
      <div className="border-t border-border mt-auto" />
    </aside>
  );
}

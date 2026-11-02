"use client";

import { useTheme } from "@/components/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logo.png' : '/logo-dark-text.png';

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] py-12 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center">
          <div className="relative h-10 w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Tributum Power Private Limited"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
          <a href="#crisis" className="hover:text-[var(--text-primary)] transition-colors">The Challenge</a>
          <a href="#solution" className="hover:text-[var(--text-primary)] transition-colors">The Solution</a>
          <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">AtmosPOLE™</a>
          <a href="#interactiveHardware" className="hover:text-[var(--text-primary)] transition-colors">Subsystems</a>
          <a href="#vision" className="hover:text-[var(--text-primary)] transition-colors">Smart India</a>
        </div>

        {/* Legal */}
        <div className="text-[11px] text-[var(--text-muted)] font-normal">
          © 2026 Tributum Power Private Limited. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

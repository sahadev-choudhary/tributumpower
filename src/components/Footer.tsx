import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center">
          <div className="relative h-10 w-auto">
            <Image
              src="/tributum-logo-clean.png"
              alt="Tributum Power Private Limited"
              width={180}
              height={55}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
          <a href="#crisis" className="hover:text-slate-900 transition-colors">The Challenge</a>
          <a href="#solution" className="hover:text-slate-900 transition-colors">The Solution</a>
          <a href="#features" className="hover:text-slate-900 transition-colors">AtmosPOLE™</a>
          <a href="#vision" className="hover:text-slate-900 transition-colors">Smart India</a>
        </div>

        {/* Legal */}
        <div className="text-[11px] text-slate-400 font-normal">
          © 2026 Tributum Power Private Limited. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

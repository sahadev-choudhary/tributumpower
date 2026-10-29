"use client";

export default function SolutionBridge() {
  return (
    <section id="solution" className="py-20 px-6 bg-slate-50/80 border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            The Urban Leap
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Every Indian City Has Millions of Street Poles.
            <br />
            <span className="gradient-green-light">What If They Did More?</span>
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed max-w-2xl">
            We do not need to tear up roadways or acquire expensive new urban land.
            The solution lies in upgrading the poles already standing on every street corner.
          </p>
        </div>

        {/* Before / After Comparison */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Before: Ordinary Streetlamp */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Standard</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] font-bold">
                BEFORE
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Conventional Streetlamp</h3>
            
            <ul className="space-y-3">
              {[
                "Only illuminates roads — offers zero environmental protection",
                "Draws heavy grid electricity 365 nights a year",
                "Passive asset during toxic winter smog peaks",
                "No sensor feedback, air monitoring, or citizen transparency",
                "No CCTV surveillance — requires separate poles for municipal security",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-500">
                  <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] mt-0.5 shrink-0">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After: AtmosPOLE™ */}
          <div className="bg-emerald-50/50 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Next-Gen Urban Guardian</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                AFTER: ATMOSPOLE™
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">AtmosPOLE™ Smart Infrastructure</h3>
            
            <ul className="space-y-3">
              {[
                "High-efficiency LED illumination + active mist smog suppression",
                "100% solar self-powered with zero operating grid electricity bills",
                "Integrated CCTV surveillance camera for smart city safety & traffic monitoring",
                "Real-time dual PM2.5/PM10 sensors with public AQI screen",
                "Plug-and-play retrofit: exact same footprint as existing poles",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] mt-0.5 shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Transition Prompt to Scroll Section */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#c8102e] animate-ping" />
            <span>Scroll down to inspect AtmosPOLE™ components in detail</span>
          </div>
        </div>

      </div>
    </section>
  );
}

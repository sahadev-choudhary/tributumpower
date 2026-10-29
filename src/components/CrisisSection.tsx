"use client";

const CITIES = [
  { name: "Delhi", aqi: 484, status: "Severe", color: "#dc2626", bar: 95 },
  { name: "Noida", aqi: 468, status: "Severe", color: "#dc2626", bar: 92 },
  { name: "Gurugram", aqi: 451, status: "Severe", color: "#dc2626", bar: 88 },
  { name: "Patna", aqi: 392, status: "Very Poor", color: "#ea580c", bar: 78 },
  { name: "Kolkata", aqi: 356, status: "Very Poor", color: "#ea580c", bar: 70 },
  { name: "Lucknow", aqi: 341, status: "Very Poor", color: "#ea580c", bar: 66 },
  { name: "Mumbai", aqi: 278, status: "Poor", color: "#d97706", bar: 54 },
];

export default function CrisisSection() {
  return (
    <section id="crisis" className="py-20 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header - Trimmed & Positive */}
        <div className="max-w-3xl mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            The Urban Air Reality
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            The AQI Numbers We Face.
            <br />
            <span className="text-[#c8102e]">The Opportunity to Solve Them.</span>
          </h2>
          <p className="text-slate-600 text-base mt-3 leading-relaxed max-w-2xl">
            Major Indian cities regularly breach hazardous pollution thresholds during winter months.
            Traditional centralized air purifiers cannot cover miles of open streets — but existing street lighting infrastructure can.
          </p>
        </div>

        {/* Visual AQI City Tracker Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* City Bars (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Peak Winter AQI Readings</h3>
                <span className="text-[11px] text-slate-400">Official CPCB Monitoring Stations</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Safe Target: 50</span>
              </div>
            </div>

            {/* City Bar Rows */}
            <div className="space-y-3.5">
              {CITIES.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-bold text-slate-700 shrink-0">{c.name}</span>
                  <div className="flex-1 h-6 bg-slate-200/80 rounded-md overflow-hidden relative">
                    <div
                      className="h-full rounded-md flex items-center justify-end pr-2.5 text-white font-mono text-[11px] font-bold transition-all duration-700"
                      style={{
                        width: `${c.bar}%`,
                        backgroundColor: c.color,
                      }}
                    >
                      {c.aqi}
                    </div>
                  </div>
                  <span
                    className="w-20 text-right text-[11px] font-semibold shrink-0"
                    style={{ color: c.color }}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Impact Stats (Right 5 Cols) */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3.5 py-1.5 min-w-[78px] whitespace-nowrap rounded-xl bg-emerald-100/90 text-emerald-800 font-black text-xs sm:text-sm inline-flex items-center justify-center shrink-0 shadow-xs">
                  14 Cities
                </span>
                <h4 className="text-sm font-bold text-slate-800">Global Ranking Alert</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                14 of the world&apos;s 20 most polluted cities are in India. Transforming street-level air quality is the fastest path to public health recovery.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3.5 py-1.5 min-w-[78px] whitespace-nowrap rounded-xl bg-amber-100/90 text-amber-800 font-black text-xs sm:text-sm inline-flex items-center justify-center shrink-0 shadow-xs">
                  35M+
                </span>
                <h4 className="text-sm font-bold text-slate-800">Streetlight Opportunity</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                India has over 35 million conventional streetlights. Each one is a ready mounting point for solar-powered air purification.
              </p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-5 card-hover sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3.5 py-1.5 min-w-[78px] whitespace-nowrap rounded-xl bg-sky-100/90 text-sky-800 font-black text-xs sm:text-sm inline-flex items-center justify-center shrink-0 shadow-xs">
                  0-Grid
                </span>
                <h4 className="text-sm font-bold text-slate-800">Clean Energy Independence</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AtmosPOLE™ harnesses rooftop solar power. Scaling thousands of poles does not strain municipal electricity grids.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

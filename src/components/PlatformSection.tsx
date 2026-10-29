"use client";

const LIVE_METRICS = [
  { label: "Ambient Air PM2.5", value: "125 µg/m³", status: "Unhealthy Intake", color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Treated Air PM2.5", value: "4.16 µg/m³", status: "Clean Output", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Treated Air PM10", value: "3.81 µg/m³", status: "Clean Output", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "24-Hr Air Cleaned", value: "8,06,400 cu ft", status: "Continuous Volume", color: "text-sky-700", bg: "bg-sky-50" },
];

export default function PlatformSection() {
  return (
    <section id="telemetry" className="py-20 px-6 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Section Header */}
        <div className="max-w-2xl mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-semibold tracking-wide mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Street Telemetry
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transparent Data from Sensor to Screen
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time telemetry streamed directly from deployed AtmosPOLE™ units every 5 minutes.
          </p>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_METRICS.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs card-hover`}
            >
              <div className="text-[11px] font-medium text-slate-400 mb-1">{m.label}</div>
              <div className={`text-xl sm:text-2xl font-black ${m.color} tracking-tight font-mono mb-2`}>
                {m.value}
              </div>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${m.bg} ${m.color}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

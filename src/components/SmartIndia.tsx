"use client";

import Image from "next/image";

const VISION_CARDS = [
  {
    title: "National Clean Air Programme",
    desc: "Directly assists Indian municipal corporations in meeting NCAP 40% PM reduction targets through active street-level suppression.",
    icon: "🌱",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/25",
  },
  {
    title: "100 Smart Cities Mission",
    desc: "Seamlessly connects into Integrated Command and Control Centres (ICCC) for hyper-local environmental telemetry and integrated 24/7 CCTV security surveillance.",
    icon: "🏙️",
    accent: "text-sky-500",
    bg: "bg-sky-500/10 border-sky-500/25",
  },
  {
    title: "Zero Disruption Rollout",
    desc: "Standardized bolt-down baseplate matches existing street pole foundations. One pole swapped in under two hours with zero road redesign.",
    icon: "⚡",
    accent: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/25",
  },
];

export default function SmartIndia() {
  return (
    <section id="vision" className="py-24 px-6 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-semibold tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Urban Vision
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
            A Developing India Deserves
            <br />
            <span className="text-[#c8102e]">World-Class Clean Streets.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-base mt-3 leading-relaxed max-w-2xl">
            India is modernizing at breathtaking speed. AtmosPOLE™ ensures that industrial progress and public health go hand in hand, turning roadway corridors into active purification corridors.
          </p>
        </div>

        {/* Visual Street Deployment Showcase with video-deployment.mp4 */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left 6 Cols: Video Deployment Player matching Image 3 */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-card)] group bg-black">
            <div className="relative w-full h-[380px] sm:h-[460px]">
              <video
                src="/video-deployment.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover block group-hover:scale-102 transition-transform duration-700"
              />
            </div>
            {/* Overlay badge matching Image 3 */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60 dark:border-white/10 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  High-Resolution Engineering View
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  AtmosPOLE™ Architectural Close-up & Active Misting
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2" />
            </div>
          </div>

          {/* Vision Impact Cards (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {VISION_CARDS.map((v, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${v.bg} shadow-xs card-hover flex items-start gap-4 transition-all`}
              >
                <div className="text-2xl shrink-0 p-2.5 bg-[var(--bg-card)] rounded-xl shadow-xs border border-[var(--border-subtle)]">
                  {v.icon}
                </div>
                <div>
                  <h3 className={`text-base font-bold ${v.accent} mb-1`}>
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Recent Coverage & Field Demonstrations */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-500 text-xs font-semibold tracking-wide mb-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Live Demonstrations & Media
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                See AtmosPOLE™ in Action
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md">
              Watch recent on-ground coverage, field tests, and video interviews highlighting the pole&apos;s real-time particulate treatment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Video Card 1: Facebook Reel */}
            <a
              href="https://www.facebook.com/reel/1045563091578052"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 mb-5">
                <Image
                  src="/atmospole-street.jpg"
                  alt="AtmosPOLE™ Live Demonstration on Facebook Reel"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Platform Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook Reel</span>
                </div>

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform pl-1">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-bold block mb-0.5">
                    Live Broadcast & Interview
                  </span>
                  <span className="text-sm font-bold line-clamp-1">
                    On-Ground Field Demonstration & Particulate Knock-Down
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors mb-1.5 flex items-center justify-between">
                  <span>AtmosPOLE™ Live Coverage Video</span>
                  <span className="text-xs text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                    Watch Video ↗
                  </span>
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  Watch the live broadcast interview demonstrating how the smart pole operates on active roads with real-time mist smog suppression.
                </p>
              </div>
            </a>

            {/* Video Card 2: Instagram Reel */}
            <a
              href="https://www.instagram.com/reels/DcfKu6DBrRW/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900 mb-5">
                <Image
                  src="/atmospole-street.jpg"
                  alt="AtmosPOLE™ Field Overview on Instagram Reel"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Platform Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram Reel</span>
                </div>

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 text-rose-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform pl-1">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold block mb-0.5">
                    Field Feature Video
                  </span>
                  <span className="text-sm font-bold line-clamp-1">
                    AtmosPOLE™ Live Misting & Digital Display Demonstration
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-rose-500 transition-colors mb-1.5 flex items-center justify-between">
                  <span>AtmosPOLE™ Instagram Feature</span>
                  <span className="text-xs text-rose-500 font-semibold group-hover:translate-x-1 transition-transform">
                    Watch Reel ↗
                  </span>
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                  Explore how AtmosPOLE™ tackles India&apos;s urban air challenge, showcasing the active misting system and real-time public telemetry.
                </p>
              </div>
            </a>

          </div>
        </div>

        {/* Positive Municipal Callout Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              <span className="block">Bring AtmosPOLE™</span>
              <span className="block">to Your City</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl font-normal leading-relaxed">
              Connect with Tributum Power for corridor pilot assessments, urban energy modeling, and smart city implementation schedules.
            </p>
          </div>
          <a
            href="mailto:contact@tributumpower.com"
            className="px-8 py-3.5 rounded-full bg-white text-emerald-900 font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Contact Us</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}

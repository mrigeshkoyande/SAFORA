import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Auto-advance after 4 seconds to onboarding or dashboard
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main
      className="relative min-h-dvh w-full flex flex-col items-center justify-between p-6 overflow-hidden bg-gradient-to-b from-[#2d0b1e] via-[#1a0718] to-[#0d040e] text-white select-none"
      aria-label="SAFORA Startup Experience"
    >
      {/* Background Video Layer */}
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen scale-105 pointer-events-none"
        >
          <source src="/app-login-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Atmospheric Vibrant Glow Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-600/25 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Dark & Glass Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0d040e] via-transparent to-black/30 pointer-events-none" />

      {/* Header Badge */}
      <div className="relative z-20 pt-6 flex items-center gap-2">
        <span className="px-4 py-1.5 bg-pink-500/20 border border-pink-400/40 rounded-full text-xs font-semibold tracking-widest text-pink-200 uppercase backdrop-blur-md shadow-lg shadow-pink-500/10">
          Personal Safety Companion
        </span>
      </div>

      {/* Main Branding & Logo */}
      <div className="relative z-20 flex flex-col items-center text-center my-auto px-4 max-w-sm">
        {/* Animated Glow Shield behind Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-pink-500/40 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center p-3 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl transition-transform duration-500 hover:scale-105">
            <img
              src="/app-logo.png"
              alt="SAFORA Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-bold text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-400 tracking-wider uppercase mb-2 drop-shadow-md">
          SAFORA
        </h1>
        <p className="text-pink-100/90 font-medium text-sm md:text-base tracking-wide max-w-xs leading-relaxed">
          Women's Safety & AI Emergency Protection
        </p>
      </div>

      {/* Bottom Action Controls */}
      <div className="relative z-20 w-full max-w-sm pb-6 flex flex-col items-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 active:scale-95 text-white font-bold text-base shadow-xl shadow-pink-600/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Open SAFORA Dashboard</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div className="flex gap-4 items-center pt-1">
          <button
            onClick={() => navigate('/onboarding/1')}
            className="text-xs font-semibold text-pink-300/80 hover:text-white transition-colors tracking-wider uppercase"
          >
            View Features
          </button>
          <span className="text-pink-500/40">•</span>
          <button
            onClick={() => navigate('/auth')}
            className="text-xs font-semibold text-pink-300/80 hover:text-white transition-colors tracking-wider uppercase"
          >
            Login / Signup
          </button>
        </div>
      </div>
    </main>
  );
}

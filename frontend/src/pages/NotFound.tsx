import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d0f11] text-[#e0dcc8] px-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 rounded-full border border-[#b8894f] flex items-center justify-center relative">
          <div className="absolute inset-1 rounded-full border border-[#b8894f]/40"></div>
          <span className="font-serif text-[#d9a865] text-lg">IL</span>
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#888]">InvoiceLoop</span>
      </div>

      <p className="text-[10px] tracking-widest uppercase mb-3 text-[#b8894f]">Error 404</p>
      <h1 className="text-5xl sm:text-6xl font-serif mb-4">Page not found</h1>
      <p className="text-[#888] text-center max-w-md mb-10">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on track.
      </p>

      <Link
        to="/dashboard"
        className="bg-[#e0dcc8] text-[#0d0f11] px-6 py-3 text-xs font-medium tracking-[0.15em] hover:bg-white transition-colors"
      >
        BACK TO DASHBOARD
      </Link>

      <div className="mt-16 border-t border-[#1e2022] pt-6 w-full max-w-xs text-center">
        <p className="text-[10px] tracking-[0.2em] text-[#555]">ENCRYPTED GATEWAY · ACCESS GRANTED</p>
      </div>
    </div>
  );
}
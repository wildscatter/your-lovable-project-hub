import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-8 text-xs text-[#9991a3] sm:px-10">
        <BrandLogo />
        <span>© {new Date().getFullYear()} WildScatter · 18+ · Play responsibly.</span>
        <nav aria-label="Legal pages" className="flex flex-wrap gap-5">
          <a href="/privacy-policy" className="hover:text-[#e1fb50]">Privacy</a>
          <a href="/terms" className="hover:text-[#e1fb50]">Terms</a>
          <a href="/responsible-gambling" className="hover:text-[#e1fb50]">Responsible gaming</a>
        </nav>
      </footer>
  );
}

import { Link } from "react-router-dom";

export default function BrandLogo() {
  return (
    <Link to="/" aria-label="WildScatter VIP homepage" className="inline-flex items-center gap-2 sm:gap-3">
      <span aria-hidden="true" className="text-[30px] sm:text-[38px] leading-none text-[#e0ff50] drop-shadow-[0_0_15px_rgba(221,255,75,.55)]">✦</span>
      <span className="text-lg min-[360px]:text-xl font-black uppercase tracking-[-.055em] text-white sm:text-3xl">WildScatter <span className="text-[#e5bd75]">VIP</span></span>
    </Link>
  );
}

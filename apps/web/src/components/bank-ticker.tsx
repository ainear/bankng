"use client";

import Image from "next/image";

const BANKS = [
  { name: "Vietcombank", short: "VCB", color: "#006633", slug: "vietcombank" },
  { name: "VietinBank", short: "CTG", color: "#C00000", slug: "vietinbank" },
  { name: "BIDV", short: "BID", color: "#1A5276", slug: "bidv" },
  { name: "Agribank", short: "AGR", color: "#006633", slug: "agribank" },
  { name: "Techcombank", short: "TCB", color: "#EF3124", slug: "techcombank" },
  { name: "MB Bank", short: "MBB", color: "#004B87", slug: "mbbank" },
  { name: "ACB", short: "ACB", color: "#0047AA", slug: "acb" },
  { name: "VPBank", short: "VPB", color: "#23A047", slug: "vpbank" },
  { name: "TPBank", short: "TPB", color: "#E2001A", slug: "tpbank" },
  { name: "Sacombank", short: "STB", color: "#1D6DB5", slug: "sacombank" },
  { name: "HDBank", short: "HDB", color: "#003C8F", slug: "hdbank" },
  { name: "VIB", short: "VIB", color: "#0063B0", slug: "vib" },
  { name: "SHB", short: "SHB", color: "#C10000", slug: "shb" },
  { name: "Eximbank", short: "EIB", color: "#004A97", slug: "eximbank" },
  { name: "MSB", short: "MSB", color: "#E31F26", slug: "msb" },
  { name: "SeABank", short: "SSB", color: "#F26522", slug: "seabank" },
  { name: "OCB", short: "OCB", color: "#007DC5", slug: "ocb" },
  { name: "LPBank", short: "LPB", color: "#005BAA", slug: "lpbank" },
  { name: "NamABank", short: "NAB", color: "#E52629", slug: "namabank" },
  { name: "PVcomBank", short: "PVC", color: "#0067B1", slug: "pvcombank" },
];

const VIETQR_LOGO_MAP: Record<string, string> = {
  vietcombank: "VCB",
  vietinbank: "ICB",
  bidv: "BIDV",
  agribank: "VBA",
  techcombank: "TCB",
  mbbank: "MB",
  acb: "ACB",
  vpbank: "VPB",
  tpbank: "TPB",
  sacombank: "STB",
  hdbank: "HDB",
  vib: "VIB",
  shb: "SHB",
  eximbank: "EIB",
  msb: "MSB",
  seabank: "SEAB",
  ocb: "OCB",
  lpbank: "LPB",
  namabank: "NAB",
  pvcombank: "PVCB",
};

// Duplicate list for seamless loop
const TICKER_BANKS = [...BANKS, ...BANKS];

function BankLogo({ name, short, color, slug }: { name: string; short: string; color: string; slug: string }) {
  const code = VIETQR_LOGO_MAP[slug] ?? short;
  const logoUrl = `https://cdn.vietqr.io/img/${code}.png`;
  
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md">
      {/* Real image logo */}
      <Image
        src={logoUrl}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 object-contain"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
          const sibling = (e.target as HTMLElement).nextElementSibling;
          if (sibling) {
            (sibling as HTMLElement).classList.remove("hidden");
            (sibling as HTMLElement).classList.add("flex");
          }
        }}
      />
      
      {/* Fallback circular badge if image fails to load */}
      <div
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {short.slice(0, 3)}
      </div>
      <span className="whitespace-nowrap text-sm font-medium text-[var(--bankng-text-primary)]">
        {name}
      </span>
    </div>
  );
}

export function BankTicker() {
  return (
    <div className="w-full overflow-hidden bg-[var(--bankng-surface-muted)] py-3">
      {/* Fade masks on left/right edges */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--bankng-surface-muted)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--bankng-surface-muted)] to-transparent" />

        {/* Ticker track */}
        <div
          className="flex gap-3"
          style={{
            animation: "bankTicker 40s linear infinite",
            width: "max-content",
          }}
        >
          {TICKER_BANKS.map((bank, i) => (
            <BankLogo key={`${bank.short}-${i}`} {...bank} />
          ))}
        </div>
      </div>

      {/* Inject keyframe via style tag */}
      <style>{`
        @keyframes bankTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flex[style*="bankTicker"] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

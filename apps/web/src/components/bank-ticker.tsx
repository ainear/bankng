"use client";

// Bank logo ticker — infinite auto-scrolling marquee giống nganhang.com
// Sử dụng CSS animation, không cần thư viện ngoài

const BANKS = [
  { name: "Vietcombank", short: "VCB", color: "#006633" },
  { name: "VietinBank", short: "CTG", color: "#C00000" },
  { name: "BIDV", short: "BID", color: "#1A5276" },
  { name: "Agribank", short: "AGR", color: "#006633" },
  { name: "Techcombank", short: "TCB", color: "#EF3124" },
  { name: "MB Bank", short: "MBB", color: "#004B87" },
  { name: "ACB", short: "ACB", color: "#0047AA" },
  { name: "VPBank", short: "VPB", color: "#23A047" },
  { name: "TPBank", short: "TPB", color: "#E2001A" },
  { name: "Sacombank", short: "STB", color: "#1D6DB5" },
  { name: "HDBank", short: "HDB", color: "#003C8F" },
  { name: "VIB", short: "VIB", color: "#0063B0" },
  { name: "SHB", short: "SHB", color: "#C10000" },
  { name: "Eximbank", short: "EIB", color: "#004A97" },
  { name: "MSB", short: "MSB", color: "#E31F26" },
  { name: "SeABank", short: "SSB", color: "#F26522" },
  { name: "OCB", short: "OCB", color: "#007DC5" },
  { name: "LPBank", short: "LPB", color: "#005BAA" },
  { name: "NamABank", short: "NAB", color: "#E52629" },
  { name: "PVcomBank", short: "PVC", color: "#0067B1" },
];

// Duplicate list for seamless loop
const TICKER_BANKS = [...BANKS, ...BANKS];

function BankLogo({ name, short, color }: { name: string; short: string; color: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-[var(--bankng-border)] bg-white px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md">
      {/* Logo placeholder — circular badge with bank color */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
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

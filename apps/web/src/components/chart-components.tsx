"use client";

import { useMemo } from "react";

interface PieChartProps {
  principal: number; // số tiền gốc (VND)
  interest: number;  // số tiền lãi (VND)
}

export function RepaymentPieChart({ principal, interest }: PieChartProps) {
  const total = principal + interest;
  const principalPercent = total > 0 ? (principal / total) * 100 : 50;
  const interestPercent = total > 0 ? (interest / total) * 100 : 50;

  // SVG parameters for circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (principalPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">📊 Cơ cấu Tổng tiền phải trả</h4>
      <div className="relative h-40 w-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle - Interest */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#fca5a5" // Light red (interest)
            strokeWidth="14"
          />
          {/* Foreground circle - Principal */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#10b981" // Emerald green (principal)
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center Text info */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest">Tổng cộng</span>
          <span className="text-xs font-black text-slate-800 mt-0.5">
            {((total) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xxs font-bold">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-[#10b981]" />
          <span className="text-slate-600">Tiền Gốc: {principalPercent.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-[#fca5a5]" />
          <span className="text-slate-600">Tiền Lãi: {interestPercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  monthlyData: {
    monthIndex: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}

export function RepaymentBarChart({ monthlyData }: BarChartProps) {
  // Only plot max 12 data points to prevent cluttered layout
  const sampledData = useMemo(() => {
    if (monthlyData.length <= 12) return monthlyData;
    const step = Math.ceil(monthlyData.length / 12);
    return monthlyData.filter((_, idx) => idx % step === 0 || idx === monthlyData.length - 1);
  }, [monthlyData]);

  const maxPayment = useMemo(() => {
    return Math.max(...sampledData.map(d => d.principalPaid + d.interestPaid), 1);
  }, [sampledData]);

  return (
    <div className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-xs">
      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-5 text-center">📈 Tiến trình Giảm dần Dư nợ hàng tháng</h4>
      <div className="flex items-end justify-between h-40 gap-1.5 md:gap-2 px-2 border-b border-slate-100">
        {sampledData.map((d, index) => {
          const principalHeight = (d.principalPaid / maxPayment) * 100;
          const interestHeight = (d.interestPaid / maxPayment) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-2 bg-slate-800 text-white rounded px-2 py-1 text-xxs font-semibold opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap shadow-md">
                Gốc: {(d.principalPaid / 1000000).toFixed(1)}M | Lãi: {(d.interestPaid / 1000000).toFixed(1)}M
              </div>

              {/* Stacked bar */}
              <div className="w-full flex flex-col justify-end h-32 rounded-t-sm overflow-hidden bg-slate-50">
                <div 
                  style={{ height: `${interestHeight}%` }} 
                  className="w-full bg-[#fca5a5] hover:opacity-90 transition-all duration-500" 
                />
                <div 
                  style={{ height: `${principalHeight}%` }} 
                  className="w-full bg-[#10b981] hover:opacity-90 transition-all duration-500" 
                />
              </div>

              {/* Label */}
              <span className="text-[9px] font-bold text-slate-400 mt-2">Th.{d.monthIndex}</span>
            </div>
          );
        })}
      </div>

      {/* Axis title */}
      <div className="mt-2.5 flex justify-center gap-4 text-[10px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#10b981]" />
          <span className="text-slate-500">Gốc trả</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#fca5a5]" />
          <span className="text-slate-500">Lãi trả</span>
        </div>
      </div>
    </div>
  );
}

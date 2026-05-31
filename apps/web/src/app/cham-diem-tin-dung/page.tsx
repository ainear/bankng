"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";

type Step = 1 | 2 | 3 | 4;

export default function CreditScorePage() {
  const [step, setStep] = useState<Step>(1);
  
  // State for Form Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Doc-than");
  const [income, setIncome] = useState(15); // triệu VND
  const [expense, setExpense] = useState(8); // triệu VND
  const [debt, setDebt] = useState(2); // triệu VND trả nợ cũ hàng tháng
  const [overdue, setOverdue] = useState("none"); // none, group1 (1-10d), group2 (10-90d), group3 (90d+)
  const [hasCc, setHasCc] = useState(true);

  // Result state
  const [score, setScore] = useState<number | null>(null);
  const [grade, setGrade] = useState(""); // A++, A+, A, B, C, D
  const [dti, setDti] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleCalculate = () => {
    // 1. Calculate DTI (Debt to Income ratio)
    const totalDebtService = debt + (hasCc ? 0.5 : 0); // Giả định thẻ tín dụng chiếm 500k chi phí
    const dtiRatio = Number(((totalDebtService / income) * 100).toFixed(1));
    setDti(dtiRatio);

    // 2. Base score: 1000 points
    let points = 750; // Start at fair

    // Income factor
    if (income >= 50) points += 120;
    else if (income >= 30) points += 90;
    else if (income >= 15) points += 50;
    else points -= 30;

    // Surplus/Expense factor
    const surplus = income - expense - debt;
    if (surplus > 15) points += 60;
    else if (surplus > 5) points += 30;
    else points -= 50;

    // Debt factor (DTI)
    if (dtiRatio === 0) points += 80;
    else if (dtiRatio < 20) points += 40;
    else if (dtiRatio > 50) points -= 150;
    else if (dtiRatio > 35) points -= 80;

    // Overdue history factor (CIC groups)
    if (overdue === "none") {
      points += 150;
    } else if (overdue === "group1") {
      points -= 100;
    } else if (overdue === "group2") {
      points -= 250;
    } else if (overdue === "group3") {
      points -= 450;
    }

    // Cap points
    if (points > 1000) points = 1000;
    if (points < 300) points = 300;

    setScore(points);

    // Grade and recommendation mapping
    let letterGrade = "";
    let recText = "";

    if (points >= 900) {
      letterGrade = "A++";
      recText = "Hồ sơ tín dụng hoàn hảo! Bạn thuộc nhóm khách hàng VIP của mọi ngân hàng, đủ điều kiện nhận các mức lãi suất ưu đãi nhất thị trường (chỉ từ 4.5% - 5.5%/năm cho vay mua nhà). Tỷ lệ duyệt hồ sơ là 99%.";
    } else if (points >= 800) {
      letterGrade = "A+";
      recText = "Hồ sơ cực kỳ tốt! Khả năng duyệt vay cực cao (>90%), hưởng mức lãi suất cạnh tranh và có thể thương lượng thêm biên độ. Thủ tục giải ngân sẽ diễn ra cực kỳ nhanh gọn.";
    } else if (points >= 700) {
      letterGrade = "A";
      recText = "Hồ sơ tốt & an toàn. Hầu hết các ngân hàng thương mại cổ phần tư nhân (Techcombank, ACB, VPBank) sẽ chào đón hồ sơ của bạn với hạn mức tốt. DTI của bạn nên giữ dưới 40% để hồ sơ mượt mà nhất.";
    } else if (points >= 600) {
      letterGrade = "B";
      recText = "Hồ sơ trung bình khá. Bạn vẫn đủ điều kiện vay thế chấp, tuy nhiên đối với các gói vay tín chấp có thể yêu cầu chứng minh thu nhập khắt khe hơn. Nên giảm bớt dư nợ hiện tại để tăng tỷ lệ duyệt.";
    } else if (points >= 500) {
      letterGrade = "C";
      recText = "Hồ sơ dưới trung bình (Nhóm nợ chú ý hoặc nợ cần cơ cấu). Tỷ lệ duyệt ở các ngân hàng lớn là khá thấp. Khuyến nghị bạn thanh toán dứt điểm các khoản nợ cũ quá hạn trong vòng 1-3 tháng và tránh phát sinh nợ mới.";
    } else {
      letterGrade = "D";
      recText = "Nhóm nợ xấu hoặc rủi ro tín dụng rất cao. Hầu hết ngân hàng sẽ từ chối cấp tín dụng. Bạn nên tìm kiếm các giải pháp tái cơ cấu nợ, tuyệt đối tránh phát sinh nợ nhóm 3-5 trên CIC trước khi nộp hồ sơ vay mới.";
    }

    setGrade(letterGrade);
    setRecommendation(recText);
    setStep(4);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
        <div>
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Chấm điểm tín dụng" }
            ]}
          />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mô phỏng Chấm điểm Tín dụng Cá nhân (CIC)</h1>
          </div>
          <p className="mt-2 text-sm text-[var(--bankng-text-secondary)] font-medium">
            Hệ thống chấm điểm thông minh dựa trên mô hình xếp hạng tín dụng tiêu chuẩn của các ngân hàng thương mại Việt Nam.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Cột trái: Form khảo sát multi-step */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-6 shadow-xl shadow-emerald-500/5 bg-white border border-slate-100">
            {step < 4 && (
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bước {step} / 3: {step === 1 ? "Thông tin cá nhân" : step === 2 ? "Khảo sát tài chính" : "Lịch sử tín dụng"}
                </span>
                <div className="flex gap-1">
                  <span className={`h-1.5 w-8 rounded-full ${step >= 1 ? "bg-emerald-600" : "bg-slate-200"}`} />
                  <span className={`h-1.5 w-8 rounded-full ${step >= 2 ? "bg-emerald-600" : "bg-slate-200"}`} />
                  <span className={`h-1.5 w-8 rounded-full ${step >= 3 ? "bg-emerald-600" : "bg-slate-200"}`} />
                </div>
              </div>
            )}

            {/* Bước 1: Thông tin cơ bản */}
            {step === 1 && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Họ và tên của bạn</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Tình trạng hôn nhân</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMaritalStatus("Doc-than")}
                      className={`min-h-11 rounded-xl border text-sm font-bold transition-all ${
                        maritalStatus === "Doc-than"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      🕺 Độc thân
                    </button>
                    <button
                      onClick={() => setMaritalStatus("Ket-hon")}
                      className={`min-h-11 rounded-xl border text-sm font-bold transition-all ${
                        maritalStatus === "Ket-hon"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      💍 Đã kết hôn
                    </button>
                  </div>
                </div>
                <button
                  disabled={!name || !phone}
                  onClick={() => setStep(2)}
                  className="mt-4 bg-emerald-600 text-white min-h-11 font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  Tiếp tục khảo sát tài chính ➔
                </button>
              </div>
            )}

            {/* Bước 2: Khảo sát tài chính */}
            {step === 2 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Thu nhập ròng hàng tháng</label>
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{income} triệu VND</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="1"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xxs text-slate-400 font-semibold">
                    <span>5 triệu</span>
                    <span>50 triệu</span>
                    <span>100 triệu</span>
                    <span>150 triệu</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Chi phí sinh hoạt tối thiểu</label>
                    <span className="text-sm font-extrabold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md">{expense} triệu VND</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="100"
                    step="1"
                    value={expense}
                    onChange={(e) => setExpense(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xxs text-slate-400 font-semibold">
                    <span>3 triệu</span>
                    <span>30 triệu</span>
                    <span>60 triệu</span>
                    <span>100 triệu</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">Số tiền trả nợ cũ hàng tháng (nếu có)</label>
                    <span className="text-sm font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">{debt} triệu VND</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={debt}
                    onChange={(e) => setDebt(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xxs text-slate-400 font-semibold">
                    <span>0 triệu</span>
                    <span>15 triệu</span>
                    <span>30 triệu</span>
                    <span>50 triệu</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <label className="text-sm font-bold text-slate-700 block">Sở hữu thẻ tín dụng?</label>
                    <span className="text-xxs text-slate-400 font-semibold block mt-0.5">Thẻ Visa, Mastercard còn hạn mức hoạt động</span>
                  </div>
                  <button
                    onClick={() => setHasCc(!hasCc)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      hasCc ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {hasCc ? "ĐANG SỞ HỮU" : "KHÔNG CÓ"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 min-h-11 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    ⬅ Quay lại
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-emerald-600 text-white min-h-11 font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Tiếp tục bước 3 ➔
                  </button>
                </div>
              </div>
            )}

            {/* Bước 3: Lịch sử tín dụng & CIC */}
            {step === 3 && (
              <div className="flex flex-col gap-5 animate-fadeIn">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 block">Lịch sử thanh toán & Trả quá hạn trên CIC</label>
                  <p className="text-xs text-slate-400 font-semibold mb-2">
                    Các tổ chức tín dụng đánh giá rất cao độ trung thực. Chọn lịch sử chính xác nhất của bạn:
                  </p>
                  
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => setOverdue("none")}
                      className={`min-h-12 text-left rounded-xl border p-4 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        overdue === "none" ? "border-emerald-600 bg-emerald-50/70 text-emerald-800 font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>🟢 Thanh toán rất đầy đủ, chưa bao giờ quá hạn</span>
                      <span className="text-xxs font-black text-emerald-600">AN TOÀN NHẤT</span>
                    </button>

                    <button
                      onClick={() => setOverdue("group1")}
                      className={`min-h-12 text-left rounded-xl border p-4 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        overdue === "group1" ? "border-amber-600 bg-amber-50/70 text-amber-800 font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>🟡 Quá hạn nợ nhẹ dưới 10 ngày (Nợ nhóm 1)</span>
                      <span className="text-xxs font-black text-amber-600">RỦI RO THẤP</span>
                    </button>

                    <button
                      onClick={() => setOverdue("group2")}
                      className={`min-h-12 text-left rounded-xl border p-4 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        overdue === "group2" ? "border-orange-600 bg-orange-50/70 text-orange-800 font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>🟠 Trễ hạn từ 10 - 90 ngày (Nợ nhóm 2 chú ý)</span>
                      <span className="text-xxs font-black text-orange-600">RỦI RO TRUNG BÌNH</span>
                    </button>

                    <button
                      onClick={() => setOverdue("group3")}
                      className={`min-h-12 text-left rounded-xl border p-4 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        overdue === "group3" ? "border-red-600 bg-red-50/70 text-red-800 font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span>🔴 Trễ nợ trên 90 ngày hoặc đã cơ cấu nợ xấu (Nhóm 3-5)</span>
                      <span className="text-xxs font-black text-red-600">RỦI RO CỰC CAO</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 min-h-11 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    ⬅ Quay lại
                  </button>
                  <button
                    onClick={handleCalculate}
                    className="bg-emerald-600 text-white min-h-11 font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    ⚡ Xem Điểm tín dụng ngay ➔
                  </button>
                </div>
              </div>
            )}

            {/* Bước 4: Hiển thị kết quả */}
            {step === 4 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="text-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Điểm tín dụng mô phỏng của bạn</span>
                  <div className="flex items-baseline justify-center gap-2 mt-2">
                    <span className="text-5xl font-black text-emerald-600">{score}</span>
                    <span className="text-sm font-semibold text-slate-400">/ 1000 điểm</span>
                  </div>
                  
                  {/* Badge xếp hạng */}
                  <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-black">
                    ⭐ Hạng tín dụng: {grade}
                  </div>
                </div>

                {/* Phân tích DTI */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-slate-100 bg-white p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Hệ số nợ/thu nhập (DTI)</span>
                    <span className={`text-2xl font-black mt-1 ${dti && dti > 45 ? "text-red-600" : dti && dti > 30 ? "text-amber-600" : "text-emerald-600"}`}>{dti}%</span>
                    <p className="text-xxs font-semibold text-slate-400 mt-1">Hệ số nợ tối ưu được khuyến nghị là dưới 35%.</p>
                  </div>
                  <div className="border border-slate-100 bg-white p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Thặng dư tích lũy tháng</span>
                    <span className="text-2xl font-black text-slate-800 mt-1">{(income - expense - debt).toFixed(1)} triệu</span>
                    <p className="text-xxs font-semibold text-slate-400 mt-1">Số dư tự do giúp tạo lớp đệm tài chính dự phòng.</p>
                  </div>
                </div>

                {/* Nhận xét từ Hệ thống */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/20">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">💡 Đánh giá & Khuyến nghị hồ sơ</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">{recommendation}</p>
                </div>

                {/* Form gửi thông tin nhận hỗ trợ thật */}
                {!leadSubmitted ? (
                  <form onSubmit={handleLeadSubmit} className="border-t border-slate-100 pt-6 flex flex-col gap-4 animate-fadeIn">
                    <h3 className="font-extrabold text-slate-900 text-sm">📬 Kết nối với Nhân viên Ngân hàng để hoàn thành hồ sơ thật</h3>
                    <p className="text-xxs font-semibold text-slate-400">
                      Chúng tôi sẽ gửi kết quả chấm điểm này kèm thông tin hồ sơ cho top 3 ngân hàng có lãi suất tốt nhất phù hợp với bạn.
                    </p>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white min-h-11 font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10 cursor-pointer"
                    >
                      Gửi thông tin cho Nhân viên ngân hàng (Miễn phí)
                    </button>
                  </form>
                ) : (
                  <div className="border-t border-slate-100 pt-6 text-center animate-fadeIn">
                    <span className="text-2xl">🎉</span>
                    <h3 className="font-black text-slate-900 text-sm mt-2">Đăng ký thành công!</h3>
                    <p className="text-xxs text-slate-500 font-semibold mt-1">
                      Kết quả của bạn đã được chuyển tới Top 3 Banker phù hợp. Họ sẽ liên hệ tư vấn trong vòng 15-30 phút.
                    </p>
                  </div>
                )}

                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => {
                      setStep(1);
                      setLeadSubmitted(false);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    🔄 Bắt đầu chấm điểm lại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Sidebar hướng dẫn / các mốc điểm */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block mb-3 text-emerald-800">Thang điểm chuẩn tín dụng</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100">
                  <span className="text-emerald-700">A++ (900 - 1000)</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xxs font-black">VIP / Xuất Sắc</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100">
                  <span className="text-emerald-600">A+ (800 - 899)</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xxs font-black">Rất Tốt</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100">
                  <span className="text-slate-800">A (700 - 799)</span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xxs font-bold">Tốt</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100">
                  <span className="text-amber-700">B (600 - 699)</span>
                  <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-xxs font-bold">Đạt Chuẩn</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100">
                  <span className="text-orange-700">C (500 - 599)</span>
                  <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded text-xxs font-bold">Dưới Chuẩn</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold py-1">
                  <span className="text-red-700">D (300 - 499)</span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xxs font-black">Rủi Ro Cao</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-100 bg-white">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block mb-2 text-slate-800">Mẹo nâng điểm CIC</h3>
              <ul className="text-xxs font-semibold text-slate-500 flex flex-col gap-2 list-disc pl-4 leading-relaxed">
                <li>Luôn thanh toán dư nợ thẻ tín dụng đúng hạn trước ít nhất 2 ngày.</li>
                <li>Không đứng ra bảo lãnh khoản vay quá khả năng tài chính của bản thân.</li>
                <li>Hạn chế đăng ký mở thẻ tín dụng hoặc nộp hồ sơ vay dồn dập tại nhiều ngân hàng cùng lúc.</li>
                <li>Duy trì tỷ lệ nợ DTI ở mức lý tưởng là dưới 35%.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

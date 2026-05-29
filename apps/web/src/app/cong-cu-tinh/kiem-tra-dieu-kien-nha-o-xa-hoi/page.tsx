"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  options: { text: string; isPassed: boolean; feedback: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Sếp thuộc nhóm đối tượng được ưu tiên mua Nhà ở xã hội nào sau đây?",
    options: [
      {
        text: "Người có công với cách mạng, thân nhân liệt sĩ.",
        isPassed: true,
        feedback: "Đạt đối tượng ưu tiên nhóm A theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Người thu nhập thấp, hộ nghèo, cận nghèo tại khu vực đô thị.",
        isPassed: true,
        feedback: "Đạt đối tượng thu nhập thấp tại đô thị theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Người lao động, công nhân đang làm việc tại các doanh nghiệp/khu công nghiệp.",
        isPassed: true,
        feedback: "Đạt đối tượng công nhân khu công nghiệp theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Sĩ quan, quân nhân chuyên nghiệp, công chức lực lượng vũ trang nhân dân.",
        isPassed: true,
        feedback: "Đạt đối tượng lực lượng vũ trang nhân dân theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Cán bộ, công chức, viên chức theo quy định pháp luật.",
        isPassed: true,
        feedback: "Đạt đối tượng cán bộ công chức theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Học sinh, sinh viên các trường đại học, cao đẳng (thuộc nhóm thuê nhà ở xã hội).",
        isPassed: true,
        feedback: "Đạt đối tượng sinh viên thuê nhà theo Điều 76 Luật Nhà ở.",
      },
      {
        text: "Tôi không thuộc bất kỳ đối tượng ưu tiên nào ở trên.",
        isPassed: false,
        feedback: "Không thuộc diện đối tượng được hỗ trợ mua NOXH theo quy định.",
      },
    ],
  },
  {
    id: 2,
    text: "Tình trạng sở hữu nhà đất hiện tại của gia đình sếp thế nào?",
    options: [
      {
        text: "Chưa có nhà ở thuộc sở hữu của mình, đang phải ở thuê hoặc ở nhờ.",
        isPassed: true,
        feedback: "Đạt điều kiện chưa có nhà ở.",
      },
      {
        text: "Có nhà ở thuộc sở hữu cá nhân nhưng diện tích bình quân đầu người dưới 10m² / người.",
        isPassed: true,
        feedback: "Đạt điều kiện diện tích nhà ở bình quân tối thiểu dưới 10m² theo Luật mới.",
      },
      {
        text: "Đã có nhà ở riêng biệt khang trang diện tích trung bình trên 10m² / người.",
        isPassed: false,
        feedback: "Chưa đạt điều kiện về nhà ở (Đã có nhà ở riêng biệt đạt tiêu chuẩn).",
      },
    ],
  },
  {
    id: 3,
    text: "Điều kiện cư trú và tham gia bảo hiểm xã hội của sếp tại tỉnh có dự án?",
    options: [
      {
        text: "Có đăng ký hộ khẩu thường trú tại tỉnh/thành phố nơi có dự án NOXH.",
        isPassed: true,
        feedback: "Đạt điều kiện cư trú thường trú.",
      },
      {
        text: "Đăng ký tạm trú từ 1 năm trở lên và có đóng BHXH tối thiểu 1 năm tại tỉnh đó.",
        isPassed: true,
        feedback: "Đạt điều kiện cư trú tạm trú dài hạn có đóng BHXH.",
      },
      {
        text: "Chưa đăng ký thường trú hoặc tạm trú dưới 1 năm tại tỉnh có dự án.",
        isPassed: false,
        feedback: "Chưa đạt điều kiện cư trú tại địa phương có dự án.",
      },
    ],
  },
  {
    id: 4,
    text: "Mức thu nhập chịu thuế thu nhập cá nhân hàng tháng của sếp/gia đình?",
    options: [
      {
        text: "Độc thân: Thu nhập chịu thuế TNCN hàng tháng dưới 15 triệu đồng.",
        isPassed: true,
        feedback: "Đạt điều kiện thu nhập độc thân (Quy định mới nhất nới rộng từ 11tr lên 15tr).",
      },
      {
        text: "Đã kết hôn: Tổng thu nhập chịu thuế TNCN của cả 2 vợ chồng dưới 30 triệu đồng.",
        isPassed: true,
        feedback: "Đạt điều kiện thu nhập hộ gia đình (Quy định mới nới rộng lên 30tr).",
      },
      {
        text: "Độc thân thu nhập chịu thuế TNCN trên 15 triệu đồng hoặc Vợ chồng trên 30 triệu đồng.",
        isPassed: false,
        feedback: "Chưa đạt điều kiện về thu nhập chịu thuế TNCN đóng nộp hàng tháng.",
      },
    ],
  },
];

export default function SocialHousingCalculatorPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Evaluation logic
  const evaluationDetails = answers.map((answerIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex];
    const option = question.options[answerIndex];
    return {
      questionText: question.text,
      chosenOption: option.text,
      isPassed: option.isPassed,
      feedback: option.feedback,
    };
  });

  const isAllPassed = evaluationDetails.every((item) => item.isPassed);

  return (
    <main className="min-h-screen bg-[var(--bankng-background)] text-[var(--bankng-text-primary)]">
      {/* Decorative background gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
        <div className="absolute top-[30%] -right-[15%] h-[60%] w-[55%] rounded-full bg-[var(--bankng-primary)]/5 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--bankng-primary)] hover:underline"
            href="/cong-cu-tinh"
          >
            ← Tất cả công cụ
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            TRẮC NGHIỆM ĐIỀU KIỆN NOXH
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Kiểm Tra Điều Kiện Mua Nhà Ở Xã Hội
          </h1>
          <p className="mt-2 text-base text-[var(--bankng-text-secondary)]">
            Bài đánh giá nhanh 4 bước giúp sếp tự xác định khả năng được mua nhà ở xã hội theo quy định Luật Nhà ở mới nhất.
          </p>
        </div>

        {/* Wizard content */}
        {!showResult ? (
          <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
            {/* Step progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-[var(--bankng-text-secondary)] uppercase tracking-wider mb-2">
                <span>Câu hỏi {currentStep + 1} / {QUESTIONS.length}</span>
                <span>Tiến trình {Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[var(--bankng-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-lg font-bold text-[var(--bankng-text-primary)] mb-6">
              {QUESTIONS[currentStep].text}
            </h2>

            {/* Options list */}
            <div className="space-y-3">
              {QUESTIONS[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left rounded-xl border border-[var(--bankng-border)] bg-white p-4 text-sm font-semibold text-slate-700 shadow-xs hover:border-[var(--bankng-primary)] hover:bg-[var(--bankng-primary)]/5 hover:text-[var(--bankng-primary)] transition-all active:scale-99"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Results Panel */
          <div className="space-y-6">
            {/* Core Status Card */}
            {isAllPassed ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-600/5 blur-xl" />
                <span className="text-4xl">🎉</span>
                <h2 className="mt-4 text-xl font-bold text-emerald-800 uppercase tracking-wider">Sếp Đủ Điều Kiện Mua Nhà Ở Xã Hội!</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-700">
                  Tuyệt vời! Kết quả khảo sát cho thấy sếp hoàn toàn đáp ứng đầy đủ 3 tiêu chuẩn vàng của Luật Nhà ở: **Đúng đối tượng ưu tiên**, **Đạt điều kiện về nhà ở**, **Đạt điều kiện cư trú** và **Đạt điều kiện thu nhập chịu thuế thấp**.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-600/5 blur-xl" />
                <span className="text-4xl">⚠️</span>
                <h2 className="mt-4 text-xl font-bold text-red-800 uppercase tracking-wider">Chưa Đạt Điều Kiện Mua Nhà Ở Xã Hội</h2>
                <p className="mt-2 text-sm leading-relaxed text-red-700">
                  Rất tiếc! Kết quả trắc nghiệm phát hiện sếp vẫn còn một số điểm chưa khớp hoàn toàn với các quy định khắt khe của Luật Nhà ở hiện hành. Sếp hãy kiểm tra bảng bóc tách chi tiết dưới đây để tìm hướng xử lý phù hợp.
                </p>
              </div>
            )}

            {/* Báo cáo chi tiết từng tiêu chí */}
            <div className="rounded-2xl border border-[var(--bankng-border)] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-base font-bold">Bóc tách chi tiết 4 tiêu chuẩn thẩm định pháp lý</h3>

              <div className="space-y-4">
                {evaluationDetails.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="block text-xs font-bold text-[var(--bankng-text-secondary)] uppercase tracking-wider mb-1">
                          Tiêu chí {idx + 1}: {idx === 0 ? "Đối tượng" : idx === 1 ? "Nhà ở hiện tại" : idx === 2 ? "Cư trú" : "Thu nhập"}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {item.questionText}
                        </h4>
                        <p className="mt-2 text-xs font-medium text-slate-500 italic">
                          Lựa chọn của sếp: "{item.chosenOption}"
                        </p>
                      </div>
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xxs font-extrabold tracking-wider uppercase shrink-0 ${
                          item.isPassed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.isPassed ? "✓ Đạt" : "✗ Chưa đạt"}
                      </span>
                    </div>

                    <div className="mt-2.5 rounded-lg bg-slate-50 p-3 text-xxs font-bold text-[var(--bankng-text-secondary)] border border-slate-100/50">
                      ℹ️ {item.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons control */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl border border-[var(--bankng-border)] bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-[var(--bankng-surface)] active:scale-98"
              >
                🔄 Thực hiện lại bài đánh giá
              </button>
              
              <Link href="/danh-sach-bankers" className="flex-1 shrink-0 min-w-[200px]">
                <button className="w-full rounded-xl bg-[var(--bankng-primary)] py-3.5 text-sm font-bold text-white shadow-md shadow-[var(--bankng-primary)]/20 transition-all hover:bg-[var(--bankng-primary)]/90 active:scale-98">
                  📞 Kết nối Banker tư vấn dự án NOXH
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

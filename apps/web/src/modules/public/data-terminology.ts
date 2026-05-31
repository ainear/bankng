export interface Terminology {
  id: string;
  slug: string;
  title: string;
  englishName: string;
  level: "Cơ bản" | "Trung cấp" | "Nâng cao";
  category: "Huy động" | "Tín dụng" | "Thẻ" | "Bảo hiểm" | "Pháp chế" | "Quản trị rủi ro" | "Đầu tư";
  excerpt: string;
  content: string;
}

export const TERMINOLOGIES: Terminology[] = [
  {
    id: "aml",
    slug: "aml",
    title: "AML",
    englishName: "Anti-Money Laundering",
    level: "Trung cấp",
    category: "Pháp chế",
    excerpt: "Phòng chống rửa tiền - các biện pháp ngăn chặn việc hợp pháp hóa tiền có nguồn gốc bất hợp pháp.",
    content: "Anti-Money Laundering (AML) là tập hợp các luật, quy định và thủ tục được thiết kế để ngăn chặn việc người khác ngụy trang các khoản tiền thu được bất hợp pháp thành thu nhập hợp pháp. Các tổ chức tài chính bắt buộc phải áp dụng quy trình AML nghiêm ngặt như KYC (Know Your Customer) và giám sát giao dịch bất thường để báo cáo lên cơ quan chức năng."
  },
  {
    id: "atm",
    slug: "atm",
    title: "ATM",
    englishName: "Automated Teller Machine",
    level: "Cơ bản",
    category: "Thẻ",
    excerpt: "Máy giao dịch tự động cho phép rút tiền, chuyển khoản, thanh toán không cần đến quầy.",
    content: "Automated Teller Machine (ATM) là thiết bị viễn thông điện tử cho phép khách hàng của các tổ chức tài chính thực hiện các giao dịch tài chính, đặc biệt là rút tiền mặt, gửi tiền, chuyển khoản hoặc truy vấn thông tin tài khoản bất kỳ lúc nào mà không cần sự trợ giúp của nhân viên giao dịch."
  },
  {
    id: "bancassurance",
    slug: "bancassurance",
    title: "Bancassurance",
    englishName: "Bancassurance",
    level: "Cơ bản",
    category: "Bảo hiểm",
    excerpt: "Mô hình phân phối các sản phẩm bảo hiểm thông qua mạng lưới chi nhánh và tệp khách hàng của ngân hàng.",
    content: "Bancassurance là sự kết hợp giữa Ngân hàng (Banque) và Bảo hiểm (Assurance). Đây là mô hình kinh doanh mà ngân hàng và công ty bảo hiểm hợp tác để bán các sản phẩm bảo hiểm cho khách hàng của ngân hàng. Mô hình này giúp ngân hàng gia tăng thu nhập ngoài lãi (non-interest income) và giúp khách hàng dễ dàng tiếp cận bảo hiểm."
  },
  {
    id: "car",
    slug: "car",
    title: "CAR",
    englishName: "Capital Adequacy Ratio",
    level: "Nâng cao",
    category: "Quản trị rủi ro",
    excerpt: "Tỷ lệ an toàn vốn - đo lường khả năng chống chịu rủi ro và bảo vệ tiền gửi của ngân hàng.",
    content: "Capital Adequacy Ratio (CAR) là tỷ lệ an toàn vốn của ngân hàng, được tính bằng tỷ lệ phần trăm của vốn tự có so với tổng tài sản có rủi ro đã được điều chỉnh. Tỷ lệ này được sử dụng để bảo vệ người gửi tiền và thúc đẩy sự ổn định của hệ thống tài chính toàn cầu, tuân thủ theo các hiệp ước Basel (Basel II, Basel III)."
  },
  {
    id: "casa",
    slug: "casa",
    title: "CASA",
    englishName: "Current Account Savings Account",
    level: "Nâng cao",
    category: "Huy động",
    excerpt: "Tỷ lệ tiền gửi không kỳ hạn và tiền gửi thanh toán trên tổng tiền gửi của ngân hàng.",
    content: "Current Account Savings Account (CASA) là tỷ lệ tiền gửi không kỳ hạn trên tổng tiền gửi của một ngân hàng. Tỷ lệ CASA cao đồng nghĩa với việc ngân hàng huy động được nguồn vốn giá rẻ rất lớn, từ đó giúp giảm chi phí vốn đầu vào (COF) và cải thiện đáng kể biên lãi ròng (NIM)."
  },
  {
    id: "cashback",
    slug: "cashback",
    title: "Cashback",
    englishName: "Cashback",
    level: "Cơ bản",
    category: "Thẻ",
    excerpt: "Chương trình hoàn tiền thực tế cho chủ thẻ khi thực hiện chi tiêu hoặc thanh toán mua sắm.",
    content: "Cashback là một tính năng ưu đãi của thẻ tín dụng hoặc thẻ thanh toán, theo đó tổ chức phát hành thẻ sẽ hoàn trả lại một tỷ lệ phần trăm nhất định (thường từ 0.5% đến 10% tùy danh mục chi tiêu) của số tiền giao dịch vào tài khoản thẻ của chủ thẻ."
  },
  {
    id: "cic",
    slug: "cic",
    title: "CIC",
    englishName: "Credit Information Center",
    level: "Cơ bản",
    category: "Tín dụng",
    excerpt: "Trung tâm Thông tin Tín dụng Quốc gia Việt Nam - nơi lưu trữ lịch sử tín dụng của mọi khách hàng.",
    content: "Trung tâm Thông tin Tín dụng Quốc gia Việt Nam (CIC) thuộc Ngân hàng Nhà nước Việt Nam. CIC thu thập thông tin tín dụng từ tất cả các tổ chức tài chính để xây dựng cơ sở dữ liệu quốc gia, giúp các ngân hàng đánh giá điểm tín dụng, lịch sử trả nợ (nợ xấu nhóm 1-5) của khách hàng trước khi ra quyết định phê duyệt khoản vay."
  },
  {
    id: "dti",
    slug: "dti",
    title: "DTI",
    englishName: "Debt-to-Income Ratio",
    level: "Trung cấp",
    category: "Tín dụng",
    excerpt: "Tỷ lệ nợ trên thu nhập - tỷ lệ phần trăm thu nhập hàng tháng dùng để chi trả cho các khoản nợ.",
    content: "Debt-to-Income Ratio (DTI) là chỉ số tài chính cá nhân được tính bằng cách lấy tổng số tiền trả nợ hàng tháng (bao gồm cả gốc và lãi) chia cho tổng thu nhập gộp hàng tháng. Các ngân hàng sử dụng tỷ lệ DTI để đánh giá khả năng quản lý tài chính và mức độ rủi ro mất khả năng thanh toán của khách hàng khi vay vốn."
  },
  {
    id: "ltv",
    slug: "ltv",
    title: "LTV",
    englishName: "Loan-to-Value Ratio",
    level: "Trung cấp",
    category: "Tín dụng",
    excerpt: "Tỷ lệ khoản vay trên giá trị tài sản bảo đảm - giới hạn tối đa số tiền ngân hàng có thể cho vay.",
    content: "Loan-to-Value Ratio (LTV) là tỷ lệ cho vay trên giá trị tài sản thế chấp. Ví dụ tài sản bảo đảm trị giá 1 tỷ đồng và ngân hàng cho vay tối đa 700 triệu đồng thì tỷ lệ LTV là 70%. Tỷ lệ LTV càng thấp thì mức rủi ro thất thoát vốn của ngân hàng khi khách hàng vỡ nợ càng thấp."
  },
  {
    id: "nim",
    slug: "nim",
    title: "NIM",
    englishName: "Net Interest Margin",
    level: "Nâng cao",
    category: "Quản trị rủi ro",
    excerpt: "Biên lãi ròng - thước đo đo lường sự chênh lệch giữa thu nhập lãi và chi phí lãi của ngân hàng.",
    content: "Net Interest Margin (NIM) là biên lãi thuần ròng, được tính bằng cách lấy thu nhập lãi thuần chia cho tổng tài sản sinh lời trung bình của ngân hàng. NIM phản ánh hiệu quả sử dụng vốn của ngân hàng: biên chênh lệch giữa lãi suất cho vay đầu ra và lãi suất huy động đầu vào."
  },
  {
    id: "omo",
    slug: "omo",
    title: "OMO",
    englishName: "Open Market Operations",
    level: "Nâng cao",
    category: "Đầu tư",
    excerpt: "Nghiệp vụ thị trường mở - công cụ điều tiết cung tiền và thanh khoản của Ngân hàng Trung ương.",
    content: "Open Market Operations (OMO) là hoạt động của Ngân hàng Trung ương mua hoặc bán các giấy tờ có giá (như tín phiếu kho bạc, trái phiếu chính phủ) trên thị trường mở nhằm điều tiết khối lượng tiền tệ lưu thông và thanh khoản trong hệ thống ngân hàng thương mại, từ đó gián tiếp kiểm soát lãi suất thị trường."
  },
  {
    id: "npl",
    slug: "npl",
    title: "NPL",
    englishName: "Non-Performing Loan",
    level: "Trung cấp",
    category: "Quản trị rủi ro",
    excerpt: "Tỷ lệ nợ xấu - đo lường các khoản nợ quá hạn từ 90 ngày trở lên (nhóm 3 đến nhóm 5).",
    content: "Non-Performing Loan (NPL) là tỷ lệ nợ xấu trên tổng dư nợ cho vay của ngân hàng. Theo chuẩn quy định Việt Nam, nợ quá hạn từ 90 ngày trở lên được xếp vào nợ xấu (Nợ nhóm 3 - Dưới tiêu chuẩn, Nợ nhóm 4 - Nghi ngờ, Nợ nhóm 5 - Có khả năng mất vốn). Tỷ lệ NPL thấp phản ánh chất lượng tài sản tốt và quy trình thẩm định tín dụng chặt chẽ của ngân hàng."
  }
];

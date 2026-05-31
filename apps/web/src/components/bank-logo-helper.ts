export function cleanLogoUrl(url: string | null | undefined): string {
  if (!url) return "https://vietqr.net/portal-assets/img/logo-vietqr.png";
  
  let cleaned = url;
  
  // Thay thế các logo bị sai/lỗi trong dữ liệu bằng các logo VietQR chuẩn
  if (cleaned.includes("/CTG.png")) {
    cleaned = cleaned.replace("/CTG.png", "/ICB.png");
  }
  if (cleaned.includes("/PVCOMBANK.png")) {
    cleaned = cleaned.replace("/PVCOMBANK.png", "/PVCB.png");
  }
  if (cleaned.includes("/VIETQR.png")) {
    cleaned = "https://vietqr.net/portal-assets/img/logo-vietqr.png";
  }
  
  return cleaned;
}

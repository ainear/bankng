export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D+/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("84") && digits.length >= 11) {
    return `0${digits.slice(2)}`;
  }

  if (!digits.startsWith("0") || digits.length < 9 || digits.length > 11) {
    return "";
  }

  return digits;
}

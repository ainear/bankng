export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D+/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("84") && digits.length >= 10) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

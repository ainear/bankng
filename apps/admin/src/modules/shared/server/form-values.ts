export function parseBooleanField(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

export function parseOptionalStringField(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

export function parseOptionalNumberField(value: FormDataEntryValue | null) {
  const normalized = parseOptionalStringField(value);
  return normalized ? Number(normalized) : undefined;
}

export function parseOptionalIntegerField(value: FormDataEntryValue | null) {
  const normalized = parseOptionalStringField(value);
  return normalized ? Number.parseInt(normalized, 10) : undefined;
}

export function parseRequiredDateField(value: FormDataEntryValue | null) {
  const normalized = parseOptionalStringField(value);

  if (!normalized) {
    throw new Error("Date field is required");
  }

  return new Date(`${normalized}T00:00:00.000Z`);
}

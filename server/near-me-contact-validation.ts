export type NearMeContactField = "parentName" | "phone";
export type NearMeContactFieldErrors = Partial<Record<NearMeContactField, string>>;

const INVALID_NAME_MESSAGE = "Enter your name.";
const INVALID_PHONE_MESSAGE = "Enter a valid mobile number.";

export function validateNearMeContactFields(input: {
  leadSource?: unknown;
  parentName?: unknown;
  phone?: unknown;
}): NearMeContactFieldErrors {
  if (input.leadSource !== "play-school-near-me") return {};

  const fieldErrors: NearMeContactFieldErrors = {};
  if (typeof input.parentName !== "string" || input.parentName.trim().length === 0) {
    fieldErrors.parentName = INVALID_NAME_MESSAGE;
  }
  if (typeof input.phone !== "string" || !/^[6-9]\d{9}$/.test(input.phone)) {
    fieldErrors.phone = INVALID_PHONE_MESSAGE;
  }

  return fieldErrors;
}
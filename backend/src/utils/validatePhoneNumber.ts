import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js/max";

export function validatePhoneNumber(value: string, ctx: any) {
  try {
    const cleanValue = value?.trim();

    if (!cleanValue) {
      ctx.addIssue({
        code: "custom",
        message: "Numéro de téléphone requis",
      });
      return null;
    }

    if (!isValidPhoneNumber(cleanValue, "FR")) {
      ctx.addIssue({
        code: "custom",
        message: "Numéro de téléphone invalide",
      });
      return null;
    }

    const phoneNumber = parsePhoneNumber(cleanValue, "FR");

    if (!phoneNumber) {
      ctx.addIssue({
        code: "custom",
        message: "Impossible de parser le numéro de téléphone",
      });
      return null;
    }

    if (!phoneNumber.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "Numéro de téléphone invalide",
      });
      return null;
    }

    return phoneNumber.formatInternational();
  } catch (error) {
    console.error("Erreur validation téléphone:", error);
    ctx.addIssue({
      code: "custom",
      message: "Format de téléphone invalide",
    });
    return null;
  }
}

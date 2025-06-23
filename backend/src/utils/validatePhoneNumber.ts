import { parsePhoneNumberFromString } from "libphonenumber-js";

function validateAndFormat(phone: string, defaultCountry = "FR") {
  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);

  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Numéro de téléphone invalide");
  }

  return {
    international: phoneNumber.formatInternational(), // +33 6 ...
    national: phoneNumber.formatNational(), // 06 ...
    E164: phoneNumber.number, // +336...
    country: phoneNumber.country, // FR, BE, etc.
  };
}

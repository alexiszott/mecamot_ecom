import { parsePhoneNumber } from "react-phone-number-input";

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} à ${hours}:${minutes}`;
};

export const formatPhoneNumber = (phone?: string) => {
  if (!phone) return "";
  const phoneNumber = parsePhoneNumber(phone);

  const countryCallingCode = `+${phoneNumber?.countryCallingCode} `;
  const nationalNumber =
    phoneNumber?.nationalNumber
      .toString()
      .replace(/\D/g, "")
      .match(/.{1,2}/g)
      ?.join(" ") ?? "";

  return countryCallingCode + nationalNumber;
};

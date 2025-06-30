export const convertFormatPrice = (price) => {
  const numPrice =
    typeof price === "string" ? parseFloat(price) : Number(price);

  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return "N/A";
  }

  try {
    return numPrice.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  } catch (error) {
    return `${numPrice.toFixed(2)}€`;
  }
};

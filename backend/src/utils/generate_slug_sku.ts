export const generateSlugCode = (name: string) => {
  const slug = name
    .toLowerCase()
    .normalize("NFD") // enlève les accents (é → e)
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .replace(/[^a-z0-9\s-]/g, "") // enlève les caractères spéciaux sauf tirets/espaces
    .trim()
    .replace(/\s+/g, "-") // remplace les espaces par des tirets
    .replace(/-+/g, "-") // supprime les tirets multiples
    .slice(0, 100);
  return slug;
};

export const generateSkuCode = (name: string) => {
  const prefix = name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 5);

  const random = Math.floor(1000 + Math.random() * 9000);

  const sku = `${prefix}-${random}`;

  return sku;
};

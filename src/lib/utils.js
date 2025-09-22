export const THB = new Intl.NumberFormat("th-TH",{ style:"currency", currency:"THB" });

export const normalizeImage = (url) => {
  if (!url) return "/images/placeholder.png";
  return url.replace("./", "/"); // map ./images/... -> /images/...
};

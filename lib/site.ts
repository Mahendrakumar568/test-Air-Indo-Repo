/**
 * Company contact details. Values set to null show "To be confirmed" on the site.
 * Fill these in (or set the matching environment variables) before launch.
 */
export const company = {
  legalName: "Air Indo Airlines",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  mediaEmail: process.env.NEXT_PUBLIC_MEDIA_EMAIL || null,
  careersEmail: process.env.NEXT_PUBLIC_CAREERS_EMAIL || null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  address: process.env.NEXT_PUBLIC_REGISTERED_ADDRESS || null,
  cin: process.env.NEXT_PUBLIC_CIN || null,
  founded: "Andhra Pradesh, India",
};

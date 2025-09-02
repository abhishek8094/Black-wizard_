
export function slugify(text) {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, ''); 
}

export function generateProductSlug(title) {
  const baseSlug = slugify(title);
  return `${baseSlug}`;
}

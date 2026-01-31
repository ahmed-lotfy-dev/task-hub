export function generateSlug(name: string): string {
  const timestamp = Date.now().toString(36);
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .substring(0, 50); // Limit length

  return `${baseSlug}-${timestamp}`;
}

export function generateWorkspaceSlug(name: string): string {
  return generateSlug(name);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

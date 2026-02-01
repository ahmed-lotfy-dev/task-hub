export async function generateKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const raw = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const key = `th_live_${raw}`;
  const preview = `${key.slice(0, 11)}...${key.slice(-4)}`;

  // SHA-256 hash for fast lookup
  const hash = await hashKey(key);

  return { key, hash, preview };
}

export async function hashKey(key: string) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(key);
  return hasher.digest("hex");
}
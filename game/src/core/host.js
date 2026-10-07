// The maker's own machine or home network: the dev server on this computer, or reached
// from a phone on the same Wi-Fi (10.x, 172.16 → 172.31.x, 192.168.x). The test buttons
// at the top of the screen show only there, never on the public site or in the store app.
// (Volume 1's rule, core/count.js there.)
export function isLocalHost(hostname) {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') return true;
  if (hostname.endsWith('.localhost') || hostname.endsWith('.test')) return true;
  const part = /^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(hostname);
  if (!part) return false;
  const [a, b] = [Number(part[1]), Number(part[2])];
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

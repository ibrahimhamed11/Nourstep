/**
 * Static Auth — Business / Tasks access guard
 *
 * Credentials are never stored in plain text.
 * The stored value is the SHA-256 hash of "email:password" (lowercase-trimmed email).
 *
 * Session key stored in sessionStorage (clears on tab close).
 */

const SESSION_KEY = 'ns-biz-session';
// SHA-256 of "ibrahim.hamed112@hotmail.com:Ee055304*"
const CREDENTIAL_HASH = '1b0f2dbab2bf3dcbbcf389a47e2857ca0162c0cec156e324a052a9811b84762d';

/** Compute SHA-256 of a string using the Web Crypto API */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Attempt login. Returns true on success.
 * Stores a session marker in sessionStorage on success.
 */
export async function staticLogin(email: string, password: string): Promise<boolean> {
  const candidate = await sha256(`${email.toLowerCase().trim()}:${password}`);
  if (candidate !== CREDENTIAL_HASH) return false;
  sessionStorage.setItem(SESSION_KEY, '1');
  return true;
}

/** Returns true if the user has an active session */
export function isStaticAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

/** Clear the session (logout) */
export function staticLogout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

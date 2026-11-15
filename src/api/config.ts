/**
 * Backend base URL.
 *
 * - If VITE_API_URL is set (e.g. in .env.local), it wins.
 * - Otherwise use the same host the page was opened from, on port 8081.
 *   Opening http://192.168.1.7:5173 on a phone therefore calls
 *   http://192.168.1.7:8081, and on this PC http://localhost:8081.
 */
export const API_URL: string =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8081`;

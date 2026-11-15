import { API_URL } from "./config";
import type { AppNotification } from "../types/notification";

async function request<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1/notifications${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export function getNotifications(token: string) {
  return request<AppNotification[]>("", token);
}

export async function getUnreadNotificationCount(token: string) {
  return (await request<{ count: number }>("/unread-count", token)).count;
}

export function markNotificationRead(id: number, token: string) {
  return request<void>(`/${id}/read`, token, { method: "PATCH" });
}

export function markAllNotificationsRead(token: string) {
  return request<void>("/read-all", token, { method: "PATCH" });
}

import type { ChatMessage, Conversation } from "../types/chat";
import type { ItemStatus } from "../types/item";

import { API_URL } from "./config";
export { API_URL };

async function request<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: {
      // JSON bodies only; for FormData the browser sets the multipart boundary.
      ...(typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      /* body was not JSON */
    }
    throw new Error(message);
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

/** Start a chat with the owner of an item, or get the existing one. */
export function startConversation(itemId: number, token: string) {
  return request<Conversation>("/chats", token, {
    method: "POST",
    body: JSON.stringify({ itemId }),
  });
}

export function getConversations(token: string) {
  return request<Conversation[]>("/chats", token);
}

export function getConversation(conversationId: number, token: string) {
  return request<Conversation>(`/chats/${conversationId}`, token);
}

export function getMessages(conversationId: number, token: string) {
  return request<ChatMessage[]>(`/chats/${conversationId}/messages`, token);
}

export function sendMessage(
  conversationId: number,
  content: string,
  token: string,
) {
  return request<ChatMessage>(`/chats/${conversationId}/messages`, token, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/** Send one photo (uploaded to Cloudinary by the backend) with an optional caption. */
export function sendImageMessage(
  conversationId: number,
  image: File,
  caption: string,
  token: string,
) {
  const form = new FormData();
  form.append("image", image);
  if (caption.trim()) form.append("content", caption.trim());
  return request<ChatMessage>(
    `/chats/${conversationId}/messages/image`,
    token,
    { method: "POST", body: form },
  );
}

/** Poster only: mark the item as TRADED (with this chat's trader) or AVAILABLE. */
export function updateItemStatus(
  conversationId: number,
  status: ItemStatus,
  token: string,
) {
  return request<Conversation>(`/chats/${conversationId}/item-status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getUnreadCount(token: string): Promise<number> {
  const data = await request<{ count: number }>("/chats/unread-count", token);
  return data.count;
}

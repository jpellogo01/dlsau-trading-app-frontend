import type { Comment, Item } from "../types/item";

import { API_URL } from "./config";

export async function postItem(
  formData: FormData,
  token: string,
): Promise<Item> {
  const response = await fetch(`${API_URL}/api/v1/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // No Content-Type - browser sets multipart
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getItems(token?: string): Promise<Item[]> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}/api/v1/items`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export interface LikeResponse {
  itemId: number;
  totalLikes: number;
  likedByCurrentUser: boolean;
}

export async function getLikeSummary(
  itemId: number,
  token: string,
): Promise<LikeResponse> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/likes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function addLike(
  itemId: number,
  token: string,
): Promise<LikeResponse> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/likes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function removeLike(
  itemId: number,
  token: string,
): Promise<LikeResponse> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/likes`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getComments(
  itemId: number,
  token: string,
): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/** Post a comment, or a reply when parentId (the comment being replied to) is given. */
export async function postComment(
  itemId: number,
  content: string,
  token: string,
  parentId?: number | null,
): Promise<Comment> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parentId: parentId ?? null }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function updateComment(
  commentId: number,
  content: string,
  token: string,
): Promise<Comment> {
  const response = await fetch(`${API_URL}/api/v1/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteComment(
  commentId: number,
  token: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}

// ------------------------------------------------------------ My Posts (owner only)

export interface MyPost {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  condition: Item["condition"];
  meetupLocation?: string | null;
  thumbnailUrl?: string | null;
  status: Item["status"];
  tradedWithUserId?: number | null;
  tradedWithUsername?: string | null;
  tradedAt?: string | null;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  chatCount: number;
}

export interface UpdatePostRequest {
  title: string;
  description?: string | null;
  category?: string | null;
  condition: Item["condition"];
  meetupLocation?: string | null;
}

async function ownerRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!response.ok) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {
      /* not JSON */
    }
    throw new Error(message);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export function getMyPosts(token: string) {
  return ownerRequest<MyPost[]>("/items/mine", token);
}

export function updatePost(id: number, data: UpdatePostRequest, token: string) {
  return ownerRequest<MyPost>(`/items/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function updatePostStatus(
  id: number,
  status: Item["status"],
  token: string,
) {
  return ownerRequest<MyPost>(`/items/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deletePost(id: number, token: string) {
  return ownerRequest<void>(`/items/${id}`, token, { method: "DELETE" });
}

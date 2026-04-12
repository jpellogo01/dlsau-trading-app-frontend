import type { Comment, Item } from "../types/item";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

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

export async function postComment(
  itemId: number,
  content: string,
  token: string,
): Promise<Comment> {
  const response = await fetch(`${API_URL}/api/v1/items/${itemId}/comments`, {
    method: "POST",
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

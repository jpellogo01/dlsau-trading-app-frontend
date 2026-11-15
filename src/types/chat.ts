import type { ItemStatus } from "./item";

export interface Conversation {
  id: number;
  itemId: number;
  itemTitle: string;
  itemThumbnailUrl?: string | null;
  itemStatus: ItemStatus;
  tradedWithUserId?: number | null;
  otherUserId: number;
  otherUsername: string;
  /** true when the current user posted the item */
  isPoster: boolean;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  /** Photos already sent in this conversation (both users). */
  imagesUsed: number;
  /** Max photos allowed per conversation. */
  imagesLimit: number;
  createdAt: string;
}

export type MessageType = "TEXT" | "SYSTEM";

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderUsername: string;
  content: string;
  /** Cloudinary URL when the message carries a photo. */
  imageUrl?: string | null;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
}

export interface ItemStatusEvent {
  itemId: number;
  status: ItemStatus;
  tradedWithUserId?: number | null;
}

export type ChatEvent =
  | { type: "MESSAGE"; payload: ChatMessage }
  | { type: "STATUS"; payload: ItemStatusEvent };

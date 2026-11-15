export type NotificationType = "COMMENT_REPLY" | "ITEM_COMMENT";

export interface AppNotification {
  id: number;
  type: NotificationType;
  actorId: number;
  actorUsername: string;
  itemId?: number | null;
  itemTitle?: string | null;
  /** The comment/reply that triggered it (used to jump to it). */
  commentId?: number | null;
  preview?: string | null;
  isRead: boolean;
  createdAt: string;
}

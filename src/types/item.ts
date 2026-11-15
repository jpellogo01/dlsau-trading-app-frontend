export type ItemStatus = "AVAILABLE" | "TRADED";

export interface ItemImage {
  id: number;
  imageUrl: string;
}

export interface ItemUser {
  id: number;
  username: string;
  email: string;
}

export interface Comment {
  id: number;
  itemId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
  /** Top-level comment this reply belongs to; null/undefined for top-level comments. */
  parentId?: number | null;
  /** Person being replied to (shown as @username). */
  replyToUserId?: number | null;
  replyToUsername?: string | null;
}

export interface Item {
  id: number;
  title: string;
  description?: string;
  category?: string;
  condition: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  meetupLocation?: string;
  thumbnailUrl?: string;
  status: ItemStatus;
  tradedWithUserId?: number | null;
  likes?: number; // Backend optional, 0 default
  isLiked?: boolean; // Optional legacy field used by other components
  comments?: Comment[]; // Backend optional
  user: ItemUser;
  images: ItemImage[];
  createdAt: string;
  updatedAt: string;
}

// Frontend extension for UI state
export interface ExtendedItem extends Item {
  liked: boolean;
  showComments: boolean;
  localLikes: number;
  commentsLoaded: boolean;
  commentCount: number;
}

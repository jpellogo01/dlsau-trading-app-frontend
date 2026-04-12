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
}

export interface Item {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  isNegotiable: boolean;
  tradeOption: "SELL" | "TRADE" | "BOTH";
  condition: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  meetupLocation?: string;
  thumbnailUrl?: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
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

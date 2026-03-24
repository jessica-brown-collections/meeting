export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  stockCount?: number;
  cartUrl: string;
  badge?: string;
}

export interface PinnedProduct {
  productId: string;
  pinnedAt: number;
}

export type ReactionType = '❤️' | '🔥' | '👍' | '😮' | '🛒';

export interface Reaction {
  id: string;
  type: ReactionType;
  participantIdentity: string;
  timestamp: number;
}

export interface FlashSale {
  productId: string;
  discountPercent: number;
  endsAt: number;
  message: string;
}

export type DataChannelTopic =
  | 'shopping:reaction'
  | 'shopping:flash-sale'
  | 'shopping:cart-update'
  | 'shopping:stock-alert';

export interface DataChannelMessage<T = unknown> {
  topic: DataChannelTopic;
  payload: T;
}

export const ATTR_PINNED_PRODUCT = 'pinnedProduct';
export const ATTR_HOST_ROLE = 'hostRole';
export const REACTION_TYPES: ReactionType[] = ['❤️', '🔥', '👍', '😮', '🛒'];

import type { Seller } from "@/types/user";

export type P2PDealType = "SALE" | "EXCHANGE";

export type P2PStatus =
  | "PROPOSED"
  | "ACCEPTED"
  | "COMPLETED"
  | "DISPUTED"
  | "EXPIRED"
  | "CANCELLED"
  | "DECLINED";

/** The slice of a marketplace product a deal carries (federation ref). */
export interface DealProduct {
  id: number;
  name: string;
  images?: string[] | null;
  price: number;
}

export interface Deal {
  id: number;
  type: P2PDealType;
  status: P2PStatus;
  buyerId: string;
  sellerId: string;
  compensationAmount: number;
  compensationPayerId?: string | null;
  confirmationDeadline?: string | null;
  buyerConfirmedAt?: string | null;
  sellerConfirmedAt?: string | null;
  buyerEvidenceUrl?: string | null;
  sellerEvidenceUrl?: string | null;
  disputeReason?: string | null;
  completedAt?: string | null;
  createdAt: string;
  product?: DealProduct | null;
  requestedProduct?: DealProduct | null;
  offeredProduct?: DealProduct | null;
  /** The two parties, resolved via federation. Only a subset of fields is
   *  selected (see DEAL_PARTY_FIELDS) — enough for name/avatar/location. */
  buyer?: Seller | null;
  seller?: Seller | null;
}

export interface P2PReputation {
  strikes: number;
  blockedUntil?: string | null;
  completedCount: number;
  failedCount: number;
}

/** Which side the current viewer is on, for choosing available actions. */
export type DealPerspective = "buyer" | "seller";

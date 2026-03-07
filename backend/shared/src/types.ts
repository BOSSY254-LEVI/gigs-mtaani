export enum UserRole {
  STUDENT = "STUDENT",
  VERIFIED_STUDENT = "VERIFIED_STUDENT",
  MODERATOR = "MODERATOR",
  RISK_OPS = "RISK_OPS",
  FINANCE_OPS = "FINANCE_OPS",
  ADMIN = "ADMIN"
}

export enum GigStatus {
  OPEN = "OPEN",
  IN_REVIEW = "IN_REVIEW",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED"
}

export enum EscrowState {
  CREATED = "CREATED",
  FUNDED = "FUNDED",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED",
  DISPUTED = "DISPUTED",
  CLOSED = "CLOSED"
}

export enum TrustBand {
  A = "A",
  B = "B",
  C = "C",
  RESTRICTED = "RESTRICTED"
}

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Pagination = {
  cursor?: string;
  limit?: number;
};


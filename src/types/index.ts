export type PartnerType = 'company' | 'seller';

export type ProductType = 'physical' | 'digital';

export type ApprovalStatus = 'approved' | 'under_review' | 'rejected';

export type ProductStatus = 'active' | 'draft' | 'archived';

export type OrderStatus =
  | 'new'
  | 'processing'
  | 'awaiting_fulfillment'
  | 'ready_for_dispatch'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'disputed';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';

export type DisputeCategory =
  | 'defective_item'
  | 'wrong_size'
  | 'digital_file_corrupted'
  | 'undelivered'
  | 'not_as_described';

export type PayoutStatus = 'settled' | 'processing' | 'queued';

export type StaffRole = 'owner' | 'manager' | 'fulfillment' | 'accountant';

export interface PartnerProfile {
  id: string;
  type: PartnerType;
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  cacNumber?: string;
  tinNumber?: string;
  ninNumber?: string;
  logo: string;
  banner: string;
  bio: string;
  commissionRate: number; // e.g., 0.08 for 8%, 0.12 for 12%
  kycStatus: 'verified' | 'pending' | 'action_required';
  agreementSigned: boolean;
  tierName: string;
  verifiedBadge: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string }; // e.g. { size: 'XL', color: 'Midnight Violet' }
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  type: ProductType;
  sku: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  approvalStatus: ApprovalStatus;
  status: ProductStatus;
  imageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // Physical specific attributes
  variants?: ProductVariant[];
  weightKg?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  branchLocationId?: string;
  // Digital specific attributes
  digitalFileFormat?: string;
  digitalFileSize?: string;
  digitalDownloadLimit?: number;
  digitalSampleUrl?: string;
  licenseType?: 'standard' | 'extended_commercial' | 'exclusive_rights';
}

export interface OrderItem {
  productId: string;
  title: string;
  type: ProductType;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variantName?: string;
  digitalDownloadUrl?: string;
  downloadToken?: string;
  downloadsRemaining?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  commissionFee: number;
  netPayout: number;
  status: OrderStatus;
  paymentMethod: string;
  courier?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  slaDeadline?: string;
  dispatchBranch?: string;
  hasDispute?: boolean;
  disputeId?: string;
  notes?: string;
}

export interface DisputeMessage {
  id: string;
  sender: 'merchant' | 'customer' | 'arbitrator';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface Dispute {
  id: string;
  caseNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  category: DisputeCategory;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  amount: number;
  customerEvidence: {
    photos: string[];
    description: string;
  };
  merchantResponse?: {
    action: 'accepted' | 'rejected' | 'refunded';
    reason: string;
    counterEvidence?: string[];
    respondedAt: string;
  };
  messages: DisputeMessage[];
}

export interface Payout {
  id: string;
  batchId: string;
  amount: number;
  requestedAt: string;
  settledAt?: string;
  status: PayoutStatus;
  bankName: string;
  accountNumber: string;
  accountName: string;
  reference: string;
  fee: number;
  netAmount: number;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  reply?: {
    merchantName: string;
    message: string;
    repliedAt: string;
  };
  reported?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: 'active' | 'invited' | 'suspended';
  avatar: string;
  lastActive: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  managerName: string;
  phone: string;
  isHQ: boolean;
  activeStockUnits: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productTitle: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: string;
  changedBy: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'product' | 'inventory' | 'platform' | 'dispute';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'orders_shipping' | 'payouts_finance' | 'kyc_account' | 'technical' | 'disputes';
  status: 'open' | 'awaiting_merchant' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: {
    sender: 'merchant' | 'support';
    name: string;
    message: string;
    timestamp: string;
  }[];
}

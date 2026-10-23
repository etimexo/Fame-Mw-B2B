"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { generateRandomId } from "@/lib/utils";
import type {
  PartnerType,
  PartnerProfile,
  Product,
  Order,
  OrderStatus,
  Dispute,
  Payout,
  Review,
  StaffMember,
  Branch,
  InventoryLog,
  NotificationItem,
  SupportTicket,
} from "@/types";

// ─── Helper to map DB rows → app types ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(row: any): PartnerProfile {
  return {
    id: row.id,
    type: row.type || "seller",
    businessName: row.business_name || "Merchant",
    tagline: row.tagline ?? "",
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    country: row.country ?? "Nigeria",
    cacNumber: row.cac_number,
    tinNumber: row.tin_number,
    ninNumber: row.nin_number,
    logo: row.logo ?? "",
    banner: row.banner ?? "",
    bio: row.bio ?? "",
    commissionRate: Number(row.commission_rate ?? 0.1),
    kycStatus: row.kyc_status ?? "pending",
    agreementSigned: Boolean(row.agreement_signed),
    tierName: row.tier_name ?? "Bronze Seller",
    verifiedBadge: row.verified_badge,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category ?? "",
    subcategory: row.subcategory ?? "",
    type: row.type,
    sku: row.sku ?? "",
    barcode: row.barcode,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    stock: Number(row.stock),
    lowStockThreshold: Number(row.low_stock_threshold ?? 5),
    approvalStatus: row.approval_status,
    status: row.status,
    imageUrl: row.image_url ?? "",
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    weightKg: row.weight_kg ? Number(row.weight_kg) : undefined,
    dimensionsCm: typeof row.dimensions_cm === "string" ? JSON.parse(row.dimensions_cm) : row.dimensions_cm,
    branchLocationId: row.branch_location_id,
    digitalFileFormat: row.digital_file_format,
    digitalFileSize: row.digital_file_size,
    digitalDownloadLimit: row.digital_download_limit ? Number(row.digital_download_limit) : undefined,
    digitalSampleUrl: row.digital_sample_url,
    licenseType: row.license_type,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone ?? "",
    shippingAddress: typeof row.shipping_address === "string" ? JSON.parse(row.shipping_address) : (row.shipping_address || {}),
    items: typeof row.items === "string" ? JSON.parse(row.items) : (row.items || []),
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_fee ?? 0),
    commissionFee: Number(row.commission_fee ?? 0),
    netPayout: Number(row.net_payout ?? row.subtotal),
    status: row.status,
    paymentMethod: row.payment_method ?? "",
    courier: row.courier,
    trackingNumber: row.tracking_number,
    dispatchedAt: row.dispatched_at,
    deliveredAt: row.delivered_at,
    slaDeadline: row.sla_deadline,
    dispatchBranch: row.dispatch_branch,
    hasDispute: Boolean(row.has_dispute),
    disputeId: row.dispute_id,
    notes: row.notes,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDispute(row: any): Dispute {
  return {
    id: row.id,
    caseNumber: row.case_number,
    orderId: row.order_id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    category: row.category,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
    amount: Number(row.amount),
    customerEvidence: typeof row.customer_evidence === "string" ? JSON.parse(row.customer_evidence) : (row.customer_evidence || { photos: [], description: "" }),
    merchantResponse: typeof row.merchant_response === "string" ? JSON.parse(row.merchant_response) : row.merchant_response,
    messages: typeof row.messages === "string" ? JSON.parse(row.messages) : (row.messages || []),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPayout(row: any): Payout {
  return {
    id: row.id,
    batchId: row.batch_id,
    amount: Number(row.amount),
    requestedAt: row.requested_at,
    settledAt: row.settled_at,
    status: row.status,
    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name,
    reference: row.reference,
    fee: Number(row.fee ?? 0),
    netAmount: Number(row.net_amount ?? row.amount),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    customerName: row.customer_name,
    rating: Number(row.rating),
    title: row.title ?? "",
    comment: row.comment ?? "",
    verifiedPurchase: Boolean(row.verified_purchase),
    createdAt: row.created_at,
    reply: typeof row.reply === "string" ? JSON.parse(row.reply) : row.reply,
    reported: Boolean(row.reported),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStaff(row: any): StaffMember {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    role: row.role,
    status: row.status,
    avatar: row.avatar ?? "",
    lastActive: row.last_active ?? "Just now",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBranch(row: any): Branch {
  return {
    id: row.id,
    name: row.name,
    code: row.code ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    managerName: row.manager_name ?? "",
    phone: row.phone ?? "",
    isHQ: Boolean(row.is_hq),
    activeStockUnits: Number(row.active_stock_units ?? 0),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInventoryLog(row: any): InventoryLog {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    previousStock: Number(row.previous_stock),
    newStock: Number(row.new_stock),
    change: Number(row.change),
    reason: row.reason ?? "",
    changedBy: row.changed_by ?? "Merchant",
    timestamp: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNotification(row: any): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    timestamp: row.created_at,
    read: Boolean(row.read),
    link: row.link,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupportTicket(row: any): SupportTicket {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    subject: row.subject,
    category: row.category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: typeof row.messages === "string" ? JSON.parse(row.messages) : (row.messages || []),
  };
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface DashboardContextType {
  partnerType: PartnerType;
  switchPartnerType: (type: PartnerType) => void;
  profile: PartnerProfile;
  updateProfile: (updated: Partial<PartnerProfile>) => Promise<void>;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  branches: Branch[];
  addBranch: (branch: Omit<Branch, "id" | "activeStockUnits">) => void;
  staff: StaffMember[];
  inviteStaff: (newStaff: Omit<StaffMember, "id" | "status" | "lastActive">) => void;
  removeStaff: (id: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  dispatchOrder: (orderId: string, courier: string, trackingNumber: string, branchName: string) => Promise<void>;
  reissueDigitalLink: (orderId: string, itemId: string) => string;
  disputes: Dispute[];
  respondToDispute: (disputeId: string, action: "accepted" | "rejected" | "refunded", reason: string) => Promise<void>;
  sendDisputeMessage: (disputeId: string, message: string) => Promise<void>;
  inventoryLogs: InventoryLog[];
  updateStock: (productId: string, newStock: number, reason?: string) => Promise<void>;
  batchUpdateStock: (updates: { productId: string; newStock: number }[], reason?: string) => Promise<void>;
  payouts: Payout[];
  requestPayout: (amount: number, bankName: string, accountNumber: string, accountName: string) => Promise<boolean>;
  reviews: Review[];
  replyReview: (reviewId: string, replyMessage: string) => void;
  reportReview: (reviewId: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  supportTickets: SupportTicket[];
  openSupportTicket: (subject: string, category: SupportTicket["category"], priority: SupportTicket["priority"], initialMessage: string) => void;
  sendTicketMessage: (ticketId: string, message: string) => void;
  balances: {
    lifetimeGross: number;
    availableWithdrawable: number;
    pendingEscrow: number;
    disputedHold: number;
    totalPaidOut: number;
    totalCommissionPaid: number;
  };
  metrics: {
    totalRevenue: number;
    deliveredOrdersCount: number;
    pendingOrdersCount: number;
    activeProductsCount: number;
    averageRating: number;
    openDisputesCount: number;
  };
  isDataLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultProfile: PartnerProfile = {
  id: "",
  type: "seller",
  businessName: "Loading…",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
  logo: "",
  banner: "",
  bio: "",
  commissionRate: 0.1,
  kycStatus: "pending",
  agreementSigned: false,
  tierName: "Bronze Seller",
  verifiedBadge: "",
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user, profile: authProfile } = useAuth();

  const [partnerType, setPartnerType] = useState<PartnerType>("seller");
  const [profile, setProfile] = useState<PartnerProfile>(defaultProfile);
  const [activeBranchId, setActiveBranchId] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ─── Load all data for authenticated user from Neon API ─────────────────────
  const loadAllData = useCallback(async () => {
    if (!user) return;
    setIsDataLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) return;
      const data = await res.json();

      if (data.profile) {
        const mapped = mapProfile(data.profile);
        setProfile(mapped);
        setPartnerType(mapped.type);
      }
      if (data.products) setProducts(data.products.map(mapProduct));
      if (data.orders) setOrders(data.orders.map(mapOrder));
      if (data.disputes) setDisputes(data.disputes.map(mapDispute));
      if (data.payouts) setPayouts(data.payouts.map(mapPayout));
      if (data.reviews) setReviews(data.reviews.map(mapReview));
      if (data.staff) setStaff(data.staff.map(mapStaff));
      if (data.branches) {
        const mappedBranches = data.branches.map(mapBranch);
        setBranches(mappedBranches);
        const hq = mappedBranches.find((b: Branch) => b.isHQ);
        if (hq) setActiveBranchId(hq.id);
        else if (mappedBranches.length > 0) setActiveBranchId(mappedBranches[0].id);
      }
      if (data.inventoryLogs) setInventoryLogs(data.inventoryLogs.map(mapInventoryLog));
      if (data.notifications) setNotifications(data.notifications.map(mapNotification));
      if (data.supportTickets) setSupportTickets(data.supportTickets.map(mapSupportTicket));
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, loadAllData]);

  // Sync profile from auth context
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setPartnerType(authProfile.type);
    }
  }, [authProfile]);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const switchPartnerType = (type: PartnerType) => {
    setPartnerType(type);
    updateProfile({ type });
  };

  const updateProfile = async (updated: Partial<PartnerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  };

  // Products
  const addProduct = async (newProd: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const tempId = "prod-" + generateRandomId("P");
    const optimisticProd: Product = {
      ...newProd,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [optimisticProd, ...prev]);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const mapped = mapProduct(data.product);
          setProducts((prev) => prev.map((p) => (p.id === tempId ? mapped : p)));
        }
      }
    } catch {
      // Keep optimistic
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    });
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
  };

  // Orders
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
  };

  const dispatchOrder = async (
    orderId: string,
    courier: string,
    trackingNumber: string,
    branchName: string
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "shipped",
              courier,
              trackingNumber,
              dispatchBranch: branchName,
              dispatchedAt: now,
            }
          : o
      )
    );
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        action: "dispatch",
        courier,
        trackingNumber,
        dispatchBranch: branchName,
      }),
    });
  };

  const reissueDigitalLink = (orderId: string, itemId: string): string => {
    const token = generateRandomId("SEC");
    const expiresAt = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    return `https://download.fameme.ng/v1/stems/${orderId}/${itemId}?token=${token}&expires=${expiresAt}`;
  };

  // Disputes
  const respondToDispute = async (
    disputeId: string,
    action: "accepted" | "rejected" | "refunded",
    reason: string
  ) => {
    const now = new Date().toISOString();
    const newStatus = action === "refunded" ? "resolved" : "under_review";
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: newStatus,
              merchantResponse: { action, reason, respondedAt: now },
            }
          : d
      )
    );

    await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disputeId,
        action,
        reason,
        senderName: profile.businessName,
      }),
    });
  };

  const sendDisputeMessage = async (disputeId: string, message: string) => {
    const now = new Date().toISOString();
    const newMsg = {
      id: "msg-" + generateRandomId("M"),
      sender: "merchant" as const,
      senderName: `${profile.businessName} (Merchant)`,
      message,
      timestamp: now,
    };

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, messages: [...d.messages, newMsg] } : d))
    );

    await fetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disputeId,
        message,
        senderName: `${profile.businessName} (Merchant)`,
      }),
    });
  };

  // Inventory
  const updateStock = async (productId: string, newStock: number, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        newStock,
        reason,
        changedBy: profile.businessName,
      }),
    });
  };

  const batchUpdateStock = async (
    updates: { productId: string; newStock: number }[],
    reason?: string
  ) => {
    for (const u of updates) {
      await updateStock(u.productId, u.newStock, reason);
    }
  };

  // Financial calculations
  const deliveredNet = orders
    .filter((o) => o.status === "delivered" && !o.hasDispute)
    .reduce((sum, o) => sum + o.netPayout, 0);

  const totalPaidOut = payouts
    .filter((p) => p.status === "settled" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);

  const availableWithdrawable = Math.max(0, deliveredNet - totalPaidOut);

  const pendingEscrow = orders
    .filter(
      (o) =>
        !o.hasDispute &&
        ["new", "processing", "awaiting_fulfillment", "ready_for_dispatch", "shipped"].includes(
          o.status
        )
    )
    .reduce((sum, o) => sum + o.netPayout, 0);

  const disputedHold = orders
    .filter((o) => o.hasDispute || o.status === "disputed")
    .reduce((sum, o) => sum + o.netPayout, 0);

  const totalCommissionPaid = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.commissionFee, 0);

  const lifetimeGross = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const requestPayout = async (
    amount: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ): Promise<boolean> => {
    if (amount <= 0 || amount > availableWithdrawable) return false;

    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bankName, accountNumber, accountName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.payout) {
          setPayouts((prev) => [mapPayout(data.payout), ...prev]);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Reviews
  const replyReview = (reviewId: string, replyMessage: string) => {
    const now = new Date().toISOString();
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: {
                merchantName: profile.businessName,
                message: replyMessage,
                repliedAt: now,
              },
            }
          : r
      )
    );
  };

  const reportReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reported: true } : r))
    );
  };

  // Branches
  const addBranch = (newBranch: Omit<Branch, "id" | "activeStockUnits">) => {
    const branch: Branch = {
      ...newBranch,
      id: "br-" + generateRandomId("B"),
      activeStockUnits: 0,
    };
    setBranches((prev) => [...prev, branch]);
  };

  // Staff
  const inviteStaff = (newStaff: Omit<StaffMember, "id" | "status" | "lastActive">) => {
    const member: StaffMember = {
      ...newStaff,
      id: "stf-" + generateRandomId("S"),
      status: "invited",
      lastActive: "Pending invite acceptance",
    };
    setStaff((prev) => [...prev, member]);
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Support
  const openSupportTicket = (
    subject: string,
    category: SupportTicket["category"],
    priority: SupportTicket["priority"],
    initialMessage: string
  ) => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: "tkt-" + generateRandomId("T"),
      ticketNumber: "FM-" + Math.floor(1000 + Math.random() * 9000),
      subject,
      category,
      status: "open",
      priority,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          sender: "merchant",
          name: profile.businessName,
          message: initialMessage,
          timestamp: now,
        },
      ],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
  };

  const sendTicketMessage = (ticketId: string, message: string) => {
    const now = new Date().toISOString();
    const ticket = supportTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    const newMsg = {
      sender: "merchant" as const,
      name: profile.businessName,
      message,
      timestamp: now,
    };
    const updatedMessages = [...ticket.messages, newMsg];
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, updatedAt: now, messages: updatedMessages } : t))
    );
  };

  // Metrics
  const metrics = {
    totalRevenue: deliveredNet,
    deliveredOrdersCount: orders.filter((o) => o.status === "delivered").length,
    pendingOrdersCount: orders.filter((o) =>
      ["new", "processing", "awaiting_fulfillment", "ready_for_dispatch", "shipped"].includes(
        o.status
      )
    ).length,
    activeProductsCount: products.filter((p) => p.status === "active").length,
    averageRating:
      reviews.length > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0,
    openDisputesCount: disputes.filter(
      (d) => d.status === "open" || d.status === "under_review"
    ).length,
  };

  return (
    <DashboardContext.Provider
      value={{
        partnerType,
        switchPartnerType,
        profile,
        updateProfile,
        activeBranchId,
        setActiveBranchId,
        branches,
        addBranch,
        staff,
        inviteStaff,
        removeStaff,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        dispatchOrder,
        reissueDigitalLink,
        disputes,
        respondToDispute,
        sendDisputeMessage,
        inventoryLogs,
        updateStock,
        batchUpdateStock,
        payouts,
        requestPayout,
        reviews,
        replyReview,
        reportReview,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        supportTickets,
        openSupportTicket,
        sendTicketMessage,
        balances: {
          lifetimeGross,
          availableWithdrawable,
          pendingEscrow,
          disputedHold,
          totalPaidOut,
          totalCommissionPaid,
        },
        metrics,
        isDataLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

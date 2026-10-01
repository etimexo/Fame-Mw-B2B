"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
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
import {
  companyProfile,
  sellerProfile,
  initialProducts,
  initialOrders,
  initialDisputes,
  initialPayouts,
  initialReviews,
  initialStaff,
  initialBranches,
  initialInventoryLogs,
  initialNotifications,
  initialSupportTickets,
} from "@/lib/seed-data";
import { generateRandomId } from "@/lib/utils";

interface DashboardContextType {
  partnerType: PartnerType;
  switchPartnerType: (type: PartnerType) => void;
  profile: PartnerProfile;
  updateProfile: (updated: Partial<PartnerProfile>) => void;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  branches: Branch[];
  addBranch: (branch: Omit<Branch, "id" | "activeStockUnits">) => void;
  staff: StaffMember[];
  inviteStaff: (staff: Omit<StaffMember, "id" | "status" | "lastActive">) => void;
  removeStaff: (id: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  dispatchOrder: (orderId: string, courier: string, trackingNumber: string, branch: string) => void;
  reissueDigitalLink: (orderId: string, productId: string) => string;
  disputes: Dispute[];
  respondToDispute: (disputeId: string, action: "accepted" | "rejected" | "refunded", reason: string) => void;
  sendDisputeMessage: (disputeId: string, message: string) => void;
  inventoryLogs: InventoryLog[];
  updateStock: (productId: string, newStock: number, reason?: string) => void;
  batchUpdateStock: (updates: { productId: string; newStock: number }[], reason?: string) => void;
  payouts: Payout[];
  requestPayout: (amount: number, bankName: string, accountNumber: string, accountName: string) => boolean;
  reviews: Review[];
  replyReview: (reviewId: string, replyMessage: string) => void;
  reportReview: (reviewId: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  supportTickets: SupportTicket[];
  openSupportTicket: (subject: string, category: SupportTicket["category"], priority: SupportTicket["priority"], initialMessage: string) => void;
  sendTicketMessage: (ticketId: string, message: string) => void;
  // Financial computed balances
  balances: {
    lifetimeGross: number;
    availableWithdrawable: number;
    pendingEscrow: number;
    totalCommissionPaid: number;
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [partnerType, setPartnerType] = useState<PartnerType>("company");
  const [companyData, setCompanyData] = useState<PartnerProfile>(companyProfile);
  const [sellerData, setSellerData] = useState<PartnerProfile>(sellerProfile);
  const [activeBranchId, setActiveBranchId] = useState<string>("branch-lekki-hq");
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(initialInventoryLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

  // Load from local state on mount if available
  useEffect(() => {
    try {
      const savedType = localStorage.getItem("fameme_partner_type");
      if (savedType === "company" || savedType === "seller") {
        setPartnerType(savedType);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const switchPartnerType = (type: PartnerType) => {
    setPartnerType(type);
    try {
      localStorage.setItem("fameme_partner_type", type);
    } catch {
      // safe fallback
    }
  };

  const profile = partnerType === "company" ? companyData : sellerData;

  const updateProfile = (updated: Partial<PartnerProfile>) => {
    if (partnerType === "company") {
      setCompanyData((prev) => ({ ...prev, ...updated }));
    } else {
      setSellerData((prev) => ({ ...prev, ...updated }));
    }
  };

  // Financial Calculations
  const lifetimeGross = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.subtotal, 1450000); // base lifetime

  // Orders delivered > 7 days ago or settled
  const deliveredNet = orders
    .filter((o) => o.status === "delivered" && !o.hasDispute)
    .reduce((sum, o) => sum + o.netPayout, 0);

  const totalPaidOut = payouts
    .filter((p) => p.status === "settled" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);

  // Escrow: orders currently in processing, awaiting_fulfillment, ready_for_dispatch, shipped, or delivered within dispute window
  const pendingEscrow = orders
    .filter(
      (o) =>
        o.status === "processing" ||
        o.status === "awaiting_fulfillment" ||
        o.status === "ready_for_dispatch" ||
        o.status === "shipped" ||
        (o.status === "delivered" && o.hasDispute)
    )
    .reduce((sum, o) => sum + o.netPayout, 0);

  const availableWithdrawable = Math.max(0, 890000 + deliveredNet - totalPaidOut);

  const totalCommissionPaid = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.commissionFee, 116000);

  // Actions
  const addProduct = (newProd: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const id = "prod-" + generateRandomId("p");
    const now = new Date().toISOString();
    const createdProduct: Product = {
      ...newProd,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [createdProduct, ...prev]);

    // Inventory log if physical
    if (newProd.type === "physical" && newProd.stock > 0) {
      const log: InventoryLog = {
        id: "log-" + generateRandomId("L"),
        productId: id,
        productTitle: newProd.title,
        previousStock: 0,
        newStock: newProd.stock,
        change: newProd.stock,
        reason: "Initial product stock catalog creation",
        changedBy: profile.businessName,
        timestamp: now,
      };
      setInventoryLogs((prev) => [log, ...prev]);
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (productId: string, newStock: number, reason: string = "Manual Stock Adjustment") => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prevStock = p.stock;
          const change = newStock - prevStock;
          const log: InventoryLog = {
            id: "log-" + generateRandomId("L"),
            productId: p.id,
            productTitle: p.title,
            previousStock: prevStock,
            newStock,
            change,
            reason,
            changedBy: profile.businessName,
            timestamp: new Date().toISOString(),
          };
          setInventoryLogs((lPrev) => [log, ...lPrev]);
          return { ...p, stock: newStock, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const batchUpdateStock = (updates: { productId: string; newStock: number }[], reason: string = "Batch Stock Update") => {
    const now = new Date().toISOString();
    const newLogs: InventoryLog[] = [];

    setProducts((prev) =>
      prev.map((p) => {
        const match = updates.find((u) => u.productId === p.id);
        if (match) {
          const prevStock = p.stock;
          const change = match.newStock - prevStock;
          newLogs.push({
            id: "log-" + generateRandomId("L"),
            productId: p.id,
            productTitle: p.title,
            previousStock: prevStock,
            newStock: match.newStock,
            change,
            reason,
            changedBy: profile.businessName,
            timestamp: now,
          });
          return { ...p, stock: match.newStock, updatedAt: now };
        }
        return p;
      })
    );

    if (newLogs.length > 0) {
      setInventoryLogs((prev) => [...newLogs, ...prev]);
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            deliveredAt: status === "delivered" ? new Date().toISOString() : o.deliveredAt,
          };
        }
        return o;
      })
    );
  };

  const dispatchOrder = (orderId: string, courier: string, trackingNumber: string, branch: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: "shipped",
            courier,
            trackingNumber,
            dispatchBranch: branch,
            dispatchedAt: now,
          };
        }
        return o;
      })
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: "notif-" + generateRandomId("N"),
      title: `Order Dispatched via ${courier}`,
      message: `Waybill ${trackingNumber} assigned for Order #${orderId}`,
      type: "order",
      timestamp: now,
      read: false,
      link: "/orders",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const reissueDigitalLink = (orderId: string, productId: string): string => {
    const freshToken = "token_" + generateRandomId("jwt").toLowerCase();
    const newUrl = `https://fame-me.download/access/${freshToken}`;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedItems = o.items.map((item) => {
            if (item.productId === productId && item.type === "digital") {
              return {
                ...item,
                digitalDownloadUrl: newUrl,
                downloadToken: freshToken,
                downloadsRemaining: 5,
              };
            }
            return item;
          });
          return { ...o, items: updatedItems };
        }
        return o;
      })
    );
    return newUrl;
  };

  const respondToDispute = (disputeId: string, action: "accepted" | "rejected" | "refunded", reason: string) => {
    const now = new Date().toISOString();
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          const actionText =
            action === "accepted"
              ? "Accepted Return / Exchange"
              : action === "refunded"
              ? "Approved Full Refund"
              : "Disputed / Rejected Claim";

          const newMsg = {
            id: "msg-" + generateRandomId("M"),
            sender: "merchant" as const,
            senderName: `${profile.businessName} (Merchant)`,
            message: `${actionText}: ${reason}`,
            timestamp: now,
          };

          return {
            ...d,
            status: action === "accepted" ? "under_review" : action === "refunded" ? "resolved" : "escalated",
            merchantResponse: {
              action,
              reason,
              respondedAt: now,
            },
            messages: [...d.messages, newMsg],
          };
        }
        return d;
      })
    );
  };

  const sendDisputeMessage = (disputeId: string, message: string) => {
    const now = new Date().toISOString();
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          const newMsg = {
            id: "msg-" + generateRandomId("M"),
            sender: "merchant" as const,
            senderName: `${profile.businessName} (Merchant)`,
            message,
            timestamp: now,
          };
          return { ...d, messages: [...d.messages, newMsg] };
        }
        return d;
      })
    );
  };

  const requestPayout = (amount: number, bankName: string, accountNumber: string, accountName: string): boolean => {
    if (amount <= 0 || amount > availableWithdrawable) {
      return false;
    }

    const now = new Date().toISOString();
    const batchId = `SETTLE-NGN-${now.slice(0, 10)}-${Math.floor(100 + Math.random() * 900)}`;
    const newPayout: Payout = {
      id: "pay-" + generateRandomId("P"),
      batchId,
      amount,
      requestedAt: now,
      status: "processing",
      bankName,
      accountNumber,
      accountName,
      reference: `NIP/FME/${bankName.slice(0, 3).toUpperCase()}/${Date.now()}`,
      fee: 100, // Standard ₦100 NIBSS transfer charge
      netAmount: amount - 100,
    };

    setPayouts((prev) => [newPayout, ...prev]);

    const notif: NotificationItem = {
      id: "notif-" + generateRandomId("N"),
      title: "Payout Request Initiated",
      message: `₦${amount.toLocaleString()} queued for transfer to ${bankName} (${accountNumber})`,
      type: "platform",
      timestamp: now,
      read: false,
      link: "/finance",
    };
    setNotifications((prev) => [notif, ...prev]);

    return true;
  };

  const replyReview = (reviewId: string, replyMessage: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            reply: {
              merchantName: profile.businessName,
              message: replyMessage,
              repliedAt: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );
  };

  const reportReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return { ...r, reported: true };
        }
        return r;
      })
    );
  };

  const inviteStaff = (newStaff: Omit<StaffMember, "id" | "status" | "lastActive">) => {
    const created: StaffMember = {
      ...newStaff,
      id: "staff-" + generateRandomId("S"),
      status: "invited",
      lastActive: "Invitation email dispatched",
    };
    setStaff((prev) => [...prev, created]);
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const addBranch = (newBranch: Omit<Branch, "id" | "activeStockUnits">) => {
    const created: Branch = {
      ...newBranch,
      id: "branch-" + generateRandomId("B").toLowerCase(),
      activeStockUnits: 0,
    };
    setBranches((prev) => [...prev, created]);
  };

  const openSupportTicket = (
    subject: string,
    category: SupportTicket["category"],
    priority: SupportTicket["priority"],
    initialMessage: string
  ) => {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: "tick-" + generateRandomId("T"),
      ticketNumber: "TICK-FME-" + Math.floor(1000 + Math.random() * 9000),
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
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: now,
            messages: [
              ...t.messages,
              {
                sender: "merchant",
                name: profile.businessName,
                message,
                timestamp: now,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
          totalCommissionPaid,
        },
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

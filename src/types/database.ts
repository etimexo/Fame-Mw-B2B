// Auto-generated Supabase database types for FameMe B2B
// These map 1:1 with the Supabase tables defined in supabase-schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      partner_profiles: {
        Row: {
          id: string; // uuid → matches auth.users.id
          type: "company" | "seller";
          business_name: string;
          tagline: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          cac_number: string | null;
          tin_number: string | null;
          nin_number: string | null;
          logo: string | null;
          banner: string | null;
          bio: string | null;
          commission_rate: number;
          kyc_status: "verified" | "pending" | "action_required";
          agreement_signed: boolean;
          tier_name: string | null;
          verified_badge: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["partner_profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["partner_profiles"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          partner_id: string;
          title: string;
          description: string | null;
          category: string | null;
          subcategory: string | null;
          type: "physical" | "digital";
          sku: string | null;
          barcode: string | null;
          price: number;
          sale_price: number | null;
          stock: number;
          low_stock_threshold: number;
          approval_status: "approved" | "under_review" | "rejected";
          status: "active" | "draft" | "archived";
          image_url: string | null;
          tags: string[] | null;
          weight_kg: number | null;
          dimensions_cm: Json | null;
          branch_location_id: string | null;
          digital_file_format: string | null;
          digital_file_size: string | null;
          digital_download_limit: number | null;
          digital_sample_url: string | null;
          license_type: "standard" | "extended_commercial" | "exclusive_rights" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          partner_id: string;
          title: string;
          price: number;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price: number;
          stock: number;
          attributes: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_variants"]["Row"]> & {
          product_id: string;
          name: string;
          price: number;
          stock: number;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          partner_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          shipping_address: Json;
          items: Json;
          subtotal: number;
          shipping_fee: number;
          commission_fee: number;
          net_payout: number;
          status: "new" | "processing" | "awaiting_fulfillment" | "ready_for_dispatch" | "shipped" | "delivered" | "cancelled" | "returned" | "disputed";
          payment_method: string | null;
          courier: string | null;
          tracking_number: string | null;
          dispatched_at: string | null;
          delivered_at: string | null;
          sla_deadline: string | null;
          dispatch_branch: string | null;
          has_dispute: boolean;
          dispute_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          partner_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          shipping_address: Json;
          items: Json;
          subtotal: number;
          net_payout: number;
          status: "new" | "processing" | "awaiting_fulfillment" | "ready_for_dispatch" | "shipped" | "delivered" | "cancelled" | "returned" | "disputed";
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      disputes: {
        Row: {
          id: string;
          partner_id: string;
          case_number: string;
          order_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          category: "defective_item" | "wrong_size" | "digital_file_corrupted" | "undelivered" | "not_as_described";
          reason: string;
          status: "open" | "under_review" | "resolved" | "escalated";
          amount: number;
          customer_evidence: Json;
          merchant_response: Json | null;
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["disputes"]["Row"]> & {
          partner_id: string;
          case_number: string;
          order_id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          category: "defective_item" | "wrong_size" | "digital_file_corrupted" | "undelivered" | "not_as_described";
          reason: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["disputes"]["Row"]>;
        Relationships: [];
      };
      payouts: {
        Row: {
          id: string;
          partner_id: string;
          batch_id: string;
          amount: number;
          requested_at: string;
          settled_at: string | null;
          status: "settled" | "processing" | "queued";
          bank_name: string;
          account_number: string;
          account_name: string;
          reference: string;
          fee: number;
          net_amount: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payouts"]["Row"]> & {
          partner_id: string;
          batch_id: string;
          amount: number;
          bank_name: string;
          account_number: string;
          account_name: string;
          reference: string;
          net_amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["payouts"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          partner_id: string;
          product_id: string;
          product_title: string;
          customer_name: string;
          rating: number;
          title: string | null;
          comment: string | null;
          verified_purchase: boolean;
          reply: Json | null;
          reported: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          partner_id: string;
          product_id: string;
          product_title: string;
          customer_name: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      staff: {
        Row: {
          id: string;
          partner_id: string;
          name: string;
          email: string;
          phone: string | null;
          role: "owner" | "manager" | "fulfillment" | "accountant";
          status: "active" | "invited" | "suspended";
          avatar: string | null;
          last_active: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["staff"]["Row"]> & {
          partner_id: string;
          name: string;
          email: string;
          role: "owner" | "manager" | "fulfillment" | "accountant";
        };
        Update: Partial<Database["public"]["Tables"]["staff"]["Row"]>;
        Relationships: [];
      };
      branches: {
        Row: {
          id: string;
          partner_id: string;
          name: string;
          code: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          manager_name: string | null;
          phone: string | null;
          is_hq: boolean;
          active_stock_units: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["branches"]["Row"]> & {
          partner_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["branches"]["Row"]>;
        Relationships: [];
      };
      inventory_logs: {
        Row: {
          id: string;
          partner_id: string;
          product_id: string;
          product_title: string;
          previous_stock: number;
          new_stock: number;
          change: number;
          reason: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inventory_logs"]["Row"]> & {
          partner_id: string;
          product_id: string;
          product_title: string;
          previous_stock: number;
          new_stock: number;
          change: number;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_logs"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          partner_id: string;
          title: string;
          message: string;
          type: "order" | "product" | "inventory" | "platform" | "dispute";
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          partner_id: string;
          title: string;
          message: string;
          type: "order" | "product" | "inventory" | "platform" | "dispute";
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          partner_id: string;
          ticket_number: string;
          subject: string;
          category: "orders_shipping" | "payouts_finance" | "kyc_account" | "technical" | "disputes";
          status: "open" | "awaiting_merchant" | "closed";
          priority: "low" | "medium" | "high" | "urgent";
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]> & {
          partner_id: string;
          ticket_number: string;
          subject: string;
          category: "orders_shipping" | "payouts_finance" | "kyc_account" | "technical" | "disputes";
          messages: Json;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

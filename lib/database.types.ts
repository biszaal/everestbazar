/* EverestBazar — Supabase database types.
 * Hand-written to match supabase/migrations/001_initial_schema.sql so the code
 * typechecks before a project is linked. Regenerate the canonical version with:
 *   npx supabase gen types typescript --db-url "$SUPABASE_DB_URL" > lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type KycStatusDb = "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
type CategoryDb = "ELECTRONICS" | "FASHION" | "FURNITURE" | "VEHICLES" | "OTHER";
type ConditionDb = "LIKE_NEW" | "GOOD" | "FAIR" | "FOR_PARTS";
type ListingStatusDb = "ACTIVE" | "RESERVED" | "SOLD" | "DELETED";
type TxnStatusDb =
  | "PENDING_PAYMENT"
  | "ESCROW_HELD"
  | "DELIVERY_CONFIRMED"
  | "COMPLETED"
  | "DISPUTED"
  | "REFUNDED"
  | "CANCELLED";
type PaymentMethodDb = "ESEWA" | "KHALTI";
type MessageTypeDb = "TEXT" | "OFFER" | "SYSTEM";
type OfferStatusDb = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string;
          name: string;
          kyc_status: KycStatusDb;
          kyc_rejected_reason: string | null;
          nid_hash: string | null;
          nid_front_path: string | null;
          nid_back_path: string | null;
          selfie_path: string | null;
          esewa_number: string | null;
          khalti_number: string | null;
          trust_score: number;
          completed_sales: number;
          completed_purchases: number;
          avg_rating: number;
          city: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; phone: string } & Partial<
          Database["public"]["Tables"]["profiles"]["Row"]
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          category: CategoryDb;
          subcategory: string;
          condition: ConditionDb;
          price_npr: number;
          photo_paths: string[];
          status: ListingStatusDb;
          city: string;
          views: number;
          accepts_offers: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          seller_id: string;
          title: string;
          category: CategoryDb;
          condition: ConditionDb;
          price_npr: number;
        } & Partial<Database["public"]["Tables"]["listings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["listings"]["Row"]>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          listing_id: string;
          price_npr: number;
          platform_fee_npr: number;
          escrow_fee_npr: number;
          total_npr: number;
          status: TxnStatusDb;
          payment_method: PaymentMethodDb | null;
          payment_ref: string | null;
          escrow_deadline: string | null;
          delivery_method: "PICKUP" | "PATHAO";
          dispute_reason: string | null;
          dispute_evidence: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          buyer_id: string;
          seller_id: string;
          listing_id: string;
          price_npr: number;
          platform_fee_npr: number;
          total_npr: number;
        } & Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string | null;
          buyer_id: string;
          seller_id: string;
          last_message: string | null;
          last_message_at: string | null;
          buyer_unread: number;
          seller_unread: number;
          created_at: string;
        };
        Insert: {
          buyer_id: string;
          seller_id: string;
        } & Partial<Database["public"]["Tables"]["conversations"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["conversations"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type: MessageTypeDb;
          offer_amount_npr: number | null;
          offer_status: OfferStatusDb | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          sender_id: string;
          content: string;
        } & Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          transaction_id: string;
          reviewer_id: string;
          reviewed_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          transaction_id: string;
          reviewer_id: string;
          reviewed_id: string;
          rating: number;
        } & Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_views: { Args: { listing_id: string }; Returns: undefined };
      recalculate_trust_score: { Args: { user_id: string }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];
export type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

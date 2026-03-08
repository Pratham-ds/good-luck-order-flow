export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string | null
          state: string | null
          street_address: string
          title: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          street_address: string
          title: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          street_address?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          created_at: string | null
          id: string
          milestone: number
          redeemed: boolean
          redeemed_at: string | null
          reward_type: string
          reward_value: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          milestone: number
          redeemed?: boolean
          redeemed_at?: string | null
          reward_type?: string
          reward_value?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          milestone?: number
          redeemed?: boolean
          redeemed_at?: string | null
          reward_type?: string
          reward_value?: number
          user_id?: string
        }
        Relationships: []
      }
      order_tracking: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string
          created_at: string | null
          delivery_date: string | null
          id: string
          items: Json
          order_number: string
          phone: string | null
          pickup_date: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_id: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          items: Json
          order_number: string
          phone?: string | null
          pickup_date?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_id?: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          items?: Json
          order_number?: string
          phone?: string | null
          pickup_date?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      price_items: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_active: boolean
          item_name: string
          offer_price: string
          regular_price: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          item_name: string
          offer_price: string
          regular_price: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          item_name?: string
          offer_price?: string
          regular_price?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      special_offers: {
        Row: {
          created_at: string | null
          description: string | null
          discount_text: string
          id: string
          is_active: boolean
          title: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_text: string
          id?: string
          is_active?: boolean
          title: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_text?: string
          id?: string
          is_active?: boolean
          title?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          customer_location: string | null
          customer_name: string
          id: string
          is_active: boolean
          message: string
          rating: number
        }
        Insert: {
          created_at?: string | null
          customer_location?: string | null
          customer_name: string
          id?: string
          is_active?: boolean
          message: string
          rating?: number
        }
        Update: {
          created_at?: string | null
          customer_location?: string | null
          customer_name?: string
          id?: string
          is_active?: boolean
          message?: string
          rating?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      get_loyalty_status: {
        Args: { user_uuid: string }
        Returns: {
          available_rewards: number
          current_milestone: number
          next_milestone: number
          orders_to_next: number
          total_delivered_orders: number
        }[]
      }
      get_reorder_suggestions: {
        Args: { user_uuid: string }
        Returns: {
          days_since_last_order: number
          last_order_date: string
          service_type: Database["public"]["Enums"]["service_type"]
          suggestion_message: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_customer: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "customer"
      order_status:
        | "scheduled"
        | "picked_up"
        | "in_process"
        | "out_for_delivery"
        | "delivered"
      service_type:
        | "dry_cleaning"
        | "laundry"
        | "alterations"
        | "shoe_cleaning"
        | "curtain_cleaning"
        | "sofa_cleaning"
        | "minor_repair"
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "customer"],
      order_status: [
        "scheduled",
        "picked_up",
        "in_process",
        "out_for_delivery",
        "delivered",
      ],
      service_type: [
        "dry_cleaning",
        "laundry",
        "alterations",
        "shoe_cleaning",
        "curtain_cleaning",
        "sofa_cleaning",
        "minor_repair",
      ],
      user_role: ["admin", "customer"],
    },
  },
} as const

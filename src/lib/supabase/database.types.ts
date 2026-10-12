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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_on: string | null
          company: string
          contact_name: string | null
          created_at: string
          id: number
          job_post: string | null
          job_url: string | null
          message_sent: string | null
          my_ask: string | null
          next_step: string | null
          next_step_on: string | null
          notes: string | null
          pay_max_php: number | null
          pay_min_php: number | null
          pay_text: string | null
          remote: string | null
          resume_used: string | null
          role: string
          source: string | null
          stage: Database["public"]["Enums"]["application_stage"]
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_on?: string | null
          company: string
          contact_name?: string | null
          created_at?: string
          id?: never
          job_post?: string | null
          job_url?: string | null
          message_sent?: string | null
          my_ask?: string | null
          next_step?: string | null
          next_step_on?: string | null
          notes?: string | null
          pay_max_php?: number | null
          pay_min_php?: number | null
          pay_text?: string | null
          remote?: string | null
          resume_used?: string | null
          role: string
          source?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          applied_on?: string | null
          company?: string
          contact_name?: string | null
          created_at?: string
          id?: never
          job_post?: string | null
          job_url?: string | null
          message_sent?: string | null
          my_ask?: string | null
          next_step?: string | null
          next_step_on?: string | null
          notes?: string | null
          pay_max_php?: number | null
          pay_min_php?: number | null
          pay_text?: string | null
          remote?: string | null
          resume_used?: string | null
          role?: string
          source?: string | null
          stage?: Database["public"]["Enums"]["application_stage"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skipped_jobs: {
        Row: {
          created_at: string
          id: number
          job_url: string | null
          reason: string | null
          seen_on: string
          source: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          job_url?: string | null
          reason?: string | null
          seen_on?: string
          source?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: never
          job_url?: string | null
          reason?: string | null
          seen_on?: string
          source?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      stage_events: {
        Row: {
          application_id: number
          created_at: string
          from_stage: Database["public"]["Enums"]["application_stage"] | null
          happened_on: string
          id: number
          note: string | null
          to_stage: Database["public"]["Enums"]["application_stage"]
          user_id: string
        }
        Insert: {
          application_id: number
          created_at?: string
          from_stage?: Database["public"]["Enums"]["application_stage"] | null
          happened_on?: string
          id?: never
          note?: string | null
          to_stage: Database["public"]["Enums"]["application_stage"]
          user_id?: string
        }
        Update: {
          application_id?: number
          created_at?: string
          from_stage?: Database["public"]["Enums"]["application_stage"] | null
          happened_on?: string
          id?: never
          note?: string | null
          to_stage?: Database["public"]["Enums"]["application_stage"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          follow_up_days: number
          no_reply_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          follow_up_days?: number
          no_reply_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          follow_up_days?: number
          no_reply_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_stage:
        | "draft"
        | "applied"
        | "screening"
        | "technical"
        | "final"
        | "offer"
        | "rejected"
        | "no_reply"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_stage: [
        "draft",
        "applied",
        "screening",
        "technical",
        "final",
        "offer",
        "rejected",
        "no_reply",
      ],
    },
  },
} as const

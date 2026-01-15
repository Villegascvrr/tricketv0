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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_value: Json | null
          old_value: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_value?: Json | null
          old_value?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          owner_id: string | null
          start_date: string
          total_capacity: number | null
          type: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          owner_id?: string | null
          start_date: string
          total_capacity?: number | null
          type: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          owner_id?: string | null
          start_date?: string
          total_capacity?: number | null
          type?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      festival_roles: {
        Row: {
          bg_color: string | null
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          permissions: string[] | null
        }
        Insert: {
          bg_color?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          permissions?: string[] | null
        }
        Update: {
          bg_color?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
        }
        Relationships: []
      }
      interested_users: {
        Row: {
          comment: string | null
          company: string
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
        }
        Insert: {
          comment?: string | null
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string | null
        }
        Update: {
          comment?: string | null
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      invitation_code_uses: {
        Row: {
          code_id: string
          id: string
          used_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          id?: string
          used_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_code_uses_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "invitation_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string
          current_uses: number
          event_id: string
          expires_at: string | null
          festival_role_id: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          event_id: string
          expires_at?: string | null
          festival_role_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          event_id?: string
          expires_at?: string | null
          festival_role_id?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_codes_festival_role_id_fkey"
            columns: ["festival_role_id"]
            isOneToOne: false
            referencedRelation: "festival_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          clicks: number | null
          created_at: string
          ctr: number | null
          end_date: string | null
          estimated_revenue: number | null
          id: string
          name: string
          observation: string | null
          platform: string
          reach: number | null
          spent: number | null
          start_date: string
          status: string
          team_notes: string | null
          tickets_sold: number | null
          type: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          end_date?: string | null
          estimated_revenue?: number | null
          id?: string
          name: string
          observation?: string | null
          platform?: string
          reach?: number | null
          spent?: number | null
          start_date: string
          status?: string
          team_notes?: string | null
          tickets_sold?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          clicks?: number | null
          created_at?: string
          ctr?: number | null
          end_date?: string | null
          estimated_revenue?: number | null
          id?: string
          name?: string
          observation?: string | null
          platform?: string
          reach?: number | null
          spent?: number | null
          start_date?: string
          status?: string
          team_notes?: string | null
          tickets_sold?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      pre_festival_attachments: {
        Row: {
          created_at: string
          id: string
          name: string
          task_id: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          task_id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          task_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_festival_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "pre_festival_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_festival_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_festival_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "pre_festival_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_festival_milestones: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          target_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          target_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          target_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_festival_milestones_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_festival_subtasks: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          task_id: string
          title: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          task_id: string
          title: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          task_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_festival_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "pre_festival_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_festival_task_history: {
        Row: {
          action: string
          changed_by: string
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          task_id: string
        }
        Insert: {
          action: string
          changed_by: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id: string
        }
        Update: {
          action?: string
          changed_by?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_festival_task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "pre_festival_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_festival_tasks: {
        Row: {
          area: string
          assignee_id: string | null
          assignee_name: string | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string
          event_id: string | null
          id: string
          milestone_id: string | null
          priority: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          area: string
          assignee_id?: string | null
          assignee_name?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date: string
          event_id?: string | null
          id?: string
          milestone_id?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          area?: string
          assignee_id?: string | null
          assignee_name?: string | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string
          event_id?: string | null
          id?: string
          milestone_id?: string | null
          priority?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_milestone"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "pre_festival_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_festival_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string
          event_id: string | null
          festival_role_id: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_owner: boolean
          joined_at: string | null
          last_activity: string | null
          name: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id?: string | null
          festival_role_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_owner?: boolean
          joined_at?: string | null
          last_activity?: string | null
          name?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string | null
          festival_role_id?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_owner?: boolean
          joined_at?: string | null
          last_activity?: string | null
          name?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_festival_role_id_fkey"
            columns: ["festival_role_id"]
            isOneToOne: false
            referencedRelation: "festival_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_imports: {
        Row: {
          error_count: number
          event_id: string
          file_name: string
          id: string
          imported_at: string
          imported_count: number
          provider_name: string
          raw_mapping_used: Json | null
        }
        Insert: {
          error_count?: number
          event_id: string
          file_name: string
          id?: string
          imported_at?: string
          imported_count?: number
          provider_name: string
          raw_mapping_used?: Json | null
        }
        Update: {
          error_count?: number
          event_id?: string
          file_name?: string
          id?: string
          imported_at?: string
          imported_count?: number
          provider_name?: string
          raw_mapping_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_imports_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_provider_allocations: {
        Row: {
          allocated_capacity: number
          created_at: string
          event_id: string
          id: string
          notes: string | null
          provider_name: string
          updated_at: string
        }
        Insert: {
          allocated_capacity: number
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          provider_name: string
          updated_at?: string
        }
        Update: {
          allocated_capacity?: number
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          provider_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_provider_allocations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_templates: {
        Row: {
          created_at: string
          id: string
          mappings: Json
          name: string
          provider_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mappings: Json
          name: string
          provider_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mappings?: Json
          name?: string
          provider_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          buyer_age: number | null
          buyer_birth_year: number | null
          buyer_city: string | null
          buyer_country: string | null
          buyer_postal_code: string | null
          buyer_province: string | null
          channel: string | null
          created_at: string
          currency: string | null
          event_id: string
          external_ticket_id: string | null
          has_email: boolean | null
          has_phone: boolean | null
          id: string
          marketing_consent: boolean | null
          price: number
          provider_name: string
          sale_date: string
          status: string | null
          ticket_type: string | null
          updated_at: string
          zone_name: string | null
        }
        Insert: {
          buyer_age?: number | null
          buyer_birth_year?: number | null
          buyer_city?: string | null
          buyer_country?: string | null
          buyer_postal_code?: string | null
          buyer_province?: string | null
          channel?: string | null
          created_at?: string
          currency?: string | null
          event_id: string
          external_ticket_id?: string | null
          has_email?: boolean | null
          has_phone?: boolean | null
          id?: string
          marketing_consent?: boolean | null
          price: number
          provider_name: string
          sale_date: string
          status?: string | null
          ticket_type?: string | null
          updated_at?: string
          zone_name?: string | null
        }
        Update: {
          buyer_age?: number | null
          buyer_birth_year?: number | null
          buyer_city?: string | null
          buyer_country?: string | null
          buyer_postal_code?: string | null
          buyer_province?: string | null
          channel?: string | null
          created_at?: string
          currency?: string | null
          event_id?: string
          external_ticket_id?: string | null
          has_email?: boolean | null
          has_phone?: boolean | null
          id?: string
          marketing_consent?: boolean | null
          price?: number
          provider_name?: string
          sale_date?: string
          status?: string | null
          ticket_type?: string | null
          updated_at?: string
          zone_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          capacity: number | null
          created_at: string
          event_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          event_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

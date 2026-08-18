export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      grupos_evento: {
        Row: {
          color: string
          created_at: string | null
          id: string
          nombre: string
          orden: number
          project_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          nombre: string
          orden?: number
          project_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          nombre?: string
          orden?: number
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupos_evento_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invitados: {
        Row: {
          confirmacion: string | null
          created_at: string | null
          device_id: string | null
          estado: string
          fecha_confirmacion: string | null
          fecha_envio: string | null
          grupo_id: string
          id: string
          mensaje_felicitacion: string | null
          num_invitados: number
          project_id: string
          titular: string
          token: string
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          confirmacion?: string | null
          created_at?: string | null
          device_id?: string | null
          estado?: string
          fecha_confirmacion?: string | null
          fecha_envio?: string | null
          grupo_id: string
          id?: string
          mensaje_felicitacion?: string | null
          num_invitados?: number
          project_id: string
          titular: string
          token?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          confirmacion?: string | null
          created_at?: string | null
          device_id?: string | null
          estado?: string
          fecha_confirmacion?: string | null
          fecha_envio?: string | null
          grupo_id?: string
          id?: string
          mensaje_felicitacion?: string | null
          num_invitados?: number
          project_id?: string
          titular?: string
          token?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitados_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitados_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ceremony: Json | null
          confirmation_highlight_date: string | null
          confirmation_phrase: string | null
          created_at: string | null
          dress_code: Json | null
          event_date: string
          extra_config: Json | null
          gift_registry: Json | null
          guest_name: string | null
          hashtag: string | null
          hero_photo_url: string | null
          id: string
          instagram_mode: string
          itinerary: Json | null
          music_url: string | null
          padrinos: Json | null
          parent_names: Json | null
          photos: Json | null
          pin_admin: string | null
          quinceanera_name: string
          reception: Json | null
          rsvp_phone: string | null
          show_itinerary: boolean | null
          slug: string
          status: string
          template: string
          tiene_lista_invitados: boolean
          updated_at: string | null
        }
        Insert: {
          ceremony?: Json | null
          confirmation_highlight_date?: string | null
          confirmation_phrase?: string | null
          created_at?: string | null
          dress_code?: Json | null
          event_date: string
          extra_config?: Json | null
          gift_registry?: Json | null
          guest_name?: string | null
          hashtag?: string | null
          hero_photo_url?: string | null
          id?: string
          instagram_mode?: string
          itinerary?: Json | null
          music_url?: string | null
          padrinos?: Json | null
          parent_names?: Json | null
          photos?: Json | null
          pin_admin?: string | null
          quinceanera_name: string
          reception?: Json | null
          rsvp_phone?: string | null
          show_itinerary?: boolean | null
          slug: string
          status?: string
          template: string
          tiene_lista_invitados?: boolean
          updated_at?: string | null
        }
        Update: {
          ceremony?: Json | null
          confirmation_highlight_date?: string | null
          confirmation_phrase?: string | null
          created_at?: string | null
          dress_code?: Json | null
          event_date?: string
          extra_config?: Json | null
          gift_registry?: Json | null
          guest_name?: string | null
          hashtag?: string | null
          hero_photo_url?: string | null
          id?: string
          instagram_mode?: string
          itinerary?: Json | null
          music_url?: string | null
          padrinos?: Json | null
          parent_names?: Json | null
          photos?: Json | null
          pin_admin?: string | null
          quinceanera_name?: string
          reception?: Json | null
          rsvp_phone?: string | null
          show_itinerary?: boolean | null
          slug?: string
          status?: string
          template?: string
          tiene_lista_invitados?: boolean
          updated_at?: string | null
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
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const


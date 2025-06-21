export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          avaliado_id: string | null
          avaliador_id: string | null
          comentario: string | null
          criado_em: string | null
          id: string
          nota: number | null
        }
        Insert: {
          avaliado_id?: string | null
          avaliador_id?: string | null
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota?: number | null
        }
        Update: {
          avaliado_id?: string | null
          avaliador_id?: string | null
          comentario?: string | null
          criado_em?: string | null
          id?: string
          nota?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_avaliado_id_fkey"
            columns: ["avaliado_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_fotos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          foto_url: string
          id: string
          ordem: number | null
          prestador_id: string | null
          titulo: string | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          foto_url: string
          id?: string
          ordem?: number | null
          prestador_id?: string | null
          titulo?: string | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          foto_url?: string
          id?: string
          ordem?: number | null
          prestador_id?: string | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_fotos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prestador_servicos: {
        Row: {
          id: string
          preco_max: number | null
          preco_min: number | null
          prestador_id: string | null
          servico_id: string | null
        }
        Insert: {
          id?: string
          preco_max?: number | null
          preco_min?: number | null
          prestador_id?: string | null
          servico_id?: string | null
        }
        Update: {
          id?: string
          preco_max?: number | null
          preco_min?: number | null
          prestador_id?: string | null
          servico_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestador_servicos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestador_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          cor: string | null
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      servicos_disponiveis: {
        Row: {
          ativo: boolean | null
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string | null
          bio: string | null
          cpf: string | null
          criado_em: string | null
          email: string
          endereco_cidade: string | null
          foto_url: string | null
          id: string
          nome: string
          nota_media: number | null
          ocultar_nota: boolean | null
          premium: boolean | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          bio?: string | null
          cpf?: string | null
          criado_em?: string | null
          email: string
          endereco_cidade?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          nota_media?: number | null
          ocultar_nota?: boolean | null
          premium?: boolean | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          bio?: string | null
          cpf?: string | null
          criado_em?: string | null
          email?: string
          endereco_cidade?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          nota_media?: number | null
          ocultar_nota?: boolean | null
          premium?: boolean | null
          tipo?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

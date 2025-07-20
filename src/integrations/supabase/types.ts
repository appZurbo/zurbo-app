export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente_nome: string | null
          criado_em: string | null
          data_agendada: string
          descricao: string | null
          endereco: string | null
          hora_agendada: string
          id: string
          preco_acordado: number | null
          prestador_id: string | null
          servico_id: string | null
          solicitante_id: string | null
          status: string | null
          titulo: string | null
        }
        Insert: {
          cliente_nome?: string | null
          criado_em?: string | null
          data_agendada: string
          descricao?: string | null
          endereco?: string | null
          hora_agendada: string
          id?: string
          preco_acordado?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          titulo?: string | null
        }
        Update: {
          cliente_nome?: string | null
          criado_em?: string | null
          data_agendada?: string
          descricao?: string | null
          endereco?: string | null
          hora_agendada?: string
          id?: string
          preco_acordado?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_attempts: {
        Row: {
          attempt_type: string
          created_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempt_type: string
          created_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempt_type?: string
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      auth_audit_logs: {
        Row: {
          auth_id: string | null
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          provider: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          provider?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          provider?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      bairros_atendidos: {
        Row: {
          bairro: string
          id: string
          prestador_id: string | null
        }
        Insert: {
          bairro: string
          id?: string
          prestador_id?: string | null
        }
        Update: {
          bairro?: string
          id?: string
          prestador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bairros_atendidos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_emails: {
        Row: {
          blocked_reason: string
          created_at: string | null
          created_by: string | null
          email_pattern: string
          id: string
        }
        Insert: {
          blocked_reason: string
          created_at?: string | null
          created_by?: string | null
          email_pattern: string
          id?: string
        }
        Update: {
          blocked_reason?: string
          created_at?: string | null
          created_by?: string | null
          email_pattern?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_emails_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          client_message_count: number | null
          cliente_id: string | null
          created_at: string | null
          id: string
          pedido_id: string | null
          preco_proposto: number | null
          prestador_id: string | null
          provider_message_count: number | null
          servico_solicitado: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_message_count?: number | null
          cliente_id?: string | null
          created_at?: string | null
          id?: string
          pedido_id?: string | null
          preco_proposto?: number | null
          prestador_id?: string | null
          provider_message_count?: number | null
          servico_solicitado: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_message_count?: number | null
          cliente_id?: string | null
          created_at?: string | null
          id?: string
          pedido_id?: string | null
          preco_proposto?: number | null
          prestador_id?: string | null
          provider_message_count?: number | null
          servico_solicitado?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          image_url: string | null
          message_type: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          id: string
          last_message: string | null
          prestador_id: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          prestador_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          id?: string
          last_message?: string | null
          prestador_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cidades_brasileiras: {
        Row: {
          codigo_ibge: string | null
          created_at: string | null
          estado: string
          id: string
          nome: string
        }
        Insert: {
          codigo_ibge?: string | null
          created_at?: string | null
          estado: string
          id?: string
          nome: string
        }
        Update: {
          codigo_ibge?: string | null
          created_at?: string | null
          estado?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      classificacao_prestadores: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          prestador_id: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          prestador_id: string
          tipo?: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          prestador_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "classificacao_prestadores_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comprovantes: {
        Row: {
          gerado_em: string | null
          historico_id: string | null
          id: string
          url_pdf: string | null
        }
        Insert: {
          gerado_em?: string | null
          historico_id?: string | null
          id?: string
          url_pdf?: string | null
        }
        Update: {
          gerado_em?: string | null
          historico_id?: string | null
          id?: string
          url_pdf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comprovantes_historico_id_fkey"
            columns: ["historico_id"]
            isOneToOne: false
            referencedRelation: "historico_servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      cupons: {
        Row: {
          ativo: boolean | null
          codigo: string
          id: string
          tipo: string
          valido_ate: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          id?: string
          tipo: string
          valido_ate?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          id?: string
          tipo?: string
          valido_ate?: string | null
          valor?: number
        }
        Relationships: []
      }
      cupons_usados: {
        Row: {
          cupom_id: string | null
          id: string
          usuario_id: string | null
          utilizado_em: string | null
        }
        Insert: {
          cupom_id?: string | null
          id?: string
          usuario_id?: string | null
          utilizado_em?: string | null
        }
        Update: {
          cupom_id?: string | null
          id?: string
          usuario_id?: string | null
          utilizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cupons_usados_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_usados_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_image_uploads: {
        Row: {
          id: string
          upload_count: number | null
          upload_date: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          upload_count?: number | null
          upload_date?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          upload_count?: number | null
          upload_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_image_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      denuncias: {
        Row: {
          data: string | null
          denunciado_id: string | null
          denunciante_id: string | null
          detalhes: string | null
          id: string
          motivo: string | null
          status: string | null
        }
        Insert: {
          data?: string | null
          denunciado_id?: string | null
          denunciante_id?: string | null
          detalhes?: string | null
          id?: string
          motivo?: string | null
          status?: string | null
        }
        Update: {
          data?: string | null
          denunciado_id?: string | null
          denunciante_id?: string | null
          detalhes?: string | null
          id?: string
          motivo?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "denuncias_denunciado_id_fkey"
            columns: ["denunciado_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "denuncias_denunciante_id_fkey"
            columns: ["denunciante_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_payments: {
        Row: {
          amount: number
          auto_release_date: string | null
          conversation_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          pedido_id: string | null
          released_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          zurbo_fee: number | null
        }
        Insert: {
          amount: number
          auto_release_date?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pedido_id?: string | null
          released_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          zurbo_fee?: number | null
        }
        Update: {
          amount?: number
          auto_release_date?: string | null
          conversation_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pedido_id?: string | null
          released_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          zurbo_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_payments_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_payments_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          criado_em: string | null
          id: string
          prestador_id: string | null
          usuario_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          prestador_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          prestador_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_servicos: {
        Row: {
          criado_em: string | null
          data_servico: string
          id: string
          prestador_id: string | null
          servico_id: string | null
          solicitante_id: string | null
          status: string | null
          valor: number | null
        }
        Insert: {
          criado_em?: string | null
          data_servico: string
          id?: string
          prestador_id?: string | null
          servico_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          valor?: number | null
        }
        Update: {
          criado_em?: string | null
          data_servico?: string
          id?: string
          prestador_id?: string | null
          servico_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_servicos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_servicos_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string
          created_at: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          chat_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_avaliacoes: boolean | null
          email_mensagens: boolean | null
          email_novos_pedidos: boolean | null
          id: string
          push_avaliacoes: boolean | null
          push_mensagens: boolean | null
          push_novos_pedidos: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_avaliacoes?: boolean | null
          email_mensagens?: boolean | null
          email_novos_pedidos?: boolean | null
          id?: string
          push_avaliacoes?: boolean | null
          push_mensagens?: boolean | null
          push_novos_pedidos?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_avaliacoes?: boolean | null
          email_mensagens?: boolean | null
          email_novos_pedidos?: boolean | null
          id?: string
          push_avaliacoes?: boolean | null
          push_mensagens?: boolean | null
          push_novos_pedidos?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_confirmou: boolean | null
          cliente_id: string
          created_at: string
          data_conclusao: string | null
          data_solicitacao: string
          descricao: string | null
          endereco_completo: string | null
          id: string
          observacoes: string | null
          preco_acordado: number | null
          prestador_confirmou: boolean | null
          prestador_id: string
          servico_id: string
          status: string
          status_pagamento: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          cliente_confirmou?: boolean | null
          cliente_id: string
          created_at?: string
          data_conclusao?: string | null
          data_solicitacao?: string
          descricao?: string | null
          endereco_completo?: string | null
          id?: string
          observacoes?: string | null
          preco_acordado?: number | null
          prestador_confirmou?: boolean | null
          prestador_id: string
          servico_id: string
          status?: string
          status_pagamento?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          cliente_confirmou?: boolean | null
          cliente_id?: string
          created_at?: string
          data_conclusao?: string | null
          data_solicitacao?: string
          descricao?: string | null
          endereco_completo?: string | null
          id?: string
          observacoes?: string | null
          preco_acordado?: number | null
          prestador_confirmou?: boolean | null
          prestador_id?: string
          servico_id?: string
          status?: string
          status_pagamento?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      plano_premium: {
        Row: {
          ativo: boolean | null
          desde: string | null
          expira_em: string | null
          id: string
          prestador_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          desde?: string | null
          expira_em?: string | null
          id?: string
          prestador_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          desde?: string | null
          expira_em?: string | null
          id?: string
          prestador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plano_premium_prestador_id_fkey"
            columns: ["prestador_id"]
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
      sos_usage: {
        Row: {
          id: string
          usage_count: number | null
          usage_month: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          usage_count?: number | null
          usage_month?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          usage_count?: number | null
          usage_month?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sos_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_accounts: {
        Row: {
          account_type: string
          charges_enabled: boolean
          created_at: string
          details_submitted: boolean
          id: string
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          escrow_payment_id: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          escrow_payment_id?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          escrow_payment_id?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_escrow_payment_id_fkey"
            columns: ["escrow_payment_id"]
            isOneToOne: false
            referencedRelation: "escrow_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_limits: {
        Row: {
          active_requests: number
          blocked_until: string | null
          created_at: string
          id: string
          last_request_at: string | null
          service_requests_day: number
          service_requests_hour: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active_requests?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          last_request_at?: string | null
          service_requests_day?: number
          service_requests_hour?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active_requests?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          last_request_at?: string | null
          service_requests_day?: number
          service_requests_hour?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bans: {
        Row: {
          banned_by: string | null
          created_at: string | null
          duration_days: number
          expires_at: string
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          banned_by?: string | null
          created_at?: string | null
          duration_days: number
          expires_at: string
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          banned_by?: string | null
          created_at?: string | null
          duration_days?: number
          expires_at?: string
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bans_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chat_reports: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          description: string | null
          id: string
          issue_type: string
          reported_user_id: string | null
          reporter_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          issue_type: string
          reported_user_id?: string | null
          reporter_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          issue_type?: string
          reported_user_id?: string | null
          reporter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_chat_reports_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chat_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chat_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          reported_user_id: string | null
          reporter_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          reported_user_id?: string | null
          reporter_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          reported_user_id?: string | null
          reporter_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          bio: string | null
          cpf: string | null
          criado_em: string | null
          descricao_servico: string | null
          em_servico: boolean | null
          email: string
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_numero: string | null
          endereco_rua: string | null
          foto_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          nota_media: number | null
          ocultar_nota: boolean | null
          premium: boolean | null
          stripe_account_id: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          bio?: string | null
          cpf?: string | null
          criado_em?: string | null
          descricao_servico?: string | null
          em_servico?: boolean | null
          email: string
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          nota_media?: number | null
          ocultar_nota?: boolean | null
          premium?: boolean | null
          stripe_account_id?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          bio?: string | null
          cpf?: string | null
          criado_em?: string | null
          descricao_servico?: string | null
          em_servico?: boolean | null
          email?: string
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_numero?: string | null
          endereco_rua?: string | null
          foto_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          nota_media?: number | null
          ocultar_nota?: boolean | null
          premium?: boolean | null
          stripe_account_id?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_premium: {
        Row: {
          ativo: boolean | null
          desde: string | null
          expira_em: string | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          desde?: string | null
          expira_em?: string | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          desde?: string | null
          expira_em?: string | null
          id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_premium_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_email: string
          p_attempt_type: string
          p_max_attempts?: number
          p_time_window?: unknown
        }
        Returns: boolean
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_email_allowed: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      log_auth_attempt: {
        Args: {
          p_email: string
          p_attempt_type: string
          p_success?: boolean
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
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
  public: {
    Enums: {},
  },
} as const

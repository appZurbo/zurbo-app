
import { getPrestadores, getPrestadoresPremiumDestaque } from '@/utils/database/prestadores';
import { UserProfile } from '@/types';

export interface PrestadorFilters {
  cidade?: string;
  servicos?: string[];
  notaMin?: number;
  precoMin?: number;
  precoMax?: number;
  apenasPremium?: boolean;
  page?: number;
  limit?: number;
}

export class PrestadorService {
  static async searchPrestadores(filters: PrestadorFilters = {}) {
    try {
      const result = await getPrestadores(filters);
      return {
        success: true,
        data: result.prestadores,
        hasMore: result.hasMore,
        total: result.total
      };
    } catch (error) {
      console.error('Error in prestador service:', error);
      return {
        success: false,
        error: 'Erro ao buscar prestadores',
        data: [],
        hasMore: false,
        total: 0
      };
    }
  }

  static async getPremiumHighlights(): Promise<UserProfile[]> {
    try {
      return await getPrestadoresPremiumDestaque();
    } catch (error) {
      console.error('Error getting premium highlights:', error);
      return [];
    }
  }

  static validatePrestador(prestador: any): prestador is UserProfile {
    return prestador && prestador.id && prestador.nome;
  }

  static filterValidPrestadores(prestadores: any[]): UserProfile[] {
    return prestadores.filter(this.validatePrestador);
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import { getPrestadores } from '@/utils/database/prestadores';
import { getServicos } from '@/utils/database/servicos';
import { UserProfile } from '@/types';
import { MOCK_PRESTADORES } from '@/utils/mockData';

interface SearchResult {
  prestador: UserProfile;
  servicos: string[];
  matchedService: string;
}

interface SearchDropdownProps {
  placeholder?: string;
  onSearchSubmit?: (query: string) => void;
  showFiltersButton?: boolean;
  onFiltersClick?: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  placeholder = "Buscar serviços...",
  onSearchSubmit,
  showFiltersButton = true,
  onFiltersClick
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState<Array<{ id: string; nome: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Carregar serviços disponíveis
  useEffect(() => {
    const loadServicos = async () => {
      try {
        const servicosData = await getServicos();

        // Se não encontrou serviços no banco, usar dados mock para teste
        if (!servicosData || servicosData.length === 0) {
          const mockServicos = [
            { id: 'limpeza', nome: 'Limpeza' },
            { id: 'eletricista', nome: 'Eletricista' },
            { id: 'encanador', nome: 'Encanador' },
            { id: 'pintor', nome: 'Pintor' },
            { id: 'mecanico', nome: 'Mecânico' },
            { id: 'jardinagem', nome: 'Jardinagem' },
            { id: 'construcao', nome: 'Construção' },
            { id: 'refrigeracao', nome: 'Refrigeração' }
          ];
          setServicos(mockServicos);
        } else {
          setServicos(servicosData);
        }
      } catch (error) {
        console.error('❌ SearchDropdown: Error loading services:', error);
        // Fallback para dados mock em caso de erro
        const mockServicos = [
          { id: 'limpeza', nome: 'Limpeza' },
          { id: 'eletricista', nome: 'Eletricista' },
          { id: 'encanador', nome: 'Encanador' },
          { id: 'pintor', nome: 'Pintor' },
          { id: 'mecanico', nome: 'Mecânico' },
          { id: 'jardinagem', nome: 'Jardinagem' },
          { id: 'construcao', nome: 'Construção' },
          { id: 'refrigeracao', nome: 'Refrigeração' }
        ];
        setServicos(mockServicos);
      }
    };
    loadServicos();
  }, []);

  // Buscar profissionais quando query muda
  useEffect(() => {
    const searchPrestadores = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        // Buscar serviço correspondente (mais flexível)
        const matchingService = servicos.find(s =>
          s.nome.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(s.nome.toLowerCase())
        );

        if (!matchingService) {
          setResults([]);
          setShowDropdown(false);
          return;
        }

        // Buscar prestadores que oferecem esse serviço
        const prestadoresResult = await getPrestadores({
          servicos: [matchingService.id],
          limit: 10
        });

        let prestadores = prestadoresResult.prestadores;

        // Se não encontrou no banco, usar mocks filtrados
        if (prestadores.length === 0) {
          prestadores = MOCK_PRESTADORES.filter(p =>
            p.servicos_oferecidos?.some(s => s.toLowerCase().includes(matchingService.nome.toLowerCase()))
          );
        }

        // Formatar resultados
        const searchResults: SearchResult[] = prestadores.map(prestador => ({
          prestador,
          servicos: prestador.servicos_oferecidos || [],
          matchedService: matchingService.nome
        }));

        setResults(searchResults);
        // Mostrar dropdown se há resultados OU se está carregando
        setShowDropdown(searchResults.length > 0 || loading);
      } catch (error) {
        console.error('Erro ao buscar prestadores:', error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPrestadores, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [query, servicos]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearchSubmit) {
      onSearchSubmit(query);
      setShowDropdown(false);
    } else if (query.trim()) {
      navigate(`/prestadores?search=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  const handlePrestadorClick = (prestador: UserProfile) => {
    navigate(`/prestador/${prestador.id}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleServiceClick = (serviceName: string) => {
    const service = servicos.find(s =>
      s.nome.toLowerCase().includes(serviceName.toLowerCase())
    );
    if (service) {
      navigate(`/prestadores?servicos=${service.id}`);
      setShowDropdown(false);
      setQuery('');
    }
  };

  const renderPrestadorItem = (result: SearchResult) => {
    const { prestador, matchedService } = result;

    return (
      <div
        key={prestador.id}
        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        onClick={() => handlePrestadorClick(prestador)}
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
          <AvatarFallback>
            {prestador.nome?.charAt(0)?.toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">{prestador.nome}</h4>
            {prestador.premium && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                Premium
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">
              {prestador.endereco_cidade || 'Localização não informada'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-gray-600">
              {prestador.nota_media ? `${prestador.nota_media.toFixed(1)}` : 'N/A'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-orange-600 font-medium">{matchedService}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#8C7E72] group-focus-within:text-[#E05815] transition-colors" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.length >= 2) {
              setShowDropdown(true);
            }
          }}
          className="w-full pl-11 pr-12 py-4 bg-white rounded-2xl shadow-sm text-[#3D342B] placeholder:text-[#8C7E72] focus:outline-none focus:ring-2 focus:ring-[#E05815]/20 border-[#E6DDD5]"
        />
        {showFiltersButton && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onFiltersClick}
              className="p-2 bg-[#FEE8D6] text-[#E05815] rounded-xl hover:bg-[#FEE8D6]/80"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        )}
      </form>

      {/* Dropdown de resultados */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-[100] max-h-96 overflow-hidden"
          style={{ zIndex: 100 }}
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
              Buscando profissionais...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {/* Header do dropdown */}
              <div className="p-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-600">
                  Profissionais que executam "{query}"
                </p>
              </div>

              {/* Lista de resultados */}
              {results.slice(0, 5).map(renderPrestadorItem)}

              {/* Ver todos os resultados */}
              {results.length > 5 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleServiceClick(query)}
                    className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    Ver todos os profissionais ({results.length})
                  </Button>
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Nenhum profissional encontrado para "{query}"</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/prestadores')}
                className="mt-2 text-orange-600 hover:text-orange-700"
              >
                Ver todos os prestadores
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
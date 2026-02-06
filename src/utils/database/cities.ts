
import { supabase } from '@/integrations/supabase/client';
import { CidadeBrasileira } from './types';

// Function to normalize city names for consistent matching
const normalizeCityName = (cityName: string): string => {
  if (!cityName) return '';

  // Convert common variations to standard format
  const normalizedName = cityName
    .trim()
    .replace(/\s*,\s*MT\s*$/i, ', Mato Grosso') // Convert "Sinop, MT" to "Sinop, Mato Grosso"
    .replace(/\s*,\s*Mato\s+Grosso\s*$/i, ', Mato Grosso') // Ensure consistent spacing
    .replace(/\s+/g, ' '); // Remove extra spaces

  return normalizedName;
};

export const getCidades = async (searchTerm?: string): Promise<CidadeBrasileira[]> => {
  try {
    let query = supabase
      .from('cidades_brasileiras')
      .select('*')
      .eq('estado', 'MT')
      .order('nome', { ascending: true });

    if (searchTerm && searchTerm.length > 0) {
      const normalizedSearch = normalizeCityName(searchTerm);
      const cityPart = normalizedSearch.split(',')[0].trim();
      query = query.ilike('nome', `%${cityPart}%`);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching cities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Database error fetching cities:', error);
    return [];
  }
};

export const getCidadeByNome = async (nome: string): Promise<CidadeBrasileira | null> => {
  try {
    const normalizedName = normalizeCityName(nome);
    const cityPart = normalizedName.split(',')[0].trim();

    const { data, error } = await supabase
      .from('cidades_brasileiras')
      .select('*')
      .eq('nome', cityPart)
      .eq('estado', 'MT')
      .maybeSingle();

    if (error) {
      console.error('Error fetching city by name:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching city:', error);
    return null;
  }
};

export const getCidadesPrestadores = async (): Promise<string[]> => {
  try {
    // Always return "Sinop, Mato Grosso" as the primary city
    return ['Sinop, Mato Grosso'];
  } catch (error) {
    console.error('Database error fetching cities from prestadores:', error);
    return ['Sinop, Mato Grosso'];
  }
};

// Function to update all existing city references to use consistent format
export const normalizeDatabaseCities = async (): Promise<void> => {
  try {


    // Update all users to use "Sinop, Mato Grosso" for consistency
    const { data: updateResult, error: updateError } = await supabase
      .from('users')
      .update({ endereco_cidade: 'Sinop, Mato Grosso' })
      .not('endereco_cidade', 'is', null)
      .select('id');

    if (updateError) {
      console.error('Error updating cities:', updateError);
      return;
    }


  } catch (error) {
    console.error('Error normalizing database cities:', error);
  }
};

// Auto-run normalization when this module is imported
normalizeDatabaseCities();

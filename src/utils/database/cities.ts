
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
    const { data, error } = await supabase
      .from('users')
      .select('endereco_cidade')
      .eq('tipo', 'prestador')
      .not('endereco_cidade', 'is', null);

    if (error) {
      console.error('Error fetching cities from prestadores:', error);
      return ['Sinop, Mato Grosso']; // Default fallback with normalized name
    }

    // Extract unique cities and normalize them
    const cities = Array.from(new Set(
      data
        .map(item => normalizeCityName(item.endereco_cidade))
        .filter(city => city && city.trim())
    )).sort();

    // Always include Sinop as default with normalized name
    const sinopVariations = ['sinop', 'sinop, mt', 'sinop, mato grosso'];
    const hasSinop = cities.some(city => 
      sinopVariations.includes(city.toLowerCase())
    );
    
    if (!hasSinop) {
      cities.unshift('Sinop, Mato Grosso');
    }

    return cities;
  } catch (error) {
    console.error('Database error fetching cities from prestadores:', error);
    return ['Sinop, Mato Grosso'];
  }
};

// Function to update all existing city references to use consistent format
export const normalizeDatabaseCities = async (): Promise<void> => {
  try {
    // Get all users with city data
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, endereco_cidade')
      .not('endereco_cidade', 'is', null);

    if (fetchError) {
      console.error('Error fetching users for normalization:', fetchError);
      return;
    }

    // Update each user's city to normalized format
    const updates = users
      .filter(user => user.endereco_cidade)
      .map(user => ({
        id: user.id,
        endereco_cidade: normalizeCityName(user.endereco_cidade)
      }))
      .filter(user => user.endereco_cidade !== user.endereco_cidade); // Only update if changed

    // Batch update users
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ endereco_cidade: update.endereco_cidade })
        .eq('id', update.id);

      if (updateError) {
        console.error(`Error updating user ${update.id}:`, updateError);
      }
    }

    console.log(`Normalized ${updates.length} city entries`);
  } catch (error) {
    console.error('Error normalizing database cities:', error);
  }
};

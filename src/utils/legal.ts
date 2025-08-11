
import { supabase } from "@/integrations/supabase/client";

export type DocType = "cliente_termos" | "prestador_contrato";

export interface LegalDocument {
  id: string;
  doc_type: DocType;
  version: string;
  content: string;
  summary: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PendingAcceptance {
  doc_id: string;
  doc_type: DocType;
  version: string;
  created_at: string;
}

const PENDING_KEY = "pending_legal_acceptance";

export const mapUserTipoToDocType = (tipo: string): DocType => {
  if (tipo === "cliente") return "cliente_termos";
  return "prestador_contrato";
};

export async function fetchActiveLegalDocument(docType: DocType): Promise<LegalDocument | null> {
  const { data, error } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("doc_type", docType)
    .eq("active", true)
    .single();

  if (error) {
    console.error("Error fetching legal document:", error);
    return null;
  }
  return data as LegalDocument;
}

export async function computeSHA256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function savePendingAcceptance(doc: LegalDocument) {
  const pending: PendingAcceptance = {
    doc_id: doc.id,
    doc_type: doc.doc_type as DocType,
    version: doc.version,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function getPendingAcceptance(): PendingAcceptance | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingAcceptance;
  } catch (e) {
    console.warn("Invalid pending acceptance in storage");
    return null;
  }
}

export function clearPendingAcceptance() {
  localStorage.removeItem(PENDING_KEY);
}

async function fetchPublicIP(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    if (!res.ok) return null;
    const data = await res.json();
    return data?.ip || null;
  } catch {
    return null;
  }
}

/**
 * Registra aceite no banco para o usuário logado.
 * Requer:
 *  - Sessão válida
 *  - user_id (da tabela users) do usuário atual
 */
export async function recordLegalAcceptance(params: {
  userId: string; // users.id
  doc: LegalDocument;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<{ ok: boolean; error?: any }> {
  const acceptedAt = new Date().toISOString();
  const baseString = `${params.userId}|${params.doc.id}|${params.doc.version}|${acceptedAt}|${params.userAgent || ""}|${params.ipAddress || ""}`;
  const hash = await computeSHA256Hex(baseString);

  const { error } = await supabase.from("legal_acceptances").insert({
    user_id: params.userId,
    doc_id: params.doc.id,
    doc_type: params.doc.doc_type,
    version: params.doc.version,
    hash,
    accepted_at: acceptedAt,
    ip_address: params.ipAddress || null,
    user_agent: params.userAgent || null,
  });

  if (error) {
    console.error("Error recording legal acceptance:", error);
    return { ok: false, error };
  }
  return { ok: true };
}

/**
 * Consome aceite pendente (armazenado localmente) se existir, para o usuário logado.
 * Útil após login/validação de email.
 */
export async function consumePendingAcceptanceIfAny(userId: string): Promise<{ consumed: boolean; error?: any }> {
  const pending = getPendingAcceptance();
  if (!pending) return { consumed: false };

  // Buscar o documento ativo correspondente para garantir consistência
  const doc = await fetchActiveLegalDocument(pending.doc_type);
  if (!doc || doc.id !== pending.doc_id || doc.version !== pending.version) {
    // Documento mudou; descartar pendente
    clearPendingAcceptance();
    return { consumed: false };
  }

  const ip = await fetchPublicIP();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;

  const res = await recordLegalAcceptance({
    userId,
    doc,
    ipAddress: ip,
    userAgent: ua,
  });

  if (res.ok) {
    clearPendingAcceptance();
    return { consumed: true };
  }

  return { consumed: false, error: res.error };
}

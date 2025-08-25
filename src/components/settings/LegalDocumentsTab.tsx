
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { fetchActiveLegalDocument, mapUserTipoToDocType, consumePendingAcceptanceIfAny, type LegalDocument } from "@/utils/legal";
import jsPDF from "jspdf";

type AcceptanceRow = {
  id: string;
  user_id: string;
  doc_id: string;
  doc_type: string;
  version: string;
  hash: string;
  accepted_at: string;
};

export function LegalDocumentsTab() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [acceptance, setAcceptance] = useState<AcceptanceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const titulo = useMemo(() => {
    if (profile?.tipo === "cliente") return "Termos de Uso – Cliente";
    return "Contrato de Prestador";
  }, [profile?.tipo]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!profile?.id || !profile?.tipo) {
        setLoading(false);
        return;
      }

      // Consumir aceite pendente (caso cadastro email tenha sido confirmado agora)
      await consumePendingAcceptanceIfAny(profile.id);

      const docType = mapUserTipoToDocType(profile.tipo);
      const currentDoc = await fetchActiveLegalDocument(docType);

      if (!mounted) return;
      setDoc(currentDoc);

      if (currentDoc) {
        const { data: acc, error } = await supabase
          .from("legal_acceptances")
          .select("*")
          .eq("user_id", profile.id)
          .eq("doc_type", currentDoc.doc_type)
          .eq("version", currentDoc.version)
          .maybeSingle();

        if (error) {
          console.error("Error fetching acceptance:", error);
        }
        if (mounted) setAcceptance(acc || null);
      }

      setLoading(false);
    };

    init();
    return () => {
      mounted = false;
    };
  }, [profile?.id, profile?.tipo]);

  const handleGeneratePDF = async () => {
    if (!doc || !profile) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const width = pdf.internal.pageSize.getWidth() - margin * 2;

      pdf.setFontSize(16);
      pdf.text("ZURBO - Meu Contrato", margin, 60);

      pdf.setFontSize(10);
      pdf.text(`Nome: ${profile.nome || ""}`, margin, 80);
      pdf.text(`Email: ${profile.email || ""}`, margin, 95);
      pdf.text(`Versão: ${doc.version}`, margin, 110);
      pdf.text(`Tipo: ${doc.doc_type}`, margin, 125);
      if (acceptance?.accepted_at) {
        pdf.text(`Aceito em: ${new Date(acceptance.accepted_at).toLocaleString()}`, margin, 140);
      }
      if (acceptance?.hash) {
        pdf.text(`Hash de Aceite: ${acceptance.hash}`, margin, 155);
      }

      pdf.setFontSize(12);
      pdf.text(titulo, margin, 185);

      pdf.setFontSize(10);
      const content = doc.content || "";
      const lines = pdf.splitTextToSize(content, width);
      let y = 205;
      lines.forEach((line: string) => {
        if (y > pdf.internal.pageSize.getHeight() - 60) {
          pdf.addPage();
          y = 60;
        }
        pdf.text(line, margin, y);
        y += 14;
      });

      pdf.save("meu-contrato-zurbo.pdf");
      toast({ title: "PDF gerado", description: "Seu contrato foi baixado com sucesso." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Erro ao gerar PDF", description: e?.message || "Tente novamente", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!doc) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Documento não disponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {acceptance ? (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
            Aceito em {new Date(acceptance.accepted_at).toLocaleString()} (versão {acceptance.version})
          </div>
        ) : (
          <div className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3">
            Você ainda não registrou o aceite desta versão. Caso tenha se cadastrado por email,
            o aceite será registrado automaticamente no seu próximo login. Se preferir, reabra a tela de cadastro para aceitar.
          </div>
        )}

        <div className="text-xs text-muted-foreground whitespace-pre-line">
          {doc.summary}
        </div>

        <div className="border rounded">
          <ScrollArea className="h-80 p-4">
            <pre className="whitespace-pre-wrap text-sm">{doc.content}</pre>
          </ScrollArea>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleGeneratePDF} disabled={generating}>
            {generating ? "Gerando..." : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Database, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ExportControlsProps {
  data: any[];
  filename: string;
}

export const ExportControls = ({ data, filename }: ExportControlsProps) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const { toast } = useToast();

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || '';
        }).join(',')
      )
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    toast({ title: "Exportação concluída", description: "Arquivo CSV baixado com sucesso" });
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
    toast({ title: "Exportação concluída", description: "Arquivo JSON baixado com sucesso" });
  };

  const exportExcel = () => {
    // Para Excel, vamos usar CSV com separador de tabulação
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const tsvContent = [
      headers.join('\t'),
      ...data.map(row => 
        headers.map(header => row[header] || '').join('\t')
      )
    ].join('\n');
    
    downloadFile(tsvContent, `${filename}.xls`, 'application/vnd.ms-excel');
    toast({ title: "Exportação concluída", description: "Arquivo Excel baixado com sucesso" });
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'csv':
        exportCSV();
        break;
      case 'json':
        exportJSON();
        break;
      case 'excel':
        exportExcel();
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Dados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  JSON
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleExport}
            disabled={!data.length}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar ({data.length} registros)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

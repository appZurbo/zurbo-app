
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class FileValidator {
  private static readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly SUSPICIOUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar'
  ];

  static validateImage(file: File): FileValidationResult {
    const result: FileValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Verificar tipo MIME
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      result.errors.push(`Tipo de arquivo não permitido: ${file.type}`);
      result.isValid = false;
    }

    // Verificar extensão do arquivo
    const extension = file.name.toLowerCase().split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      result.errors.push(`Extensão de arquivo não permitida: .${extension}`);
      result.isValid = false;
    }

    // Verificar tamanho
    if (file.size > this.MAX_FILE_SIZE) {
      result.errors.push(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 10MB`);
      result.isValid = false;
    }

    // Verificar extensões suspeitas
    const fileName = file.name.toLowerCase();
    for (const suspiciousExt of this.SUSPICIOUS_EXTENSIONS) {
      if (fileName.includes(suspiciousExt)) {
        result.errors.push('Arquivo com extensão potencialmente perigosa detectado');
        result.isValid = false;
        break;
      }
    }

    // Verificar nome do arquivo
    if (file.name.length > 255) {
      result.errors.push('Nome do arquivo muito longo');
      result.isValid = false;
    }

    // Verificar caracteres suspeitos no nome
    const suspiciousChars = /[<>:"|?*\x00-\x1f]/;
    if (suspiciousChars.test(file.name)) {
      result.errors.push('Nome do arquivo contém caracteres inválidos');
      result.isValid = false;
    }

    return result;
  }

  static async validateFileContent(file: File): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Ler os primeiros bytes para verificar assinatura do arquivo
      const buffer = await file.slice(0, 16).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      
      // Verificar assinaturas de arquivos de imagem
      const signatures = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        gif: [0x47, 0x49, 0x46],
        webp: [0x52, 0x49, 0x46, 0x46]
      };

      let validSignature = false;
      
      for (const [format, signature] of Object.entries(signatures)) {
        if (signature.every((byte, index) => bytes[index] === byte)) {
          validSignature = true;
          break;
        }
      }

      if (!validSignature && file.type.startsWith('image/')) {
        result.warnings.push('Assinatura do arquivo não confere com o tipo declarado');
      }

    } catch (error) {
      result.warnings.push('Não foi possível validar o conteúdo do arquivo');
    }

    return result;
  }
}

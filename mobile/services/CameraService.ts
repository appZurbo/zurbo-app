import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface CameraPhoto {
  uri: string;
  width: number;
  height: number;
  type?: string;
  base64?: string;
}

export class Camera {
  /**
   * Solicita permissões da câmera e galeria
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      // Solicitar permissão da câmera
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraStatus.status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'A permissão da câmera é necessária para tirar fotos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Solicitar permissão da galeria (para acessar fotos existentes)
      const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (mediaLibraryStatus.status !== 'granted') {
        console.warn('Permissão da galeria negada');
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões da câmera:', error);
      return false;
    }
  }

  /**
   * Abre a câmera para tirar uma foto
   */
  static async takePicture(options?: {
    allowsEditing?: boolean;
    quality?: number;
    base64?: boolean;
  }): Promise<CameraPhoto | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        aspect: [4, 3],
        quality: options?.quality ?? 0.5, // Reduzido para evitar crash de memória
        base64: options?.base64 ?? false,
      });

      if (result.canceled) {
        return null;
      }

      const photo = result.assets[0];
      
      // Se a imagem for muito grande, o WebView pode crashar ao receber
      // Vamos garantir que não seja gigante, mas mantendo boa qualidade
      // Nota: O ImagePicker já comprime com 'quality', mas o tamanho em pixels também importa
      
      return {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        type: photo.type,
        base64: photo.base64,
      };
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
      return null;
    }
  }

  /**
   * Abre a galeria para selecionar uma foto
   */
  static async pickImage(options?: {
    allowsEditing?: boolean;
    quality?: number;
    base64?: boolean;
    allowsMultipleSelection?: boolean;
  }): Promise<CameraPhoto[] | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        aspect: [4, 3],
        quality: options?.quality ?? 0.8,
        base64: options?.base64 ?? false,
        allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
      });

      if (result.canceled) {
        return null;
      }

      return result.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type,
        base64: asset.base64,
      }));
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      return null;
    }
  }

  /**
   * Abre opções para escolher entre câmera ou galeria
   */
  static async showImagePicker(options?: {
    allowsEditing?: boolean;
    quality?: number;
    base64?: boolean;
  }): Promise<CameraPhoto | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Selecionar Imagem',
        'Escolha uma opção',
        [
          {
            text: 'Câmera',
            onPress: async () => {
              const photo = await this.takePicture(options);
              resolve(photo);
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              const photos = await this.pickImage({
                ...options,
                allowsMultipleSelection: false,
              });
              resolve(photos && photos.length > 0 ? photos[0] : null);
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true }
      );
    });
  }
}


interface UserData {
  uuid: string;
  name: string;
  project_id: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class UserService {
  private baseUrl = 'http://116.203.250.18:8050/api';

  async createUser(userData: UserData): Promise<ApiResponse> {
    try {
      console.log('API çağrısı yapılıyor:', `${this.baseUrl}/users`);
      console.log('Gönderilen data:', JSON.stringify(userData));
      
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Response text'ini önce al
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Eğer response başarılıysa (status 200-299), JSON parse hatası olsa bile başarılı say
      if (response.ok) {
        // JSON parse etmeyi dene
        let data;
        try {
          data = JSON.parse(responseText);
          return {
            success: true,
            data: data,
          };
        } catch (parseError) {
          console.warn('JSON parse hatası ama response başarılı:', parseError);
          // JSON parse edilemese bile başarılı response döndür
          return {
            success: true,
            data: { message: 'Kullanıcı başarıyla oluşturuldu', rawResponse: responseText },
          };
        }
      } else {
        // Hata durumunda JSON parse etmeyi dene
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          return {
            success: false,
            message: errorData.message || 'Kullanıcı oluşturulamadı',
          };
        } catch (parseError) {
          return {
            success: false,
            message: `Server hatası: ${responseText.substring(0, 100)}...`,
          };
        }
      }
    } catch (error) {
      console.error('API çağrısı hatası:', error);
      return {
        success: false,
        message: 'Ağ bağlantısı hatası',
      };
    }
  }
}

export const userService = new UserService();
export type { UserData, ApiResponse };

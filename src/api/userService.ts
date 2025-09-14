interface UserData {
  uuid: string;
  name: string;
  project_id: number;
}

interface CreditData {
  uuid: string;
  coin: number;
}

interface UserApiResponse {
  success: boolean;
  data?: {
    uuid: string;
    name: string;
    coin: number;
    project_id: number;
    project_name: string;
    created_at: string;
  };
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface ChatRequest {
  message: string;
  uuid: string;
  project_id: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    conversation_id: string;
    tokens_used: number;
    response_time: number;
    remaining_coins: number;
    model: string;
  };
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

  async addUserCredit(creditData: CreditData): Promise<ApiResponse> {
    try {
      console.log('Kredi ekleme API çağrısı yapılıyor:', `${this.baseUrl}/users/credit`);
      console.log('Gönderilen kredi data:', JSON.stringify(creditData));
      
      const response = await fetch(`${this.baseUrl}/users/credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creditData),
      });

      console.log('Kredi API Response status:', response.status);

      // Response text'ini önce al
      const responseText = await response.text();
      console.log('Kredi API Response text:', responseText);

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
          console.warn('Kredi API JSON parse hatası ama response başarılı:', parseError);
          // JSON parse edilemese bile başarılı response döndür
          return {
            success: true,
            data: { message: 'Kredi başarıyla eklendi', rawResponse: responseText },
          };
        }
      } else {
        // Hata durumunda JSON parse etmeyi dene
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          return {
            success: false,
            message: errorData.message || 'Kredi eklenemedi',
          };
        } catch (parseError) {
          return {
            success: false,
            message: `Kredi API hatası: ${responseText.substring(0, 100)}...`,
          };
        }
      }
    } catch (error) {
      console.error('Kredi API çağrısı hatası:', error);
      return {
        success: false,
        message: 'Kredi API ağ bağlantısı hatası',
      };
    }
  }

  async getUserInfo(uuid: string): Promise<UserApiResponse> {
    try {
      console.log('Kullanıcı bilgileri çekiliyor:', `${this.baseUrl}/users/${uuid}`);
      
      const response = await fetch(`${this.baseUrl}/users/${uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Kullanıcı API Response status:', response.status);

      // Response text'ini önce al
      const responseText = await response.text();
      console.log('Kullanıcı API Response text:', responseText);

      // Eğer response başarılıysa JSON parse et
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.success && data.data) {
            return {
              success: true,
              data: data.data,
            };
          } else {
            return {
              success: false,
              message: data.message || 'Kullanıcı bilgileri alınamadı',
            };
          }
        } catch (parseError) {
          console.error('Kullanıcı API JSON parse hatası:', parseError);
          return {
            success: false,
            message: 'Server response formatı hatalı',
          };
        }
      } else {
        // Hata durumunda JSON parse etmeyi dene
        try {
          const errorData = JSON.parse(responseText);
          return {
            success: false,
            message: errorData.message || 'Kullanıcı bulunamadı',
          };
        } catch (parseError) {
          return {
            success: false,
            message: `API hatası: ${response.status}`,
          };
        }
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri API hatası:', error);
      return {
        success: false,
        message: 'Ağ bağlantısı hatası',
      };
    }
  }

  async sendChatMessage(chatData: ChatRequest): Promise<ChatResponse | ApiResponse> {
    try {
      console.log('Chat API çağrısı yapılıyor:', `${this.baseUrl}/chat`);
      console.log('Gönderilen chat data:', JSON.stringify(chatData));
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      console.log('Chat API Response status:', response.status);

      // Response text'ini önce al
      const responseText = await response.text();
      console.log('Chat API Response text:', responseText);

      // Eğer response başarılıysa JSON parse et
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            return {
              success: true,
              message: data.message,
              data: data.data,
            };
          } else {
            return {
              success: false,
              message: data.message || 'Chat mesajı gönderilemedi',
            };
          }
        } catch (parseError) {
          console.error('Chat API JSON parse hatası:', parseError);
          return {
            success: false,
            message: 'Chat response formatı hatalı',
          };
        }
      } else {
        // Hata durumunda JSON parse etmeyi dene
        try {
          const errorData = JSON.parse(responseText);
          return {
            success: false,
            message: errorData.message || 'Chat mesajı gönderilemedi',
          };
        } catch (parseError) {
          return {
            success: false,
            message: `Chat API hatası: ${response.status}`,
          };
        }
      }
    } catch (error) {
      console.error('Chat API çağrısı hatası:', error);
      return {
        success: false,
        message: 'Chat API ağ bağlantısı hatası',
      };
    }
  }
}

export const userService = new UserService();
export type { UserData, CreditData, ApiResponse, UserApiResponse, ChatRequest, ChatResponse };

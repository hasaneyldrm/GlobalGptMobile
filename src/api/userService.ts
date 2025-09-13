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
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Kullanıcı oluşturulamadı',
        };
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

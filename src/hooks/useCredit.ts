import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUserCredit as setReduxCredit, addUserCredit as addReduxCredit, subtractUserCredit as subtractReduxCredit } from '../store/creditSlice';
import { storage } from '../services/storage';
import { userService } from '../api/userService';

/**
 * Kredi işlemlerini hem Redux hem de AsyncStorage ile senkronize eden hook
 */
export const useCredit = () => {
  const dispatch = useDispatch();
  const credit = useSelector((state: RootState) => state.credit.userCredit);

  // Kredi set etme (hem Redux hem AsyncStorage)
  const setCredit = async (newCredit: number) => {
    try {
      await storage.setUserCredit(newCredit);
      dispatch(setReduxCredit(newCredit));
      console.log('Kredi güncellendi:', newCredit);
    } catch (error) {
      console.error('Kredi güncellenirken hata:', error);
    }
  };

  // Kredi ekleme (Redux, AsyncStorage ve API)
  const addCredit = async (creditToAdd: number, callApi: boolean = true) => {
    try {
      // Önce AsyncStorage'a ekle
      const newTotal = await storage.addUserCredit(creditToAdd);
      dispatch(setReduxCredit(newTotal)); // Güncel toplam ile set et
      
      // API çağrısı yap (eğer istenirse)
      if (callApi) {
        const userUUID = await storage.getUserUUID();
        if (userUUID) {
          const apiResponse = await userService.addUserCredit({
            uuid: userUUID,
            coin: creditToAdd
          });
          
          if (apiResponse.success) {
            console.log(`Kredi API'ye başarıyla gönderildi: ${creditToAdd}`);
          } else {
            console.error('Kredi API hatası:', apiResponse.message);
          }
        } else {
          console.warn('UUID bulunamadı, kredi API çağrısı yapılamadı');
        }
      }
      
      console.log(`Kredi eklendi: ${creditToAdd}, Yeni toplam: ${newTotal}`);
      return newTotal;
    } catch (error) {
      console.error('Kredi eklenirken hata:', error);
      return credit; // Hata durumunda mevcut krediyi döndür
    }
  };

  // Kredi çıkarma (hem Redux hem AsyncStorage)
  const subtractCredit = async (creditToSubtract: number) => {
    try {
      const newTotal = await storage.subtractUserCredit(creditToSubtract);
      dispatch(setReduxCredit(newTotal)); // Güncel toplam ile set et
      console.log(`Kredi çıkarıldı: ${creditToSubtract}, Kalan: ${newTotal}`);
      return newTotal;
    } catch (error) {
      console.error('Kredi çıkarılırken hata:', error);
      return credit; // Hata durumunda mevcut krediyi döndür
    }
  };

  // AsyncStorage'dan kredi yükleme
  const loadCredit = async () => {
    try {
      const storedCredit = await storage.getUserCredit();
      dispatch(setReduxCredit(storedCredit));
      console.log('AsyncStorage\'dan kredi yüklendi:', storedCredit);
      return storedCredit;
    } catch (error) {
      console.error('Kredi yüklenirken hata:', error);
      return 0;
    }
  };

  // API'den kullanıcı bilgilerini çek ve async storage'ı güncelle
  const syncUserData = async () => {
    try {
      const userUUID = await storage.getUserUUID();
      if (!userUUID) {
        console.warn('UUID bulunamadı, senkronizasyon yapılamadı');
        return false;
      }

      console.log('Kullanıcı bilgileri API\'den çekiliyor...');
      const response = await userService.getUserInfo(userUUID);
      
      if (response.success && response.data) {
        const { name, coin } = response.data;
        
        // AsyncStorage'ı güncelle
        await storage.setUserName(name);
        await storage.setUserCredit(coin);
        
        // Redux'ı güncelle
        dispatch(setReduxCredit(coin));
        
        console.log(`Kullanıcı bilgileri senkronize edildi - İsim: ${name}, Coin: ${coin}`);
        return true;
      } else {
        console.error('Kullanıcı bilgileri çekilemedi:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri senkronizasyonu hatası:', error);
      return false;
    }
  };

  return {
    credit,
    setCredit,
    addCredit,
    subtractCredit,
    loadCredit,
    syncUserData,
  };
};

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUserCredit as setReduxCredit, addUserCredit as addReduxCredit, subtractUserCredit as subtractReduxCredit } from '../store/creditSlice';
import { storage } from '../services/storage';

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

  // Kredi ekleme (hem Redux hem AsyncStorage)
  const addCredit = async (creditToAdd: number) => {
    try {
      const newTotal = await storage.addUserCredit(creditToAdd);
      dispatch(setReduxCredit(newTotal)); // Güncel toplam ile set et
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

  return {
    credit,
    setCredit,
    addCredit,
    subtractCredit,
    loadCredit,
  };
};

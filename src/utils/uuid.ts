/**
 * UUID v4 oluşturucu
 * React Native için crypto modülü kullanmadan UUID oluşturur
 */
export const generateUUID = (): string => {
  // Rastgele karakterler için fonksiyon
  const getRandomChar = () => {
    const chars = '0123456789abcdef';
    return chars.charAt(Math.floor(Math.random() * 16));
  };

  // UUID v4 formatı: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  let uuid = '';
  
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; // UUID v4 için sabit
    } else if (i === 19) {
      // y pozisyonu için 8, 9, a, b karakterlerinden biri
      const yChars = '89ab';
      uuid += yChars.charAt(Math.floor(Math.random() * 4));
    } else {
      uuid += getRandomChar();
    }
  }
  
  return uuid;
};

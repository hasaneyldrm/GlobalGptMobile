// Avatar ID'lerini image source'larına çeviren utility fonksiyonu

export const getAvatarSource = (avatarId: string | number) => {
  const id = String(avatarId);
  
  switch (id) {
    case '5':
    case 'teknasyon':
      return require('@/assets/teknasyon.png');
    case '8':
    case 'jonsnow':
      return require('@/assets/jonsnow.png');
    case '10':
    case 'cersei':
      return require('@/assets/cersei.png');
    case '9':
    case 'nightking':
      return require('@/assets/nightking.png');
    case '11':
    case 'semih':
      return require('@/assets/semih.jpg');
    case '12':
    case 'doruk':
      return require('@/assets/doruk.jpg');
    default:
      return null;
  }
};

// Avatar ID'sini karakter ismine çeviren fonksiyon
export const getCharacterName = (avatarId: string | number) => {
  const id = String(avatarId);
  
  switch (id) {
    case '5':
    case 'teknasyon':
      return 'Teknasyon';
    case '8':
    case 'jonsnow':
      return 'Jon Snow';
    case '10':
    case 'cersei':
      return 'Cersei Lannister';
    case '9':
    case 'nightking':
      return 'Night King';
    case '11':
    case 'semih':
      return 'Semih Kışlar';
    case '12':
    case 'doruk':
      return 'Doruk';
    default:
      return 'Bilinmeyen';
  }
};

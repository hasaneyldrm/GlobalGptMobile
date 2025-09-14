// Avatar ID'lerini image source'larına çeviren utility fonksiyonu

export const getAvatarSource = (avatarId: string | number) => {
  const id = String(avatarId);
  
  switch (id) {
    case '5':
    case 'teknasyon':
      return require('@/assets/teknasyon.png');
    case '6':
    case 'jonsnow':
      return require('@/assets/jonsnow.png');
    case '7':
    case 'cersei':
      return require('@/assets/cersei.png');
    case '8':
    case 'nightking':
      return require('@/assets/nightking.png');
    case '9':
    case 'semih':
      return require('@/assets/semih.jpg');
    case '10':
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
    case '6':
    case 'jonsnow':
      return 'Jon Snow';
    case '7':
    case 'cersei':
      return 'Cersei Lannister';
    case '8':
    case 'nightking':
      return 'Night King';
    case '9':
    case 'semih':
      return 'Semih Kışlar';
    case '10':
    case 'doruk':
      return 'Doruk';
    default:
      return 'Bilinmeyen';
  }
};

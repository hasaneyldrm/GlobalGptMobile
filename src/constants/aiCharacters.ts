export interface AICharacter {
  id: string;
  name: string;
  description: string;
  image: any; // React Native Image source
}

export const AI_CHARACTERS: AICharacter[] = [
  {
    id: '5',
    name: 'Teknasyon',
    description: 'Teknoloji uzmanı ile konuş',
    image: require('@/assets/teknasyon.png'),
  },
  {
    id: '8',
    name: 'Jon Snow',
    description: 'Kuzey\'in Kralı ile konuş',
    image: require('@/assets/jonsnow.png'),
  },
  {
    id: '10',
    name: 'Cersei Lannister',
    description: 'Kraliçe ile sohbet et',
    image: require('@/assets/cersei.png'),
  },
  {
    id: '9',
    name: 'Night King',
    description: 'Gece Kralı\'nın gücü',
    image: require('@/assets/nightking.png'),
  },
  {
    id: '11',
    name: 'Semih Kışlar',
    description: 'Hackathon düşmanı danışman ile konuş',
    image: require('@/assets/semih.jpg'),
  },
  {
    id: '12',
    name: 'Doruk',
    description: 'Kuşadalı DJ, Sallantılı Developer ile konuş',
    image: require('@/assets/doruk.jpg'),
  },
];

// Kolay erişim için ID'leri de export edelim
export const AI_CHARACTER_IDS = {
  TEKNASYON: '5',
  JON_SNOW: '8',
  CERSEI: '10',
  NIGHT_KING: '9',
  SEMIH: '11',
  DORUK: '12',
} as const;

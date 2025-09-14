import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  image?: string | any; // Resim mesajları için (string identifier veya require objesi)
  isImageOnly?: boolean; // Sadece resim mesajı mı
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatHistory {
  contactId: string;
  messages: Message[];
}

interface ChatState {
  contacts: ChatContact[];
  chatHistories: ChatHistory[];
  activeContactId?: string;
}

const initialState: ChatState = {
  contacts: [],
  chatHistories: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveContact: (state, action: PayloadAction<string>) => {
      state.activeContactId = action.payload;
      // Seçilen kişinin okunmamış mesaj sayısını sıfırla
      const contact = state.contacts.find(c => c.id === action.payload);
      if (contact) {
        contact.unreadCount = 0;
      }
    },
    addMessage: (state, action: PayloadAction<{ contactId: string; message: Message }>) => {
      const { contactId, message } = action.payload;
      
      // Chat history'yi bul veya oluştur
      let chatHistory = state.chatHistories.find(ch => ch.contactId === contactId);
      if (!chatHistory) {
        chatHistory = {
          contactId,
          messages: [],
        };
        state.chatHistories.push(chatHistory);
      }
      
      // Mesajı ekle
      chatHistory.messages.push(message);
      
      // Contact'ın son mesajını güncelle
      const contact = state.contacts.find(c => c.id === contactId);
      if (contact) {
        // Eğer resim mesajıysa "📸 Resim" göster, değilse text'i göster
        contact.lastMessage = message.isImageOnly ? '📸 Resim' : message.text;
        contact.lastMessageTime = message.timestamp;
        
        // Eğer aktif contact değilse, okunmamış mesaj sayısını artır
        if (state.activeContactId !== contactId && !message.isUser) {
          contact.unreadCount = (contact.unreadCount || 0) + 1;
        }
      }
    },
    addContact: (state, action: PayloadAction<ChatContact>) => {
      const existingContact = state.contacts.find(c => c.id === action.payload.id);
      if (!existingContact) {
        state.contacts.push(action.payload);
      }
    },
    updateContact: (state, action: PayloadAction<{ id: string; updates: Partial<ChatContact> }>) => {
      const { id, updates } = action.payload;
      const contactIndex = state.contacts.findIndex(c => c.id === id);
      if (contactIndex !== -1) {
        state.contacts[contactIndex] = { ...state.contacts[contactIndex], ...updates };
      }
    },
    clearChatHistory: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const chatHistoryIndex = state.chatHistories.findIndex(ch => ch.contactId === contactId);
      if (chatHistoryIndex !== -1) {
        state.chatHistories[chatHistoryIndex].messages = [];
      }
      
      // Contact'ın son mesajını temizle
      const contact = state.contacts.find(c => c.id === contactId);
      if (contact) {
        contact.lastMessage = undefined;
        contact.lastMessageTime = undefined;
        contact.unreadCount = 0;
      }
    },
    loadChatHistory: (state, action: PayloadAction<{ contacts: ChatContact[]; chatHistories: ChatHistory[] }>) => {
      state.contacts = action.payload.contacts;
      state.chatHistories = action.payload.chatHistories;
    },
  },
});

export const {
  setActiveContact,
  addMessage,
  addContact,
  updateContact,
  clearChatHistory,
  loadChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;


import { JournalEntry, User, EntryUpdate, ChatRoom, UserRole } from '../types';

const USERS_KEY = 'archedata_users';
const ENTRIES_KEY = 'archedata_entries';
const CURRENT_USER_KEY = 'archedata_current_user';
const CHATS_KEY = 'archedata_chats';

const INITIAL_CHATS: ChatRoom[] = [
  { 
    id: '1', 
    name: 'Археологи Казахстана', 
    description: 'Обсуждение раскопок и находок на территории РК.', 
    members: 1240,
    tags: { country: 'Казахстан', language: 'Русский/Казахский', specialization: 'Общая' }
  },
  { 
    id: '2', 
    name: 'Реставрация и Консервация', 
    description: 'Методики сохранения артефактов.', 
    members: 850,
    tags: { country: 'Мир', language: 'Русский', specialization: 'Реставрация' }
  },
];

// Admin Credentials
const ADMIN_USER: User = {
  id: 'admin-001',
  name: 'Miras Ermek',
  nickname: 'merasiik',
  email: 'byermekmiras@gmail.com',
  password: 'ErmeMiras_Ib!',
  role: 'Admin',
  dob: '2000-01-01',
  savedChatIds: []
};

export const storageService = {
  // --- Auth ---
  register: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    storageService.setCurrentUser(user);
  },

  login: (emailOrNick: string, password?: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => 
      (u.email === emailOrNick || u.nickname === emailOrNick) && 
      (!password || u.password === password) // In real app, hash check
    );
    if (user) {
      storageService.setCurrentUser(user);
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  updateUser: (updatedUser: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    let users: User[] = stored ? JSON.parse(stored) : [];
    
    // Seed Admin if not exists
    if (!users.find(u => u.nickname === 'merasiik')) {
      users.push(ADMIN_USER);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    return users;
  },

  toggleSavedChat: (userId: string, chatId: string) => {
    const user = storageService.getCurrentUser();
    if (!user || user.id !== userId) return;

    const isSaved = user.savedChatIds.includes(chatId);
    let newSavedIds = [];
    if (isSaved) {
      newSavedIds = user.savedChatIds.filter(id => id !== chatId);
    } else {
      newSavedIds = [...user.savedChatIds, chatId];
    }

    const updatedUser = { ...user, savedChatIds: newSavedIds };
    storageService.updateUser(updatedUser);
  },

  // --- Entries ---
  getEntries: (): JournalEntry[] => {
    const stored = localStorage.getItem(ENTRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveEntry: (entry: JournalEntry) => {
    const entries = storageService.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.unshift(entry);
    }
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  },

  deleteEntry: (entryId: string) => {
    let entries = storageService.getEntries();
    entries = entries.filter(e => e.id !== entryId);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  },

  addEntryUpdate: (entryId: string, update: EntryUpdate) => {
    const entries = storageService.getEntries();
    const index = entries.findIndex(e => e.id === entryId);
    if (index >= 0) {
      if (!entries[index].updates) entries[index].updates = [];
      entries[index].updates.push(update);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    }
  },

  // --- Chats ---
  getChats: (): ChatRoom[] => {
    const stored = localStorage.getItem(CHATS_KEY);
    if (!stored) {
      localStorage.setItem(CHATS_KEY, JSON.stringify(INITIAL_CHATS));
      return INITIAL_CHATS;
    }
    return JSON.parse(stored);
  },

  createChat: (chat: ChatRoom) => {
    const chats = storageService.getChats();
    chats.push(chat);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }
};


export type UserRole = 'FieldWorker' | 'Specialist' | 'Heritage' | 'Student' | 'Other' | 'Admin';
export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  nickname: string; // New: Unique display handle
  email: string;
  password?: string; // Mock password storage
  role: UserRole;
  dob?: string;
  
  // Professional Data
  organization?: string;
  specialty?: string;
  university?: string;
  
  // Documents (Mock file paths/names)
  documents?: string[];
  documentType?: string;
  
  // Profile
  avatar?: string;
  bio?: string;
  works?: string[]; // List of past excavations/papers
  savedChatIds: string[]; 
}

export interface Finding {
  id: string;
  name: string;
  description: string;
  material: string;
  condition: 'Intact' | 'Fragmented' | 'Fragile' | 'Restored';
}

export interface EntryUpdate {
  id: string;
  date: string;
  text: string;
  authorName: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  authorName: string;
  authorRole: string; // Displayed tag
  
  // -- Stage 1: Documentation --
  title: string;
  date: string; // ISO String
  discoveryTime?: string;
  
  // Location
  location: string;
  coordinates?: string; // GPS
  locationContext?: string; // "500m north of..."
  
  // Finding Specs (General/Primary Object)
  material?: string;
  dimensions?: string; // "10x20cm"
  condition?: string;
  appearance?: string; // Form, drawings, etc.
  
  // Context
  findingContext?: string; // Nearby objects, soil layer
  
  // -- Stage 2: Diary --
  description: string; // The "Process"
  
  findings: Finding[]; // Sub-findings
  teamMembers: { id: string; name: string; role: string }[];
  tags: string[];
  weather?: string;
  isPublic: boolean;
  updates: EntryUpdate[];
}

export interface FilterState {
  searchQuery: string;
  startDate: string;
  endDate: string;
  material: string;
  location: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  members: number;
  tags: {
    country: string;
    language: string;
    specialization: string;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

// Initial Data moved to storageService or kept minimal here
export const INITIAL_ENTRIES: JournalEntry[] = [];
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_photo?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatContact extends User {
  lastMessage?: string;
  online?: boolean;
}
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  profile_photo?: string
  last_message?: string
  created_at?: string
  last_message_read?: boolean
}

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  is_read: boolean
  created_at: string
  type?: "chat_message" | "typing" | "presence" | "read_receipt"
}

export interface ChatContact extends User {
  lastMessage?: string
  online?: boolean
}
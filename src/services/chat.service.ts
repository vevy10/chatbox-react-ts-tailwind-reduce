import { type Message } from '../types/chat.type'

const API_URL = 'http://127.0.0.1:8000/chat'

export async function sendMessage(
  token: string, 
  receiverId: number, 
  content: string,
  senderId: number
): Promise<Message> {
  const res = await fetch(`${API_URL}/send`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ 
      sender_id: senderId, 
      receiver_id: receiverId, 
      content 
    }),
  })

  if (!res.ok) {
    const error = await res.json();
    console.error("Erreur Backend 422:", error);
    throw new Error('Erreur lors de l\'envoi du message');
  }

  return res.json()
}

export async function getChatHistory(token: string, friendId: number): Promise<Message[]> {
  const res = await fetch(`${API_URL}/history/${friendId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  return res.json()
}
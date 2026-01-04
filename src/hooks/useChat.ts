import { useState, useEffect, useCallback } from 'react';
import { getChatHistory } from '../services/chat.service';
import { getAllUsers } from '../services/auth.service'; 
import { type Message } from '../types/chat.type';
import { type User } from '../types/auth.type';

export const useChat = (userId: number | undefined, token: string | null, activeFriendId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);

  const loadContacts = useCallback(async () => {
    if (!token) return;
    try {
      const users = await getAllUsers(token);
      setContacts(users.filter(u => Number(u.id) !== Number(userId)));
    } catch (err) {
      console.error("Erreur contacts:", err);
    }
  }, [token, userId]);

  const loadHistory = useCallback(async () => {
    if (!token || !activeFriendId) return;
    try {
      const history = await getChatHistory(token, activeFriendId);
      setMessages(Array.isArray(history) ? history : []);
    } catch (err) {
      setMessages([]);
    }
  }, [token, activeFriendId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    loadHistory();

    if (!userId || !activeFriendId) return;
    
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const incoming = JSON.parse(event.data);
      const isFromActiveFriend = Number(incoming.sender_id) === Number(activeFriendId);
      const isFromMe = Number(incoming.sender_id) === Number(userId);

      if (isFromActiveFriend || isFromMe) {
        setMessages((prev) => {
          if (prev.find(m => m.id === incoming.id)) return prev;
          return [...prev, incoming];
        });
      }
    };

    return () => ws.close();
  }, [userId, activeFriendId, loadHistory]);

  return { messages, setMessages, contacts };
};
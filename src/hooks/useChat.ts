import { useState, useEffect, useRef } from 'react'
import { getChatHistory } from '../services/chat.service'
import { getAllUsers } from '../services/auth.service' 
import { type Message, type User } from '../types/chat.type'

export const useChat = (userId: number | undefined, token: string | null, activeFriendId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<User[]>([])
  const [onlineUsers, setOnlineUsers] = useState<number[]>([])
  const [typingStatus, setTypingStatus] = useState<{[key: number]: boolean}>({})
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token) return
    getAllUsers(token).then(users => {
      setContacts(users.filter(u => Number(u.id) !== Number(userId)))
    })
  }, [token, userId])

  useEffect(() => {
    if (!token || !activeFriendId) {
      setMessages([])
      return
    }
    getChatHistory(token, activeFriendId).then(history => {
      setMessages(Array.isArray(history) ? history : [])
    })
  }, [token, activeFriendId])

  useEffect(() => {
    if (!userId) return
    
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`)
    socketRef.current = ws

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case "presence":
          setOnlineUsers(data.online_ids)
          break
        case "typing":
          setTypingStatus(prev => ({ ...prev, [data.sender_id]: data.is_typing }))
          break
        case "chat_message":
          if (Number(data.sender_id) === Number(activeFriendId) || Number(data.sender_id) === Number(userId)) {
            setMessages(prev => {
              if (prev.find(m => m.id === data.id)) return prev
              return [...prev, data]
            })
          }
          setContacts((prev: User[]) => 
            prev.map(contact => {
              if (Number(contact.id) === Number(data.sender_id) || Number(contact.id) === Number(data.receiver_id)) {
                return { 
                  ...contact, 
                  last_message: data.content,
                  created_at: data.created_at,
                  last_message_read: Number(data.sender_id) === Number(activeFriendId) || Number(data.sender_id) === Number(userId)
                }
              }
              return contact
            })
          )
          break
      }
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close()
    }
  }, [userId, activeFriendId])

  const sendTyping = (isTyping: boolean) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && activeFriendId) {
      socketRef.current.send(JSON.stringify({ type: "typing", receiver_id: activeFriendId, is_typing: isTyping }))
    }
  }

  return { messages, setMessages, contacts, setContacts, onlineUsers, typingStatus, sendTyping }
}
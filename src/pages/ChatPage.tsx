import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { Send, Search, MessageSquare, Check, CheckCheck } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { sendMessage } from '../services/chat.service'
import { DashboardLayout } from '../components/layouts/DashboardLayout'
import { type User } from '../types/chat.type'

const formatSmartDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })
}

export const ChatPage = () => {
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { messages, setMessages, contacts, setContacts, onlineUsers, typingStatus, sendTyping } = useChat(user?.id, token, activeTab)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingStatus])

  const sortedContacts = useMemo(() => {
    return [...contacts]
      .filter(c => `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
  }, [contacts, searchQuery])

  const handleContactClick = (contactId: number) => {
    setActiveTab(contactId)
    setContacts((prev: User[]) => prev.map(c => 
      Number(c.id) === contactId ? { ...c, last_message_read: true } : c
    ))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    sendTyping(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !token || !activeTab || !user?.id) return
    try {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      sendTyping(false)
      const sent = await sendMessage(token, activeTab, newMessage, user.id)
      setMessages(prev => [...prev, sent])
      setNewMessage('')
    } catch (err) {
      console.error(err)
    }
  }

  const selectedContact = contacts.find(c => Number(c.id) === activeTab)

  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden bg-[#0a0f1a]">
        <div className="w-85 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
            {sortedContacts.map(contact => {
              const isOnline = onlineUsers.includes(Number(contact.id))
              const isTyping = typingStatus[Number(contact.id)]
              const isUnread = contact.last_message_read === false && activeTab !== Number(contact.id)

              return (
                <div 
                  key={contact.id} 
                  onClick={() => handleContactClick(Number(contact.id))}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-3 border ${
                    activeTab === Number(contact.id) 
                    ? 'bg-blue-600/20 border-blue-500/40' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white border border-white/10 font-bold">
                      {contact.profile_photo ? (
                        <img src={`http://127.0.0.1:8000/${contact.profile_photo}`} className="w-full h-full rounded-full object-cover" alt="" />
                      ) : (
                        contact.first_name[0].toUpperCase()
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0f1a] rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'font-semibold text-white/90'}`}>
                        {contact.first_name}
                      </p>
                      {contact.created_at && (
                        <span className={`text-[10px] ${isUnread ? 'text-blue-400 font-bold' : 'text-white/30'}`}>
                          {formatSmartDate(contact.created_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isTyping ? (
                        <p className="text-[11px] text-blue-400 font-bold animate-pulse italic">écrit...</p>
                      ) : (
                        <p className={`text-[11px] truncate ${isUnread ? 'font-bold text-white' : 'font-medium text-white/40'}`}>
                          {contact.last_message || "Démarrer la discussion"}
                        </p>
                      )}
                      {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 px-8 border-b border-white/5 bg-black/20 backdrop-blur-md flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    {selectedContact.first_name[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{selectedContact.first_name} {selectedContact.last_name}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                      {onlineUsers.includes(Number(selectedContact.id)) ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => {
                  const isMe = Number(msg.sender_id) === Number(user?.id)
                  return (
                    <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`group relative max-w-[75%] px-5 py-3 rounded-2xl transition-all ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800/80 text-white rounded-tl-none'
                      }`}>
                        <p className="text-[14px] leading-relaxed">{msg.content}</p>
                        <div className={`flex items-center gap-1.5 mt-1.5 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[9px] font-mono">{formatSmartDate(msg.created_at)}</span>
                          {isMe && (msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />)}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={scrollRef} />
              </div>

              <form onSubmit={handleSend} className="p-8 pt-2">
                <div className="max-w-4xl mx-auto flex items-center bg-slate-900/80 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                  <input 
                    value={newMessage} 
                    onChange={handleInputChange}
                    placeholder={`Écrire à ${selectedContact.first_name}...`} 
                    className="flex-1 bg-transparent py-3 px-4 text-sm text-white focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()} 
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white p-3 rounded-xl transition-all active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                </div>
                {typingStatus[Number(selectedContact.id)] && (
                  <p className="text-center text-[10px] text-blue-400 mt-2 font-bold animate-pulse">
                    {selectedContact.first_name} est en train d'écrire...
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                <MessageSquare size={40} className="text-blue-500 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-white">Sélectionnez une discussion</h3>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
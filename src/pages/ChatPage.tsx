import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, User as UserIcon, ArrowLeft, Search, Circle } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { sendMessage } from '../services/chat.service';
import { useNavigate } from 'react-router-dom';

export const ChatPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const { messages, setMessages, contacts } = useChat(user?.id, token, activeTab || 0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedContact = contacts.find(c => Number(c.id) === Number(activeTab));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !token || activeTab === null || !user?.id) return;

    try {
      const sent = await sendMessage(token, activeTab, newMessage, user.id);
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      console.error("Erreur d'envoi", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex overflow-hidden">
        <div className="w-80 border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-6">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-white/40 hover:text-white mb-6 flex items-center gap-2 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
            </button>
            <h2 className="text-2xl font-light text-white mb-6 tracking-tight">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un contact..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50" 
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setActiveTab(Number(contact.id))}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                  activeTab === Number(contact.id) 
                  ? 'bg-blue-600/30 border-blue-500/50 shadow-lg scale-[1.02]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10 hover:translate-x-1'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm border border-white/10 shadow-inner overflow-hidden">
                    {contact.profile_photo ? (
                        <img src={`http://127.0.0.1:8000/${contact.profile_photo}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                        contact.first_name.charAt(0).toUpperCase() + contact.last_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#152342] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate uppercase tracking-tighter">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <p className="text-white/30 text-[10px] lowercase">Cliquez pour discuter</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-black/5">
          {selectedContact ? (
            <>
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 font-bold">
                    {selectedContact.first_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{selectedContact.first_name} {selectedContact.last_name}</h3>
                    <div className="flex items-center gap-1.5">
                      <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">En direct</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={msg.id || index} 
                    className={`flex ${Number(msg.sender_id) === Number(user?.id) ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-2xl transition-all ${
                      Number(msg.sender_id) === Number(user?.id) 
                      ? 'bg-blue-600 text-white rounded-tr-none border border-white/10' 
                      : 'bg-white/10 text-white border border-white/10 rounded-tl-none backdrop-blur-xl'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className="text-[9px] opacity-40 mt-2 text-right font-mono">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              <form onSubmit={handleSend} className="p-8 bg-black/30 backdrop-blur-sm">
                <div className="relative flex items-center">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Écrire à ${selectedContact.first_name}...`} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-6 animate-pulse">
                <UserIcon size={48} />
              </div>
              <h3 className="text-xl font-light tracking-[0.3em] uppercase">Messagerie</h3>
              <p className="mt-2 text-sm text-white/10 text-center px-10">
                Sélectionnez un contact dans la liste de gauche pour commencer à discuter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
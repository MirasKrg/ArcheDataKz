
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatRoom, ChatMessage, Language } from '../types';
import { storageService } from '../services/storageService';
import { MessageCircle, Users, Search, Plus } from './Icons';
import { translations } from '../translations';

interface CommunityProps {
  currentUser: User | null;
  onLoginRequest: () => void;
  lang: Language;
}

type CommunityView = 'hub' | 'list' | 'create' | 'chat';

export const Community: React.FC<CommunityProps> = ({ currentUser, onLoginRequest, lang = 'ru' }) => {
  const t = translations[lang].community;
  const tTags = translations[lang].tags;

  const [view, setView] = useState<CommunityView>('hub');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [newRoomData, setNewRoomData] = useState({ name: '', description: '', country: '', language: '', specialization: '' });

  useEffect(() => {
    setRooms(storageService.getChats());
  }, [view]);

  useEffect(() => {
    if (view === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room: ChatRoom = {
      id: Date.now().toString(),
      name: newRoomData.name,
      description: newRoomData.description,
      members: 1,
      tags: { country: newRoomData.country, language: newRoomData.language, specialization: newRoomData.specialization }
    };
    storageService.createChat(room);
    setSelectedRoom(room);
    setView('chat');
    setMessages([{ id: 'sys', userId: 'system', userName: 'System', text: 'Chat Created.', timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const toggleSaveChat = () => {
    if (currentUser && selectedRoom) {
      storageService.toggleSavedChat(currentUser.id, selectedRoom.id);
      alert('Saved!');
    }
  };

  if (!currentUser) {
     return (
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
           <div className="bg-white dark:bg-stone-900 p-12 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800">
              <Users className="w-16 h-16 text-stone-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">{t.hubTitle}</h2>
              <button onClick={onLoginRequest} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold shadow-md">
                {translations[lang].nav.login}
              </button>
           </div>
        </div>
     );
  }

  const renderHub = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-8">{t.hubTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => setView('list')} className="bg-white dark:bg-stone-900 p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 hover:shadow-md transition-all text-left group">
           <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Search className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{t.searchChats}</h3>
        </button>

        <button onClick={() => setView('list')} className="bg-white dark:bg-stone-900 p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 hover:shadow-md transition-all text-left group">
           <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <MessageCircle className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{t.allChats}</h3>
        </button>

        <button onClick={() => setView('create')} className="bg-white dark:bg-stone-900 p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 hover:shadow-md transition-all text-left group">
           <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Plus className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{t.createChat}</h3>
        </button>

        <button onClick={() => setView('list')} className="bg-white dark:bg-stone-900 p-8 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-amber-500 hover:shadow-md transition-all text-left group">
           <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Users className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{t.savedChats}</h3>
        </button>
      </div>
    </div>
  );

  const renderCreateRoom = () => (
    <div className="max-w-2xl mx-auto px-4 py-8">
       <button onClick={() => setView('hub')} className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 mb-6 flex items-center">← Back</button>
       <div className="bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 p-8">
          <h2 className="text-2xl font-serif font-bold mb-6 text-stone-900 dark:text-stone-100">{t.createChat}</h2>
          <form onSubmit={handleCreateRoom} className="space-y-6">
             <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">Name</label>
                <input required className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none" 
                  value={newRoomData.name} onChange={e => setNewRoomData({...newRoomData, name: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea required className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none h-24" 
                  value={newRoomData.description} onChange={e => setNewRoomData({...newRoomData, description: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">Specialization</label>
                <select className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none"
                  value={newRoomData.specialization} onChange={e => setNewRoomData({...newRoomData, specialization: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="Раскопки">{tTags.excavations}</option>
                    <option value="Реставрация">{tTags.restoration}</option>
                    <option value="Антропология">{tTags.anthropology}</option>
                    <option value="Другое">{tTags.other}</option>
                </select>
             </div>
             <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg shadow mt-4">
                Create
             </button>
          </form>
       </div>
    </div>
  );

  const renderChatList = () => {
    const filteredRooms = rooms.filter(r => 
       r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
         <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('hub')} className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium">← Hub</button>
            <div className="flex-1 relative">
               <input 
                 autoFocus type="text" 
                 className="w-full pl-4 pr-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none"
                 placeholder="Search..."
                 value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredRooms.map(room => (
               <div key={room.id} onClick={() => { setSelectedRoom(room); setView('chat'); }} className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500 cursor-pointer shadow-sm flex justify-between items-center group transition-all">
                  <div>
                     <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{room.name}</h3>
                     <p className="text-stone-500 text-sm mt-1">{room.description}</p>
                     <div className="flex gap-2 mt-2">
                         <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded">{room.tags.country}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  };

  const renderChat = () => {
     if (!selectedRoom) return null;
     return (
      <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col bg-white dark:bg-stone-900 md:border-x border-stone-200 dark:border-stone-800">
         <div className="bg-stone-50 dark:bg-stone-950 p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
               <button onClick={() => setView('list')} className="text-stone-500">←</button>
               <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100">{selectedRoom.name}</h3>
               </div>
            </div>
            <button onClick={toggleSaveChat} className="text-sm font-medium border border-stone-300 dark:border-stone-700 px-3 py-1 rounded dark:text-stone-300">Save</button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-100/50 dark:bg-stone-950">
            {messages.map(msg => {
                const isMe = msg.userId === currentUser.id;
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${isMe ? 'bg-amber-600 text-white' : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'}`}>
                        {!isMe && <div className="text-xs font-bold text-amber-600 mb-1">{msg.userName}</div>}
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    </div>
                );
            })}
            <div ref={chatBottomRef} />
         </div>
         <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
               <input autoFocus type="text" className="flex-1 bg-stone-50 text-stone-900 border border-stone-300 rounded-full px-5 py-3 outline-none" placeholder="..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
               <button type="submit" className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center">➤</button>
            </form>
         </div>
      </div>
     );
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
       {view === 'hub' && renderHub()}
       {view === 'create' && renderCreateRoom()}
       {view === 'list' && renderChatList()}
       {view === 'chat' && renderChat()}
    </div>
  );
};


import React, { useState } from 'react';
import { JournalEntry, EntryUpdate, User } from '../types';
import { storageService } from '../services/storageService';
import { Calendar, MapPin, Book, UserCircle, Plus, Trash } from './Icons';

interface EntryDetailModalProps {
  entry: JournalEntry;
  currentUser: User | null;
  onClose: () => void;
  onUpdate: () => void; // Trigger refresh
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ entry, currentUser, onClose, onUpdate }) => {
  const [newUpdateText, setNewUpdateText] = useState('');
  const isAuthor = currentUser?.id === entry.userId;
  const isAdmin = currentUser?.role === 'Admin';

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim()) return;

    const update: EntryUpdate = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text: newUpdateText,
      authorName: currentUser?.name || 'Unknown'
    };

    storageService.addEntryUpdate(entry.id, update);
    setNewUpdateText('');
    onUpdate();
  };

  const handleDelete = () => {
     if (window.confirm('Вы уверены, что хотите удалить эту запись? Это действие необратимо.')) {
        storageService.deleteEntry(entry.id);
        onUpdate();
        onClose();
     }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative flex flex-col">
        {/* Actions Bar */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
           {(isAuthor || isAdmin) && (
             <button onClick={handleDelete} className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full transition-colors" title="Удалить запись">
                <Trash className="w-5 h-5" />
             </button>
           )}
           <button 
             onClick={onClose}
             className="bg-stone-100 hover:bg-stone-200 p-2 rounded-full text-stone-500 transition-colors"
           >
             ✕
           </button>
        </div>

        {/* Header */}
        <div className="h-40 bg-stone-900 relative overflow-hidden shrink-0">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="absolute bottom-6 left-8 text-white">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-600 text-xs font-bold px-2 py-0.5 rounded uppercase">{entry.authorRole}</span>
                {entry.isPublic && <span className="bg-white/20 text-xs px-2 py-0.5 rounded">Public</span>}
             </div>
             <h2 className="text-3xl font-serif font-bold">{entry.title}</h2>
             <div className="flex items-center space-x-4 text-sm text-stone-300 mt-2">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(entry.date).toLocaleDateString()} {entry.discoveryTime && `• ${entry.discoveryTime}`}</span>
                <span className="flex items-center"><UserCircle className="w-4 h-4 mr-1"/> {entry.authorName}</span>
             </div>
           </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Data & Specs */}
          <div className="space-y-6">
             <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-4 flex items-center border-b border-stone-200 pb-2">
                   <MapPin className="w-4 h-4 mr-2" /> Локализация
                </h4>
                <div className="space-y-3 text-sm">
                   <div>
                      <div className="text-xs font-bold text-stone-500 uppercase">Координаты</div>
                      <div className="font-mono text-stone-800">{entry.coordinates || '—'}</div>
                   </div>
                   <div>
                      <div className="text-xs font-bold text-stone-500 uppercase">Место</div>
                      <div className="text-stone-800">{entry.location}</div>
                   </div>
                   {entry.locationContext && (
                      <div>
                         <div className="text-xs font-bold text-stone-500 uppercase">Привязка</div>
                         <div className="text-stone-700 italic">{entry.locationContext}</div>
                      </div>
                   )}
                </div>
             </div>

             <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-4 flex items-center border-b border-amber-200 pb-2">
                   <Book className="w-4 h-4 mr-2" /> Паспорт Находки
                </h4>
                <div className="space-y-3 text-sm">
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                         <div className="text-xs font-bold text-stone-500 uppercase">Материал</div>
                         <div className="font-medium">{entry.material || '—'}</div>
                      </div>
                      <div>
                         <div className="text-xs font-bold text-stone-500 uppercase">Размеры</div>
                         <div className="font-mono">{entry.dimensions || '—'}</div>
                      </div>
                   </div>
                   <div>
                      <div className="text-xs font-bold text-stone-500 uppercase">Состояние</div>
                      <div className="">{entry.condition || '—'}</div>
                   </div>
                   {entry.appearance && (
                      <div>
                         <div className="text-xs font-bold text-stone-500 uppercase">Внешний вид</div>
                         <div className="text-stone-700">{entry.appearance}</div>
                      </div>
                   )}
                   {entry.findingContext && (
                      <div className="bg-white p-2 rounded border border-amber-100 mt-2">
                         <div className="text-xs font-bold text-stone-500 uppercase">Контекст</div>
                         <div className="text-stone-700">{entry.findingContext}</div>
                      </div>
                   )}
                </div>
             </div>
             
             {/* Tags */}
             <div>
                <h4 className="font-bold text-stone-900 text-sm uppercase mb-2">Ключевые слова</h4>
                <div className="flex flex-wrap gap-2">
                   {entry.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs border border-stone-200">
                         #{tag}
                      </span>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column (2 spans): Narrative & Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">Полевой дневник</h3>
              <div className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base font-serif bg-white p-2">
                 {entry.description}
              </div>
            </section>

            {/* Updates Timeline */}
            <section className="bg-stone-50/50 rounded-xl p-6 border border-stone-100">
              <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center justify-between">
                 <span>Ход работ (Timeline)</span>
              </h3>
              
              <div className="space-y-6 relative pl-4 border-l-2 border-stone-200">
                {entry.updates && entry.updates.map(update => (
                  <div key={update.id} className="relative group">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-stone-300 rounded-full border-2 border-white group-hover:bg-amber-500 transition-colors"></div>
                    <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-stone-800 text-sm">{update.authorName}</span>
                        <span className="text-xs text-stone-500">{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-stone-700 text-sm whitespace-pre-wrap">{update.text}</p>
                    </div>
                  </div>
                ))}

                {(!entry.updates || entry.updates.length === 0) && !isAuthor && (
                   <div className="text-stone-400 italic text-sm pl-2">Обновлений пока нет.</div>
                )}
              </div>

              {/* Add Update Form (Author Only) */}
              {isAuthor && (
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <h4 className="font-bold text-stone-800 mb-3 flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-amber-600" />
                    Добавить запись
                  </h4>
                  <form onSubmit={handleAddUpdate} className="flex flex-col gap-3">
                    <textarea 
                      required
                      placeholder="Опишите новые находки или прогресс..."
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white text-stone-900 min-h-[100px]"
                      value={newUpdateText}
                      onChange={e => setNewUpdateText(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="self-end bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      Опубликовать
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

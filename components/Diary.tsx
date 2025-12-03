
import React, { useState, useEffect } from 'react';
import { JournalEntry, User, UserRole, Language } from '../types';
import { storageService } from '../services/storageService';
import { EntryForm } from './EntryForm';
import { EntryList } from './EntryList';
import { EntryDetailModal } from './EntryDetailModal';
import { Plus, Shield } from './Icons';
import { translations } from '../translations';

interface DiaryProps {
  currentUser: User;
  lang: Language;
}

const ALLOWED_ROLES: UserRole[] = ['FieldWorker', 'Specialist', 'Heritage', 'Student', 'Admin'];

export const Diary: React.FC<DiaryProps> = ({ currentUser, lang }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const t = translations[lang].diary;

  const loadEntries = () => {
    const allEntries = storageService.getEntries();
    setEntries(allEntries.filter(e => e.userId === currentUser.id));
  };

  useEffect(() => {
    loadEntries();
  }, [currentUser.id]);

  const handleSaveEntry = (newEntry: JournalEntry) => {
    storageService.saveEntry(newEntry);
    setIsCreating(false);
    loadEntries();
  };

  const handleEntryUpdated = () => {
    loadEntries();
    if (selectedEntry) {
        const updated = storageService.getEntries().find(e => e.id === selectedEntry.id);
        if (updated) setSelectedEntry(updated);
        else setSelectedEntry(null); // Deleted
    }
  };

  const canWrite = ALLOWED_ROLES.includes(currentUser.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{t.title}</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">{t.subtitle} ({entries.length})</p>
        </div>
        
        {!isCreating && (
          canWrite ? (
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>{t.newEntry}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-stone-200 dark:bg-stone-800 px-4 py-2 rounded text-stone-600 dark:text-stone-400 text-sm font-medium">
               <Shield className="w-4 h-4" /> {t.restricted}
            </div>
          )
        )}
      </header>

      {isCreating ? (
        <div className="max-w-6xl mx-auto mb-12 animate-fade-in-down">
          <EntryForm 
            currentUser={currentUser}
            onSave={handleSaveEntry} 
            onCancel={() => setIsCreating(false)} 
            lang={lang}
          />
        </div>
      ) : null}

      {entries.length === 0 && !isCreating ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
          <p className="text-stone-500 text-lg mb-4">{t.empty}</p>
          {canWrite && <button onClick={() => setIsCreating(true)} className="text-amber-600 font-bold hover:underline">{t.start}</button>}
        </div>
      ) : (
        <div className="space-y-4">
            {entries.map(entry => (
                <div key={entry.id} onClick={() => setSelectedEntry(entry)} className="cursor-pointer">
                    <EntryList entries={[entry]} />
                </div>
            ))}
        </div>
      )}

      {selectedEntry && (
        <EntryDetailModal 
          entry={selectedEntry} 
          currentUser={currentUser}
          onClose={() => setSelectedEntry(null)} 
          onUpdate={handleEntryUpdated}
        />
      )}
    </div>
  );
};


import React, { useState, useMemo, useEffect } from 'react';
import { JournalEntry, FilterState, Language } from '../types';
import { storageService } from '../services/storageService';
import { Search, MapPin, Filter, Book, Calendar } from './Icons';
import { EntryDetailModal } from './EntryDetailModal';
import { translations } from '../translations';

export const Database: React.FC<{lang?: Language}> = ({ lang = 'ru' }) => {
  const t = translations[lang].database;
  const tTags = translations[lang].tags;
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    startDate: '',
    endDate: '',
    material: '',
    location: ''
  });

  const loadEntries = () => {
    const allEntries = storageService.getEntries();
    setEntries(allEntries.filter(e => e.isPublic));
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = 
        entry.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      const matchesDate = 
        (!filters.startDate || entry.date >= filters.startDate) &&
        (!filters.endDate || entry.date <= filters.endDate);

      const matchesMaterial = !filters.material || 
        entry.findings.some(f => f.material === filters.material); // In real app, material matching needs better normalization
        
      const matchesLocation = !filters.location ||
        entry.location.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesDate && matchesMaterial && matchesLocation;
    });
  }, [entries, filters]);

  const handleEntryUpdated = () => {
    loadEntries();
    if (selectedEntry) {
       const updated = storageService.getEntries().find(e => e.id === selectedEntry.id);
       if (updated) setSelectedEntry(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{t.title}</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">{t.subtitle(entries.length)}</p>
        </header>

      {/* Advanced Filter Bar */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-md border border-stone-200 dark:border-stone-800 mb-8">
        <div className="flex items-center space-x-2 mb-4 text-stone-500 font-semibold uppercase text-xs tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2">
            <Filter className="w-4 h-4" />
            <span>{t.filters}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Text Search */}
          <div className="col-span-1 md:col-span-4 relative">
            <Search className="absolute left-3 top-3 text-stone-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>

          {/* Location */}
          <div className="relative">
             <label className="text-xs font-semibold text-stone-500 mb-1 block">{t.location}</label>
             <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="..." 
                  className="w-full pl-9 pr-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
             </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">{t.dateFrom}</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">{t.dateTo}</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {/* Material */}
           <div>
            <label className="text-xs font-semibold text-stone-500 mb-1 block">{t.material}</label>
            <select 
              className="w-full px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              value={filters.material}
              onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
            >
              <option value="">{t.allMaterials}</option>
              <option value="Керамика">{tTags.ceramic}</option>
              <option value="Кость">{tTags.bone}</option>
              <option value="Металл">{tTags.metal}</option>
              <option value="Камень">{tTags.stone}</option>
              <option value="Стекло">{tTags.glass}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
           <div className="text-center py-20 bg-stone-50 dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
             <div className="text-stone-400 mb-2">
                <Search className="w-12 h-12 mx-auto opacity-20" />
             </div>
             <p className="text-stone-500">{t.notFound}</p>
           </div>
        ) : (
          filteredEntries.map(entry => (
            <article 
              key={entry.id} 
              onClick={() => setSelectedEntry(entry)}
              className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-amber-600 font-medium mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="text-stone-300">|</span>
                      <span className="text-stone-500">Author: {entry.authorName}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 transition-colors">{entry.title}</h3>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end">
                      {entry.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium rounded-full border border-stone-200 dark:border-stone-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-3">
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-wrap line-clamp-2">{entry.description}</p>
                    
                    {entry.findings.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-bold text-stone-500 uppercase">
                          <Book className="w-3 h-3" />
                          <span>Items: {entry.findings.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-stone-500 space-y-3 border-t md:border-t-0 md:border-l border-stone-100 dark:border-stone-800 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <span className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {t.location}
                      </span>
                      {entry.location}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {selectedEntry && (
        <EntryDetailModal 
          entry={selectedEntry} 
          currentUser={null}
          onClose={() => setSelectedEntry(null)} 
          onUpdate={handleEntryUpdated}
        />
      )}
    </div>
  );
};

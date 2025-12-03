
import React from 'react';
import { JournalEntry } from '../types';
import { Calendar, MapPin, Book } from './Icons';

interface EntryListProps {
  entries: JournalEntry[];
}

export const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <article key={entry.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-amber-600 font-medium mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(entry.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">{entry.title}</h3>
              </div>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end">
                  {entry.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-xs font-medium rounded-full border border-stone-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">{entry.description}</p>
                
                {entry.findings.length > 0 && (
                  <div className="mt-4 bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <h4 className="text-sm font-bold text-stone-700 mb-2 flex items-center">
                      <Book className="w-4 h-4 mr-2" />
                      Найдено объектов: {entry.findings.length}
                    </h4>
                    <ul className="space-y-2">
                      {entry.findings.map(finding => (
                        <li key={finding.id} className="text-sm text-stone-600 pl-4 border-l-2 border-amber-400">
                          <span className="font-medium text-stone-800">{finding.name}</span> — {finding.material} ({finding.condition})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-sm text-stone-500 space-y-3 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                <div>
                  <span className="block font-semibold text-stone-700 mb-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> Локация
                  </span>
                  {entry.location}
                </div>
                {entry.weather && (
                  <div>
                    <span className="block font-semibold text-stone-700 mb-1">Погода</span>
                    {entry.weather}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

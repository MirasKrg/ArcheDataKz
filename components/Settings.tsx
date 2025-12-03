
import React from 'react';
import { Theme, Language } from '../types';
import { translations } from '../translations';
import { Shield, Filter } from './Icons';

interface SettingsProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Settings: React.FC<SettingsProps> = ({ lang, setLang, theme, setTheme }) => {
  const t = translations[lang].settings;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8 text-stone-900 dark:text-stone-100 flex items-center">
         <Filter className="w-8 h-8 mr-3 text-amber-600" />
         {t.title}
      </h1>

      <div className="space-y-6">
        
        {/* Account Section */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
           <h2 className="text-xl font-bold mb-6 flex items-center text-stone-900 dark:text-stone-100">
              <Shield className="w-5 h-5 mr-2 text-stone-500" />
              {t.account}
           </h2>
           <div className="space-y-4">
              <button className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium border-b border-stone-200 dark:border-stone-800 pb-1">
                 {t.changePass}
              </button>
              <div className="flex items-center justify-between">
                 <span className="text-stone-600 dark:text-stone-400">{t.notifications}</span>
                 <div className="w-12 h-6 bg-amber-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Appearance & Language */}
        <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 grid md:grid-cols-2 gap-8">
           
           {/* Theme */}
           <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4">{t.theme}</h3>
              <div className="flex gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                 <button 
                   onClick={() => setTheme('light')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-stone-900 shadow' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
                 >
                   {t.light}
                 </button>
                 <button 
                   onClick={() => setTheme('dark')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-stone-700 text-white shadow' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
                 >
                   {t.dark}
                 </button>
              </div>
           </div>

           {/* Language */}
           <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4">{t.language}</h3>
              <div className="flex gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                 <button 
                   onClick={() => setLang('ru')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'ru' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow' : 'text-stone-500'}`}
                 >
                   Русский
                 </button>
                 <button 
                   onClick={() => setLang('en')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow' : 'text-stone-500'}`}
                 >
                   English
                 </button>
              </div>
           </div>

        </div>

        <div className="flex justify-end">
           <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg">
              {t.save}
           </button>
        </div>
      </div>
    </div>
  );
};

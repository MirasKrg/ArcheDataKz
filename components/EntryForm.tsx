
import React, { useState } from 'react';
import { JournalEntry, Finding, User, Language } from '../types';
import { analyzeFieldNotes } from '../services/geminiService';
import { Sparkles, Plus, MapPin, Calendar, Book } from './Icons';
import { translations } from '../translations';

interface EntryFormProps {
  currentUser: User;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
  lang?: Language;
}

// Fixed: Component extracted outside to prevent re-renders losing focus
const EntryFieldInput = ({ 
    label, 
    field, 
    placeholder, 
    value, 
    onChange, 
    isSkipped, 
    onToggleSkip 
}: { 
    label: string, 
    field: string, 
    placeholder?: string, 
    value: string, 
    onChange: (val: string) => void,
    isSkipped: boolean,
    onToggleSkip: () => void
}) => (
    <div className="space-y-1.5">
      <div className="flex justify-between">
         <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">{label}</label>
         <div className="flex items-center gap-1.5 cursor-pointer" onClick={onToggleSkip}>
            <input 
              type="checkbox" 
              checked={isSkipped} 
              readOnly
              className="w-3.5 h-3.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Skip</span>
         </div>
      </div>
      <input 
        type="text"
        disabled={isSkipped}
        className={`w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm ${
            isSkipped 
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700 shadow-none' 
                : 'bg-white text-stone-900 border border-stone-300'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
);

export const EntryForm: React.FC<EntryFormProps> = ({ currentUser, onSave, onCancel, lang = 'ru' }) => {
  const t = translations[lang].entryForm;
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    discoveryTime: '',
    location: '',
    coordinates: '',
    locationContext: '',
    material: '',
    dimensions: '',
    condition: '',
    appearance: '',
    findingContext: '',
    description: '',
    tags: [],
    isPublic: true
  });
  
  // Track "Add Later" states
  const [skipValidation, setSkipValidation] = useState<Record<string, boolean>>({});
  const [findings, setFindings] = useState<Finding[]>([]);
  const [tagInput, setTagInput] = useState('');

  // AI Logic
  const handleAIAnalysis = async () => {
    if (!formData.description) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeFieldNotes(formData.description);
      setFormData(prev => ({
        ...prev,
        description: result.summary + "\n\n[Original Notes]:\n" + prev.description,
        tags: [...(prev.tags || []), ...result.suggestedTags]
      }));
    } catch (err) {
      console.error("AI Error", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
       setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
       setTagInput('');
    }
  };

  const handleSubmit = () => {
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      title: formData.title || 'Без названия',
      date: formData.date || new Date().toISOString(),
      location: formData.location || 'Не указано',
      description: formData.description || '',
      findings: findings,
      teamMembers: [{ id: currentUser.id, name: currentUser.name, role: currentUser.role }],
      updates: [],
      isPublic: formData.isPublic || false,
      tags: formData.tags || [],
      coordinates: formData.coordinates,
      locationContext: formData.locationContext,
      discoveryTime: formData.discoveryTime,
      material: formData.material,
      dimensions: formData.dimensions,
      condition: formData.condition,
      appearance: formData.appearance,
      findingContext: formData.findingContext,
    };
    onSave(newEntry);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col min-h-[70vh] max-h-[85vh]">
      {/* Header Wizard Steps */}
      <div className="bg-stone-900 dark:bg-black px-8 py-5 flex justify-between items-center shrink-0">
         <div className="flex space-x-8">
            <div className={`flex items-center gap-3 ${step === 1 ? 'text-white' : 'text-stone-500'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors ${step === 1 ? 'bg-amber-600' : 'bg-stone-800 border border-stone-700'}`}>1</div>
               <span className="font-serif font-bold text-lg">{t.step1}</span>
            </div>
            <div className="w-12 h-px bg-stone-700 self-center"></div>
            <div className={`flex items-center gap-3 ${step === 2 ? 'text-white' : 'text-stone-500'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors ${step === 2 ? 'bg-amber-600' : 'bg-stone-800 border border-stone-700'}`}>2</div>
               <span className="font-serif font-bold text-lg">{t.step2}</span>
            </div>
         </div>
         <button onClick={onCancel} className="text-stone-400 hover:text-white transition-colors bg-stone-800 hover:bg-stone-700 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-stone-50/30 dark:bg-stone-950/50">
         {/* STAGE 1 */}
         {step === 1 && (
           <div className="space-y-8 animate-fade-in">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 rounded-lg border border-amber-100 dark:border-amber-800 flex items-start gap-3 shadow-sm">
                 <div className="mt-1 text-amber-600"><Book className="w-5 h-5" /></div>
                 <div className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    <span className="font-bold text-amber-900 dark:text-amber-500 block mb-1">{t.passport}</span>
                    {t.passportDesc}
                 </div>
              </div>

              {/* Title & Time */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">{t.fieldTitle}</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                       placeholder="..."
                       value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">{t.date}</label>
                       <input type="date" className="w-full px-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-lg outline-none shadow-sm"
                          value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                     <EntryFieldInput 
                        label={t.time} field="discoveryTime" placeholder="14:30" 
                        value={formData.discoveryTime || ''} onChange={v => setFormData({...formData, discoveryTime: v})}
                        isSkipped={!!skipValidation.discoveryTime} onToggleSkip={() => setSkipValidation(p => ({...p, discoveryTime: !p.discoveryTime}))}
                     />
                 </div>
              </div>

              {/* Location Block */}
              <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                 <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center border-b border-stone-100 dark:border-stone-800 pb-2"><MapPin className="w-5 h-5 mr-2 text-amber-600" /> Геолокация</h4>
                 <div className="grid md:grid-cols-2 gap-6">
                    <EntryFieldInput 
                        label={t.coords} field="coordinates" placeholder="43.2389 N, 76.8897 E"
                        value={formData.coordinates || ''} onChange={v => setFormData({...formData, coordinates: v})}
                        isSkipped={!!skipValidation.coordinates} onToggleSkip={() => setSkipValidation(p => ({...p, coordinates: !p.coordinates}))}
                    />
                    <EntryFieldInput 
                        label={t.address} field="location" placeholder="..."
                        value={formData.location || ''} onChange={v => setFormData({...formData, location: v})}
                        isSkipped={!!skipValidation.location} onToggleSkip={() => setSkipValidation(p => ({...p, location: !p.location}))}
                    />
                    <div className="md:col-span-2">
                       <EntryFieldInput 
                            label={t.locContext} field="locationContext" placeholder="..."
                            value={formData.locationContext || ''} onChange={v => setFormData({...formData, locationContext: v})}
                            isSkipped={!!skipValidation.locationContext} onToggleSkip={() => setSkipValidation(p => ({...p, locationContext: !p.locationContext}))}
                       />
                    </div>
                 </div>
              </div>

              {/* Finding Specs Block */}
              <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                 <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center border-b border-stone-100 dark:border-stone-800 pb-2"><Book className="w-5 h-5 mr-2 text-amber-600" /> Характеристики</h4>
                 <div className="grid md:grid-cols-3 gap-6">
                    <EntryFieldInput 
                        label={t.material} field="material" placeholder="..."
                        value={formData.material || ''} onChange={v => setFormData({...formData, material: v})}
                        isSkipped={!!skipValidation.material} onToggleSkip={() => setSkipValidation(p => ({...p, material: !p.material}))}
                    />
                    <EntryFieldInput 
                        label={t.dims} field="dimensions" placeholder="10 x 5 cm"
                        value={formData.dimensions || ''} onChange={v => setFormData({...formData, dimensions: v})}
                        isSkipped={!!skipValidation.dimensions} onToggleSkip={() => setSkipValidation(p => ({...p, dimensions: !p.dimensions}))}
                    />
                    <EntryFieldInput 
                        label={t.condition} field="condition" placeholder="..."
                        value={formData.condition || ''} onChange={v => setFormData({...formData, condition: v})}
                        isSkipped={!!skipValidation.condition} onToggleSkip={() => setSkipValidation(p => ({...p, condition: !p.condition}))}
                    />
                 </div>
                 <EntryFieldInput 
                    label={t.appearance} field="appearance" placeholder="..."
                    value={formData.appearance || ''} onChange={v => setFormData({...formData, appearance: v})}
                    isSkipped={!!skipValidation.appearance} onToggleSkip={() => setSkipValidation(p => ({...p, appearance: !p.appearance}))}
                 />
              </div>
           </div>
         )}

         {/* STAGE 2 */}
         {step === 2 && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
               <div className="flex justify-between items-end mb-2">
                  <label className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif">{t.diaryDesc}</label>
                  <button 
                    type="button" onClick={handleAIAnalysis} disabled={isAnalyzing || !formData.description}
                    className="flex items-center text-sm font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-700 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isAnalyzing ? '...' : t.aiBtn}
                  </button>
               </div>
               
               <div className="relative">
                 <textarea 
                    className="w-full h-80 px-6 py-5 bg-white text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none leading-relaxed text-lg shadow-inner"
                    placeholder="..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
               </div>

               {/* Tags */}
               <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                  <label className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wide flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">SEO</span>
                    {t.tags}
                  </label>
                  <div className="flex gap-3">
                     <input 
                       className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-2 focus:ring-stone-200 outline-none"
                       placeholder="..."
                       value={tagInput} onChange={e => setTagInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                     />
                     <button type="button" onClick={handleAddTag} className="bg-stone-800 dark:bg-stone-700 text-white px-6 rounded-lg font-bold hover:bg-stone-700 transition-colors shadow-md">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                     {formData.tags?.map(t => (
                        <span key={t} className="bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm border border-amber-100 dark:border-amber-800 flex items-center shadow-sm">
                           #{t}
                           <button onClick={() => setFormData(prev => ({...prev, tags: prev.tags?.filter(tag => tag !== t)}))} className="ml-2 text-amber-400 hover:text-red-500 font-bold">×</button>
                        </span>
                     ))}
                  </div>
               </div>
               
               <div className="flex items-center space-x-3 pt-2 bg-stone-100 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                  <input type="checkbox" id="publicCheck" checked={formData.isPublic} onChange={e => setFormData({...formData, isPublic: e.target.checked})} className="w-5 h-5 text-amber-600 rounded border-stone-300 focus:ring-amber-500" />
                  <label htmlFor="publicCheck" className="text-sm font-medium text-stone-800 dark:text-stone-200 cursor-pointer select-none">
                     {t.public}
                  </label>
               </div>
            </div>
         )}
      </div>

      {/* Footer Controls */}
      <div className="px-8 py-5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between shrink-0 items-center">
         {step === 1 ? (
            <button onClick={onCancel} className="text-stone-500 font-bold hover:text-stone-800 dark:hover:text-stone-200 transition-colors px-4 uppercase tracking-wide text-sm">{t.back}</button>
         ) : (
            <button onClick={() => setStep(1)} className="text-stone-500 font-bold hover:text-stone-800 dark:hover:text-stone-200 transition-colors px-4 uppercase tracking-wide text-sm">← {t.back}</button>
         )}
         
         {step === 1 ? (
            <button onClick={() => setStep(2)} className="bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform transform active:scale-95 flex items-center">
               {t.next} <span className="ml-2">→</span>
            </button>
         ) : (
            <button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-3 rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-0.5">
               {t.save}
            </button>
         )}
      </div>
    </div>
  );
};

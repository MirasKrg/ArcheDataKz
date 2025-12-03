
import React, { useState } from 'react';
import { User, Language } from '../types';
import { storageService } from '../services/storageService';
import { UserCircle, Briefcase, GraduationCap } from './Icons';

interface ProfileProps {
  currentUser: User;
  lang: Language;
}

export const Profile: React.FC<ProfileProps> = ({ currentUser, lang }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: currentUser.bio || '',
    organization: currentUser.organization || '',
  });

  const handleSave = () => {
    const updatedUser = { ...currentUser, ...formData };
    storageService.updateUser(updatedUser);
    setIsEditing(false);
    window.location.reload(); 
  };

  const isProfileIncomplete = !currentUser.bio || (!currentUser.works && currentUser.role !== 'Other');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Complete Profile Notification */}
      {isProfileIncomplete && !isEditing && (
         <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div>
               <h4 className="font-bold text-amber-800 dark:text-amber-500">Заполните ваш профиль</h4>
               <p className="text-sm text-amber-700 dark:text-amber-600">Расскажите о себе и ваших работах.</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-500 px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-amber-100 dark:hover:bg-stone-700 transition-colors">
               Заполнить
            </button>
         </div>
      )}

      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-stone-800 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] relative"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="flex items-end">
               {/* Square Avatar to match Logo */}
               <div className="w-32 h-32 bg-stone-100 dark:bg-stone-800 rounded-2xl border-4 border-white dark:border-stone-900 shadow-md flex items-center justify-center text-stone-300 dark:text-stone-600 overflow-hidden">
                  <UserCircle className="w-full h-full p-2" />
               </div>
               <div className="ml-6 mb-2">
                 <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{currentUser.name}</h1>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded uppercase tracking-wide">
                       {currentUser.role}
                    </span>
                    <span className="text-stone-500 text-sm">@{currentUser.nickname}</span>
                 </div>
               </div>
            </div>
            
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-6 py-2 rounded-lg font-bold shadow-sm transition-colors ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8 border-t border-stone-100 dark:border-stone-800 pt-8">
             <div className="space-y-6">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-sm">Info</h3>
                
                {isEditing ? (
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-500">Организация</label>
                      <input className="w-full p-2 border rounded" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                   </div>
                ) : (
                  currentUser.organization && (
                    <div className="flex items-center text-stone-600 dark:text-stone-400">
                       <Briefcase className="w-5 h-5 text-stone-400 dark:text-stone-500 mr-2" />
                       <span>{currentUser.organization}</span>
                    </div>
                  )
                )}

                {currentUser.university && (
                   <div className="flex items-center text-stone-600 dark:text-stone-400">
                      <GraduationCap className="w-5 h-5 text-stone-400 dark:text-stone-500 mr-2" />
                      <span>{currentUser.university}</span>
                   </div>
                )}
                
                <div className="flex items-center text-stone-600 dark:text-stone-400">
                   <div className="w-5 flex justify-center mr-2 text-stone-400 dark:text-stone-500 font-bold">ID</div>
                   <span className="text-sm">{currentUser.id}</span>
                </div>
             </div>

             <div className="col-span-2 space-y-6">
                <div>
                   <h3 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-sm mb-2">Bio</h3>
                   {isEditing ? (
                      <textarea className="w-full p-2 border rounded h-24" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                   ) : (
                      <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{currentUser.bio || '—'}</p>
                   )}
                </div>

                <h3 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-sm">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {storageService.getEntries().filter(e => e.userId === currentUser.id).length}
                      </div>
                      <div className="text-xs text-stone-500 uppercase mt-1">Entries</div>
                   </div>
                   <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {currentUser.savedChatIds.length}
                      </div>
                      <div className="text-xs text-stone-500 uppercase mt-1">Saved Chats</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

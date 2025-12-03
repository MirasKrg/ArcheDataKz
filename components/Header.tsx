
import React from 'react';
import { Pickaxe, Book, Database, Users, UserCircle, LogOut, Filter } from './Icons'; // Using Filter icon for settings as mock
import { User, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentUser: User | null;
  currentView: string;
  onChangeView: (view: string) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  currentView, 
  onChangeView, 
  onLoginClick,
  onLogoutClick,
  onProfileClick,
  onSettingsClick,
  lang
}) => {
  const t = translations[lang].nav;

  return (
    <nav className="bg-stone-900 text-stone-100 shadow-lg sticky top-0 z-50 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button onClick={() => onChangeView('landing')} className="flex items-center space-x-3 group">
            <div className="bg-amber-600 p-1.5 rounded-lg group-hover:bg-amber-500 transition-colors shadow-md shadow-amber-900/20">
              <Pickaxe className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-serif font-bold tracking-wide group-hover:text-amber-500 transition-colors">ArcheData</span>
          </button>

          {/* Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavButton 
              active={currentView === 'diary'} 
              onClick={() => onChangeView('diary')}
              icon={<Book className="w-4 h-4 mr-2" />}
              label={t.diary}
            />
            <NavButton 
              active={currentView === 'database'} 
              onClick={() => onChangeView('database')}
              icon={<Database className="w-4 h-4 mr-2" />}
              label={t.database}
            />
            <NavButton 
              active={currentView === 'community'} 
              onClick={() => onChangeView('community')}
              icon={<Users className="w-4 h-4 mr-2" />}
              label={t.community}
            />
          </div>

          {/* Auth / Profile */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-stone-200">{currentUser.name}</div>
                  <div className="text-xs text-amber-500">{currentUser.role}</div>
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative group">
                   {/* Square Avatar */}
                   <div className="w-10 h-10 bg-stone-700 rounded-xl flex items-center justify-center border border-stone-600 cursor-pointer hover:bg-stone-600 transition-all hover:ring-2 hover:ring-amber-600">
                      <UserCircle className="w-6 h-6 text-stone-300" />
                   </div>
                   
                   {/* Dropdown Content */}
                   <div className="absolute right-0 mt-2 w-56 bg-stone-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-stone-700">
                      <div className="px-4 py-3 border-b border-stone-700 mb-2">
                         <p className="text-xs text-stone-400">Signed in as</p>
                         <p className="text-sm font-bold text-white truncate">{currentUser.nickname}</p>
                      </div>
                      <button onClick={onProfileClick} className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500 transition-colors flex items-center">
                        <UserCircle className="w-4 h-4 mr-2" />
                        {t.profile}
                      </button>
                      <button onClick={onSettingsClick} className="w-full text-left px-4 py-2 text-sm text-stone-200 hover:bg-stone-700 hover:text-amber-500 transition-colors flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        {t.settings}
                      </button>
                      <div className="border-t border-stone-700 my-2"></div>
                      <button 
                        onClick={onLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t.logout}
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-stone-300 hover:text-white transition-colors"
                >
                  {t.login}
                </button>
                <button 
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-lg"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-stone-800 text-amber-500 shadow-inner' 
        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

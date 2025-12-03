
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Diary } from './components/Diary';
import { Database } from './components/Database';
import { Community } from './components/Community';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { AuthModal } from './components/AuthModal';
import { storageService } from './services/storageService';
import { User, Language, Theme } from './types';

type View = 'landing' | 'diary' | 'database' | 'community' | 'profile' | 'settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Settings State
  const [language, setLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('light');

  // Initial Load
  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user) setCurrentUser(user);

    // Load persisted settings (mock) or system pref
    const savedLang = localStorage.getItem('archedata_lang') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedTheme = localStorage.getItem('archedata_theme') as Theme;
    if (savedTheme) {
        setTheme(savedTheme);
    }
  }, []);

  // Apply Theme Side Effect
  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('archedata_theme', theme);
  }, [theme]);

  // Apply Language Persistence
  useEffect(() => {
    localStorage.setItem('archedata_lang', language);
  }, [language]);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    if (currentView === 'landing') setCurrentView('diary');
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleViewChange = (view: string) => {
    if ((view === 'diary' || view === 'profile') && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view as View);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300">
      <Header 
        currentUser={currentUser}
        currentView={currentView}
        onChangeView={handleViewChange}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        onProfileClick={() => setCurrentView('profile')}
        onSettingsClick={() => setCurrentView('settings')}
        lang={language}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onStart={() => currentUser ? setCurrentView('diary') : setShowAuthModal(true)} />
        )}
        {currentView === 'diary' && currentUser && (
          <Diary currentUser={currentUser} lang={language} />
        )}
        {currentView === 'database' && (
          <Database lang={language} />
        )}
        {currentView === 'community' && (
          <Community 
            currentUser={currentUser} 
            onLoginRequest={() => setShowAuthModal(true)}
            lang={language}
          />
        )}
        {currentView === 'profile' && currentUser && (
          <Profile currentUser={currentUser} lang={language} />
        )}
        {currentView === 'settings' && (
          <Settings 
            lang={language} setLang={setLanguage}
            theme={theme} setTheme={setTheme}
          />
        )}
      </main>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLogin}
        />
      )}
    </div>
  );
};

export default App;

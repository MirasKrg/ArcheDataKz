
import React from 'react';
import { Book, Pickaxe, MapPin, Database, Users } from './Icons';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Hero Section */}
      <header className="relative bg-stone-900 text-stone-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-amber-600/20 text-amber-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-amber-600/30 backdrop-blur-sm">
            <Pickaxe className="w-4 h-4" />
            <span>Инструмент для профессионалов</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-8 drop-shadow-lg">
            Сохраняем историю <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">в цифровом веке</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-stone-200 mb-10 leading-relaxed drop-shadow-md">
            ArcheData — это специализированная платформа для археологов. 
            Ведите полевые дневники, каталогизируйте находки и управляйте данными раскопок 
            в едином стандартизированном формате.
          </p>
          <button 
            onClick={onStart}
            className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Присоединиться к проекту
          </button>
        </div>
      </header>

      {/* About Us / Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-stone-900 mb-6">О Нас</h2>
              <div className="w-20 h-1.5 bg-amber-600 mb-8"></div>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                ArcheData была основана группой энтузиастов и профессиональных археологов с одной целью: 
                <span className="font-semibold text-stone-800"> решить проблему фрагментации данных</span> в современной археологии.
              </p>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                Часто бесценные сведения о находках остаются в бумажных дневниках или разрозненных таблицах. 
                Мы создаем единую экосистему, где каждый дневник становится частью глобальной базы знаний, 
                доступной для научного сообщества.
              </p>
              <div className="flex gap-4 mt-8">
                 <div className="flex flex-col">
                    <span className="text-3xl font-bold text-amber-600">500+</span>
                    <span className="text-sm text-stone-500">Экспедиций</span>
                 </div>
                 <div className="w-px bg-stone-300"></div>
                 <div className="flex flex-col">
                    <span className="text-3xl font-bold text-amber-600">10k+</span>
                    <span className="text-sm text-stone-500">Находок</span>
                 </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-stone-100 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1000&auto=format&fit=crop" 
                alt="Archaeologists at work" 
                className="relative rounded-2xl shadow-lg w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">Экосистема ArcheData</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Три кита нашей платформы для эффективной работы
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-colors group">
            <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mb-6 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
              <Book className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Цифровой Дневник</h3>
            <p className="text-stone-600 leading-relaxed">
              Ваше личное пространство. Записывайте ход работ с помощью AI-ассистента, который структурирует заметки и подбирает теги. Ваши данные в безопасности.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-colors group">
            <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mb-6 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
              <Database className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Глобальная База</h3>
            <p className="text-stone-600 leading-relaxed">
              Мощная система фильтрации позволяет находить аналогии в других экспедициях. Фильтруйте по эре, материалу, региону и типу находок.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-colors group">
            <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center mb-6 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Комьюнити</h3>
            <p className="text-stone-600 leading-relaxed">
              Общайтесь с коллегами в тематических чатах. Обсуждайте находки, делитесь опытом и координируйте совместные исследования в реальном времени.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-stone-900 py-24 text-stone-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-serif font-bold mb-6">Готовы внести свой вклад?</h2>
          <p className="text-stone-400 mb-10 text-xl">
            Регистрируйтесь сейчас и начните вести свой первый цифровой дневник.
          </p>
          <button 
            onClick={onStart}
            className="bg-white text-stone-900 hover:bg-stone-100 px-10 py-4 rounded-xl text-lg font-bold transition-colors shadow-lg"
          >
            Начать работу
          </button>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 mb-8">
            <div>
                <h4 className="text-white font-serif font-bold mb-4">ArcheData</h4>
                <p className="text-sm">Единая цифровая платформа для современной археологии.</p>
            </div>
             <div>
                <h4 className="text-white font-bold mb-4">Платформа</h4>
                <ul className="space-y-2 text-sm">
                    <li>Дневник</li>
                    <li>База Данных</li>
                    <li>API</li>
                </ul>
            </div>
             <div>
                <h4 className="text-white font-bold mb-4">Компания</h4>
                <ul className="space-y-2 text-sm">
                    <li>О Нас</li>
                    <li>Команда</li>
                    <li>Контакты</li>
                </ul>
            </div>
             <div>
                <h4 className="text-white font-bold mb-4">Контакты</h4>
                <p className="text-sm">support@archedata.com</p>
                <p className="text-sm">+7 (777) 123-45-67</p>
            </div>
        </div>
        <div className="text-center text-sm pt-8 border-t border-stone-900">
            <p>&copy; 2024 ArcheData. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

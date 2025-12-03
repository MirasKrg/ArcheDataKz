
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { Pickaxe, Shield, GraduationCap, Users, Briefcase, Upload, Eye, EyeOff } from './Icons';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'FieldWorker', label: 'Полевой работник', icon: <Pickaxe className="w-8 h-8" />, desc: 'Археологи, руководители раскопок' },
  { id: 'Specialist', label: 'Специалист', icon: <Briefcase className="w-8 h-8" />, desc: 'Антропологи, керамисты, реставраторы' },
  { id: 'Heritage', label: 'Охрана наследия', icon: <Shield className="w-8 h-8" />, desc: 'Музеи, инспекции' },
  { id: 'Student', label: 'Студент', icon: <GraduationCap className="w-8 h-8" />, desc: 'Практиканты и учащиеся' },
  { id: 'Other', label: 'Иные лица', icon: <Users className="w-8 h-8" />, desc: 'Любители истории' },
];

const DOC_TYPES = [
  'Открытый лист',
  'Лицензия / Permit',
  'Справка с работы',
  'Отчет о раскопках',
  'Членский билет'
];

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1); // 1 = Role Select, 2 = Form
  const [selectedRole, setSelectedRole] = useState<UserRole | 'FieldWorker'>('FieldWorker');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [regData, setRegData] = useState<Partial<User>>({
    name: '', email: '', password: '', nickname: '', dob: '', 
    organization: '', specialty: '', university: '', documentType: '', documents: []
  });
  const [error, setError] = useState('');

  // Helpers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storageService.login(loginData.id, loginData.password);
    if (user) onSuccess(user);
    else setError('Неверные данные (проверьте Email/Никнейм или Пароль)');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password || !regData.nickname) {
      setError('Заполните обязательные поля');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: selectedRole,
      savedChatIds: [],
      ...regData as User
    };

    storageService.register(newUser);
    onSuccess(newUser);
  };

  const handleFileMock = () => {
    const fileName = `Scan_Doc_${Math.floor(Math.random() * 1000)}.pdf`;
    setRegData(prev => ({ ...prev, documents: [...(prev.documents || []), fileName] }));
  };

  const handleTabSwitch = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setShowPassword(false);
    setError('');
  };

  // --- Renders ---

  const renderRoleSelection = () => (
    <div className="space-y-8 p-4">
       <div className="text-center">
         <h3 className="text-2xl font-serif font-bold text-stone-900">Выберите вашу роль</h3>
         <p className="text-stone-500 mt-2">Это определит ваши права доступа к базе данных.</p>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ROLES.map(role => (
            <div 
              key={role.id}
              onClick={() => { setSelectedRole(role.id); setStep(2); setError(''); setShowPassword(false); }}
              className="group border-2 border-stone-200 rounded-2xl p-6 hover:border-amber-500 hover:shadow-xl cursor-pointer transition-all flex flex-col items-center text-center bg-white hover:bg-amber-50/10"
            >
               <div className="mb-4 text-stone-400 group-hover:text-amber-600 transition-colors transform group-hover:scale-110 duration-200">{role.icon}</div>
               <div className="font-bold text-lg text-stone-900">{role.label}</div>
               <div className="text-sm text-stone-500 mt-2">{role.desc}</div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderRegForm = () => {
    const isPro = ['FieldWorker', 'Specialist', 'Heritage'].includes(selectedRole);
    const isStudent = selectedRole === 'Student';
    
    return (
      <form onSubmit={handleRegister} className="space-y-6 px-2">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                 {ROLES.find(r => r.id === selectedRole)?.icon}
              </div>
              <div>
                 <div className="text-sm text-stone-500 font-bold uppercase">Регистрация</div>
                 <div className="text-xl font-bold text-stone-900">{ROLES.find(r => r.id === selectedRole)?.label}</div>
              </div>
           </div>
           <button type="button" onClick={() => setStep(1)} className="text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors">← Изменить роль</button>
        </div>
        
        {/* Document Section for Pros */}
        {isPro && (
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4">
             <label className="block text-sm font-bold text-stone-800 uppercase tracking-wide">1. Подтверждение квалификации</label>
             <div className="flex flex-wrap gap-3">
                {DOC_TYPES.map(doc => (
                  <button 
                    key={doc}
                    type="button"
                    onClick={() => setRegData({...regData, documentType: doc})}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${regData.documentType === doc ? 'bg-amber-600 text-white border-amber-600 shadow-md transform scale-105' : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'}`}
                  >
                    {doc}
                  </button>
                ))}
             </div>
             
             {regData.documentType && (
               <div className="flex items-center gap-4 mt-2 bg-white p-3 rounded-lg border border-stone-200">
                  <button type="button" onClick={handleFileMock} className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg border border-stone-300 text-sm font-bold text-stone-700 transition-colors">
                     <Upload className="w-4 h-4" /> Загрузить скан документа
                  </button>
                  {regData.documents && regData.documents.length > 0 ? (
                     <span className="text-sm text-green-600 font-bold flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Файл загружен: {regData.documents[0]}
                     </span>
                  ) : (
                     <span className="text-xs text-stone-400">Форматы: PDF, JPG, PNG (Max 10MB)</span>
                  )}
               </div>
             )}
             
             <div>
                <label className="block text-xs font-bold text-stone-500 mt-2">Профиль в науч. соцсетях (Ссылка)</label>
                <input type="text" className="w-full mt-1 px-4 py-2 bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="ResearchGate / University Profile / LinkedIn" />
             </div>
          </div>
        )}

        {/* Dynamic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Specialty - Pro & Student */}
           {(isPro || isStudent) && (
             <div className="col-span-2">
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Специальность / Направление</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                  value={regData.specialty} onChange={e => setRegData({...regData, specialty: e.target.value})}
                  placeholder="Напр: Археология Бронзового века"
                />
             </div>
           )}

           {/* Organization - Pro & Student */}
           {(isPro || isStudent) && (
              <div className="col-span-2 relative">
                 <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isStudent ? 'Организация практики (Необязательно)' : 'Организация / Институт'}</label>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                     value={regData.organization} onChange={e => setRegData({...regData, organization: e.target.value})}
                     placeholder="Институт Археологии..."
                   />
                   {/* If student fills this, assume they might need to upload a referral */}
                   {isStudent && regData.organization && (
                      <button type="button" onClick={handleFileMock} className="whitespace-nowrap px-4 bg-stone-100 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-200">
                        + Справка
                      </button>
                   )}
                 </div>
              </div>
           )}

           {/* University - Student Only */}
           {isStudent && (
             <div className="col-span-2">
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Университет</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                  value={regData.university} onChange={e => setRegData({...regData, university: e.target.value})}
                  placeholder="Название ВУЗа"
                />
             </div>
           )}

           {/* Common Fields */}
           <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">ФИО (Полностью)</label>
              <input type="text" required className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
           </div>

           <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Никнейм (Unique ID)</label>
              <input type="text" required className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                value={regData.nickname} onChange={e => setRegData({...regData, nickname: e.target.value})} placeholder="@username"/>
           </div>

           <div className="col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email (Рабочий предпочтительно)</label>
              <input type="email" required className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
           </div>

           <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Дата Рождения</label>
              <input type="date" required className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                value={regData.dob} onChange={e => setRegData({...regData, dob: e.target.value})} />
           </div>

           <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Пароль</label>
              <div className="relative">
                 <input 
                   type={showPassword ? "text" : "password"}
                   required 
                   className="w-full px-4 py-3 bg-white text-stone-900 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-shadow pr-12" 
                   value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} 
                 />
                 <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
              </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg mt-8 text-lg transition-transform transform hover:-translate-y-0.5">
           Завершить регистрацию
        </button>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Tabs */}
        <div className="flex border-b border-stone-200 shrink-0">
          <button 
            className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase transition-colors ${!isRegister ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
            onClick={() => handleTabSwitch(false)}
          >
            Вход
          </button>
          <button 
            className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase transition-colors ${isRegister ? 'bg-amber-600 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
            onClick={() => handleTabSwitch(true)}
          >
            Регистрация
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 font-medium rounded-xl border border-red-200 text-center">{error}</div>}

          {!isRegister ? (
             <div className="max-w-md mx-auto py-10">
                <div className="text-center mb-10">
                   <div className="w-20 h-20 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Pickaxe className="w-10 h-10" />
                   </div>
                   <h2 className="text-3xl font-serif font-bold text-stone-900">С возвращением</h2>
                   <p className="text-stone-500 mt-2">Введите свои данные для входа в систему ArcheData</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                   <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Email или Никнейм</label>
                      <input 
                        type="text" required 
                        className="w-full px-5 py-4 bg-white text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-800 outline-none text-lg transition-shadow"
                        placeholder="user@archedata.com"
                        value={loginData.id} onChange={e => setLoginData({...loginData, id: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Пароль</label>
                      <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            required 
                            className="w-full px-5 py-4 bg-white text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-800 outline-none text-lg transition-shadow pr-12"
                            placeholder="••••••••"
                            value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})}
                        />
                        <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                   </div>
                   <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl shadow-xl text-lg transition-transform transform hover:-translate-y-0.5 mt-4">
                      Войти в аккаунт
                   </button>
                </form>
             </div>
          ) : (
             <div className="h-full">
               {step === 1 ? renderRoleSelection() : renderRegForm()}
             </div>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0 text-center">
           <button onClick={onClose} className="text-sm text-stone-500 hover:text-stone-800 font-bold uppercase tracking-wide">Закрыть окно</button>
        </div>
      </div>
    </div>
  );
};

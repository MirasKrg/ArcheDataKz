
import { Language } from './types';

export const translations = {
  ru: {
    nav: {
      diary: 'Дневник',
      database: 'База данных',
      community: 'Комьюнити',
      login: 'Войти',
      register: 'Регистрация',
      profile: 'Профиль',
      settings: 'Настройки',
      logout: 'Выйти'
    },
    settings: {
      title: 'Настройки',
      account: 'Аккаунт',
      theme: 'Тема оформления',
      language: 'Язык / Language',
      light: 'Светлая',
      dark: 'Темная',
      save: 'Сохранить изменения',
      changePass: 'Сменить пароль',
      notifications: 'Уведомления'
    },
    diary: {
      title: 'Мой Дневник',
      subtitle: 'Личные записи полевых работ',
      newEntry: 'Новая запись',
      empty: 'У вас пока нет записей.',
      start: 'Начать вести дневник',
      restricted: 'Доступ ограничен'
    },
    database: {
      title: 'База Данных',
      subtitle: (count: number) => `Поиск по ${count} публичным записям`,
      searchPlaceholder: 'Поиск по ключевым словам...',
      location: 'Регион / Локация',
      dateFrom: 'Период (От)',
      dateTo: 'Период (До)',
      material: 'Материал',
      allMaterials: 'Все материалы',
      notFound: 'Записей не найдено',
      filters: 'Параметры поиска'
    },
    community: {
      hubTitle: 'Комьюнити Хаб',
      searchChats: 'Поиск Чатов',
      allChats: 'Все Чаты',
      createChat: 'Создать Чат',
      savedChats: 'Сохраненные',
      popular: 'Популярное сегодня',
      join: 'Присоединиться'
    },
    entryForm: {
      step1: 'Документация',
      step2: 'Дневник',
      passport: 'Паспорт объекта',
      passportDesc: 'Заполните официальные данные находки.',
      fieldTitle: 'Название работ / Находки',
      date: 'Дата',
      time: 'Время обнаружения',
      coords: 'Координаты (GPS)',
      address: 'Адрес / Топоним',
      locContext: 'Описание местности',
      material: 'Материал',
      dims: 'Размеры',
      condition: 'Состояние',
      appearance: 'Внешний вид',
      context: 'Сопутствующие объекты',
      diaryDesc: 'Полевой дневник',
      aiBtn: 'AI Структурирование',
      tags: 'Теги для поиска',
      public: 'Опубликовать запись',
      back: 'Назад',
      next: 'Перейти к Дневнику',
      save: 'Сохранить Запись',
      addLater: 'Добавить позже'
    },
    tags: {
      ceramic: 'Керамика',
      metal: 'Металл',
      bone: 'Кость',
      stone: 'Камень',
      glass: 'Стекло',
      excavations: 'Раскопки',
      restoration: 'Реставрация',
      anthropology: 'Антропология',
      archive: 'Архивная работа',
      other: 'Другое'
    }
  },
  en: {
    nav: {
      diary: 'Diary',
      database: 'Database',
      community: 'Community',
      login: 'Log In',
      register: 'Register',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Log Out'
    },
    settings: {
      title: 'Settings',
      account: 'Account',
      theme: 'Appearance Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      save: 'Save Changes',
      changePass: 'Change Password',
      notifications: 'Notifications'
    },
    diary: {
      title: 'My Journal',
      subtitle: 'Personal field work records',
      newEntry: 'New Entry',
      empty: 'No entries yet.',
      start: 'Start writing',
      restricted: 'Access Restricted'
    },
    database: {
      title: 'Database',
      subtitle: (count: number) => `Search through ${count} public records`,
      searchPlaceholder: 'Search by keywords...',
      location: 'Region / Location',
      dateFrom: 'Date (From)',
      dateTo: 'Date (To)',
      material: 'Material',
      allMaterials: 'All Materials',
      notFound: 'No records found',
      filters: 'Search Filters'
    },
    community: {
      hubTitle: 'Community Hub',
      searchChats: 'Search Chats',
      allChats: 'All Chats',
      createChat: 'Create Chat',
      savedChats: 'Saved',
      popular: 'Trending Today',
      join: 'Join'
    },
    entryForm: {
      step1: 'Documentation',
      step2: 'Journal',
      passport: 'Object Passport',
      passportDesc: 'Fill in official finding data.',
      fieldTitle: 'Work Title / Finding',
      date: 'Date',
      time: 'Discovery Time',
      coords: 'Coordinates (GPS)',
      address: 'Address / Toponym',
      locContext: 'Terrain Description',
      material: 'Material',
      dims: 'Dimensions',
      condition: 'Condition',
      appearance: 'Appearance',
      context: 'Associated Objects',
      diaryDesc: 'Field Journal',
      aiBtn: 'AI Structuring',
      tags: 'Search Tags',
      public: 'Publish Record',
      back: 'Back',
      next: 'Go to Journal',
      save: 'Save Entry',
      addLater: 'Add Later'
    },
    tags: {
      ceramic: 'Ceramic',
      metal: 'Metal',
      bone: 'Bone',
      stone: 'Stone',
      glass: 'Glass',
      excavations: 'Excavations',
      restoration: 'Restoration',
      anthropology: 'Anthropology',
      archive: 'Archive Work',
      other: 'Other'
    }
  }
};

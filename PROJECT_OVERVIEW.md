# Веб-додаток для обліку карт 💳

## 🚀 Огляд проекту

Повнофункціональний веб-додаток для управління картками клієнтів банку з сучасним UI/UX дизайном, створений на Next.js 15 з інтеграцією Supabase.

## ✨ Основні функції

### 📊 Dashboard з аналітикою
- **Статистичні картки** з анімованими лічильниками
- **Моніторинг в реальному часі** кількості клієнтів за статусами
- **Градієнтний дизайн** з hover-ефектами
- **Адаптивна сітка** для різних розмірів екранів

### 👥 Управління клієнтами
- **Додавання нових клієнтів** з валідацією форм
- **Перегляд і редагування** детальної інформації
- **Відстеження статусів** карток та рахунків
- **Документооборот** з tracking наявності документів

### 🎨 Сучасний UI/UX
- **Премім дизайн** з градієнтами та анімаціями
- **StatusBadge компоненти** з іконками та кольорами
- **Toast повідомлення** для користувацького feedback'у
- **Анімації** slide-in, fade-in, hover-lift ефекти
- **Responsive дизайн** для мобільних та десктоп пристроїв

## 🛠 Технічний стек

### Frontend
- **Next.js 15** з App Router
- **TypeScript** для type safety
- **Tailwind CSS** для стилізації
- **Custom CSS анімації** для покращеного UX

### Backend & Database
- **Supabase** PostgreSQL база даних
- **Row Level Security** для безпеки
- **Real-time subscriptions** (готово до реалізації)

### UI Компоненти
- **StatusBadge** - інтелігентні статусні індикатори
- **Toast система** - уведомлення користувача
- **Модальні вікна** з градієнтним дизайном
- **Таблиці** з hover-ефектами та сортуванням

## 📁 Структура проекту

```
/workspaces/card/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Головна сторінка з dashboard
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Глобальні стилі
│   ├── components/
│   │   ├── ClientTable.tsx          # Таблиця клієнтів з StatusBadge
│   │   ├── ClientModal.tsx          # Модальне вікно перегляду/редагування
│   │   ├── AddClientModal.tsx       # Модальне вікно додавання клієнта
│   │   ├── StatusBadge.tsx          # Компонент статусних індикаторів
│   │   └── Toast.tsx                # Система toast повідомлень
│   ├── lib/
│   │   ├── supabase.ts              # Supabase клієнт і типи
│   │   └── database.types.ts        # TypeScript типи БД
│   └── styles/
│       └── animations.css           # Кастомні CSS анімації
├── database-setup.md                # SQL схема для Supabase
├── .env.local                      # Environment змінні
└── package.json                    # Залежності проекту
```

## 🗄 Схема бази даних

### Таблиця `clients`
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20) UNIQUE NOT NULL,
    account_opening_date DATE NOT NULL,
    card_status VARCHAR(50) DEFAULT 'на виготовленні',
    account_status VARCHAR(50) DEFAULT 'активний',
    has_id_card BOOLEAN DEFAULT false,
    has_tax_card BOOLEAN DEFAULT false,
    has_photo BOOLEAN DEFAULT false,
    has_signature BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Типи статусів
- **Картки**: `на виготовленні`, `на відділенні`, `на організації`, `видана`
- **Рахунки**: `активний`, `заблокований`, `закритий`
- **Документи**: Boolean флаги для кожного типу документу

## 🎯 Ключові особливості UI

### StatusBadge компонент
- **Інтелігентні кольори** залежно від статусу
- **Іконки SVG** для візуального розпізнавання
- **Адаптивні розміри** і стилі
- **Type-safe** з TypeScript enum'ами

### Анімаційна система
```css
/* Slide-in анімації */
@keyframes slideInFromBottom { /* ... */ }
@keyframes slideInFromRight { /* ... */ }

/* Hover ефекти */
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Loading стани */
.loading-shimmer { /* gradient animation */ }
```

### Toast система
- **Автоматичне зникнення** через 5 секунд
- **3 типи**: success, error, info
- **Slide-in анімації** справа
- **Манувальне закриття** з X кнопкою

## 🚦 Готовність до розгортання

### Environment Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://qnwyekjwszibzhdkvmwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Deployment готовність
- ✅ **Vercel** - ready для deployment
- ✅ **Supabase** - база даних налаштована
- ✅ **Environment змінні** - конфігуровані
- ⚠️ **SQL схема** - потребує виконання в Supabase dashboard

## 📱 Responsive дизайн

- **Mobile-first** підхід
- **Breakpoints**: sm, md, lg, xl
- **Flex/Grid layouts** з Tailwind CSS
- **Touch-friendly** інтерфейс для мобільних

## 🔄 Real-time можливості

Готово до реалізації:
- **Supabase subscriptions** для live updates
- **Optimistic updates** в UI
- **Conflict resolution** для concurrent edits

## 🎨 Дизайн система

### Кольорова палітра
- **Primary**: Blue/Indigo градієнти
- **Success**: Green (#10B981)
- **Warning**: Yellow/Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Font family**: System fonts (san-serif)
- **Font weights**: 400, 500, 600, 700
- **Font sizes**: text-xs to text-2xl

### Spacing & Layout
- **Padding/Margin**: 4px increments (p-1 to p-8)
- **Border radius**: rounded-lg, rounded-xl
- **Shadows**: subtle to pronounced

## 🔧 Розробка

### Локальний запуск
```bash
cd /workspaces/card
npm install
npm run dev
```

Додаток доступний на: `http://localhost:3001`

### Production build
```bash
npm run build
npm start
```

## 📋 TODO для production

1. **База даних**:
   - [ ] Виконати SQL з `database-setup.md` в Supabase
   - [ ] Налаштувати Row Level Security policies
   - [ ] Додати індекси для оптимізації

2. **Security**:
   - [ ] Додати аутентифікацію користувачів
   - [ ] Налаштувати CORS policies
   - [ ] Додати rate limiting

3. **Performance**:
   - [ ] Додати caching стратегії
   - [ ] Оптимізувати bundle size
   - [ ] Додати lazy loading для компонентів

4. **Testing**:
   - [ ] Unit тести для компонентів
   - [ ] Integration тести для API
   - [ ] E2E тести для користувацьких сценаріїв

## 📈 Майбутні покращення

- **Графіки та аналітика** з Chart.js
- **Експорт даних** в Excel/PDF
- **Пошук та фільтрація** клієнтів
- **Bulk operations** для групових дій
- **Audit log** для відстеження змін
- **Email notifications** для статусних змін

---

*Створено з ❤️ для ефективного управління банківськими картками*

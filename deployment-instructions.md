# Інструкції для розгортання на Vercel

## Крок 1: Підготовка коду

1. Переконайтесь, що всі файли збережені
2. Створіть GitHub репозиторій та завантажте код:

```bash
git init
git add .
git commit -m "Initial commit: Card management system"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Крок 2: Розгортання на Vercel

### Варіант 1: Через веб-інтерфейс Vercel

1. Перейдіть на [vercel.com](https://vercel.com)
2. Зареєструйтесь або увійдіть в аккаунт
3. Натисніть "New Project"
4. Підключіть ваш GitHub репозиторій
5. Vercel автоматично визначить що це Next.js проект
6. Додайте змінні середовища:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://qnwyekjwszibzhdkvmwt.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud3lla2p3c3ppYnpoZGt2bXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzIwMjEsImV4cCI6MjA2NzgwODAyMX0.FimnHHnwCa0C0zibycb4yUYnqb-fHLd4PC5VaOpb__o`
7. Натисніть "Deploy"

### Варіант 2: Через CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Крок 3: Налаштування Supabase

### SQL команди для створення таблиці

Виконайте наступні команди в SQL Editor вашого Supabase проекту:

```sql
-- Створення таблиці clients
CREATE TABLE IF NOT EXISTS public.clients (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20) NOT NULL UNIQUE,
    account_opening_date DATE NOT NULL,
    account_activation_date DATE,
    card_status VARCHAR(50) NOT NULL DEFAULT 'на виготовленні',
    contract_available BOOLEAN DEFAULT false,
    questionnaire_available BOOLEAN DEFAULT false,
    passport_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Створення індексів
CREATE INDEX IF NOT EXISTS idx_clients_tax_id ON public.clients(tax_id);
CREATE INDEX IF NOT EXISTS idx_clients_card_status ON public.clients(card_status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Створення constraint для card_status
ALTER TABLE public.clients 
ADD CONSTRAINT check_card_status 
CHECK (card_status IN ('на виготовленні', 'на відділенні', 'на організації', 'видана'));

-- Функція для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення updated_at
CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Налаштування RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.clients
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.clients
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.clients
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.clients
    FOR DELETE USING (true);

-- Вставка тестових даних
INSERT INTO public.clients (full_name, tax_id, account_opening_date, account_activation_date, card_status, contract_available, questionnaire_available, passport_available) VALUES
('Іванов Іван Іванович', '1234567890', '2024-01-15', '2024-01-20', 'на виготовленні', true, true, false),
('Петренко Петро Петрович', '0987654321', '2024-02-20', '2024-02-25', 'на відділенні', true, false, true),
('Сидоренко Сидір Сидорович', '1122334455', '2024-03-10', '2024-03-15', 'на організації', false, true, true),
('Коваленко Оксана Олександрівна', '5566778899', '2024-04-05', '2024-04-10', 'видана', true, true, true);
```

## Крок 4: Перевірка роботи

1. Після розгортання, відкрийте ваш домен Vercel
2. Переконайтесь, що додаток завантажується
3. Перевірте, що дані з Supabase відображаються
4. Протестуйте додавання та редагування клієнтів

## Можливі проблеми та рішення

### Проблема з підключенням до Supabase
- Перевірте правильність URL та anon key
- Переконайтесь, що RLS політики налаштовані
- Перевірте в браузері консоль на наявність помилок

### Проблема з розгортанням
- Переконайтесь, що змінні середовища додані в Vercel
- Перевірте логи розгортання в Vercel dashboard

### Проблема з відображенням даних
- Перевірте, що таблиця clients створена в Supabase
- Переконайтесь, що тестові дані вставлені

## Результат

Після успішного розгортання ви матимете повнофункціональний веб-додаток для обліку карт з можливістю:
- Перегляду списку клієнтів
- Додавання нових клієнтів
- Редагування інформації про клієнтів
- Відстеження стану карт

Домен вашого додатку буде у форматі: `https://your-project-name.vercel.app`

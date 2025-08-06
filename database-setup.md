# Налаштування бази даних Supabase

## Додавання поля коментарів (якщо таблиця вже існує)

Якщо у вас вже є таблиця clients без поля comments, виконайте:

```sql
ALTER TABLE clients ADD COLUMN comments TEXT;
```

## SQL команди для створення таблиці clients

Виконайте наступний SQL запит в SQL Editor вашого Supabase проекту:

```sql
-- Створення таблиці clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20) UNIQUE NOT NULL,
    account_opening_date DATE NOT NULL,
    card_status VARCHAR(50) DEFAULT 'на виготовленні' CHECK (card_status IN ('на виготовленні', 'на відділенні', 'на організації', 'видана')),
    account_status VARCHAR(50) DEFAULT 'активний' CHECK (account_status IN ('активний', 'заблокований', 'закритий')),
    has_id_card BOOLEAN DEFAULT false,
    has_tax_card BOOLEAN DEFAULT false,
    has_photo BOOLEAN DEFAULT false,
    has_signature BOOLEAN DEFAULT false,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Вставка тестових даних
INSERT INTO public.clients (full_name, tax_id, account_opening_date, card_status, account_status, has_id_card, has_tax_card, has_photo, has_signature, comments) VALUES
('Іванов Іван Іванович', '1234567890', '2024-01-15', 'на виготовленні', 'активний', true, true, false, true, 'Потрібно зв''язатися з клієнтом'),
('Петренко Петро Петрович', '0987654321', '2024-02-20', 'на відділенні', 'активний', true, false, true, false, 'Все документи в порядку'),
('Сидоренко Сидір Сидорович', '1122334455', '2024-03-10', 'на організації', 'активний', false, true, true, true, 'Потрібна додаткова перевірка'),
('Коваленко Оксана Олександрівна', '5566778899', '2024-04-05', 'видана', 'активний', true, true, true, true, 'Клієнт отримав картку');
```

## Налаштування RLS (Row Level Security)

Для безпеки, також виконайте наступні команди:

```sql
-- Увімкнення RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Політика для читання (дозволити всім)
CREATE POLICY "Enable read access for all users" ON public.clients
    FOR SELECT USING (true);

-- Політика для вставки (дозволити всім)
CREATE POLICY "Enable insert for all users" ON public.clients
    FOR INSERT WITH CHECK (true);

-- Політика для оновлення (дозволити всім)
CREATE POLICY "Enable update for all users" ON public.clients
    FOR UPDATE USING (true);

-- Політика для видалення (дозволити всім)
CREATE POLICY "Enable delete for all users" ON public.clients
    FOR DELETE USING (true);
```

## Перевірка таблиці

Після створення таблиці, ви можете перевірити її командою:

```sql
SELECT * FROM public.clients ORDER BY created_at DESC;
```

-- Повний SQL скрипт для створення таблиці clients
-- Скопіюйте цей код і виконайте в Supabase SQL Editor

-- Крок 1: Створення таблиці
CREATE TABLE public.clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20) UNIQUE NOT NULL,
    account_opening_date DATE NOT NULL,
    account_activation_date DATE,
    card_status VARCHAR(50) DEFAULT 'на виготовленні' CHECK (card_status IN ('на виготовленні', 'на відділенні', 'на організації', 'видана')),
    account_status VARCHAR(50) DEFAULT 'очікує активації' CHECK (account_status IN ('очікує активації', 'активний', 'заблокований', 'закритий')),
    has_id_card BOOLEAN DEFAULT false,
    has_tax_card BOOLEAN DEFAULT false,
    has_photo BOOLEAN DEFAULT false,
    has_signature BOOLEAN DEFAULT false,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Крок 2: Створення індексів
CREATE INDEX IF NOT EXISTS idx_clients_tax_id ON public.clients(tax_id);
CREATE INDEX IF NOT EXISTS idx_clients_card_status ON public.clients(card_status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Крок 3: Налаштування RLS (Row Level Security)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Функція для автоматичного оновлення статусу рахунку
CREATE OR REPLACE FUNCTION update_account_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Автоматично визначаємо статус рахунку на основі дати активації
    IF NEW.account_activation_date IS NULL THEN
        NEW.account_status = 'очікує активації';
    ELSIF NEW.account_status = 'очікує активації' THEN
        NEW.account_status = 'активний';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Тригер для автоматичного оновлення статусу рахунку
CREATE TRIGGER trigger_update_account_status
    BEFORE INSERT OR UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_account_status();

-- Політики безпеки (дозволити всі операції всім користувачам)
CREATE POLICY "Enable read access for all users" ON public.clients
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.clients
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.clients
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.clients
    FOR DELETE USING (true);

-- Крок 4: Вставка тестових даних
INSERT INTO public.clients (full_name, tax_id, account_opening_date, account_activation_date, card_status, account_status, has_id_card, has_tax_card, has_photo, has_signature, comments) VALUES
('Іванов Іван Іванович', '1234567890', '2024-01-15', '2024-01-20', 'на виготовленні', 'активний', true, true, false, true, 'Потрібно зв''язатися з клієнтом'),
('Петренко Петро Петрович', '0987654321', '2024-02-20', '2024-02-25', 'на відділенні', 'активний', true, false, true, false, 'Все документи в порядку'),
('Сидоренко Сидір Сидорович', '1122334455', '2024-03-10', NULL, 'на організації', 'очікує активації', false, true, true, true, 'Потрібна додаткова перевірка'),
('Коваленко Оксана Олександрівна', '5566778899', '2024-04-05', '2024-04-10', 'видана', 'активний', true, true, true, true, 'Клієнт отримав картку');

-- Крок 5: Перевірка створеної таблиці
SELECT * FROM public.clients ORDER BY created_at DESC;

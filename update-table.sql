-- SQL команди для оновлення існуючої таблиці
-- Виконайте ці команди в Supabase SQL Editor, якщо таблиця вже існує

-- Крок 1: Додати поле дати активації
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS account_activation_date DATE;

-- Крок 2: Оновити можливі значення статусу рахунку
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_account_status_check;
ALTER TABLE public.clients ADD CONSTRAINT clients_account_status_check 
CHECK (account_status IN ('очікує активації', 'активний', 'заблокований', 'закритий'));

-- Крок 3: Оновити статус за замовчуванням
ALTER TABLE public.clients ALTER COLUMN account_status SET DEFAULT 'очікує активації';

-- Крок 4: Функція для автоматичного оновлення статусу рахунку
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

-- Крок 5: Створити тригер
DROP TRIGGER IF EXISTS trigger_update_account_status ON public.clients;
CREATE TRIGGER trigger_update_account_status
    BEFORE INSERT OR UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_account_status();

-- Крок 6: Оновити існуючі записи (встановити статус згідно з логікою)
UPDATE public.clients 
SET account_status = CASE 
    WHEN account_activation_date IS NULL THEN 'очікує активації'
    ELSE 'активний'
END
WHERE account_status NOT IN ('заблокований', 'закритий');

-- Перевірка результату
SELECT id, full_name, account_opening_date, account_activation_date, account_status 
FROM public.clients 
ORDER BY created_at DESC;

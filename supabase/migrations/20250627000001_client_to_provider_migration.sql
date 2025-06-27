
-- ZURBO: SQL UPGRADE SCRIPT
-- Migrate Client to Provider while preserving user data

-- 1. Add user_type column if not exists (using tipo field that already exists)
-- The users table already has a 'tipo' field, so we'll work with that

-- 2. Create table for provider additional data if not already exists
CREATE TABLE IF NOT EXISTS provider_details (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  service_categories TEXT[],
  service_area TEXT[],
  gallery TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable RLS on provider_details
ALTER TABLE provider_details ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for provider_details
CREATE POLICY "Users can read their own provider details"
ON provider_details FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own provider details"
ON provider_details FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own provider details"
ON provider_details FOR INSERT
WITH CHECK (auth.uid() = id);

-- 5. Function to migrate user from client to provider
CREATE OR REPLACE FUNCTION migrate_client_to_provider(
  user_uuid UUID,
  description TEXT DEFAULT '',
  service_categories TEXT[] DEFAULT '{}',
  service_area TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  -- Change user type from cliente to prestador
  UPDATE users 
  SET tipo = 'prestador', updated_at = now()
  WHERE id = user_uuid AND tipo = 'cliente';

  -- Create provider profile details
  INSERT INTO provider_details(id, description, service_categories, service_area, gallery)
  VALUES (user_uuid, description, service_categories, service_area, gallery)
  ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    service_categories = EXCLUDED.service_categories,
    service_area = EXCLUDED.service_area,
    gallery = EXCLUDED.gallery,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check if user can migrate
CREATE OR REPLACE FUNCTION can_migrate_to_provider(user_uuid UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_uuid AND tipo = 'cliente'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

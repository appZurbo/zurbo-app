
-- Add admin and moderator roles to the tipo enum
-- First, let's see what constraint exists
DO $$
BEGIN
    -- Add new values to the tipo column constraint
    IF EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name LIKE '%users_tipo_check%'
    ) THEN
        -- Drop the existing check constraint
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tipo_check;
    END IF;
    
    -- Add new check constraint with admin and moderator
    ALTER TABLE users ADD CONSTRAINT users_tipo_check 
    CHECK (tipo IN ('cliente', 'prestador', 'admin', 'moderator'));
END $$;

-- Update the handle_new_user function to support admin creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, nome, tipo)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'cliente')
  );
  RETURN NEW;
END;
$$;

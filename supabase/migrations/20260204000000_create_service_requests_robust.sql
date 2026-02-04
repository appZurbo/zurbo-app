-- Create service_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    category_id TEXT NOT NULL,
    description TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    photos TEXT[] DEFAULT '{}'::text[],
    location_lat FLOAT NOT NULL,
    location_lng FLOAT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (safe to run multiple times)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Clients can view their own requests" ON service_requests;
DROP POLICY IF EXISTS "Clients can insert their own requests" ON service_requests;
DROP POLICY IF EXISTS "Clients can update their own requests" ON service_requests;
DROP POLICY IF EXISTS "Everyone can view open requests" ON service_requests;

-- Create Policies
CREATE POLICY "Clients can view their own requests" 
    ON service_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clients can insert their own requests" 
    ON service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can update their own requests" 
    ON service_requests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view open requests" 
    ON service_requests FOR SELECT USING (status = 'open');

-- Create indexes (IF NOT EXISTS is supported in newer Postgres, otherwise we can wrap or just let it fail silently if manual)
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_user_id ON service_requests(user_id);

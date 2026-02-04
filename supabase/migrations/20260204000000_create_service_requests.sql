-- Create service_requests table
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

-- Enable RLS
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Policies

-- Clients can view their own requests
CREATE POLICY "Clients can view their own requests" 
    ON service_requests FOR SELECT 
    USING (auth.uid() = user_id);

-- Clients can insert their own requests
CREATE POLICY "Clients can insert their own requests" 
    ON service_requests FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Clients can update their own requests (e.g. cancel)
CREATE POLICY "Clients can update their own requests" 
    ON service_requests FOR UPDATE 
    USING (auth.uid() = user_id);

-- Providers (or anyone authenticated for now, simpler for MVP) can view 'open' requests
-- ideally we check for a 'provider' role, but let's be permissive strictly for 'open' requests
CREATE POLICY "Everyone can view open requests" 
    ON service_requests FOR SELECT 
    USING (status = 'open');

-- Create index for location/status queries if needed later
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_user_id ON service_requests(user_id);

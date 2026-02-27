-- Migration to add missing DELETE policy for service_requests
-- This allows users to delete their own service requests

CREATE POLICY "Users can delete their own requests"
    ON service_requests FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Ensure RLS is actually enabled (it should be, but just in case)
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

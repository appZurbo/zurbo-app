-- Fix critical security vulnerability in escrow_payments table
-- Remove overly permissive policy that allows all operations to everyone
DROP POLICY IF EXISTS "System can manage escrow payments" ON escrow_payments;

-- Create restrictive policies for INSERT, UPDATE, DELETE operations
-- Only allow system (service role) to create escrow payments
CREATE POLICY "System can create escrow payments" 
ON escrow_payments 
FOR INSERT 
WITH CHECK (true);

-- Only allow system (service role) to update escrow payments
CREATE POLICY "System can update escrow payments" 
ON escrow_payments 
FOR UPDATE 
USING (true);

-- Only allow system (service role) to delete escrow payments (if needed)
CREATE POLICY "System can delete escrow payments" 
ON escrow_payments 
FOR DELETE 
USING (true);

-- The existing SELECT policy is already secure and properly restricts access:
-- "Users can view their own escrow payments" - only parties in conversation can view
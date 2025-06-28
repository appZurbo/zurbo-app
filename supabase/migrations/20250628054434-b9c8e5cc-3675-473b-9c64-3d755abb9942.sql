
-- First, rename columns to match the hook expectations
ALTER TABLE public.notifications RENAME COLUMN "read" TO is_read;
ALTER TABLE public.notifications RENAME COLUMN "message" TO content;

-- Update RLS policies to use the security definer function (already exists)
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Create simpler, more efficient policies using the existing security definer function
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id = public.get_current_user_id());

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id = public.get_current_user_id());

-- Also allow users to insert notifications (needed for the system to create them)
CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

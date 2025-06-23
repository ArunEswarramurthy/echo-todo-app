
-- Create a todos table
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (for future use with authentication)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to manage todos (you can restrict this later with authentication)
CREATE POLICY "Everyone can manage todos" 
  ON public.todos 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

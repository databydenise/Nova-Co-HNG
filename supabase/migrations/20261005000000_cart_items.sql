-- CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- A user can only have one cart row for each product
  UNIQUE (user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view only their own cart
CREATE POLICY "Users can view their own cart"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add items only to their own cart
CREATE POLICY "Users can insert into their own cart"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own cart
CREATE POLICY "Users can update their own cart"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own cart
CREATE POLICY "Users can delete from their own cart"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id);
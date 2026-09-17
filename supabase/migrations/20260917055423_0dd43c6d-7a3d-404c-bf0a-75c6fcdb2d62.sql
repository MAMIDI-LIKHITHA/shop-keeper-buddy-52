CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO anon, authenticated;

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 2000),
  price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  category TEXT NOT NULL DEFAULT 'General' CHECK (char_length(category) BETWEEN 1 AND 80),
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Administrators can add products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can edit products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.business_settings (
  id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  business_name TEXT NOT NULL DEFAULT 'Your Business' CHECK (char_length(business_name) BETWEEN 1 AND 160),
  logo_url TEXT,
  whatsapp_number TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  instagram_url TEXT NOT NULL DEFAULT '',
  business_description TEXT NOT NULL DEFAULT '',
  service_areas TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.business_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view business settings"
  ON public.business_settings FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Administrators can manage business settings"
  ON public.business_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON public.business_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.business_settings (id, business_name, business_description, service_areas)
VALUES ('default', 'Your Business', 'Add your business description from Admin Settings.', 'Qatar / Dubai');

INSERT INTO public.products (name, description, price, category, image_url, available, featured, sort_order)
VALUES
  ('Product One', 'A placeholder product ready for your real catalog details.', 25.00, 'Collection A', '/images/product-placeholder.svg', true, true, 1),
  ('Product Two', 'A placeholder product ready for your real catalog details.', 35.00, 'Collection A', '/images/product-placeholder.svg', true, false, 2),
  ('Product Three', 'A placeholder product ready for your real catalog details.', 45.00, 'Collection B', '/images/product-placeholder.svg', true, true, 3),
  ('Product Four', 'A placeholder product ready for your real catalog details.', 55.00, 'Collection B', '/images/product-placeholder.svg', false, false, 4),
  ('Product Five', 'A placeholder product ready for your real catalog details.', 65.00, 'Collection C', '/images/product-placeholder.svg', true, false, 5),
  ('Product Six', 'A placeholder product ready for your real catalog details.', 75.00, 'Collection C', '/images/product-placeholder.svg', true, true, 6);

CREATE POLICY "Administrators can view product image files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can upload product image files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can update product image files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators can delete product image files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
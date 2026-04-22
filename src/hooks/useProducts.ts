import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { products as staticProducts, type Product } from '@/data/products';

type DbProduct = {
  id: number;
  name: string;
  description: string;
  sale_price: number | null;
  regular_price: number;
  category: string;
  image: string;
  external_url: string;
  button_text: string;
};

const mapDb = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  description: p.description,
  salePrice: p.sale_price,
  regularPrice: Number(p.regular_price),
  category: p.category,
  image: p.image,
  externalUrl: p.external_url,
  buttonText: p.button_text,
});

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      if (mounted && !error && data && data.length > 0) {
        setProducts((data as DbProduct[]).map(mapDb));
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}

export type { Product };

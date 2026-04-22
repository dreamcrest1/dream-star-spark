import { useEffect, useState } from 'react';
import { getBrandLogo, PRODUCT_PLACEHOLDER } from '@/lib/brandLogo';
import { brandLogoFromRules, loadBrandRules, BrandRule } from '@/hooks/useBrandRules';

interface ProductImageProps {
  src: string | null | undefined;
  name: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Renders a product image with two layers of fallback:
 * 1. If the original image URL fails, switch to the brand logo (from DB rules,
 *    or the static rules if DB rules haven't loaded yet).
 * 2. If the brand logo also fails, switch to the local placeholder.
 *
 * Brand-logo fallbacks render with `object-contain` so logos are not cropped.
 */
const ProductImage = ({ src, name, className = '', loading = 'lazy' }: ProductImageProps) => {
  const [rules, setRules] = useState<BrandRule[] | null>(null);

  useEffect(() => {
    loadBrandRules().then(setRules);
  }, []);

  const brandUrl = rules ? brandLogoFromRules(name, rules) : getBrandLogo(name);
  const initial = src && src.trim() !== '' ? src : brandUrl;
  const [current, setCurrent] = useState<string>(initial);
  const [isFallback, setIsFallback] = useState<boolean>(!src || src.trim() === '');

  useEffect(() => {
    const next = src && src.trim() !== '' ? src : brandUrl;
    setCurrent(next);
    setIsFallback(!src || src.trim() === '');
  }, [src, name, brandUrl]);

  const handleError = () => {
    if (current !== brandUrl && brandUrl !== PRODUCT_PLACEHOLDER) {
      setCurrent(brandUrl);
      setIsFallback(true);
      return;
    }
    if (current !== PRODUCT_PLACEHOLDER) {
      setCurrent(PRODUCT_PLACEHOLDER);
      setIsFallback(true);
    }
  };

  const fitClass = isFallback ? 'object-contain p-6 bg-deep-purple/40' : 'object-cover';

  return (
    <img
      src={current}
      alt={name}
      loading={loading}
      onError={handleError}
      className={`${className} ${fitClass}`}
    />
  );
};

export default ProductImage;

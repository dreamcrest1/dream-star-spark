import { useEffect, useState } from 'react';
import { getBrandLogo, PRODUCT_PLACEHOLDER } from '@/lib/brandLogo';

interface ProductImageProps {
  src: string | null | undefined;
  name: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Renders a product image with two layers of fallback:
 * 1. If the original image URL fails, switch to the brand logo.
 * 2. If the brand logo also fails, switch to the local placeholder.
 *
 * Brand-logo fallbacks render with `object-contain` so logos are not cropped.
 */
const ProductImage = ({ src, name, className = '', loading = 'lazy' }: ProductImageProps) => {
  const initial = src && src.trim() !== '' ? src : getBrandLogo(name);
  const [current, setCurrent] = useState<string>(initial);
  const [isFallback, setIsFallback] = useState<boolean>(!src || src.trim() === '');

  useEffect(() => {
    const next = src && src.trim() !== '' ? src : getBrandLogo(name);
    setCurrent(next);
    setIsFallback(!src || src.trim() === '');
  }, [src, name]);

  const handleError = () => {
    if (current !== getBrandLogo(name) && getBrandLogo(name) !== PRODUCT_PLACEHOLDER) {
      setCurrent(getBrandLogo(name));
      setIsFallback(true);
      return;
    }
    if (current !== PRODUCT_PLACEHOLDER) {
      setCurrent(PRODUCT_PLACEHOLDER);
      setIsFallback(true);
    }
  };

  // Use object-contain + padding for logos so they aren't cropped.
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

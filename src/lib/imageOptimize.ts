import imageCompression from 'browser-image-compression';

/**
 * Compress an image and convert to WebP for the main file,
 * plus produce a small WebP thumbnail.
 *
 * Returns the original-replacement WebP File and a thumb File.
 */
export async function optimizeImage(file: File): Promise<{ main: File; thumb: File }> {
  // Skip GIFs/SVGs — compression libs strip animation / vector data
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return { main: file, thumb: file };
  }

  const baseName = file.name.replace(/\.[^.]+$/, '');

  const main = await imageCompression(file, {
    maxSizeMB: 1.2,
    maxWidthOrHeight: 1920,
    fileType: 'image/webp',
    initialQuality: 0.82,
    useWebWorker: true,
  });

  const thumb = await imageCompression(file, {
    maxSizeMB: 0.08,
    maxWidthOrHeight: 320,
    fileType: 'image/webp',
    initialQuality: 0.7,
    useWebWorker: true,
  });

  return {
    main: new File([main], `${baseName}.webp`, { type: 'image/webp' }),
    thumb: new File([thumb], `${baseName}-thumb.webp`, { type: 'image/webp' }),
  };
}

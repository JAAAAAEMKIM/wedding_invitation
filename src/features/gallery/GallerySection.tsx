import { Link } from 'react-router-dom';

// Image paths helper
function getImagePaths(index: number) {
  const name = `photo_${index}`;
  return {
    webp: `/assets/gallery-optimized/thumb/${name}.webp`,
    jpg: `/assets/gallery-optimized/thumb/${name}.jpg`,
  };
}

interface GallerySectionProps {
  imageIndices: number[];
  title?: string;
  previewCount?: number;
  totalCount?: number;
}

export function GallerySection({
  imageIndices,
  title = 'GALLERY',
  previewCount = 6,
  totalCount = 12,
}: GallerySectionProps) {
  const previewIndices = imageIndices.slice(0, previewCount);

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-neutral-800">
      <div className="max-w-md mx-auto">
        {/* Title with Link */}
        <Link
          to="/gallery"
          className="block text-center mb-8 group"
        >
          <h2 className="text-sm tracking-[0.3em] text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Preview Grid */}
        <Link to="/gallery" className="block">
          <div className="grid grid-cols-3 gap-1">
            {previewIndices.map((imageIndex) => {
              const paths = getImagePaths(imageIndex);
              return (
                <div
                  key={imageIndex}
                  className="aspect-square overflow-hidden"
                >
                  <picture>
                    <source srcSet={paths.webp} type="image/webp" />
                    <img
                      src={paths.jpg}
                      alt={`Gallery ${imageIndex}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </picture>
                </div>
              );
            })}
          </div>
        </Link>

        {/* View All Button */}
        <Link
          to="/gallery"
          className="mt-6 block w-full py-3 text-center text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          사진 모두 보기 ({totalCount})
        </Link>
      </div>
    </section>
  );
}

export default GallerySection;

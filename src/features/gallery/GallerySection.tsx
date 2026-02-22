import { Link } from 'react-router-dom';

// Image paths helper
function getImagePaths(index: number) {
  const name = `photo-${index}`;
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
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Title with Link */}
        <Link
          to="/gallery"
          className="block text-center mb-8 group"
        >
          <h2 className="text-sm tracking-[0.3em] text-gray-500 group-hover:text-gray-700 transition-colors inline-flex items-center gap-2">
            {title}
            <svg
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
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
          className="mt-6 block w-full py-3 text-center text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          사진 모두 보기 ({totalCount})
        </Link>
      </div>
    </section>
  );
}

export default GallerySection;

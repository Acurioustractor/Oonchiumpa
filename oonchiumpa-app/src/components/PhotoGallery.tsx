import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Photo {
  id: string;
  src: string;
  title?: string;
  description?: string;
  alt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
  showTitles?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  columns = 3,
  showTitles = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const lightboxSlides = photos.map(photo => ({
    src: photo.src,
    alt: photo.alt || photo.title || '',
    title: photo.title,
    description: photo.description
  }));

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className={`grid grid-cols-1 ${columnClasses[columns]} gap-6`}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <img
                src={photo.src}
                alt={photo.alt || photo.title || ''}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
            {showTitles && photo.title && (
              <div className="mt-3">
                <h3 className="text-earth-900 font-medium text-lg mb-1">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-earth-600 text-sm leading-relaxed">
                    {photo.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  );
};

interface MasonryGalleryProps {
  photos: Photo[];
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({ photos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const lightboxSlides = photos.map(photo => ({
    src: photo.src,
    alt: photo.alt || photo.title || '',
    title: photo.title,
    description: photo.description
  }));

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-6 group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
              <img
                src={photo.src}
                alt={photo.alt || photo.title || ''}
                className="w-full transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={lightboxSlides}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      />
    </>
  );
};
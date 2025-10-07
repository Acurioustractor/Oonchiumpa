import React, { useState } from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  poster?: string;
  controls?: boolean;
  autoplay?: boolean;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  controls = true,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}${!controls ? '?controls=0' : ''}`;
    }

    // Handle Vimeo URLs - extract video ID and convert to embed format
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Handle Descript URLs - convert share URLs to embed
    if (url.includes('share.descript.com')) {
      return url.replace('/view/', '/embed/');
    }

    // Return as-is for other embed URLs
    return url;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 pointer-events-none"
        />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
        )}
        {/* Expand icon */}
        <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setIsModalOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

interface VideoGridProps {
  videos: Array<{
    id: string;
    url: string;
    title: string;
    thumbnail?: string;
    description?: string;
  }>;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="space-y-4">
          <VideoPlayer
            url={video.url}
            title={video.title}
            poster={video.thumbnail}
            className="aspect-video"
          />
          {video.description && (
            <p className="text-earth-600 text-sm leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
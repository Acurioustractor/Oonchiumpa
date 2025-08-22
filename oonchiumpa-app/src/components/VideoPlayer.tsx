import React from 'react';

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
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}${!controls ? '?controls=0' : ''}` : url;

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0"
      />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}
    </div>
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
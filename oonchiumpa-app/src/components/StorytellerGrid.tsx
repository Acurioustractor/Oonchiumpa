/**
 * Storyteller Grid Component
 * Display Oonchiumpa storytellers with profile images
 */

import React from 'react';
import { useDiverseStorytellers } from '../hooks/useOonchiumpaContent';
import { OonchiumpaProfile } from '../services/oonchiumpaData';

interface StorytellerGridProps {
  limit?: number;
  title?: string;
  showBio?: boolean;
}

export function StorytellerGrid({ limit = 6, title = "Our Storytellers", showBio = true }: StorytellerGridProps) {
  const { storytellers, loading, error } = useDiverseStorytellers(limit);

  if (loading) {
    return (
      <div className="storyteller-grid loading">
        <div className="loading-spinner">Loading storytellers...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading storytellers:', error);
    return null;
  }

  if (!storytellers || storytellers.length === 0) {
    return null;
  }

  return (
    <section className="storyteller-grid">
      <h2 className="storyteller-grid__title">{title}</h2>

      <div className="storyteller-grid__container">
        {storytellers.map((storyteller) => (
          <StorytellerCard
            key={storyteller.id}
            storyteller={storyteller}
            showBio={showBio}
          />
        ))}
      </div>

      <style jsx>{`
        .storyteller-grid {
          padding: 3rem 0;
        }

        .storyteller-grid__title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
          color: #2c3e50;
        }

        .storyteller-grid__container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin: 0 auto;
          max-width: 1200px;
        }

        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .storyteller-grid__container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

interface StorytellerCardProps {
  storyteller: OonchiumpaProfile;
  showBio?: boolean;
}

function StorytellerCard({ storyteller, showBio }: StorytellerCardProps) {
  const displayName = storyteller.display_name || storyteller.full_name;
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="storyteller-card">
      <div className="storyteller-card__image-container">
        {storyteller.profile_image_url ? (
          <img
            src={storyteller.profile_image_url}
            alt={displayName}
            className="storyteller-card__image"
            loading="lazy"
          />
        ) : (
          <div className="storyteller-card__placeholder">
            {initials}
          </div>
        )}

        {storyteller.is_elder && (
          <span className="storyteller-card__badge">Elder</span>
        )}
      </div>

      <div className="storyteller-card__content">
        <h3 className="storyteller-card__name">{displayName}</h3>

        {storyteller.cultural_background && (
          <p className="storyteller-card__cultural">
            {storyteller.cultural_background}
          </p>
        )}

        {showBio && storyteller.bio && (
          <p className="storyteller-card__bio">
            {storyteller.bio.length > 150
              ? storyteller.bio.substring(0, 150) + '...'
              : storyteller.bio}
          </p>
        )}

        {storyteller.geographic_connections && storyteller.geographic_connections.length > 0 && (
          <div className="storyteller-card__locations">
            {storyteller.geographic_connections.slice(0, 2).map((location, i) => (
              <span key={i} className="location-tag">{location}</span>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .storyteller-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .storyteller-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .storyteller-card__image-container {
          position: relative;
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          background: linear-gradient(135deg, #f0e6d6 0%, #d4a574 100%);
          overflow: hidden;
        }

        .storyteller-card__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .storyteller-card__placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 700;
          color: #8B4513;
        }

        .storyteller-card__badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(139, 69, 19, 0.9);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .storyteller-card__content {
          padding: 1.5rem;
        }

        .storyteller-card__name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .storyteller-card__cultural {
          font-size: 0.9rem;
          color: #8B4513;
          font-weight: 500;
          margin: 0 0 0.75rem 0;
        }

        .storyteller-card__bio {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #555;
          margin: 0 0 1rem 0;
        }

        .storyteller-card__locations {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .location-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: #f0e6d6;
          color: #8B4513;
          border-radius: 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

export default StorytellerGrid;

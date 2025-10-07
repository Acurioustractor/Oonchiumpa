/**
 * Quote Showcase Component
 * Display impactful quotes from transcripts with storyteller attribution
 */

import React from 'react';
import { useQuotesByImpactArea } from '../hooks/useOonchiumpaContent';

interface QuoteShowcaseProps {
  impactArea: string;
  title?: string;
  limit?: number;
}

export function QuoteShowcase({ impactArea, title, limit = 5 }: QuoteShowcaseProps) {
  const { quotes, loading, error } = useQuotesByImpactArea(impactArea);

  if (loading) {
    return (
      <div className="quote-showcase loading">
        <div className="loading-spinner">Loading quotes...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading quotes:', error);
    return null;
  }

  if (!quotes || quotes.length === 0) {
    return null;
  }

  const displayQuotes = quotes.slice(0, limit);

  return (
    <section className="quote-showcase">
      {title && <h2 className="quote-showcase__title">{title}</h2>}

      <div className="quote-showcase__grid">
        {displayQuotes.map((item, index) => (
          <blockquote key={index} className="quote-card">
            <div className="quote-card__content">
              <p className="quote-card__text">"{item.quote}"</p>
            </div>

            <footer className="quote-card__footer">
              <cite className="quote-card__author">
                — {item.storyteller?.display_name || item.storyteller?.full_name || 'Community Member'}
              </cite>

              {item.themes && item.themes.length > 0 && (
                <div className="quote-card__themes">
                  {item.themes.slice(0, 2).map((theme: string, i: number) => (
                    <span key={i} className="theme-tag">{theme}</span>
                  ))}
                </div>
              )}
            </footer>
          </blockquote>
        ))}
      </div>

      <style jsx>{`
        .quote-showcase {
          padding: 3rem 0;
        }

        .quote-showcase__title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
          color: #2c3e50;
        }

        .quote-showcase__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 0 auto;
          max-width: 1200px;
        }

        .quote-card {
          background: #fff;
          border-left: 4px solid #d4a574;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 0;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .quote-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .quote-card__content {
          margin-bottom: 1rem;
        }

        .quote-card__text {
          font-size: 1.1rem;
          line-height: 1.6;
          font-style: italic;
          color: #34495e;
          margin: 0;
        }

        .quote-card__footer {
          border-top: 1px solid #ecf0f1;
          padding-top: 0.75rem;
        }

        .quote-card__author {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #7f8c8d;
          font-style: normal;
          margin-bottom: 0.5rem;
        }

        .quote-card__themes {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .theme-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: #f0e6d6;
          color: #8B4513;
          border-radius: 12px;
          font-weight: 500;
        }

        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .quote-showcase__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default QuoteShowcase;

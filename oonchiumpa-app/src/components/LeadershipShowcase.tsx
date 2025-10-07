/**
 * Leadership Showcase Component
 * Feature Kristy Bloomfield and Tanya Turner with their photos, bios, and quotes
 */

import React from 'react';
import { oonchiumpaData, CORE_TEAM_IDS } from '../services/oonchiumpaData';

interface LeadershipShowcaseProps {
  showQuotes?: boolean;
  quotesPerPerson?: number;
}

export function LeadershipShowcase({ showQuotes = true, quotesPerPerson = 2 }: LeadershipShowcaseProps) {
  const [leaders, setLeaders] = React.useState<any[]>([]);
  const [quotes, setQuotes] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadLeadership() {
      try {
        // Get Kristy and Tanya profiles
        const leadership = await oonchiumpaData.getCoreLeadership();

        // Get their content with quotes
        const leadershipWithQuotes = await Promise.all(
          leadership.map(async (leader) => {
            const content = await oonchiumpaData.getStorytellerWithContent(leader.id);
            return {
              ...leader,
              stories: content.stories,
              transcripts: content.transcripts,
            };
          })
        );

        setLeaders(leadershipWithQuotes);

        // Extract quotes
        if (showQuotes) {
          const quoteData: any = {};
          for (const leader of leadershipWithQuotes) {
            const leaderQuotes = leader.transcripts
              .flatMap((t: any) => t.key_quotes || [])
              .slice(0, quotesPerPerson);
            quoteData[leader.id] = leaderQuotes;
          }
          setQuotes(quoteData);
        }
      } catch (error) {
        console.error('Error loading leadership:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeadership();
  }, [showQuotes, quotesPerPerson]);

  if (loading) {
    return (
      <div className="leadership-showcase loading">
        <div className="loading-spinner">Loading leadership...</div>
      </div>
    );
  }

  if (leaders.length === 0) {
    return null;
  }

  return (
    <section className="leadership-showcase">
      <div className="leadership-showcase__header">
        <h2 className="leadership-showcase__title">Our Leadership</h2>
        <p className="leadership-showcase__subtitle">
          Guided by vision, driven by community
        </p>
      </div>

      <div className="leadership-showcase__grid">
        {leaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            quotes={quotes[leader.id] || []}
            showQuotes={showQuotes}
          />
        ))}
      </div>

      <style jsx>{`
        .leadership-showcase {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f0e6d6 0%, #ffffff 100%);
        }

        .leadership-showcase__header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .leadership-showcase__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .leadership-showcase__subtitle {
          font-size: 1.2rem;
          color: #8B4513;
          font-style: italic;
        }

        .leadership-showcase__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .loading-spinner {
          text-align: center;
          padding: 3rem;
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .leadership-showcase__grid {
            grid-template-columns: 1fr;
          }

          .leadership-showcase__title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}

interface LeaderCardProps {
  leader: any;
  quotes: string[];
  showQuotes: boolean;
}

function LeaderCard({ leader, quotes, showQuotes }: LeaderCardProps) {
  const displayName = leader.display_name || leader.full_name;
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Determine role based on ID
  const isKristy = leader.id === CORE_TEAM_IDS.kristy_bloomfield;
  const role = isKristy ? 'Chairperson, Oonchiumpa' : 'Legal Advocate & Community Leader';

  return (
    <div className="leader-card">
      <div className="leader-card__image-section">
        {leader.profile_image_url ? (
          <img
            src={leader.profile_image_url}
            alt={displayName}
            className="leader-card__image"
            loading="lazy"
          />
        ) : (
          <div className="leader-card__image-placeholder">
            {initials}
          </div>
        )}
      </div>

      <div className="leader-card__content">
        <div className="leader-card__header">
          <h3 className="leader-card__name">{displayName}</h3>
          <p className="leader-card__role">{role}</p>
        </div>

        {leader.bio && (
          <div className="leader-card__bio">
            <p>{leader.bio.substring(0, 250)}...</p>
          </div>
        )}

        {showQuotes && quotes.length > 0 && (
          <div className="leader-card__quotes">
            <h4 className="leader-card__quotes-title">Key Insights</h4>
            {quotes.map((quote: string, index: number) => {
              // Clean up any JSON formatting artifacts
              let cleanQuote = quote;
              try {
                const parsed = JSON.parse(quote);
                cleanQuote = parsed.quote || quote;
              } catch {
                // Not JSON, use as is
              }

              return (
                <blockquote key={index} className="leader-card__quote">
                  <p>"{cleanQuote}"</p>
                </blockquote>
              );
            })}
          </div>
        )}

        {leader.stories && leader.stories.length > 0 && (
          <div className="leader-card__meta">
            <span className="leader-card__stories-count">
              {leader.stories.length} Published {leader.stories.length === 1 ? 'Story' : 'Stories'}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .leader-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .leader-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .leader-card__image-section {
          position: relative;
          width: 100%;
          padding-top: 60%; /* 5:3 Aspect Ratio */
          background: linear-gradient(135deg, #f0e6d6 0%, #d4a574 100%);
          overflow: hidden;
        }

        .leader-card__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .leader-card__image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: 700;
          color: #8B4513;
        }

        .leader-card__content {
          padding: 2rem;
        }

        .leader-card__header {
          margin-bottom: 1.5rem;
          border-bottom: 3px solid #d4a574;
          padding-bottom: 1rem;
        }

        .leader-card__name {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .leader-card__role {
          font-size: 1rem;
          color: #8B4513;
          font-weight: 600;
          margin: 0;
        }

        .leader-card__bio {
          margin-bottom: 1.5rem;
        }

        .leader-card__bio p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0;
        }

        .leader-card__quotes {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #fafafa;
          border-left: 4px solid #d4a574;
          border-radius: 4px;
        }

        .leader-card__quotes-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #8B4513;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 1rem 0;
        }

        .leader-card__quote {
          margin: 0 0 1rem 0;
          padding: 0;
          border: none;
        }

        .leader-card__quote:last-child {
          margin-bottom: 0;
        }

        .leader-card__quote p {
          font-size: 0.95rem;
          line-height: 1.6;
          font-style: italic;
          color: #34495e;
          margin: 0;
        }

        .leader-card__meta {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #ecf0f1;
        }

        .leader-card__stories-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: #7f8c8d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}

export default LeadershipShowcase;

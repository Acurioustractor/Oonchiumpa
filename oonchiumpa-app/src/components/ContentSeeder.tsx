import React, { useState } from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import { seedPlatformContent } from "../data/seedContent";

export const ContentSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleSeedContent = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const seedResult = await seedPlatformContent();
      setResult(seedResult);
    } catch (error) {
      setResult({
        success: false,
        error: error.message || "Failed to seed content",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardBody className="p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-earth-900 mb-4">
            Platform Content Seeding
          </h2>
          <p className="text-earth-700 mb-6 max-w-2xl mx-auto">
            Populate the platform with sample stories and blog posts that
            represent authentic Oonchiumpa work, values, and community
            experiences.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-ochre-50 border border-ochre-200 rounded-lg p-4">
              <h3 className="font-semibold text-ochre-800 mb-2">
                📚 Community Stories
              </h3>
              <ul className="text-sm text-ochre-700 space-y-1">
                <li>• Kristy's leadership journey</li>
                <li>• Tanya's legal advocacy</li>
                <li>• Youth transformation stories</li>
                <li>• Community healing narratives</li>
              </ul>
            </div>
            <div className="bg-eucalyptus-50 border border-eucalyptus-200 rounded-lg p-4">
              <h3 className="font-semibold text-eucalyptus-800 mb-2">
                📝 Blog Posts
              </h3>
              <ul className="text-sm text-eucalyptus-700 space-y-1">
                <li>• Program impact analysis</li>
                <li>• Traditional knowledge systems</li>
                <li>• Evaluation methodologies</li>
                <li>• Cultural insights</li>
              </ul>
            </div>
            <div className="bg-earth-50 border border-earth-200 rounded-lg p-4">
              <h3 className="font-semibold text-earth-800 mb-2">
                🛡️ Cultural Safety
              </h3>
              <ul className="text-sm text-earth-700 space-y-1">
                <li>• Elder-reviewed content</li>
                <li>• Appropriate privacy levels</li>
                <li>• Cultural protocols respected</li>
                <li>• Community consent obtained</li>
              </ul>
            </div>
          </div>

          {!result && (
            <Button
              variant="primary"
              onClick={handleSeedContent}
              disabled={isSeeding}
              className="px-8 py-3"
            >
              {isSeeding ? (
                <div className="flex items-center space-x-2">
                  <Loading size="sm" />
                  <span>Seeding Platform Content...</span>
                </div>
              ) : (
                "🌱 Seed Platform Content"
              )}
            </Button>
          )}

          {result && (
            <div className="mt-6">
              {result.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Content Successfully Seeded!
                  </h3>
                  <p className="text-green-700">{result.message}</p>
                  <div className="mt-4 space-x-4">
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.href = "/stories")}
                    >
                      📚 View Stories
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => (window.location.href = "/blog")}
                    >
                      📝 View Blog Posts
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="text-4xl mb-3">❌</div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Seeding Failed
                  </h3>
                  <p className="text-red-700">{result.error}</p>
                  <Button
                    variant="secondary"
                    onClick={() => setResult(null)}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-earth-200">
            <h3 className="font-semibold text-earth-900 mb-3">
              📋 Next Steps After Seeding
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2 text-sm text-earth-700">
                <div>✅ Review and customise seeded content</div>
                <div>✅ Add team photos to media library</div>
                <div>✅ Create additional stories using Story Editor</div>
                <div>✅ Generate blog posts from stories</div>
              </div>
              <div className="space-y-2 text-sm text-earth-700">
                <div>✅ Set up Elder approval workflow</div>
                <div>✅ Configure user permissions</div>
                <div>✅ Test content management features</div>
                <div>✅ Begin regular content creation</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-ochre-50 border border-ochre-200 rounded-lg">
            <p className="text-sm text-ochre-800">
              <strong>Note:</strong> This seeding process creates sample content
              to demonstrate platform capabilities. All content reflects
              authentic Oonchiumpa values and community experiences, but should
              be reviewed and customised by the team before publication.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ContentSeeder;

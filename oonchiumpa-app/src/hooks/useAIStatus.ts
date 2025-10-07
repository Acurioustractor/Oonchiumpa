import { useState, useEffect } from "react";

interface AIProvider {
  status: "active" | "quota_exceeded" | "error" | "inactive";
  quota: string;
  lastChecked?: string;
}

interface AISystemStatus {
  providers: {
    openai: AIProvider;
    anthropic: AIProvider;
    perplexity: AIProvider;
  };
  totalProcessed: number;
  successRate: number;
  culturalReviews: number;
}

export const useAIStatus = () => {
  const [aiStatus, setAIStatus] = useState<AISystemStatus>({
    providers: {
      openai: { status: "inactive", quota: "0/0" },
      anthropic: { status: "inactive", quota: "0/0" },
      perplexity: { status: "inactive", quota: "0/0" },
    },
    totalProcessed: 0,
    successRate: 0,
    culturalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIStatus = async () => {
      try {
        // Check if backend API is available
        const response = await fetch(
          "http://localhost:3001/api/admin/ai-status",
        );

        if (response.ok) {
          const data = await response.json();
          setAIStatus(data);
        } else {
          // Fallback to checking environment availability
          const envCheck = await fetch(
            "http://localhost:3001/api/admin/env-status",
          );
          if (envCheck.ok) {
            const envData = await envCheck.json();

            setAIStatus({
              providers: {
                openai: {
                  status: envData.providers?.openai ? "active" : "inactive",
                  quota: envData.providers?.openai
                    ? "Available"
                    : "Not configured",
                },
                anthropic: {
                  status: envData.providers?.anthropic ? "active" : "inactive",
                  quota: envData.providers?.anthropic
                    ? "Available"
                    : "Not configured",
                },
                perplexity: {
                  status: envData.providers?.perplexity ? "active" : "inactive",
                  quota: envData.providers?.perplexity
                    ? "Available"
                    : "Not configured",
                },
              },
              totalProcessed: envData.stats?.totalProcessed || 0,
              successRate: envData.stats?.successRate || 0,
              culturalReviews: envData.stats?.culturalReviews || 0,
            });
          }
        }
      } catch (error) {
        console.log("AI status check unavailable - using empty state");
        // Keep the inactive state as initialized
      } finally {
        setLoading(false);
      }
    };

    fetchAIStatus();

    // Refresh status every 5 minutes
    const interval = setInterval(fetchAIStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { aiStatus, loading };
};

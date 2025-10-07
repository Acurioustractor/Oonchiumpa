import React, { useState, useEffect } from "react";
import { Button } from "./Button";

interface Partner {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  partnershipLevel:
    | "PROSPECT"
    | "COLLABORATOR"
    | "STRATEGIC_PARTNER"
    | "CORE_PARTNER"
    | "LEGACY_PARTNER";
  monetaryValue?: number;
  inKindValue?: number;
  location?: string;
  communityConnections: string[];
}

interface PartnerShowcaseProps {
  title?: string;
  subtitle?: string;
  showDescription?: boolean;
  maxPartners?: number;
  partnershipLevel?: Partner["partnershipLevel"];
  category?: string;
  className?: string;
}

const PartnerShowcase: React.FC<PartnerShowcaseProps> = ({
  title = "Our Partners",
  subtitle = "Building stronger communities together",
  showDescription = true,
  maxPartners = 12,
  partnershipLevel,
  category,
  className = "",
}) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    fetchPartners();
  }, [partnershipLevel, category]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      let url = "/api/partners?active=true";
      if (partnershipLevel) url += `&level=${partnershipLevel}`;
      if (category) url += `&category=${category}`;
      url += `&limit=${maxPartners}`;

      const response = await fetch(url);
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPartnershipLevelColor = (level: Partner["partnershipLevel"]) => {
    const colors = {
      PROSPECT: "bg-gray-100 text-gray-700",
      COLLABORATOR: "bg-eucalyptus-100 text-eucalyptus-800",
      STRATEGIC_PARTNER: "bg-ochre-100 text-ochre-800",
      CORE_PARTNER: "bg-sunset-100 text-sunset-800",
      LEGACY_PARTNER: "bg-earth-100 text-earth-800",
    };
    return colors[level] || colors.COLLABORATOR;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
              {title}
            </h2>
            {subtitle && <p className="text-lg text-earth-700">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="w-full h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-16 bg-gradient-to-br from-sand-50 to-eucalyptus-50 ${className}`}
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-earth-700 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-earth-600">
              No partners found matching the criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg p-6 border border-earth-200 hover:border-ochre-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => setSelectedPartner(partner)}
                >
                  {/* Partner Logo */}
                  <div className="w-full h-16 flex items-center justify-center mb-4 bg-gray-50 rounded group-hover:bg-gray-100 transition-colors">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-earth-600">
                        {partner.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .substring(0, 3)}
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  <h3 className="font-bold text-earth-800 mb-2 text-center text-sm leading-tight">
                    {partner.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnershipLevelColor(partner.partnershipLevel)}`}
                    >
                      {partner.partnershipLevel.replace("_", " ")}
                    </span>
                  </div>

                  {partner.category && (
                    <p className="text-xs text-earth-600 text-center">
                      {partner.category}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Partnership Statistics */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-ochre-600 mb-2">
                  {
                    partners.filter(
                      (p) =>
                        p.partnershipLevel === "CORE_PARTNER" ||
                        p.partnershipLevel === "LEGACY_PARTNER",
                    ).length
                  }
                </div>
                <div className="text-earth-700">Core & Legacy Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eucalyptus-600 mb-2">
                  {partners.reduce(
                    (acc, p) => acc + (p.communityConnections?.length || 0),
                    0,
                  )}
                </div>
                <div className="text-earth-700">Community Connections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sunset-600 mb-2">
                  {partners.reduce(
                    (acc, p) =>
                      acc + ((p.monetaryValue || 0) + (p.inKindValue || 0)),
                    0,
                  ) > 0
                    ? formatCurrency(
                        partners.reduce(
                          (acc, p) =>
                            acc +
                            ((p.monetaryValue || 0) + (p.inKindValue || 0)),
                          0,
                        ),
                      )
                    : "$500K+"}
                </div>
                <div className="text-earth-700">Partnership Value</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  {selectedPartner.logo && (
                    <img
                      src={selectedPartner.logo}
                      alt={`${selectedPartner.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-earth-900">
                      {selectedPartner.name}
                    </h3>
                    <p className="text-ochre-600 font-semibold">
                      {selectedPartner.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {showDescription && selectedPartner.description && (
                <p className="text-earth-700 mb-4">
                  {selectedPartner.description}
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-earth-800 mb-2">
                    Partnership Level
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPartnershipLevelColor(selectedPartner.partnershipLevel)}`}
                  >
                    {selectedPartner.partnershipLevel.replace("_", " ")}
                  </span>
                </div>

                {selectedPartner.location && (
                  <div>
                    <h4 className="font-semibold text-earth-800 mb-2">
                      Location
                    </h4>
                    <p className="text-earth-700">{selectedPartner.location}</p>
                  </div>
                )}
              </div>

              {selectedPartner.communityConnections.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-earth-800 mb-2">
                    Community Connections
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.communityConnections.map(
                      (connection, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-eucalyptus-100 text-eucalyptus-800 rounded-full text-sm"
                        >
                          {connection}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                {selectedPartner.website && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(selectedPartner.website, "_blank")
                    }
                  >
                    Visit Website
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => setSelectedPartner(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PartnerShowcase;

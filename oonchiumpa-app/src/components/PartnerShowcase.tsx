import React from "react";

interface Partner {
  name: string;
  category: string;
}

const PartnerShowcase: React.FC = () => {
  const partners: Partner[] = [
    // Aboriginal Organizations
    { name: "Tangentyere Employment", category: "Aboriginal Organizations" },
    { name: "Congress", category: "Aboriginal Organizations" },
    { name: "Lhere Artepe", category: "Aboriginal Organizations" },
    { name: "NAAJA", category: "Aboriginal Organizations" },
    { name: "Akeyulerre Healing", category: "Aboriginal Organizations" },
    { name: "NPY Lands", category: "Aboriginal Organizations" },

    // Education
    { name: "St Joseph's School", category: "Education" },
    { name: "Yipirinya School", category: "Education" },
    { name: "Yirara College", category: "Education" },
    { name: "Gap Youth Centre", category: "Education" },
    { name: "YORET", category: "Education" },
    { name: "Saltbush", category: "Education" },

    // Community Services
    { name: "Headspace", category: "Community Services" },
    { name: "Spirit of the Gumtree", category: "Community Services" },
    { name: "Cruisers Basketball", category: "Community Services" },
    { name: "Territory Families", category: "Community Services" },
    { name: "NT Youth Justice", category: "Community Services" },
    { name: "Anglicare Housing", category: "Community Services" },
  ];

  const categories = Array.from(new Set(partners.map(p => p.category)));

  return (
    <section className="py-16 bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
            Our Partnership Network
          </h2>
          <p className="text-lg text-earth-700 max-w-3xl mx-auto">
            Working with Aboriginal organizations, education providers, health services, and community support networks to create wraparound care for young people
          </p>
        </div>

        {/* Partners by Category */}
        <div className="space-y-12 mb-12">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xl font-bold text-earth-900 mb-6 text-center">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {partners
                  .filter((p) => p.category === category)
                  .map((partner, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-4 border-2 border-earth-200 hover:border-ochre-400 transition-all duration-300 hover:shadow-lg text-center"
                    >
                      {/* Partner Logo Placeholder */}
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-ochre-100 to-eucalyptus-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-earth-700">
                          {partner.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .substring(0, 2)}
                        </span>
                      </div>

                      {/* Partner Name */}
                      <h4 className="font-semibold text-earth-800 text-sm leading-tight">
                        {partner.name}
                      </h4>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-xl p-6 border-2 border-ochre-200">
            <div className="text-4xl font-bold text-ochre-600 mb-2">
              {partners.length}+
            </div>
            <div className="text-earth-700 font-medium">Partner Organizations</div>
          </div>
          <div className="text-center bg-white rounded-xl p-6 border-2 border-eucalyptus-200">
            <div className="text-4xl font-bold text-eucalyptus-600 mb-2">
              71
            </div>
            <div className="text-earth-700 font-medium">Service Referrals Made</div>
          </div>
          <div className="text-center bg-white rounded-xl p-6 border-2 border-sunset-200">
            <div className="text-4xl font-bold text-sunset-600 mb-2">
              0
            </div>
            <div className="text-earth-700 font-medium">Referrals Declined</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerShowcase;

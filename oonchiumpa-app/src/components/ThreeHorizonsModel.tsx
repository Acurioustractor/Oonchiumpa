import React, { useState, useEffect } from "react";

interface HorizonData {
  title: string;
  subtitle: string;
  description: string;
  programs: Array<{
    name: string;
    status: "active" | "emerging" | "transformational";
    impact: string;
    clients?: number;
  }>;
  color: {
    primary: string;
    secondary: string;
    hover: string;
  };
}

interface ThreeHorizonsModelProps {
  className?: string;
}

const ThreeHorizonsModel: React.FC<ThreeHorizonsModelProps> = ({
  className = "",
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const horizons: HorizonData[] = [
    {
      title: "Horizon 1",
      subtitle: "Core Programs",
      description:
        "Our established, proven programs delivering immediate impact to community members.",
      programs: [
        {
          name: "Case Management Support",
          status: "active",
          impact: "30 active clients",
          clients: 30,
        },
        {
          name: "Court Support Services",
          status: "active",
          impact: "95% engagement rate",
        },
        {
          name: "Cultural Healing Workshops",
          status: "active",
          impact: "2,464 meaningful contacts",
        },
        {
          name: "Employment Pathways",
          status: "active",
          impact: "87% completion rate",
        },
      ],
      color: {
        primary: "from-ochre-400 to-ochre-600",
        secondary: "ochre-100",
        hover: "ochre-50",
      },
    },
    {
      title: "Horizon 2",
      subtitle: "Emerging Initiatives",
      description:
        "New programs and partnerships expanding our reach and impact.",
      programs: [
        {
          name: "Digital Storytelling Platform",
          status: "emerging",
          impact: "Community-driven content creation",
        },
        {
          name: "Youth Leadership Program",
          status: "emerging",
          impact: "Next generation cultural leaders",
        },
        {
          name: "Family Reconnection Services",
          status: "emerging",
          impact: "Healing intergenerational trauma",
        },
        {
          name: "Community Enterprise Development",
          status: "emerging",
          impact: "Economic empowerment initiatives",
        },
      ],
      color: {
        primary: "from-eucalyptus-400 to-eucalyptus-600",
        secondary: "eucalyptus-100",
        hover: "eucalyptus-50",
      },
    },
    {
      title: "Horizon 3",
      subtitle: "Transformational Vision",
      description:
        "Long-term aspirational goals that will transform how we serve community.",
      programs: [
        {
          name: "Oonchiumpa Cultural Campus",
          status: "transformational",
          impact: "Integrated community hub",
        },
        {
          name: "National Indigenous Justice Model",
          status: "transformational",
          impact: "Scalable framework for Australia",
        },
        {
          name: "Cultural Knowledge Repository",
          status: "transformational",
          impact: "Digital preservation of wisdom",
        },
        {
          name: "Research & Innovation Centre",
          status: "transformational",
          impact: "Evidence-based practice development",
        },
      ],
      color: {
        primary: "from-sunset-400 to-sunset-600",
        secondary: "sunset-100",
        hover: "sunset-50",
      },
    },
  ];

  return (
    <section
      className={`py-16 bg-gradient-to-br from-sand-50 to-earth-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4">
            Our Strategic Vision
          </h2>
          <p className="text-lg text-earth-600 max-w-3xl mx-auto mb-2">
            The Three Horizons Model guides our development from today's core
            programs to tomorrow's transformational impact.
          </p>
          <p className="text-sm text-earth-500 italic">
            Click on each horizon to explore our strategic approach
          </p>
        </div>

        {/* Three Horizons Visualization */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Horizon Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {horizons.map((horizon, index) => (
              <div
                key={index}
                className={`
                  relative cursor-pointer transition-all duration-300 transform
                  ${
                    selectedHorizon === index
                      ? "scale-105 shadow-2xl z-10"
                      : selectedHorizon === null
                        ? "hover:scale-102 hover:shadow-lg"
                        : "scale-95 opacity-60"
                  }
                `}
                onMouseEnter={() => setSelectedHorizon(index)}
                onMouseLeave={() => setSelectedHorizon(null)}
              >
                {/* Horizon Card */}
                <div
                  className={`
                  bg-gradient-to-br ${horizon.color.primary} 
                  rounded-xl p-6 text-white min-h-[300px] relative overflow-hidden
                `}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <defs>
                        <pattern
                          id={`pattern-${index}`}
                          x="0"
                          y="0"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="10" cy="10" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect
                        width="100"
                        height="100"
                        fill={`url(#pattern-${index})`}
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{horizon.title}</h3>
                    <h4 className="text-lg font-medium mb-4 opacity-90">
                      {horizon.subtitle}
                    </h4>
                    <p className="text-sm opacity-80 mb-6 leading-relaxed">
                      {horizon.description}
                    </p>

                    {/* Program Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">
                        {horizon.programs.length} initiatives
                      </span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover State Indicator */}
                  {selectedHorizon === index && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedHorizon === index && (
                  <div
                    className={`
                    absolute top-full left-0 right-0 mt-4 p-6 
                    bg-white rounded-xl shadow-xl border border-${horizon.color.secondary} z-20
                    animate-slide-up
                  `}
                  >
                    <h4 className="text-lg font-semibold text-earth-800 mb-4">
                      Key Initiatives
                    </h4>
                    <div className="space-y-3">
                      {horizon.programs.map((program, programIndex) => (
                        <div
                          key={programIndex}
                          className="flex items-start space-x-3"
                        >
                          <div
                            className={`
                            w-2 h-2 rounded-full mt-2 flex-shrink-0
                            ${
                              program.status === "active"
                                ? "bg-ochre-500"
                                : program.status === "emerging"
                                  ? "bg-eucalyptus-500"
                                  : "bg-sunset-500"
                            }
                          `}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-earth-800">
                              {program.name}
                            </h5>
                            <p className="text-xs text-earth-600">
                              {program.impact}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Strategic Flow Visualization */}
          <div className="relative">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="w-4 h-4 bg-ochre-500 rounded-full mb-2"></div>
                  <span className="text-xs text-earth-600">Current</span>
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-ochre-300 to-eucalyptus-300"></div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-eucalyptus-500 rounded-full mb-2"></div>
                  <span className="text-xs text-earth-600">Emerging</span>
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-eucalyptus-300 to-sunset-300"></div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-sunset-500 rounded-full mb-2"></div>
                  <span className="text-xs text-earth-600">Future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeHorizonsModel;

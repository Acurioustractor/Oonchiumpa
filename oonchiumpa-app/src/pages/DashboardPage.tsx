import React, { useState, useEffect } from 'react';
import ImpactMetrics from '../components/ImpactMetrics';
import ThreeHorizonsModel from '../components/ThreeHorizonsModel';
import { dashboardAPI, type DashboardData } from '../services/api';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '' 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, end, duration]);

  return (
    <span id={`counter-${end}`}>
      {prefix}{count}{suffix}
    </span>
  );
};

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getMetrics();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre-600 mx-auto mb-4"></div>
          <p className="text-earth-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sunset-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { keyMetrics, recentOutcomes } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-eucalyptus-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-earth-800 mb-2">
                Impact Dashboard
              </h1>
              <p className="text-earth-600 max-w-2xl">
                Real-time insights into our community programs and strategic development 
                across the Three Horizons model.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <div className="text-right">
                <div className="text-sm text-earth-500">Last updated</div>
                <div className="text-lg font-medium text-earth-700">
                  {new Date().toLocaleDateString('en-AU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'metrics', label: 'Impact Metrics', icon: '📈' },
              { id: 'strategy', label: 'Strategic Vision', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-2 border-b-2 transition-colors duration-200 flex items-center space-x-2
                  ${activeTab === tab.id
                    ? 'border-ochre-500 text-ochre-600 font-medium'
                    : 'border-transparent text-earth-600 hover:text-earth-800 hover:border-earth-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur rounded-xl p-6 border border-earth-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-earth-600">{metric.title}</h3>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${metric.changeType === 'positive' 
                        ? 'bg-eucalyptus-100 text-eucalyptus-700'
                        : 'bg-sunset-100 text-sunset-700'
                      }
                    `}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-earth-800 mb-2">
                    <AnimatedCounter 
                      end={metric.value} 
                      suffix={metric.suffix || ''}
                      duration={1500}
                    />
                  </div>
                  <p className="text-xs text-earth-500">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Outcomes */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-earth-200 overflow-hidden">
              <div className="p-6 border-b border-earth-100">
                <h2 className="text-xl font-bold text-earth-800">Recent Outcomes</h2>
                <p className="text-earth-600">Latest achievements across our three horizons</p>
              </div>
              <div className="divide-y divide-earth-100">
                {recentOutcomes.map((outcome, index) => (
                  <div key={index} className="p-6 hover:bg-earth-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-earth-800">{outcome.title}</h3>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${outcome.status === 'active' ? 'bg-ochre-100 text-ochre-700' :
                              outcome.status === 'emerging' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                              'bg-sunset-100 text-sunset-700'}
                          `}>
                            Horizon {outcome.horizon}
                          </span>
                        </div>
                        <p className="text-earth-600 text-sm mb-1">{outcome.description}</p>
                        <p className="text-earth-800 font-medium">{outcome.impact}</p>
                      </div>
                      <div className="ml-4">
                        <div className={`
                          w-3 h-3 rounded-full
                          ${outcome.status === 'active' ? 'bg-ochre-500' :
                            outcome.status === 'emerging' ? 'bg-eucalyptus-500' :
                            'bg-sunset-500'}
                        `}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && <ImpactMetrics />}

        {activeTab === 'strategy' && <ThreeHorizonsModel />}
      </div>
    </div>
  );
};

export default DashboardPage;
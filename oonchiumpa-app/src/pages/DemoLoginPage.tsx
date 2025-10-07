import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";

const DemoLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      navigate("/demo-dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ochre-50 to-earth-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏛️</div>
            <h1 className="text-2xl font-bold text-earth-900 mb-2">
              Demo Access
            </h1>
            <p className="text-earth-600">
              Quick access to explore the Oonchiumpa platform
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Demo Mode
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  This bypasses the email rate limit issue. You'll have full
                  admin access to explore all features.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-earth-100 p-4 rounded-lg">
              <h3 className="font-semibold text-earth-900 mb-2">
                Demo Admin Access:
              </h3>
              <ul className="text-sm text-earth-800 space-y-1">
                <li>• Full administrator permissions</li>
                <li>• Access to Content Dashboard</li>
                <li>• Story creation and editing</li>
                <li>• Media management</li>
                <li>• User management</li>
                <li>• Content seeding tools</li>
              </ul>
            </div>

            <Button
              onClick={handleDemoLogin}
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entering Platform..." : "🚀 Enter as Demo Admin"}
            </Button>

            <div className="text-center">
              <a
                href="/admin-setup"
                className="text-sm text-ochre-600 hover:text-ochre-700"
              >
                Try Real Account Setup →
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-ochre-50 rounded-lg">
            <h3 className="font-semibold text-ochre-900 mb-2">
              🌟 What You'll Experience:
            </h3>
            <ul className="text-sm text-ochre-800 space-y-1">
              <li>• Authentic community storytelling platform</li>
              <li>• Cultural protocols and Elder approval workflows</li>
              <li>• Media upload and organization system</li>
              <li>• Sample content from real community work</li>
              <li>• Complete content management dashboard</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DemoLoginPage;

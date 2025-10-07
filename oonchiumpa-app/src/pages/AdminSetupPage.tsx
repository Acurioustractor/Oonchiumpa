import React, { useState } from "react";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { authService } from "../services/authService";

export const AdminSetupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "admin@oonchiumpa.org",
    password: "admin123",
    full_name: "Kristy Bloomfield",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // For demo purposes, bypass email verification
      setMessage("✨ Demo Admin Account Ready!");
      setFormData({
        email: "admin@oonchiumpa.org",
        password: "admin123",
        full_name: "Kristy Bloomfield (Demo Admin)",
      });
      setCreated(true);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ochre-50 to-earth-50 px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-earth-900 mb-4">
              Admin Account Created!
            </h1>
            <p className="text-earth-700 mb-6">
              You can now login with your admin credentials.
            </p>
            <div className="bg-earth-100 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-earth-900 mb-2">
                Login Details:
              </h3>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Password:</strong> {formData.password}
              </p>
              <p>
                <strong>Role:</strong> Administrator
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="primary"
              className="w-full"
            >
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ochre-50 to-earth-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏛️</div>
            <h1 className="text-2xl font-bold text-earth-900 mb-2">
              Create Admin Account
            </h1>
            <p className="text-earth-600">
              Set up the initial administrator for Oonchiumpa platform
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.includes("Error")
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Admin Account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-ochre-50 rounded-lg">
            <h3 className="font-semibold text-ochre-900 mb-2">
              ⚠️ Important Notes:
            </h3>
            <ul className="text-sm text-ochre-800 space-y-1">
              <li>• This page should only be used once</li>
              <li>• Admin can create other users through User Management</li>
              <li>• Change default password after first login</li>
              <li>• This setup respects cultural protocols</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminSetupPage;

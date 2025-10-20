import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";

interface LoginFormProps {
  onSuccess?: () => void;
  showRegister?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  showRegister = true,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COMMUNITY_COORDINATOR",
  });

  const { signIn } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (response.user) {
          onSuccess?.();
        } else {
          setError(response.error || "Authentication failed");
        }
      } else {
        // For now, only show login - registration will be admin-only
        setError(
          "Registration is currently only available through administrators",
        );
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-50 to-eucalyptus-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">
            🏛️ Oonchiumpa Staff Portal
          </h1>
          <p className="text-earth-600">
            {isLogin
              ? "Sign in to access the content management system"
              : "Create your staff account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-earth-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-earth-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-earth-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-earth-700 mb-2"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              >
                <option value="COMMUNITY_COORDINATOR">
                  Community Coordinator
                </option>
                <option value="ELDER">Elder</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loading />
                <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {showRegister && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "COMMUNITY_COORDINATOR",
                });
              }}
              className="text-ochre-600 hover:text-ochre-800 text-sm font-medium"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-earth-200">
          <div className="text-xs text-earth-500 space-y-1">
            <p>
              🛡️ Cultural protocols and Elder consultation requirements apply
            </p>
            <p>📝 All content is reviewed before publication</p>
            <p>🔒 Secure access for authorised Oonchiumpa staff only</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;

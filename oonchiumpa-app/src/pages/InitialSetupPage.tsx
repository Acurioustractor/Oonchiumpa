import React, { useState } from "react";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import { authService } from "../services/authService";

export const InitialSetupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCreateAdmin = async () => {
    setLoading(true);
    setMessage("");

    try {
      // First, try to sign in to see if account already exists
      const loginResponse = await authService.signIn({
        email: "admin@oonchiumpa.org",
        password: "oonchiumpa2024!",
      });

      if (loginResponse.user && !loginResponse.error) {
        setMessage(
          "✅ Admin account already exists and is working!\n\n📧 Email: admin@oonchiumpa.org\n🔑 Password: oonchiumpa2024!",
        );
        setSuccess(true);
        return;
      }

      // If login failed, try to create the account
      const response = await authService.signUp({
        email: "admin@oonchiumpa.org",
        password: "oonchiumpa2024!",
        full_name: "Kristy Bloomfield",
        role: "admin",
      });

      if (response.error) {
        if (response.error.includes("rate limit")) {
          setMessage(`⚠️ Email rate limit exceeded. This is a Supabase free tier limitation.

🔧 **Manual Setup Required:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to Authentication → Users
3. Click "Add user" manually
4. Enter:
   - Email: admin@oonchiumpa.org
   - Password: oonchiumpa2024!
   - Confirm password
   - Auto confirm user: ✅
5. Click "Create user"
6. Come back here and try logging in

**Alternative:** Wait 1 hour for the rate limit to reset, then try again.`);
        } else if (response.error.includes("already registered")) {
          setMessage(
            "✅ Admin account already exists! You can login with:\n\n📧 Email: admin@oonchiumpa.org\n🔑 Password: oonchiumpa2024!",
          );
          setSuccess(true);
        } else {
          setMessage(`❌ Error: ${response.error}`);
        }
      } else {
        setMessage(
          "🎉 Admin account created successfully!\n\n📧 Email: admin@oonchiumpa.org\n🔑 Password: oonchiumpa2024!\n👑 Role: Administrator",
        );
        setSuccess(true);
      }
    } catch (error: any) {
      setMessage(`❌ Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ochre-50 to-earth-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏛️</div>
            <h1 className="text-3xl font-bold text-earth-900 mb-4">
              Oonchiumpa Platform Setup
            </h1>
            <p className="text-earth-600 text-lg">
              Create your initial administrator account to get started
            </p>
          </div>

          <div className="bg-ochre-50 border border-ochre-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-ochre-900 mb-3">
              🛡️ What This Creates:
            </h2>
            <ul className="text-ochre-800 space-y-2">
              <li>
                • <strong>Administrator Account</strong> with full platform
                access
              </li>
              <li>
                • <strong>Cultural Authority</strong> for Elder approval
                workflows
              </li>
              <li>
                • <strong>Content Management</strong> permissions for stories
                and media
              </li>
              <li>
                • <strong>User Management</strong> ability to create team
                accounts
              </li>
              <li>
                • <strong>Cultural Protocols</strong> with privacy level
                controls
              </li>
            </ul>
          </div>

          {message && (
            <div
              className={`p-6 rounded-lg mb-6 whitespace-pre-line ${
                message.includes("Error") || message.includes("❌")
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : success
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-yellow-50 border border-yellow-200 text-yellow-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-earth-100 p-6 rounded-lg">
              <h3 className="font-semibold text-earth-900 mb-3">
                Admin Credentials:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Email:</strong>
                  <br />
                  <code className="bg-white px-2 py-1 rounded">
                    admin@oonchiumpa.org
                  </code>
                </div>
                <div>
                  <strong>Password:</strong>
                  <br />
                  <code className="bg-white px-2 py-1 rounded">
                    oonchiumpa2024!
                  </code>
                </div>
                <div>
                  <strong>Role:</strong>
                  <br />
                  <span className="bg-ochre-100 text-ochre-800 px-2 py-1 rounded">
                    Administrator
                  </span>
                </div>
                <div>
                  <strong>Authority:</strong>
                  <br />
                  <span className="bg-ochre-100 text-ochre-800 px-2 py-1 rounded">
                    Cultural Elder
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateAdmin}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating Administrator Account..."
                : "🚀 Create Admin Account"}
            </Button>

            {success && (
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Continue to Login →
              </Button>
            )}
          </div>

          <div className="mt-8 p-6 bg-earth-800 text-white rounded-lg">
            <h3 className="font-semibold mb-3">
              📋 Next Steps After Creation:
            </h3>
            <ol className="text-earth-200 space-y-2 text-sm">
              <li>
                1. <strong>Login</strong> with your admin credentials
              </li>
              <li>
                2. <strong>Access Content Dashboard</strong> from your profile
                menu
              </li>
              <li>
                3. <strong>Seed Platform Content</strong> using the Content
                Seeder
              </li>
              <li>
                4. <strong>Create Team Accounts</strong> via User Management
              </li>
              <li>
                5. <strong>Configure Cultural Protocols</strong> as needed
              </li>
            </ol>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default InitialSetupPage;

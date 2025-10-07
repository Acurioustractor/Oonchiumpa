import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loading } from "./Loading";
import { Card, CardBody } from "./Card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: "admin" | "editor" | "contributor" | "elder" | "storyteller";
  requireCulturalAuthority?: boolean;
  requireContentApproval?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  requireCulturalAuthority = false,
  requireContentApproval = false,
}) => {
  const {
    user,
    loading,
    hasPermission,
    hasCulturalAuthority,
    canApproveContent,
    isAuthenticated,
  } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <Card className="p-8 text-center">
          <Loading size="lg" />
          <div className="mt-4 text-earth-700">Checking authentication...</div>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <Card className="max-w-md text-center">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-earth-900 mb-4">
              Access Denied
            </h2>
            <p className="text-earth-700 mb-4">
              You don't have the required permissions to access this page.
            </p>
            <p className="text-sm text-earth-600">
              Required permission:{" "}
              <code className="bg-earth-100 px-2 py-1 rounded">
                {requiredPermission}
              </code>
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="text-ochre-600 hover:text-ochre-800"
              >
                ← Go Back
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Check specific role if required
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <Card className="max-w-md text-center">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-earth-900 mb-4">
              Role Required
            </h2>
            <p className="text-earth-700 mb-4">
              This page requires a specific role to access.
            </p>
            <p className="text-sm text-earth-600">
              Required role:{" "}
              <code className="bg-earth-100 px-2 py-1 rounded">
                {requiredRole}
              </code>
              <br />
              Your role:{" "}
              <code className="bg-earth-100 px-2 py-1 rounded">
                {user?.role}
              </code>
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="text-ochre-600 hover:text-ochre-800"
              >
                ← Go Back
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Check cultural authority if required
  if (requireCulturalAuthority && !hasCulturalAuthority()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <Card className="max-w-md text-center">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold text-earth-900 mb-4">
              Cultural Authority Required
            </h2>
            <p className="text-earth-700 mb-4">
              This page requires cultural authority to access. Only Elders and
              authorized Traditional Owners can access this content.
            </p>
            <div className="bg-ochre-50 border border-ochre-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-ochre-800">
                🙏 This restriction ensures cultural protocols are respected and
                sacred knowledge is protected.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="text-ochre-600 hover:text-ochre-800"
              >
                ← Go Back
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Check content approval authority if required
  if (requireContentApproval && !canApproveContent()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50 px-4">
        <Card className="max-w-md text-center">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-earth-900 mb-4">
              Content Approval Authority Required
            </h2>
            <p className="text-earth-700 mb-4">
              This page is for content reviewers and approvers only.
            </p>
            <p className="text-sm text-earth-600">
              Only Elders and Administrators can approve content for
              publication.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="text-ochre-600 hover:text-ochre-800"
              >
                ← Go Back
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

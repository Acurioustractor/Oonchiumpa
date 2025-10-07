import React, { useState, useEffect } from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import { authService, type User } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export const UserManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    }
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await authService.getUsers();
      setUsers(allUsers);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      elder: "bg-purple-100 text-purple-800",
      editor: "bg-blue-100 text-blue-800",
      contributor: "bg-green-100 text-green-800",
      storyteller: "bg-yellow-100 text-yellow-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!isAdmin()) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">🚫</div>
        <h3 className="text-lg font-semibold text-earth-900 mb-2">
          Admin Access Required
        </h3>
        <p className="text-earth-600">Only administrators can manage users.</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loading />
        <div className="mt-4">Loading users...</div>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-earth-900">
            👥 User Management
          </h2>
          <Button variant="primary" size="sm">
            ➕ Add New User
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-earth-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-ochre-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-earth-900">
                    {user.full_name}
                  </div>
                  <div className="text-sm text-earth-600">{user.email}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                    {user.cultural_authority && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        🛡️ Cultural Authority
                      </span>
                    )}
                    {user.can_approve_content && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        ✅ Content Approver
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right text-sm text-earth-600">
                  <div>Last login:</div>
                  <div>{new Date(user.last_login).toLocaleDateString()}</div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    ✏️ Edit
                  </Button>
                  {user.is_active ? (
                    <Button variant="secondary" size="sm">
                      🚫 Deactivate
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm">
                      ✅ Activate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-earth-900 mb-2">
              No Users Found
            </h3>
            <p className="text-earth-600 mb-4">
              Start by adding team members to the platform.
            </p>
            <Button variant="primary">Add First User</Button>
          </div>
        )}

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-earth-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-earth-900">
              {users.length}
            </div>
            <div className="text-sm text-earth-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.is_active).length}
            </div>
            <div className="text-sm text-earth-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.cultural_authority).length}
            </div>
            <div className="text-sm text-earth-600">Cultural Authority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.can_approve_content).length}
            </div>
            <div className="text-sm text-earth-600">Content Approvers</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserManagement;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const StaffPortalHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.full_name || 'Staff User';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="bg-earth-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/staff-portal" className="hover:opacity-90 transition">
              <img
                src="/images/logo/logo-transparent.png"
                alt="Oonchiumpa logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="text-ochre-300">|</span>
            <span className="text-ochre-200">Staff Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 text-ochre-200 hover:text-white hover:bg-earth-800 rounded transition"
            >
              ← Back to Public Site
            </Link>
            {user && (
              <>
                <div className="text-right">
                  <div className="font-semibold">{fullName}</div>
                  <div className="text-sm text-earth-300">{user.role || 'Staff'}</div>
                </div>
                <div className="w-10 h-10 bg-ochre-600 rounded-full flex items-center justify-center font-bold">
                  {initials || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-ochre-200 hover:text-white hover:bg-earth-800 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <Link
              to="/staff-portal"
              className="py-4 px-2 border-b-2 border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-medium text-sm transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/staff-portal/documents"
              className="py-4 px-2 border-b-2 border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-medium text-sm transition-colors"
            >
              📄 Documents
            </Link>
            <Link
              to="/staff-portal/impact"
              className="py-4 px-2 border-b-2 border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-medium text-sm transition-colors"
            >
              🎯 Impact Framework
            </Link>
            <Link
              to="/staff-portal/media-manager"
              className="py-4 px-2 border-b-2 border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-medium text-sm transition-colors"
            >
              📸 Media Manager
            </Link>
            <Link
              to="/staff-portal/empathy-ledger"
              className="py-4 px-2 border-b-2 border-transparent text-earth-500 hover:text-earth-700 hover:border-earth-300 font-medium text-sm transition-colors"
            >
              💚 Empathy Ledger
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

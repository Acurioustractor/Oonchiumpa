import { useNavigate } from 'react-router-dom';
import { StaffPortalHeader } from '../components/StaffPortalHeader';
import { AddOutcomeForm } from '../components/AddOutcomeForm';

export default function AddOutcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <StaffPortalHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/staff-portal/impact')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            ← Back to Impact Overview
          </button>
        </div>

        <AddOutcomeForm
          onSuccess={() => {
            navigate('/staff-portal/impact');
          }}
          onCancel={() => {
            navigate('/staff-portal/impact');
          }}
        />
      </div>
    </div>
  );
}

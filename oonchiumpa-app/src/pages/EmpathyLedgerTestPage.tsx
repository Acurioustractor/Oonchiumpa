import { StaffPortalHeader } from '../components/StaffPortalHeader';

export default function EmpathyLedgerTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaffPortalHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-earth-900 mb-4">
          ✅ Empathy Ledger Test Page Working!
        </h1>
        <p className="text-lg text-earth-700">
          If you can see this, the routing is working correctly.
        </p>
        <p className="mt-4 text-earth-600">
          The issue was likely with the full EmpathyLedgerManagementPage component.
        </p>
      </div>
    </div>
  );
}

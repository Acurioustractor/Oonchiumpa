import React, { useState } from "react";
import { StorytellerDashboard } from "../components/StorytellerDashboard";

const EmpathyLedgerPage: React.FC = () => {
  // Use real Oonchiumpa storyteller: Kristy Bloomfield
  const [selectedStoryteller] = useState({
    id: "b59a1f4c-94fd-4805-a2c5-cac0922133e0",
    name: "Kristy Bloomfield",
    email: "kristy@oonchiumpa.org",
  });

  return (
    <div className="bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🎭 Empathy Ledger</h1>
            <p className="text-xl opacity-90 mb-2">
              Your Stories, Your Control
            </p>
            <p className="text-amber-100 text-sm">
              Prototype Integration with Oonchiumpa Platform
            </p>
          </div>
        </div>
      </div>

      <div className="relative -mt-6">
        <div className="bg-white rounded-t-3xl shadow-lg min-h-screen">
          <div className="pt-8">
            <StorytellerDashboard storyteller={selectedStoryteller} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpathyLedgerPage;

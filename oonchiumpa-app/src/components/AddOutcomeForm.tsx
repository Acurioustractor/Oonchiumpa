import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';
const OONCHIUMPA_TENANT_ID = '8891e1a9-92ae-423f-928b-cec602660011';

interface AddOutcomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddOutcomeForm: React.FC<AddOutcomeFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    outcome_type: 'individual',
    outcome_level: 'short_term',
    service_area: 'youth_mentorship',
    indicator_name: '',
    measurement_method: '',
    baseline_value: '',
    target_value: '',
    current_value: '',
    unit: '',
    elder_involvement: false,
    on_country_component: false,
    traditional_knowledge_transmitted: false,
    qualitative_evidence: '',
    success_stories: '',
    challenges: '',
    participant_count: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('outcomes')
        .insert({
          organization_id: OONCHIUMPA_ORG_ID,
          tenant_id: OONCHIUMPA_TENANT_ID,
          title: formData.title,
          description: formData.description,
          outcome_type: formData.outcome_type,
          outcome_level: formData.outcome_level,
          service_area: formData.service_area,
          indicator_name: formData.indicator_name,
          measurement_method: formData.measurement_method,
          baseline_value: formData.baseline_value ? parseFloat(formData.baseline_value) : null,
          target_value: formData.target_value ? parseFloat(formData.target_value) : null,
          current_value: formData.current_value ? parseFloat(formData.current_value) : null,
          unit: formData.unit || null,
          elder_involvement: formData.elder_involvement,
          on_country_component: formData.on_country_component,
          traditional_knowledge_transmitted: formData.traditional_knowledge_transmitted,
          qualitative_evidence: formData.qualitative_evidence ? [formData.qualitative_evidence] : [],
          success_stories: formData.success_stories ? [formData.success_stories] : [],
          challenges: formData.challenges ? [formData.challenges] : [],
          participant_count: formData.participant_count ? parseInt(formData.participant_count) : null,
          measurement_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      alert('✅ Outcome added successfully!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error adding outcome:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-earth-900 mb-6">Add New Outcome</h2>

      {/* Basic Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Basic Information</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Outcome Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="e.g., Youth School Re-engagement"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="Describe the outcome in detail..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Service Area *
            </label>
            <select
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            >
              <option value="youth_mentorship">Youth Mentorship & Cultural Healing</option>
              <option value="true_justice">True Justice: Deep Listening</option>
              <option value="atnarpa_homestead">Atnarpa Homestead</option>
              <option value="cultural_brokerage">Cultural Brokerage</option>
              <option value="good_news_stories">Good News Stories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Outcome Type *
            </label>
            <select
              name="outcome_type"
              value={formData.outcome_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            >
              <option value="individual">Individual Participant</option>
              <option value="program">Program-level</option>
              <option value="community">Community-wide</option>
              <option value="systemic">System Change</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Outcome Level (Theory of Change) *
          </label>
          <select
            name="outcome_level"
            value={formData.outcome_level}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
          >
            <option value="output">Output (Direct deliverable)</option>
            <option value="short_term">Short-term (0-6 months)</option>
            <option value="medium_term">Medium-term (6-18 months)</option>
            <option value="long_term">Long-term (18+ months)</option>
            <option value="impact">Impact (Lasting change)</option>
          </select>
        </div>
      </div>

      {/* Measurement Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Measurement Data</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Indicator Name *
          </label>
          <input
            type="text"
            name="indicator_name"
            value={formData.indicator_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="e.g., School Attendance Rate"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            How is this measured?
          </label>
          <input
            type="text"
            name="measurement_method"
            value={formData.measurement_method}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="e.g., Monthly school attendance reports"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Baseline Value
            </label>
            <input
              type="number"
              step="0.01"
              name="baseline_value"
              value={formData.baseline_value}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Target Value
            </label>
            <input
              type="number"
              step="0.01"
              name="target_value"
              value={formData.target_value}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Current Value
            </label>
            <input
              type="number"
              step="0.01"
              name="current_value"
              value={formData.current_value}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="75"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
              placeholder="%, count, etc."
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Number of Participants
          </label>
          <input
            type="number"
            name="participant_count"
            value={formData.participant_count}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="e.g., 21"
          />
        </div>
      </div>

      {/* Cultural Elements */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Cultural Elements</h3>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="elder_involvement"
              checked={formData.elder_involvement}
              onChange={handleChange}
              className="w-5 h-5 text-ochre-600 rounded focus:ring-ochre-500"
            />
            <span className="ml-3 text-earth-700">Elder Involvement</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="on_country_component"
              checked={formData.on_country_component}
              onChange={handleChange}
              className="w-5 h-5 text-ochre-600 rounded focus:ring-ochre-500"
            />
            <span className="ml-3 text-earth-700">On Country Component</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="traditional_knowledge_transmitted"
              checked={formData.traditional_knowledge_transmitted}
              onChange={handleChange}
              className="w-5 h-5 text-ochre-600 rounded focus:ring-ochre-500"
            />
            <span className="ml-3 text-earth-700">Traditional Knowledge Transmitted</span>
          </label>
        </div>
      </div>

      {/* Qualitative Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Qualitative Evidence</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Evidence / Quotes
          </label>
          <textarea
            name="qualitative_evidence"
            value={formData.qualitative_evidence}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="Enter key quotes or observations that evidence this outcome..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Success Story
          </label>
          <textarea
            name="success_stories"
            value={formData.success_stories}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="Tell a story that illustrates this outcome..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Challenges Encountered
          </label>
          <textarea
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-earth-300 rounded-md focus:ring-2 focus:ring-ochre-500 focus:border-transparent"
            placeholder="What barriers or challenges were faced?"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-earth-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-earth-700 bg-earth-100 hover:bg-earth-200 rounded-md font-medium transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-ochre-600 text-white rounded-md font-medium hover:bg-ochre-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : 'Add Outcome'}
        </button>
      </div>
    </form>
  );
};

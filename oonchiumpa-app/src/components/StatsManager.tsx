import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface ImpactStat {
  id: string;
  number: string;
  label: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  section: string;
  is_visible: boolean;
}

export const StatsManager: React.FC = () => {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<ImpactStat | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('impact_stats')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading stats:', error);
      alert('Error loading stats');
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (stat: ImpactStat) => {
    if (stat.id && !isCreating) {
      // Update existing
      const { error } = await supabase
        .from('impact_stats')
        .update({
          number: stat.number,
          label: stat.label,
          description: stat.description,
          icon: stat.icon,
          display_order: stat.display_order,
          section: stat.section,
          is_visible: stat.is_visible
        })
        .eq('id', stat.id);

      if (error) {
        console.error('Error updating stat:', error);
        alert('Error updating stat');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('impact_stats')
        .insert({
          number: stat.number,
          label: stat.label,
          description: stat.description,
          icon: stat.icon,
          display_order: stat.display_order,
          section: stat.section,
          is_visible: stat.is_visible
        });

      if (error) {
        console.error('Error creating stat:', error);
        alert('Error creating stat');
        return;
      }
    }

    setEditingStat(null);
    setIsCreating(false);
    loadStats();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    const { error } = await supabase
      .from('impact_stats')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting stat:', error);
      alert('Error deleting stat');
    } else {
      loadStats();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingStat({
      id: '',
      number: '',
      label: '',
      description: null,
      icon: null,
      display_order: stats.length + 1,
      section: 'about',
      is_visible: true
    });
  };

  if (loading) {
    return <Loading />;
  }

  const statsBySection = stats.reduce((acc, stat) => {
    if (!acc[stat.section]) acc[stat.section] = [];
    acc[stat.section].push(stat);
    return acc;
  }, {} as Record<string, ImpactStat[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-earth-900">Impact Stats Manager</h2>
        <Button variant="primary" onClick={handleCreateNew}>
          + Add New Stat
        </Button>
      </div>

      {/* Edit/Create Form */}
      {editingStat && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isCreating ? 'Add New Stat' : 'Edit Stat'}
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <StatForm
              stat={editingStat}
              onSave={handleSave}
              onCancel={() => {
                setEditingStat(null);
                setIsCreating(false);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Stats List by Section */}
      {Object.entries(statsBySection).map(([section, sectionStats]) => (
        <div key={section}>
          <h3 className="text-lg font-semibold text-earth-900 mb-3 capitalize">
            {section} Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionStats.map((stat) => (
              <Card key={stat.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gradient mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-earth-900 mb-1">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-sm text-earth-600 mb-3">
                        {stat.description}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-xs text-earth-500 mb-3">
                      {stat.icon && <span>Icon: {stat.icon}</span>}
                      <span>Order: {stat.display_order}</span>
                      {!stat.is_visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingStat(stat)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(stat.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Stat Form Component
interface StatFormProps {
  stat: ImpactStat;
  onSave: (stat: ImpactStat) => void;
  onCancel: () => void;
}

const StatForm: React.FC<StatFormProps> = ({ stat, onSave, onCancel }) => {
  const [formData, setFormData] = useState(stat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Number/Value * (e.g., "95%", "30+")
          </label>
          <input
            type="text"
            required
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
            placeholder="95%"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Label *
          </label>
          <input
            type="text"
            required
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
            placeholder="Diversion Success"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Description
        </label>
        <input
          type="text"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Of youth diverted from justice system"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Icon Name
          </label>
          <input
            type="text"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
            placeholder="shield, heart, users"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Section
          </label>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          >
            <option value="about">About</option>
            <option value="impact">Impact</option>
            <option value="home">Home</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_visible}
            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-earth-900">Visible on website</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" variant="primary">
          Save Stat
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

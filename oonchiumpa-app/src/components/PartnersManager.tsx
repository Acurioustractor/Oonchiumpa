import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface Partner {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  website: string | null;
  display_order: number;
  is_visible: boolean;
}

export const PartnersManager: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error loading partners:', error);
      alert('Error loading partners');
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (partner: Partner) => {
    if (partner.id && !isCreating) {
      // Update existing
      const { error } = await supabase
        .from('partners')
        .update({
          name: partner.name,
          category: partner.category,
          logo_url: partner.logo_url,
          website: partner.website,
          display_order: partner.display_order,
          is_visible: partner.is_visible
        })
        .eq('id', partner.id);

      if (error) {
        console.error('Error updating partner:', error);
        alert('Error updating partner');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('partners')
        .insert({
          name: partner.name,
          category: partner.category,
          logo_url: partner.logo_url,
          website: partner.website,
          display_order: partner.display_order,
          is_visible: partner.is_visible
        });

      if (error) {
        console.error('Error creating partner:', error);
        alert('Error creating partner');
        return;
      }
    }

    setEditingPartner(null);
    setIsCreating(false);
    loadPartners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting partner:', error);
      alert('Error deleting partner');
    } else {
      loadPartners();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingPartner({
      id: '',
      name: '',
      category: 'aboriginal',
      logo_url: null,
      website: null,
      display_order: partners.length + 1,
      is_visible: true
    });
  };

  if (loading) {
    return <Loading />;
  }

  const filteredPartners = filterCategory === 'all'
    ? partners
    : partners.filter(p => p.category === filterCategory);

  const categories = ['all', 'aboriginal', 'education', 'support'];
  const partnersByCategory = partners.reduce((acc, partner) => {
    if (!acc[partner.category]) acc[partner.category] = [];
    acc[partner.category].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-earth-900">Partner Organizations Manager</h2>
        <Button variant="primary" onClick={handleCreateNew}>
          + Add Partner
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-ochre-50 to-ochre-100">
          <div className="text-2xl font-bold text-ochre-800">
            {partnersByCategory['aboriginal']?.length || 0}
          </div>
          <div className="text-ochre-600 text-sm">Aboriginal Organizations</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-eucalyptus-50 to-eucalyptus-100">
          <div className="text-2xl font-bold text-eucalyptus-800">
            {partnersByCategory['education']?.length || 0}
          </div>
          <div className="text-eucalyptus-600 text-sm">Education & Training</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-2xl font-bold text-blue-800">
            {partnersByCategory['support']?.length || 0}
          </div>
          <div className="text-blue-600 text-sm">Support Services</div>
        </Card>
      </div>

      {/* Edit/Create Form */}
      {editingPartner && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isCreating ? 'Add New Partner' : 'Edit Partner'}
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <PartnerForm
              partner={editingPartner}
              onSave={handleSave}
              onCancel={() => {
                setEditingPartner(null);
                setIsCreating(false);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {partner.logo_url && (
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      className="h-12 w-auto mb-3 object-contain"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-earth-900 mb-1">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-ochre-100 text-ochre-700 rounded text-xs capitalize">
                      {partner.category}
                    </span>
                    {!partner.is_visible && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-eucalyptus-600 hover:underline"
                    >
                      Visit website →
                    </a>
                  )}
                  <div className="text-xs text-earth-500 mt-2">
                    Order: {partner.display_order}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => setEditingPartner(partner)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => handleDelete(partner.id)}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Partner Form Component
interface PartnerFormProps {
  partner: Partner;
  onSave: (partner: Partner) => void;
  onCancel: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSave, onCancel }) => {
  const [formData, setFormData] = useState(partner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Organization Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Tangentyere Employment"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Category *
        </label>
        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
        >
          <option value="aboriginal">Aboriginal Organizations</option>
          <option value="education">Education & Training</option>
          <option value="support">Support Services</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Logo URL
        </label>
        <input
          type="url"
          value={formData.logo_url || ''}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="https://..."
        />
        {formData.logo_url && (
          <img
            src={formData.logo_url}
            alt="Logo preview"
            className="mt-2 h-12 w-auto object-contain"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Website URL
        </label>
        <input
          type="url"
          value={formData.website || ''}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="flex items-center gap-2 mt-7">
            <input
              type="checkbox"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-earth-900">Visible on website</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" variant="primary">
          Save Partner
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

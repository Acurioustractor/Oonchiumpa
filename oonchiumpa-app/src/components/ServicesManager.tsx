import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  features: string[];
  icon_svg: string | null;
  display_order: number;
  is_visible: boolean;
}

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading services:', error);
      alert('Error loading services');
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (service: Service) => {
    if (service.id && !isCreating) {
      // Update existing
      const { error } = await supabase
        .from('services')
        .update({
          slug: service.slug,
          title: service.title,
          description: service.description,
          image_url: service.image_url,
          features: service.features,
          icon_svg: service.icon_svg,
          display_order: service.display_order,
          is_visible: service.is_visible
        })
        .eq('id', service.id);

      if (error) {
        console.error('Error updating service:', error);
        alert('Error updating service');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('services')
        .insert({
          slug: service.slug,
          title: service.title,
          description: service.description,
          image_url: service.image_url,
          features: service.features,
          icon_svg: service.icon_svg,
          display_order: service.display_order,
          is_visible: service.is_visible
        });

      if (error) {
        console.error('Error creating service:', error);
        alert('Error creating service');
        return;
      }
    }

    setEditingService(null);
    setIsCreating(false);
    loadServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    } else {
      loadServices();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingService({
      id: '',
      slug: '',
      title: '',
      description: '',
      image_url: null,
      features: [],
      icon_svg: null,
      display_order: services.length + 1,
      is_visible: true
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-earth-900">Services Manager</h2>
        <Button variant="primary" onClick={handleCreateNew}>
          + Add New Service
        </Button>
      </div>

      {/* Edit/Create Form */}
      {editingService && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isCreating ? 'Create New Service' : 'Edit Service'}
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <ServiceForm
              service={editingService}
              onSave={handleSave}
              onCancel={() => {
                setEditingService(null);
                setIsCreating(false);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-earth-900">
                      {service.title}
                    </h3>
                    {!service.is_visible && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-earth-600 mb-3">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-earth-500">
                    <span>Order: {service.display_order}</span>
                    <span>Slug: {service.slug}</span>
                    <span>{service.features.length} features</span>
                  </div>
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="mt-3 h-24 w-auto rounded object-cover"
                    />
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingService(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
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
  );
};

// Service Form Component
interface ServiceFormProps {
  service: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState(service);
  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Slug * (URL-friendly identifier)
        </label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="youth-mentorship"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url || ''}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Features
        </label>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                readOnly
                className="flex-1 px-3 py-2 bg-earth-50 border border-earth-200 rounded-lg"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
              placeholder="Add a feature..."
            />
            <Button type="button" variant="secondary" onClick={addFeature}>
              Add
            </Button>
          </div>
        </div>
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
          Save Service
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

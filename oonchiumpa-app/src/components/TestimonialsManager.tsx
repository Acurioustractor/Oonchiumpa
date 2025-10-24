import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  context: string | null;
  avatar_url: string | null;
  specialties: string[];
  source: string | null;
  impact_statement: string | null;
  category: string | null;
  display_order: number;
  is_visible: boolean;
}

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading testimonials:', error);
      alert('Error loading testimonials');
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (testimonial: Testimonial) => {
    if (testimonial.id && !isCreating) {
      // Update existing
      const { error } = await supabase
        .from('testimonials')
        .update({
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          context: testimonial.context,
          avatar_url: testimonial.avatar_url,
          specialties: testimonial.specialties,
          source: testimonial.source,
          impact_statement: testimonial.impact_statement,
          category: testimonial.category,
          display_order: testimonial.display_order,
          is_visible: testimonial.is_visible
        })
        .eq('id', testimonial.id);

      if (error) {
        console.error('Error updating testimonial:', error);
        alert('Error updating testimonial');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          quote: testimonial.quote,
          context: testimonial.context,
          avatar_url: testimonial.avatar_url,
          specialties: testimonial.specialties,
          source: testimonial.source,
          impact_statement: testimonial.impact_statement,
          category: testimonial.category,
          display_order: testimonial.display_order,
          is_visible: testimonial.is_visible
        });

      if (error) {
        console.error('Error creating testimonial:', error);
        alert('Error creating testimonial');
        return;
      }
    }

    setEditingTestimonial(null);
    setIsCreating(false);
    loadTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const { error} = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    } else {
      loadTestimonials();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTestimonial({
      id: '',
      name: '',
      role: '',
      quote: '',
      context: null,
      avatar_url: null,
      specialties: [],
      source: null,
      impact_statement: null,
      category: 'law_student',
      display_order: testimonials.length + 1,
      is_visible: true
    });
  };

  if (loading) {
    return <Loading />;
  }

  const filteredTestimonials = filterCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === filterCategory);

  const categories = ['all', ...Array.from(new Set(testimonials.map(t => t.category).filter(Boolean)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-earth-900">Testimonials Manager</h2>
        <Button variant="primary" onClick={handleCreateNew}>
          + Add Testimonial
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
            {cat === 'all' ? 'All' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>

      {/* Edit/Create Form */}
      {editingTestimonial && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isCreating ? 'Add New Testimonial' : 'Edit Testimonial'}
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <TestimonialForm
              testimonial={editingTestimonial}
              onSave={handleSave}
              onCancel={() => {
                setEditingTestimonial(null);
                setIsCreating(false);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                {testimonial.avatar_url && (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-earth-900">
                      {testimonial.name}
                    </h3>
                    {testimonial.category && (
                      <span className="px-2 py-1 bg-ochre-100 text-ochre-700 rounded text-xs capitalize">
                        {testimonial.category.replace('_', ' ')}
                      </span>
                    )}
                    {!testimonial.is_visible && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-earth-600 text-sm mb-2">{testimonial.role}</p>
                  <blockquote className="text-earth-700 italic mb-2 line-clamp-2 border-l-4 border-ochre-400 pl-3">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4 text-xs text-earth-500">
                    <span>Order: {testimonial.display_order}</span>
                    {testimonial.specialties.length > 0 && (
                      <span>{testimonial.specialties.length} specialties</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingTestimonial(testimonial)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
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

// Testimonial Form Component
interface TestimonialFormProps {
  testimonial: Testimonial;
  onSave: (testimonial: Testimonial) => void;
  onCancel: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonial, onSave, onCancel }) => {
  const [formData, setFormData] = useState(testimonial);
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Role *
          </label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
            placeholder="Law Student, ANU"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Quote *
        </label>
        <textarea
          required
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Context
        </label>
        <textarea
          value={formData.context || ''}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Background or additional context..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Impact Statement
        </label>
        <textarea
          value={formData.impact_statement || ''}
          onChange={(e) => setFormData({ ...formData, impact_statement: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Why this testimonial matters..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Avatar/Photo URL
        </label>
        <input
          type="url"
          value={formData.avatar_url || ''}
          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Specialties
        </label>
        <div className="space-y-2">
          {formData.specialties.map((specialty, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={specialty}
                readOnly
                className="flex-1 px-3 py-2 bg-earth-50 border border-earth-200 rounded-lg"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeSpecialty(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
              placeholder="Add a specialty..."
            />
            <Button type="button" variant="secondary" onClick={addSpecialty}>
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Category
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          >
            <option value="law_student">Law Student</option>
            <option value="youth">Youth</option>
            <option value="family">Family</option>
            <option value="partner">Partner</option>
            <option value="leadership">Leadership</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Source
          </label>
          <input
            type="text"
            value={formData.source || ''}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
            placeholder="Document name/date"
          />
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
          Save Testimonial
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

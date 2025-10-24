import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Card, CardBody, CardHeader } from './Card';
import { Button } from './Button';
import { Loading } from './Loading';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tribe: string | null;
  description: string | null;
  quote: string | null;
  avatar_url: string | null;
  display_order: number;
  is_visible: boolean;
}

export const TeamManager: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading team members:', error);
      alert('Error loading team members');
    } else {
      setTeamMembers(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (member: TeamMember) => {
    if (member.id && !isCreating) {
      // Update existing
      const { error } = await supabase
        .from('team_members')
        .update({
          name: member.name,
          role: member.role,
          tribe: member.tribe,
          description: member.description,
          quote: member.quote,
          avatar_url: member.avatar_url,
          display_order: member.display_order,
          is_visible: member.is_visible
        })
        .eq('id', member.id);

      if (error) {
        console.error('Error updating team member:', error);
        alert('Error updating team member');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          role: member.role,
          tribe: member.tribe,
          description: member.description,
          quote: member.quote,
          avatar_url: member.avatar_url,
          display_order: member.display_order,
          is_visible: member.is_visible
        });

      if (error) {
        console.error('Error creating team member:', error);
        alert('Error creating team member');
        return;
      }
    }

    setEditingMember(null);
    setIsCreating(false);
    loadTeamMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      alert('Error deleting team member');
    } else {
      loadTeamMembers();
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingMember({
      id: '',
      name: '',
      role: '',
      tribe: null,
      description: null,
      quote: null,
      avatar_url: null,
      display_order: teamMembers.length + 1,
      is_visible: true
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-earth-900">Team Members Manager</h2>
        <Button variant="primary" onClick={handleCreateNew}>
          + Add Team Member
        </Button>
      </div>

      {/* Edit/Create Form */}
      {editingMember && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isCreating ? 'Add New Team Member' : 'Edit Team Member'}
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <TeamMemberForm
              member={editingMember}
              onSave={handleSave}
              onCancel={() => {
                setEditingMember(null);
                setIsCreating(false);
              }}
            />
          </CardBody>
        </Card>
      )}

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                {member.avatar_url && (
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-earth-900">
                      {member.name}
                    </h3>
                    {!member.is_visible && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-ochre-600 font-medium mb-1">{member.role}</p>
                  {member.tribe && (
                    <p className="text-earth-600 text-sm mb-2">{member.tribe}</p>
                  )}
                  {member.description && (
                    <p className="text-earth-700 text-sm mb-2 line-clamp-2">
                      {member.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-earth-500 mt-3">
                    <span>Order: {member.display_order}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingMember(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
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

// Team Member Form Component
interface TeamMemberFormProps {
  member: TeamMember;
  onSave: (member: TeamMember) => void;
  onCancel: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState(member);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            placeholder="Director & Traditional Owner"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Tribe / Cultural Identity
        </label>
        <input
          type="text"
          value={formData.tribe || ''}
          onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Central & Eastern Arrernte Woman"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="Brief bio and background..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-900 mb-1">
          Quote
        </label>
        <textarea
          value={formData.quote || ''}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
          placeholder="A meaningful quote from this person..."
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
        {formData.avatar_url && (
          <img
            src={formData.avatar_url}
            alt="Preview"
            className="mt-2 w-24 h-24 rounded-full object-cover"
          />
        )}
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
          Save Team Member
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

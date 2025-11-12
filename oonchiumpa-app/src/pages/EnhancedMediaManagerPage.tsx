import React, { useState, useEffect } from 'react';
import { StaffPortalHeader } from '../components/StaffPortalHeader';
import { supabase } from '../config/supabase';
import { MediaUpload } from '../components/MediaUpload';

const OONCHIUMPA_ORG_ID = 'c53077e1-98de-4216-9149-6268891ff62e';

interface MediaItem {
  id: string;
  title: string;
  file_url: string;
  media_type: 'image' | 'video' | 'audio';
  service_area?: string;
  linked_outcome_id?: string;
  tags: string[];
  created_at: string;
  thumbnail_url?: string;
  source_empathy_entry_id?: string;
}

interface Outcome {
  id: string;
  title: string;
  service_area: string;
  indicator_name: string;
}

export default function EnhancedMediaManagerPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'service-galleries' | 'empathy-ledger'>('gallery');

  // Bulk actions
  const [bulkServiceArea, setBulkServiceArea] = useState('');
  const [bulkOutcomeId, setBulkOutcomeId] = useState('');
  const [bulkTags, setBulkTags] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load media from gallery_photos table
      const { data: photosData } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });

      // Load outcomes for linking
      const { data: outcomesData } = await supabase
        .from('outcomes')
        .select('id, title, service_area, indicator_name')
        .eq('organization_id', OONCHIUMPA_ORG_ID);

      // Transform data
      const mediaItems: MediaItem[] = (photosData || []).map(photo => ({
        id: photo.id,
        title: photo.title || photo.filename || photo.caption || 'Untitled',
        file_url: photo.photo_url,
        media_type: 'image',
        service_area: photo.service_area,
        linked_outcome_id: photo.linked_outcome_id,
        tags: photo.tags || [],
        created_at: photo.created_at,
        thumbnail_url: photo.thumbnail_url || photo.photo_url,
        source_empathy_entry_id: photo.source_empathy_entry_id
      }));

      setMedia(mediaItems);
      setOutcomes(outcomesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter media based on current filters
  const filteredMedia = media.filter(item => {
    // Search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && item.media_type !== filterType) {
      return false;
    }

    // Service filter
    if (filterService !== 'all' && item.service_area !== filterService) {
      return false;
    }

    // Tags filter
    if (filterTags.length > 0 && !filterTags.some(tag => item.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // Group media by service area
  const mediaByService = filteredMedia.reduce((acc, item) => {
    const service = item.service_area || 'untagged';
    if (!acc[service]) acc[service] = [];
    acc[service].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  // Get all unique tags
  const allTags = Array.from(new Set(media.flatMap(m => m.tags)));

  // Toggle media selection
  const toggleSelection = (mediaId: string) => {
    const newSelection = new Set(selectedMedia);
    if (newSelection.has(mediaId)) {
      newSelection.delete(mediaId);
    } else {
      newSelection.add(mediaId);
    }
    setSelectedMedia(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  // Select all visible media
  const selectAll = () => {
    setSelectedMedia(new Set(filteredMedia.map(m => m.id)));
    setShowBulkActions(true);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedMedia(new Set());
    setShowBulkActions(false);
  };

  // Apply bulk actions
  const applyBulkActions = async () => {
    if (selectedMedia.size === 0) return;

    const updates: any = {};
    if (bulkServiceArea) updates.service_area = bulkServiceArea;
    if (bulkOutcomeId) updates.linked_outcome_id = bulkOutcomeId;
    if (bulkTags) {
      const tagsArray = bulkTags.split(',').map(t => t.trim()).filter(t => t);
      updates.tags = tagsArray;
    }

    try {
      for (const mediaId of Array.from(selectedMedia)) {
        await supabase
          .from('gallery_photos')
          .update(updates)
          .eq('id', mediaId);
      }

      alert(`✅ Updated ${selectedMedia.size} items!`);
      clearSelection();
      loadData();
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const serviceNames: Record<string, string> = {
    youth_mentorship: 'Youth Mentorship',
    true_justice: 'True Justice',
    atnarpa_homestead: 'Atnarpa Homestead',
    cultural_brokerage: 'Cultural Brokerage',
    good_news_stories: 'Good News Stories',
    untagged: 'Untagged'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <StaffPortalHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-xl">Loading media...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <StaffPortalHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📸 Enhanced Media Manager</h1>
            <p className="text-gray-600">
              Manage photos and videos with advanced filtering, bulk tagging, and Impact Framework integration
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'gallery'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📁 Media Gallery
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'upload'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📤 Upload Media
            </button>
            <button
              onClick={() => setActiveTab('service-galleries')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'service-galleries'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎯 Service Galleries
            </button>
            <button
              onClick={() => setActiveTab('empathy-ledger')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'empathy-ledger'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💚 Empathy Ledger Photos
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Upload New Media</h2>
              <MediaUpload
                onUploadComplete={() => {
                  loadData();
                  alert('✅ Upload complete!');
                }}
                onUploadError={(error) => alert(`❌ Upload error: ${error.message}`)}
                maxFiles={20}
                acceptedTypes={['image/*', 'video/*']}
              />
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <>
              {/* Filters & Search */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">🔍 Filters & Search</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search titles..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>

                  {/* Service Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Area
                    </label>
                    <select
                      value={filterService}
                      onChange={(e) => setFilterService(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Services</option>
                      <option value="youth_mentorship">Youth Mentorship</option>
                      <option value="true_justice">True Justice</option>
                      <option value="atnarpa_homestead">Atnarpa Homestead</option>
                      <option value="cultural_brokerage">Cultural Brokerage</option>
                      <option value="good_news_stories">Good News Stories</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actions
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Showing {filteredMedia.length} of {media.length} items</span>
                    {selectedMedia.size > 0 && (
                      <span className="font-medium text-blue-600">
                        {selectedMedia.size} selected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bulk Actions Panel */}
              {showBulkActions && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    🏷️ Bulk Actions ({selectedMedia.size} items selected)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tag Service Area
                      </label>
                      <select
                        value={bulkServiceArea}
                        onChange={(e) => setBulkServiceArea(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">-- Select Service --</option>
                        <option value="youth_mentorship">Youth Mentorship</option>
                        <option value="true_justice">True Justice</option>
                        <option value="atnarpa_homestead">Atnarpa Homestead</option>
                        <option value="cultural_brokerage">Cultural Brokerage</option>
                        <option value="good_news_stories">Good News Stories</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link to Outcome
                      </label>
                      <select
                        value={bulkOutcomeId}
                        onChange={(e) => setBulkOutcomeId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">-- Select Outcome --</option>
                        {outcomes.map(outcome => (
                          <option key={outcome.id} value={outcome.id}>
                            {outcome.indicator_name} ({outcome.service_area})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={bulkTags}
                        onChange={(e) => setBulkTags(e.target.value)}
                        placeholder="e.g., trip, cultural, youth"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={applyBulkActions}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition"
                    >
                      ✅ Apply to {selectedMedia.size} Items
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                      selectedMedia.has(item.id)
                        ? 'border-blue-600 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedMedia.has(item.id)}
                        onChange={() => {}}
                        className="w-5 h-5 rounded"
                      />
                    </div>

                    {/* Image */}
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={item.thumbnail_url || item.file_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-white text-sm font-medium truncate">
                        {item.title}
                      </div>
                      {item.service_area && (
                        <div className="text-xs text-gray-300 mt-1">
                          {serviceNames[item.service_area]}
                        </div>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredMedia.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No media found</h3>
                  <p className="text-gray-600">Try adjusting your filters or upload new media</p>
                </div>
              )}
            </>
          )}

          {/* Service Galleries Tab */}
          {activeTab === 'service-galleries' && (
            <div className="space-y-8">
              {Object.entries(mediaByService).map(([service, items]) => (
                <div key={service} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {serviceNames[service] || service}
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {items.length} photos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {items.slice(0, 12).map(item => (
                      <div key={item.id} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail_url || item.file_url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-110 transition"
                        />
                      </div>
                    ))}
                  </div>

                  {items.length > 12 && (
                    <div className="mt-4 text-center">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View all {items.length} photos →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empathy Ledger Photos Tab */}
          {activeTab === 'empathy-ledger' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">💚 Photos from Empathy Ledger</h2>
                <p className="text-gray-600">
                  Photos automatically synced from Empathy Ledger storytelling sessions
                </p>
              </div>

              {(() => {
                const empathyPhotos = media.filter(item => item.source_empathy_entry_id);

                if (empathyPhotos.length === 0) {
                  return (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="text-4xl mb-4">💚</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Empathy Ledger photos yet</h3>
                      <p className="text-gray-600 mb-4">
                        Photos will appear here when empathy entries with media are synced
                      </p>
                      <p className="text-sm text-gray-500">
                        Go to the Empathy Ledger page to create entries with photos, then run the sync.
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        {empathyPhotos.length} photo{empathyPhotos.length !== 1 ? 's' : ''} synced from Empathy Ledger
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {empathyPhotos.map(item => (
                        <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                          <img
                            src={item.thumbnail_url || item.file_url}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-110 transition"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                            <p className="text-white text-xs font-medium truncate">{item.title}</p>
                            <p className="text-green-300 text-xs">💚 Empathy Ledger</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

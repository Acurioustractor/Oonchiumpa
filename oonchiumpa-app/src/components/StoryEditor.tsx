import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import MediaUpload from "./MediaUpload";
import { supabase, SUPABASE_PROJECT_ID } from "../config/supabase";
import { type MediaFile } from "../services/mediaService";

export interface Story {
  id?: string;
  title: string;
  content: string;
  story_category: string;
  tags: string[];
  is_public: boolean;
  privacy_level: "Public" | "Community" | "Private" | "Organization";
  storyteller_id: string;
  attachments?: MediaFile[];
  created_at?: string;
  updated_at?: string;
}

export interface Storyteller {
  id: string;
  full_name: string;
  email?: string;
  community?: string;
  bio?: string;
}

interface StoryEditorProps {
  storyId?: string;
  storytellerId?: string;
  onSave?: (story: Story) => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export const StoryEditor: React.FC<StoryEditorProps> = ({
  storyId,
  storytellerId,
  onSave,
  onCancel,
  mode = "create",
}) => {
const projectId = SUPABASE_PROJECT_ID || "";

const [story, setStory] = useState<Story>({
    title: "",
    content: "",
    story_category: "personal-experience",
    tags: [],
    is_public: false,
    privacy_level: "Community",
    storyteller_id: storytellerId || "",
  });

  const [storytellers, setStorytellers] = useState<Storyteller[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<MediaFile[]>([]);

  const storyCategories = [
    { id: "personal-experience", name: "Personal Experience", icon: "👤" },
    { id: "cultural-knowledge", name: "Cultural Knowledge", icon: "🪃" },
    { id: "family-history", name: "Family History", icon: "👨‍👩‍👧‍👦" },
    { id: "community-events", name: "Community Events", icon: "🎭" },
    { id: "traditional-practices", name: "Traditional Practices", icon: "🔥" },
    { id: "youth-experiences", name: "Youth Experiences", icon: "🌱" },
    { id: "healing-journey", name: "Healing Journey", icon: "🌈" },
    { id: "achievements", name: "Achievements", icon: "🏆" },
  ];

  const privacyLevels = [
    {
      id: "Public",
      name: "Public",
      description: "Visible to everyone",
      icon: "🌐",
      color: "text-green-600",
    },
    {
      id: "Community",
      name: "Community",
      description: "Visible to Oonchiumpa community",
      icon: "👥",
      color: "text-blue-600",
    },
    {
      id: "Organization",
      name: "Organization",
      description: "Visible to organization members",
      icon: "🏢",
      color: "text-purple-600",
    },
    {
      id: "Private",
      name: "Private",
      description: "Only visible to storyteller and admins",
      icon: "🔒",
      color: "text-red-600",
    },
  ];

  useEffect(() => {
    loadStorytellers();
    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const loadStorytellers = async () => {
    try {
      let query = supabase
        .from("storytellers")
        .select("id, full_name, email, community, bio");

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query.order("full_name");

      if (error) throw error;
      setStorytellers(data || []);
    } catch (error) {
      console.error("Error loading storytellers:", error);
    }
  };

  const loadStory = async () => {
    if (!storyId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", storyId)
        .single();

      if (error) throw error;

      setStory({
        id: data.id,
        title: data.title || "",
        content: data.content || "",
        story_category: data.story_category || "personal-experience",
        tags: data.tags || [],
        is_public: data.is_public || false,
        privacy_level: data.privacy_level || "Community",
        storyteller_id: data.storyteller_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
    } catch (error) {
      console.error("Error loading story:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveStory = async () => {
    if (!story.title.trim() || !story.content.trim() || !story.storyteller_id) {
      alert(
        "Please fill in all required fields: title, content, and storyteller.",
      );
      return;
    }

    setSaving(true);
    try {
      const storyData: Record<string, unknown> = {
        title: story.title.trim(),
        content: story.content.trim(),
        story_category: story.story_category,
        tags: story.tags,
        is_public: story.is_public,
        privacy_level: story.privacy_level,
        storyteller_id: story.storyteller_id,
      };

      if (projectId) {
        storyData.project_id = projectId;
      }

      let result;
      if (mode === "edit" && story.id) {
        const { data, error } = await supabase
          .from("stories")
          .update({
            ...storyData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", story.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("stories")
          .insert(storyData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      const savedStory: Story = {
        id: result.id,
        title: result.title,
        content: result.content,
        story_category: result.story_category,
        tags: result.tags || [],
        is_public: result.is_public,
        privacy_level: result.privacy_level,
        storyteller_id: result.storyteller_id,
        attachments: attachedMedia,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      onSave?.(savedStory);
    } catch (error) {
      console.error("Error saving story:", error);
      alert("Failed to save story. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !story.tags.includes(tag.trim())) {
      setStory((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStory((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleMediaUpload = (media: MediaFile) => {
    setAttachedMedia((prev) => [...prev, media]);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loading />
          <span className="ml-2">Loading story...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-earth-900">
            📝 {mode === "edit" ? "Edit Story" : "Create New Story"}
          </h1>
          <div className="flex space-x-3">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button variant="primary" onClick={saveStory} disabled={saving}>
              {saving ? <Loading size="sm" /> : "💾"}
              {saving
                ? "Saving..."
                : mode === "edit"
                  ? "Update Story"
                  : "Save Story"}
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              value={story.title}
              onChange={(e) =>
                setStory((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter the title of your story..."
              className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-ochre-500 focus:border-ochre-500 text-lg"
              required
            />
          </div>

          {/* Storyteller Selection */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Storyteller *
            </label>
            <select
              value={story.storyteller_id}
              onChange={(e) =>
                setStory((prev) => ({
                  ...prev,
                  storyteller_id: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
              required
            >
              <option value="">Select Storyteller</option>
              {storytellers.map((storyteller) => (
                <option key={storyteller.id} value={storyteller.id}>
                  {storyteller.full_name}{" "}
                  {storyteller.community && `(${storyteller.community})`}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Story Category
            </label>
            <select
              value={story.story_category}
              onChange={(e) =>
                setStory((prev) => ({
                  ...prev,
                  story_category: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
            >
              {storyCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Story Content */}
      <Card className="p-6">
        <label className="block text-sm font-medium text-earth-700 mb-2">
          Story Content *
        </label>
        <textarea
          value={story.content}
          onChange={(e) =>
            setStory((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Share your story here... Write in your own voice and style. This is your space to tell your experience authentically."
          rows={15}
          className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-ochre-500 focus:border-ochre-500 resize-y"
          required
        />
        <div className="mt-2 text-sm text-earth-600">
          {story.content.length} characters • ~
          {Math.ceil(story.content.split(" ").length / 200)} minute read
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <label className="block text-sm font-medium text-earth-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {story.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-ochre-100 text-ochre-800 text-sm rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-ochre-600 hover:text-ochre-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tags (press Enter to add)"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
          className="w-full px-3 py-2 border border-earth-300 rounded-md focus:ring-ochre-500 focus:border-ochre-500"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Family",
            "Culture",
            "Community",
            "Healing",
            "Youth",
            "Education",
            "Traditional Knowledge",
            "Personal Growth",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="px-3 py-1 text-sm bg-earth-100 text-earth-700 rounded-full hover:bg-earth-200"
            >
              + {tag}
            </button>
          ))}
        </div>
      </Card>

      {/* Privacy & Sharing Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">
          🛡️ Privacy & Cultural Protocols
        </h3>

        <div className="space-y-4">
          {/* Privacy Level */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-3">
              Who can see this story?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {privacyLevels.map((level) => (
                <label
                  key={level.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    story.privacy_level === level.id
                      ? "border-ochre-500 bg-ochre-50"
                      : "border-earth-200 hover:border-earth-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy_level"
                    value={level.id}
                    checked={story.privacy_level === level.id}
                    onChange={(e) =>
                      setStory((prev) => ({
                        ...prev,
                        privacy_level: e.target.value as Story["privacy_level"],
                        is_public: e.target.value === "Public",
                      }))
                    }
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{level.icon}</span>
                      <span className={`font-medium ${level.color}`}>
                        {level.name}
                      </span>
                    </div>
                    <div className="text-sm text-earth-600 mt-1">
                      {level.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cultural Sensitivity Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-amber-600 text-lg mr-2">⚠️</span>
              <div className="flex-1">
                <div className="font-medium text-amber-800 mb-1">
                  Cultural Review Process
                </div>
                <div className="text-amber-700 text-sm">
                  All stories undergo cultural review to ensure respectful
                  representation and appropriate sharing protocols. Stories
                  containing sacred or sensitive cultural content will require
                  Elder consultation before publication.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Media Attachments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-earth-900">
            📸 Story Media
          </h3>
          <Button
            variant="secondary"
            onClick={() => setShowMediaUpload(!showMediaUpload)}
          >
            {showMediaUpload ? "Hide Upload" : "Add Media"}
          </Button>
        </div>

        {attachedMedia.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {attachedMedia.map((media, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-3 bg-earth-50"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {media.type === "image"
                      ? "🖼️"
                      : media.type === "video"
                        ? "🎥"
                        : "📄"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-earth-900 truncate">
                      {media.title}
                    </div>
                    <div className="text-sm text-earth-600">{media.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showMediaUpload && (
          <MediaUpload
            category="story-media"
            storytellerId={story.storyteller_id}
            storyId={story.id}
            onUploadComplete={handleMediaUpload}
          />
        )}
      </Card>
    </div>
  );
};

export default StoryEditor;

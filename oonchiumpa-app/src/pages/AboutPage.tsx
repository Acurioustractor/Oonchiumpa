import React, { useState, useEffect } from "react";
import { Section } from "../components/Section";
import { Card, CardBody } from "../components/Card";
import { Button } from "../components/Button";
import MediaGallery from "../components/MediaGallery";
import MediaUpload from "../components/MediaUpload";
import { mediaService, type MediaFile } from "../services/mediaService";
import {
  CirclePattern,
  DotPattern,
  SpiralPattern,
} from "../design-system/symbols";

export const AboutPage: React.FC = () => {
  const [showTeamPhotoUpload, setShowTeamPhotoUpload] = useState(false);
  const [teamPhotos, setTeamPhotos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load team photos on component mount
  useEffect(() => {
    loadTeamPhotos();
  }, []);

  const loadTeamPhotos = async () => {
    try {
      setLoading(true);
      const photos = await mediaService.getMedia({
        category: "team-photos",
        elder_approved: true,
        cultural_sensitivity: ["public", "community"],
        type: "image",
      });
      setTeamPhotos(photos);
    } catch (error) {
      console.error("Failed to load team photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (media: MediaFile) => {
    setTeamPhotos((prev) => [media, ...prev]);
    setShowTeamPhotoUpload(false);
  };

  // TODO: Replace with real Oonchiumpa team members (Kristy Bloomfield, Tanya Turner, etc.)
  const teamMembers = [
    {
      name: "Kristy Bloomfield",
      role: "Director, Traditional Owner",
      description:
        "Leading with cultural authority and traditional ownership, driving exceptional outcomes through community connection.",
      image: null, // Will load from team member database
    },
    {
      name: "Tanya Turner",
      role: "Legal Advocate & Community Educator",
      description:
        "UWA law graduate and former Supreme Court associate, bringing professional excellence to community advocacy.",
      image: null, // Will load from team member database
    },
    {
      name: "Christie",
      role: "Community Team Member",
      description:
        "Supporting families and young people with deep understanding of community needs and cultural protocols.",
      image: null, // Will load from team member database
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-sand-50 via-sand-100 to-ochre-50 pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-earth-900 mb-6">
            About <span className="text-gradient">Oonchiumpa</span>
          </h1>
          <p className="text-lg md:text-xl text-earth-700">
            Founded on respect, guided by wisdom, and committed to creating
            meaningful connections between past, present, and future
            generations.
          </p>
        </div>
      </Section>

      {/* Our Story Section */}
      <Section id="story">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-earth-900">
              Our Story
            </h2>
            <div className="space-y-4 text-earth-700 leading-relaxed">
              <p>
                Oonchiumpa was born from a deep recognition that true
                understanding comes through authentic cultural exchange and
                respectful storytelling. Our journey began when a group of
                Aboriginal Elders, community leaders, and cultural advocates
                came together with a shared vision.
              </p>
              <p>
                We saw the need for a platform that could bridge the gap between
                ancient wisdom and modern understanding, creating spaces where
                traditional knowledge could be honored, preserved, and shared in
                ways that benefit entire communities.
              </p>
              <p>
                Today, we continue to grow as a movement that celebrates the
                richness of Aboriginal culture while fostering meaningful
                connections across all communities.
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <DotPattern className="w-8 h-8 text-ochre-500" />
              <CirclePattern className="w-8 h-8 text-eucalyptus-500" />
              <SpiralPattern className="w-8 h-8 text-sunset-500" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-ochre-100 to-eucalyptus-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <CirclePattern className="absolute inset-0 w-full h-full text-ochre-300 opacity-20" />
              <span className="text-earth-600 font-medium z-10">
                Our Story Visual
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Values */}
      <Section className="bg-earth-50">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardBody className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ochre-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-ochre-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-earth-900 mb-4">
                Our Mission
              </h3>
              <p className="text-earth-600 leading-relaxed">
                To preserve, celebrate, and share Aboriginal cultural wisdom
                while building bridges of understanding across all communities.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-eucalyptus-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-eucalyptus-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-earth-900 mb-4">
                Our Vision
              </h3>
              <p className="text-earth-600 leading-relaxed">
                A world where Aboriginal culture is understood, respected, and
                celebrated as a vital part of our shared human heritage.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sunset-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-sunset-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-earth-900 mb-4">
                Our Values
              </h3>
              <p className="text-earth-600 leading-relaxed">
                Respect, authenticity, community, and the profound
                responsibility of cultural stewardship guide everything we do.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* Team Section */}
      <Section id="team">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-earth-900 mb-4">
            Our Team
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto">
            Guided by Elders and driven by passionate advocates for cultural
            preservation and community connection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-ochre-100 to-eucalyptus-100 flex items-center justify-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-ochre-200 rounded-full flex items-center justify-center">
                      <span className="text-ochre-700 text-2xl font-semibold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <span className="text-earth-600 text-sm">
                      Team Photo Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <CardBody className="text-center">
                <h3 className="text-lg font-semibold text-earth-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-ochre-600 font-medium mb-3">{member.role}</p>
                <p className="text-earth-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* Team Photos Section */}
      <Section className="bg-earth-50" id="team-photos">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-earth-900 mb-4">
            📸 Team & Community Photos
          </h2>
          <p className="text-lg text-earth-700 max-w-2xl mx-auto mb-6">
            Capturing moments of connection, celebration, and community work
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              variant="primary"
              onClick={() => setShowTeamPhotoUpload(!showTeamPhotoUpload)}
            >
              {showTeamPhotoUpload
                ? "❌ Close Upload"
                : "📤 Upload Team Photos"}
            </Button>
          </div>
        </div>

        {/* Upload Interface */}
        {showTeamPhotoUpload && (
          <div className="mb-8">
            <MediaUpload
              category="team-photos"
              acceptedTypes={["image/*"]}
              maxFiles={10}
              onUploadComplete={handlePhotoUpload}
              onUploadError={(error) => {
                console.error("Upload error:", error);
                alert("Failed to upload photo: " + error.message);
              }}
            />
          </div>
        )}

        {/* Team Photos Gallery */}
        <MediaGallery
          category="team-photos"
          layout="grid"
          maxItems={50}
          allowFullscreen={true}
          showMetadata={true}
        />

        {/* Community Guidelines */}
        <Card className="mt-8 bg-gradient-to-r from-ochre-50 to-eucalyptus-50 border-ochre-200">
          <CardBody className="p-6 text-center">
            <h3 className="text-lg font-semibold text-earth-900 mb-3">
              🛡️ Photo Sharing Guidelines
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-earth-700">
              <div>
                <div className="font-medium text-ochre-700 mb-1">
                  Cultural Respect
                </div>
                <div>All photos undergo Elder review before publication</div>
              </div>
              <div>
                <div className="font-medium text-eucalyptus-700 mb-1">
                  Permission Required
                </div>
                <div>
                  Only upload photos with permission from all participants
                </div>
              </div>
              <div>
                <div className="font-medium text-sunset-700 mb-1">
                  Community Focus
                </div>
                <div>Share moments that celebrate our work and community</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Section>
    </>
  );
};

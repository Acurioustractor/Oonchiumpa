import React from "react";
import { Section } from "../components/Section";
import { leaders, staff, community, getInitials, type TeamMember } from "../data/team";
import { useOrgPeople, useStorytellers } from "../hooks/useEmpathyLedger";
import { EditableImage } from "../components/EditableImage";
import { HeroVideo } from "../components/HeroVideo";
import { useEditMode } from "../contexts/EditModeContext";

const EMPATHY_LEDGER_PEOPLE_URL =
  "https://www.empathyledger.com/admin/people";

function EditorHint({ source }: { source: "static" | "ledger" }) {
  const { isEditMode } = useEditMode();
  if (!isEditMode) return null;
  return (
    <div className="max-w-3xl mx-auto mb-10 rounded-xl border border-ochre-200 bg-ochre-50 p-4 text-sm text-earth-800">
      <p className="font-semibold text-ochre-800 mb-1">
        {source === "ledger"
          ? "Live from Empathy Ledger"
          : "Static fallback (this list)"}
      </p>
      {source === "ledger" ? (
        <p>
          These cards come from Empathy Ledger. To add or update someone,
          create / edit the person in EL with{" "}
          <code className="px-1 bg-white/60 rounded">membership_type</code>{" "}
          set and{" "}
          <code className="px-1 bg-white/60 rounded">is_public = true</code>.{" "}
          <a
            href={EMPATHY_LEDGER_PEOPLE_URL}
            target="_blank"
            rel="noreferrer"
            className="underline text-ochre-800"
          >
            Open Empathy Ledger →
          </a>
        </p>
      ) : (
        <p>
          Empathy Ledger has no records yet for this category, so the page
          shows the static fallback in{" "}
          <code className="px-1 bg-white/60 rounded">
            src/data/team.ts
          </code>
          . Edit that file to add a name or change a role. Add the person in{" "}
          <a
            href={EMPATHY_LEDGER_PEOPLE_URL}
            target="_blank"
            rel="noreferrer"
            className="underline text-ochre-800"
          >
            Empathy Ledger
          </a>{" "}
          to take this list live.
        </p>
      )}
    </div>
  );
}

function PersonCard({ member, size = "md" }: { member: TeamMember; size?: "lg" | "md" }) {
  const isLarge = size === "lg";
  const sizeClass = isLarge ? "w-36 h-36" : "w-24 h-24";

  const photoNode = member.photo ? (
    member.slotId ? (
      <EditableImage
        slotId={member.slotId}
        defaultSrc={member.photo}
        defaultAlt={member.name || "Oonchiumpa team member"}
        className="w-full h-full object-cover"
        wrapperClassName={`${sizeClass} rounded-full overflow-hidden mx-auto mb-4 border-2 border-earth-100`}
      />
    ) : (
      <img
        src={member.photo}
        alt={member.name}
        className={`${sizeClass} rounded-full object-cover mx-auto mb-4 border-2 border-earth-100`}
      />
    )
  ) : (
    <div
      className={`${isLarge ? "w-36 h-36 text-3xl" : "w-24 h-24 text-xl"} rounded-full bg-ochre-100 flex items-center justify-center mx-auto mb-4 border-2 border-ochre-200`}
    >
      <span className="text-ochre-700 font-semibold">
        {member.name ? getInitials(member.name) : "—"}
      </span>
    </div>
  );

  return (
    <div className={isLarge ? "text-center max-w-sm mx-auto" : "text-center"}>
      {photoNode}
      {member.name && (
        <h3 className={`${isLarge ? "text-xl" : "text-base"} font-display text-earth-950 font-semibold`}>
          {member.name}
        </h3>
      )}
      {member.isElder && (
        <p className="text-ochre-700 text-xs font-semibold uppercase tracking-[0.24em] mt-1">
          Elder
        </p>
      )}
      <p className="text-earth-600 text-sm mt-1">{member.role}</p>
      {member.location && (
        <p className="text-earth-400 text-xs mt-0.5">{member.location}</p>
      )}

      {isLarge && member.bio && (
        <p className="text-earth-700 text-base leading-relaxed mt-4 max-w-xs mx-auto">
          {member.bio}
        </p>
      )}

      {isLarge && member.quote && (
        <blockquote className="text-earth-600 text-sm italic leading-relaxed mt-4 max-w-xs mx-auto">
          "{member.quote}"
        </blockquote>
      )}

      {member.specialties && member.specialties.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {member.specialties.map((s) => (
            <span
              key={s}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-earth-100 text-earth-600"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export const TeamPage: React.FC = () => {
  const { storytellers } = useStorytellers(50);
  // Empathy Ledger "unified org people" model is the source of truth when
  // populated. Legacy role prefixes (Leader:/Staff:/Community:) have been
  // migrated into membership_type on the EL side — this page just asks for
  // each type and gets back is_public=true rows.
  const { people: orgPeople } = useOrgPeople(["leadership", "staff", "partner"]);

  const elLeaders = orgPeople.filter((p) => p.membershipType === "leadership");
  const elStaff = orgPeople.filter((p) => p.membershipType === "staff");
  const elCommunity = orgPeople.filter((p) => p.membershipType === "partner");

  // IDs already represented in the typed lists, so we don't double-show them
  // in the "voices" tail.
  const namedIds = new Set(orgPeople.map((p) => p.id));

  // Storytellers without a typed membership fall into the "voices" section.
  const voices = storytellers.filter(
    (s) =>
      s.isActive &&
      s.avatarUrl &&
      !namedIds.has(s.id) &&
      !leaders.some((l) => l.name === s.displayName) &&
      !community.some((c) => c.name === s.displayName),
  );

  const leadersToShow: TeamMember[] =
    elLeaders.length > 0
      ? elLeaders.map((p) => ({
          name: p.displayName,
          role: p.roleTitle ?? "Leader",
          category: "leader",
          photo: p.avatarUrl ?? undefined,
          bio: p.bio ?? undefined,
          isElder: false,
        }))
      : leaders;

  const staffToShow: TeamMember[] =
    elStaff.length > 0
      ? elStaff.map((p) => ({
          name: p.displayName,
          role: p.roleTitle ?? "Team Member",
          category: "staff",
          photo: p.avatarUrl ?? undefined,
          bio: p.bio ?? undefined,
          isElder: false,
        }))
      : staff;

  const communityToShow: TeamMember[] =
    elCommunity.length > 0
      ? elCommunity.map((p) => ({
          name: p.displayName,
          role: p.roleTitle ?? "Community",
          category: "community",
          photo: p.avatarUrl ?? undefined,
          bio: p.bio ?? undefined,
        }))
      : community;

  const activeStorytellers = voices;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/youth-walking.mp4"
          poster="/videos/hero/youth-walking.jpg"
          alt="Oonchiumpa staff and a young person working together on a swag"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 md:pb-24">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.24em] mb-4">
            Our people
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white leading-[1.08] mb-4">
            The people behind the work
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
            Leaders, staff, and community working together through cultural
            authority and shared commitment.
          </p>
        </div>
      </section>

      {/* Leaders */}
      {leadersToShow.length > 0 && (
        <Section className="bg-white">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Leadership</p>
            <h2 className="heading-lg mb-4">
              Cultural authority meets systems change
            </h2>
            <p className="lead-text max-w-3xl mx-auto">
              Oonchiumpa is led by people who hold cultural authority and
              professional expertise. Every decision is grounded in
              responsibility to Country and community.
            </p>
          </div>
          <EditorHint source={elLeaders.length > 0 ? "ledger" : "static"} />
          <div
            className={`grid ${leadersToShow.length === 1 ? "max-w-sm mx-auto" : leadersToShow.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-3 max-w-5xl mx-auto"} gap-12`}
          >
            {leadersToShow.map((member) => (
              <PersonCard key={member.slotId || member.name} member={member} size="lg" />
            ))}
          </div>
        </Section>
      )}

      {/* Team photo + Staff */}
      <Section className="bg-sand-50">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Our team</p>
          <h2 className="heading-lg mb-4">
            Run by community, for community
          </h2>
          <p className="lead-text max-w-3xl mx-auto">
            100% Aboriginal employment. Every staff member brings lived
            experience and cultural grounding to their work.
          </p>
        </div>

        {/* Team group photo */}
        <figure className="max-w-5xl mx-auto mb-16">
          <EditableImage
            slotId="team-group-photo"
            defaultSrc="/images/team/group-2024.jpg"
            defaultAlt="Oonchiumpa team 2024 in front of the True Justice artwork"
            className="w-full aspect-[3/2] object-cover"
            wrapperClassName="rounded-3xl overflow-hidden border border-earth-100 shadow-[var(--shadow-elevated)]"
          />
          <figcaption className="text-center text-earth-600 text-sm mt-4 italic">
            The Oonchiumpa team, 2024, in front of "True Justice: Indigenous
            Perspective &amp; Deep Listening on Country".
          </figcaption>
        </figure>

        {/*
          Individual staff cards intentionally hidden until each person is
          added to Empathy Ledger with confirmed name, role, and consent.
          The team group photo above is the source of truth for "who works
          here". To re-enable individual cards: add staff to EL with
          membership_type='staff', is_public=true — they'll appear here
          automatically.
        */}
      </Section>

      {/* Empathy Ledger storytellers (dynamic, if available) */}
      {activeStorytellers.length > 0 && (
        <Section className={staff.length > 0 ? "bg-white" : "bg-sand-50"}>
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our community</p>
            <h2 className="heading-lg mb-4">Storytellers and voices</h2>
            <p className="lead-text max-w-3xl mx-auto">
              Community members who share their stories through the Empathy
              Ledger, keeping the work visible and accountable.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {activeStorytellers.map((s) => (
              <div key={s.id} className="text-center">
                <img
                  src={s.avatarUrl!}
                  alt={s.displayName}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-earth-100"
                />
                <p className="text-earth-950 font-medium text-sm font-display">
                  {s.displayName}
                </p>
                {s.isElder && (
                  <p className="text-ochre-700 text-xs font-semibold uppercase tracking-[0.24em] mt-1">
                    Elder
                  </p>
                )}
                {s.role && (
                  <p className="text-earth-600 text-xs mt-0.5">{s.role}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Community partners / voices */}
      {communityToShow.length > 0 && (
        <Section
          className={
            activeStorytellers.length > 0
              ? staff.length > 0
                ? "bg-sand-50"
                : "bg-white"
              : staff.length > 0
                ? "bg-sand-50"
                : "bg-white"
          }
        >
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Community voices</p>
            <h2 className="heading-lg mb-4">Partners and supporters</h2>
            <p className="lead-text max-w-3xl mx-auto">
              People who have engaged with Oonchiumpa's work and carry its
              impact forward.
            </p>
          </div>
          <EditorHint source={elCommunity.length > 0 ? "ledger" : "static"} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {communityToShow.map((member) => (
              <PersonCard
                key={member.slotId || member.name}
                member={member}
                size="md"
              />
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden">
        <EditableImage
          slotId="team-cta-bg"
          defaultSrc="/images/model/atnarpa-land.jpg"
          defaultAlt="Atnarpa Station landscape"
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-earth-950/85" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-ochre-300 text-sm uppercase tracking-[0.24em] mb-8">
            Join the work
          </p>
          <h2 className="text-3xl md:text-4xl font-display text-white mb-6 leading-snug">
            Building Aboriginal workforce pathways
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Oonchiumpa creates pathways for Aboriginal workers, mentors, and
            leaders whose lived experience and cultural grounding strengthen
            every outcome.
          </p>
          <a
            href="/contact"
            className="btn-primary px-8"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  );
};

export default TeamPage;

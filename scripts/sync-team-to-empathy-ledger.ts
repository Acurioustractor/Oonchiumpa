/**
 * Sync team headshots + metadata to Empathy Ledger.
 *
 * This script is a TEMPLATE. The exact EL admin API shape may differ —
 * update the endpoints and request bodies to match your EL docs before running.
 *
 * Prerequisites:
 *   1. Run `python3 scripts/extract-team-headshots.py` first to produce
 *      headshots in oonchiumpa-app/public/images/team/.
 *   2. Rename headshots with real slugs (e.g. sarah-smith.png).
 *   3. Edit the TEAM_ROSTER array below with real names + roles.
 *   4. Export EL admin credentials:
 *        export EL_ADMIN_URL="https://..."
 *        export EL_ADMIN_KEY="..."
 *   5. Run: bunx tsx scripts/sync-team-to-empathy-ledger.ts
 *      (or: npx tsx scripts/sync-team-to-empathy-ledger.ts)
 *
 * What it does per person:
 *   - Checks if a storyteller with the same displayName already exists (dedup)
 *   - If not, creates one
 *   - Uploads the headshot as the avatar
 *   - Sets role with prefix convention (Staff: / Leader: / Community:)
 *
 * After this runs, the website's /team page pulls everything from EL.
 * You can then delete src/data/team.ts.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const EL_ADMIN_URL = process.env.EL_ADMIN_URL;
const EL_ADMIN_KEY = process.env.EL_ADMIN_KEY;
const HEADSHOT_DIR = path.resolve(
  __dirname,
  "../oonchiumpa-app/public/images/team",
);

interface RosterEntry {
  slug: string; // matches headshot filename: <slug>.png
  displayName: string;
  role: string; // include prefix: "Staff: Case Worker"
  isElder?: boolean;
  location?: string;
  bio?: string;
}

// EDIT THIS: 11 team members from the 2024 group photo
const TEAM_ROSTER: RosterEntry[] = [
  // Back row (standing), left to right
  { slug: "back-1", displayName: "TBD 1", role: "Staff: Team Member" },
  { slug: "back-2", displayName: "TBD 2", role: "Staff: Team Member" },
  { slug: "back-3", displayName: "TBD 3", role: "Staff: Team Member" },
  { slug: "back-4", displayName: "TBD 4", role: "Staff: Team Member" },
  { slug: "back-5", displayName: "TBD 5", role: "Staff: Team Member" },
  { slug: "back-6", displayName: "TBD 6", role: "Staff: Team Member" },
  { slug: "back-7", displayName: "TBD 7", role: "Staff: Team Member" },
  { slug: "back-8", displayName: "TBD 8", role: "Staff: Team Member" },
  // Front row (seated), left to right
  { slug: "front-1", displayName: "TBD 9", role: "Staff: Team Member" },
  { slug: "front-2", displayName: "TBD 10", role: "Staff: Team Member" },
  { slug: "front-3", displayName: "TBD 11", role: "Staff: Team Member" },
];

async function main() {
  if (!EL_ADMIN_URL || !EL_ADMIN_KEY) {
    console.error("❌ Missing env vars EL_ADMIN_URL and/or EL_ADMIN_KEY");
    console.error("   export EL_ADMIN_URL=... ; export EL_ADMIN_KEY=...");
    process.exit(1);
  }

  console.log(`📡 Using EL at ${EL_ADMIN_URL}`);
  console.log(`👥 Syncing ${TEAM_ROSTER.length} team members`);

  // Fetch existing storytellers to dedup
  const existingRes = await fetch(`${EL_ADMIN_URL}/api/v2/storytellers?limit=200`, {
    headers: { Authorization: `Bearer ${EL_ADMIN_KEY}` },
  });
  if (!existingRes.ok) {
    console.error(`❌ Failed to fetch existing storytellers: ${existingRes.status}`);
    process.exit(1);
  }
  const existing = await existingRes.json();
  const existingByName = new Map<string, { id: string }>();
  for (const s of existing.data ?? []) {
    existingByName.set(s.displayName.trim().toLowerCase(), { id: s.id });
  }
  console.log(`   Found ${existingByName.size} existing storytellers (for dedup)`);

  for (const entry of TEAM_ROSTER) {
    if (entry.displayName.startsWith("TBD")) {
      console.log(`⏭️  Skipping placeholder ${entry.slug} — set a real name first`);
      continue;
    }

    const key = entry.displayName.trim().toLowerCase();
    let storytellerId = existingByName.get(key)?.id;

    if (storytellerId) {
      console.log(`♻️  ${entry.displayName} exists (${storytellerId}) — updating role`);
      // PATCH role + location + bio
      await fetch(`${EL_ADMIN_URL}/api/v2/admin/storytellers/${storytellerId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${EL_ADMIN_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: entry.role,
          location: entry.location,
          bio: entry.bio,
          isElder: entry.isElder ?? false,
        }),
      });
    } else {
      console.log(`➕ Creating ${entry.displayName}`);
      const createRes = await fetch(`${EL_ADMIN_URL}/api/v2/admin/storytellers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EL_ADMIN_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: entry.displayName,
          role: entry.role,
          location: entry.location,
          bio: entry.bio,
          isElder: entry.isElder ?? false,
          isActive: true,
        }),
      });
      if (!createRes.ok) {
        console.error(`   ❌ Create failed: ${createRes.status} ${await createRes.text()}`);
        continue;
      }
      const created = await createRes.json();
      storytellerId = created.id ?? created.data?.id;
      console.log(`   ✅ Created ${storytellerId}`);
    }

    // Upload headshot
    const imagePath = path.join(HEADSHOT_DIR, `${entry.slug}.png`);
    if (!fs.existsSync(imagePath)) {
      console.warn(`   ⚠️  No headshot at ${imagePath} — skipping avatar upload`);
      continue;
    }

    const form = new FormData();
    const buf = fs.readFileSync(imagePath);
    form.append(
      "file",
      new Blob([buf], { type: "image/png" }),
      `${entry.slug}.png`,
    );

    const uploadRes = await fetch(
      `${EL_ADMIN_URL}/api/v2/admin/storytellers/${storytellerId}/avatar`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${EL_ADMIN_KEY}` },
        body: form,
      },
    );
    if (uploadRes.ok) {
      console.log(`   🖼️  Avatar uploaded`);
    } else {
      console.error(`   ❌ Avatar upload failed: ${uploadRes.status}`);
    }
  }

  console.log(`\n🎉 Done. The website's /team page will pick these up on next load.`);
  console.log(`   Delete src/data/team.ts once you've verified.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

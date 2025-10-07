// Comprehensive Supabase table discovery script
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverAllTables() {
  console.log("🔍 DISCOVERING ALL SUPABASE TABLES\n");
  console.log("=" .repeat(60));

  // Query PostgreSQL system tables to find all user tables
  const { data: tables, error } = await supabase.rpc("get_all_tables", {});

  if (error) {
    console.log("⚠️  RPC not available, trying direct table discovery...\n");

    // Alternative: Try common table names
    const commonTables = [
      // Auth & Users
      "profiles",
      "users",
      "user_profiles",
      "accounts",

      // Organizations
      "organizations",
      "orgs",
      "tenants",
      "projects",

      // Stories & Content
      "stories",
      "posts",
      "content",
      "articles",
      "blog_posts",

      // Transcripts
      "transcripts",
      "recordings",
      "audio_transcripts",
      "interviews",

      // Storytellers
      "storytellers",
      "authors",
      "contributors",
      "members",

      // Relationships
      "storyteller_organizations",
      "user_organizations",
      "organization_members",

      // Permissions
      "story_permissions",
      "permissions",
      "roles",
      "user_roles",

      // Media
      "media",
      "media_items",
      "uploads",
      "files",
      "images",

      // Outcomes & Impact
      "outcomes",
      "impact_metrics",
      "results",

      // Partners
      "partners",
      "partnerships",
      "funders",

      // Reviews
      "cultural_reviews",
      "reviews",
      "approvals",

      // Logs
      "story_access_logs",
      "access_logs",
      "audit_logs",
    ];

    console.log("📋 Checking common table names...\n");

    const existingTables = [];

    for (const tableName of commonTables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: false })
          .limit(1);

        if (!error) {
          existingTables.push({
            name: tableName,
            hasData: (data && data.length > 0) || false,
            count: count || 0,
            sample: data?.[0] || null,
          });
          console.log(`✅ ${tableName}`);
        }
      } catch (e) {
        // Table doesn't exist, skip
      }
    }

    console.log("\n" + "=" .repeat(60));
    console.log(`\n📊 FOUND ${existingTables.length} TABLES\n`);

    // Now get detailed info for each table
    for (const table of existingTables) {
      await inspectTable(table.name);
    }
  }
}

async function inspectTable(tableName) {
  console.log("\n" + "─".repeat(60));
  console.log(`📋 TABLE: ${tableName.toUpperCase()}`);
  console.log("─".repeat(60));

  try {
    // Get count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.log(`❌ Error: ${countError.message}`);
      return;
    }

    console.log(`📊 Total rows: ${count || 0}`);

    // Get sample data to understand structure
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1);

    if (error) {
      console.log(`❌ Error fetching data: ${error.message}`);
      return;
    }

    if (data && data.length > 0) {
      const sample = data[0];
      console.log(`\n📝 Columns (${Object.keys(sample).length}):`);

      // Show column names and types
      Object.entries(sample).forEach(([key, value]) => {
        const type = Array.isArray(value)
          ? "array"
          : value === null
            ? "null"
            : typeof value;
        const preview =
          typeof value === "string" && value.length > 50
            ? value.substring(0, 50) + "..."
            : value;
        console.log(
          `  • ${key.padEnd(25)} [${type.padEnd(8)}] ${preview !== null ? "= " + JSON.stringify(preview) : ""}`,
        );
      });

      // Check for common relationship fields
      const relationshipFields = Object.keys(sample).filter(
        (key) =>
          key.includes("_id") ||
          key.includes("_uuid") ||
          key === "organization_id" ||
          key === "storyteller_id" ||
          key === "user_id" ||
          key === "author_id",
      );

      if (relationshipFields.length > 0) {
        console.log(`\n🔗 Relationship fields:`);
        relationshipFields.forEach((field) => {
          console.log(`  • ${field} → ${sample[field]}`);
        });
      }
    } else {
      console.log("📭 Table is empty (no sample data)");

      // Still try to get column info by fetching with limit 0
      const { data: emptyData } = await supabase
        .from(tableName)
        .select("*")
        .limit(0);

      if (emptyData) {
        console.log("\n📝 Schema detected (table exists but empty)");
      }
    }

    // Get actual row count with data
    if (count && count > 0) {
      const { data: allData } = await supabase
        .from(tableName)
        .select("*")
        .limit(5);

      if (allData && allData.length > 0) {
        console.log(`\n📋 Sample records (showing ${allData.length}):`);
        allData.forEach((record, idx) => {
          const id = record.id || record.uuid || record.slug || idx;
          const name =
            record.title ||
            record.name ||
            record.public_name ||
            record.email ||
            "---";
          console.log(`  ${idx + 1}. [${id}] ${name}`);
        });
      }
    }
  } catch (error) {
    console.log(`💥 Failed to inspect table: ${error.message}`);
  }
}

// Main execution
(async () => {
  await discoverAllTables();

  console.log("\n" + "=".repeat(60));
  console.log("\n✨ DISCOVERY COMPLETE!\n");

  console.log("💡 Next steps:");
  console.log("  1. Review the tables found above");
  console.log("  2. Identify which tables have the data you need");
  console.log("  3. Map relationships between tables");
  console.log("  4. Determine if migration is needed\n");
})();

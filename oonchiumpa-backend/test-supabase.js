// Quick Supabase database schema test
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

async function testConnection() {
  console.log("🔍 Testing Supabase connection...");

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("storytellers")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error connecting to storytellers table:", error.message);
    } else {
      console.log("✅ Successfully connected to Supabase!");
      console.log("📊 Storytellers table exists:", data !== null);
    }

    // Check what tables exist
    console.log("\n🗃️  Checking available tables...");

    const tables = [
      "storytellers",
      "stories",
      "story_permissions",
      "story_reactions",
      "partners",
      "outcomes",
    ];

    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select("*")
          .limit(0);

        if (tableError) {
          console.log(`❌ ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ ${table}: exists`);
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("💥 Connection failed:", error.message);
  }
}

testConnection();

#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config();

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OONCHIUMPA_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID;

if (
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  SUPABASE_SERVICE_ROLE_KEY === "YOUR_SERVICE_ROLE_KEY_HERE" ||
  !OONCHIUMPA_PROJECT_ID
) {
  console.error(`❌ Missing Supabase Service Role Key!

To fix this:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/${
    SUPABASE_URL?.split(".")[0].split("//")[1] || "your-project-ref"
  }/settings/api
2. Copy your "service_role" key (NOT the anon key)
3. Add it to your .env file:
   SUPABASE_SERVICE_ROLE_KEY=eyJ...your_service_role_key_here

Then run this script again.`);
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createInitialAdmin() {
  try {
    console.log("🏛️ Creating initial admin account with service role key...");

    // First, check if admin user already exists
    console.log("🔍 Checking if admin user already exists...");
    const { data: existingAuth } = await supabase.auth.admin.listUsers();
    const existingUser = existingAuth.users?.find(
      (user) => user.email === "admin@oonchiumpa.org",
    );

    let authUserId;

    if (existingUser) {
      console.log("✅ Admin user already exists in Supabase Auth");
      authUserId = existingUser.id;
    } else {
      // Create admin user in Supabase Auth using service role
      console.log("🔐 Creating admin user in Supabase Auth...");
      const { data, error } = await supabase.auth.admin.createUser({
        email: "admin@oonchiumpa.org",
        password: "oonchiumpa2024!",
        email_confirm: true, // Skip email verification
        user_metadata: {
          full_name: "Kristy Bloomfield",
          role: "admin",
        },
      });

      if (error) {
        console.error("❌ Error creating auth user:", error.message);
        return;
      }

      authUserId = data.user.id;
      console.log("✅ Auth user created successfully");
    }

    // Check if user profile exists
    console.log("🔍 Checking if user profile exists...");
    const { data: existingProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUserId)
      .eq("project_id", OONCHIUMPA_PROJECT_ID)
      .single();

    if (existingProfile) {
      console.log("✅ User profile already exists in database");
    } else {
      // Create user profile in our custom table
      console.log("📝 Creating user profile in database...");
      const userProfile = {
        id: authUserId,
        email: "admin@oonchiumpa.org",
        full_name: "Kristy Bloomfield",
        role: "admin",
        project_id: OONCHIUMPA_PROJECT_ID,
        permissions: [
          "create_content",
          "edit_content",
          "delete_content",
          "approve_content",
          "manage_users",
          "manage_media",
          "view_analytics",
          "cultural_authority",
        ],
        is_active: true,
        cultural_authority: true,
        can_approve_content: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .insert(userProfile)
        .select()
        .single();

      if (profileError) {
        console.error("❌ Error creating user profile:", profileError.message);
        return;
      }

      console.log("✅ User profile created successfully");
    }

    console.log("\n🎉 ADMIN ACCOUNT READY!\n");
    console.log("📧 Email: admin@oonchiumpa.org");
    console.log("🔑 Password: oonchiumpa2024!");
    console.log("👑 Role: Administrator");
    console.log("🛡️ Cultural Authority: Yes");
    console.log("\n🚀 You can now login at: http://localhost:3001/login\n");
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

createInitialAdmin();

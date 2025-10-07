#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OONCHIUMPA_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID;

if (!SUPABASE_URL) {
  console.error("❌ Missing Supabase URL. Set SUPABASE_URL or VITE_SUPABASE_URL.");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing Supabase service role key. Add SUPABASE_SERVICE_ROLE_KEY to your environment.",
  );
  process.exit(1);
}

if (!OONCHIUMPA_PROJECT_ID) {
  console.error(
    "❌ Missing Supabase project ID. Add SUPABASE_PROJECT_ID or VITE_SUPABASE_PROJECT_ID to your environment.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createInitialAdmin() {
  try {
    console.log("🏛️ Creating initial admin account...");

    // Create admin user in Supabase Auth
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

    console.log("✅ Auth user created successfully");

    // Create user profile in our custom table
    const userProfile = {
      id: data.user.id,
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
    console.log("\n🎉 ADMIN ACCOUNT CREATED SUCCESSFULLY!\n");
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

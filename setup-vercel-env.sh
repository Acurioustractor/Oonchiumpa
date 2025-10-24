#!/bin/bash

# Setup Vercel Environment Variables for all environments

echo "Setting up Vercel environment variables..."

# Add VITE_SUPABASE_PROJECT_ID
echo "5b853f55-c01e-4f1d-9e16-b99290ee1a2c" | vercel env add VITE_SUPABASE_PROJECT_ID production preview development

# Add VITE_SUPABASE_URL
echo "https://yvnuayzslukamizrlhwb.supabase.co" | vercel env add VITE_SUPABASE_URL production preview development

# Add VITE_SUPABASE_ANON_KEY
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDQ4NTAsImV4cCI6MjA3MTgyMDg1MH0.UV8JOXSwANMl72lRjw-9d4CKniHSlDk9hHZpKHYN6Bs" | vercel env add VITE_SUPABASE_ANON_KEY production preview development

echo "Environment variables set!"
echo "Now run: vercel --prod --force"

/**
 * Contact email routing.
 *
 * Each inquiry type can route to a different email. Set these in .env
 * if you want separate inboxes. Falls back to the general admin email
 * if unset.
 *
 * Env vars:
 *   VITE_EMAIL_REFERRAL     , youth referrals
 *   VITE_EMAIL_PARTNERSHIP  : service partners, other organisations
 *   VITE_EMAIL_FUNDING      : funders, grants
 *   VITE_EMAIL_MEDIA        : press, media enquiries
 *   VITE_EMAIL_GENERAL      , everything else (also the fallback)
 */

export type InquiryType = "referral" | "partnership" | "funding" | "media" | "general";

const FALLBACK = "admin@oonchiumpaconsultancy.com.au";

const GENERAL_EMAIL = import.meta.env.VITE_EMAIL_GENERAL || FALLBACK;

export const inquiryEmails: Record<InquiryType, string> = {
  referral: import.meta.env.VITE_EMAIL_REFERRAL || GENERAL_EMAIL,
  partnership: import.meta.env.VITE_EMAIL_PARTNERSHIP || GENERAL_EMAIL,
  funding: import.meta.env.VITE_EMAIL_FUNDING || GENERAL_EMAIL,
  media: import.meta.env.VITE_EMAIL_MEDIA || GENERAL_EMAIL,
  general: GENERAL_EMAIL,
};

export function emailFor(inquiryType: InquiryType): string {
  return inquiryEmails[inquiryType] || GENERAL_EMAIL;
}

/** Subject line used for the fallback mailto if Supabase write fails */
export function subjectFor(inquiryType: InquiryType, name: string): string {
  const type = inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1);
  return `[Oonchiumpa · ${type}] from ${name}`;
}

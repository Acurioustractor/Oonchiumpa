import React, { useState } from "react";
import { supabase } from "../config/supabase";
import { emailFor, subjectFor, type InquiryType } from "../config/contact";

interface HowToEngageProps {
  serviceId: string;
  serviceTitle: string;
  /** Numbered steps showing the engagement process. */
  howItWorks: Array<{ step: string; detail: string }>;
  /** Primary contact person for this service. */
  contactPerson?: {
    name: string;
    role: string;
    email?: string;
    avatar?: string;
  };
  /** Which inbox to route the EOI to. */
  inquiryType?: InquiryType;
  /** Short label for the form submit, e.g. "Make a referral". */
  ctaLabel?: string;
  /** Optional override of the section heading. */
  heading?: string;
  /** Optional override of the section intro text. */
  intro?: string;
}

/**
 * Drops into every service detail page. Three parts:
 * 1. How it works, numbered steps the user can trust
 * 2. Who to contact: a specific human, not a generic email
 * 3. Inline EOI form: submit directly, routes to the right inbox
 */
export const HowToEngage: React.FC<HowToEngageProps> = ({
  serviceId,
  serviceTitle,
  howItWorks,
  contactPerson,
  inquiryType = "referral",
  ctaLabel = "Send enquiry",
  heading = "How to engage",
  intro,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const fullMessage = `[Service: ${serviceTitle}]\n\n${form.message}`;

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        organization: form.organization || null,
        inquiry_type: inquiryType,
        message: fullMessage,
      });
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      // Fallback to mailto routed to the right inbox
      const to = emailFor(inquiryType);
      const subject = encodeURIComponent(subjectFor(inquiryType, form.name));
      const body = encodeURIComponent(
        [
          `Name: ${form.name}`,
          `Email: ${form.email}`,
          `Organisation: ${form.organization || ", "}`,
          `Service: ${serviceTitle}`,
          `Type: ${inquiryType}`,
          "",
          form.message,
        ].join("\n"),
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setStatus("success");
    }
  };

  const resolvedIntro =
    intro ||
    `If ${serviceTitle} might be the right fit, here's how the process works. ${
      contactPerson
        ? `${contactPerson.name.split(" ")[0]} and the team will read every enquiry, no auto-responders.`
        : "The team reads every enquiry."
    }`;

  return (
    <section className="bg-sand-50 border-y border-earth-100 py-16 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">{ctaLabel}</p>
          <h2 className="heading-lg mb-4">{heading}</h2>
          <p className="lead-text">{resolvedIntro}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* How it works, steps */}
          <div className="lg:col-span-7">
            <h3 className="text-2xl font-display text-earth-950 mb-6">The process</h3>
            <ol className="space-y-5">
              {howItWorks.map((item, i) => (
                <li key={i} className="flex gap-5">
                  <div className="flex-none w-10 h-10 rounded-full bg-ochre-600 text-white flex items-center justify-center font-semibold">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <p className="font-display text-earth-950 font-semibold text-lg mb-1">
                      {item.step}
                    </p>
                    <p className="text-earth-700 text-base leading-relaxed">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Form + contact person */}
          <div className="lg:col-span-5">
            {status === "success" ? (
              <div className="section-shell p-8 text-center">
                <div className="w-14 h-14 bg-eucalyptus-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-eucalyptus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-display text-earth-950 mb-3">Thank you</h3>
                <p className="text-earth-700 leading-relaxed">
                  We've received your enquiry about <strong>{serviceTitle}</strong>. A team
                  member will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="section-shell p-7 md:p-8 space-y-4">
                {contactPerson && (
                  <div className="flex items-center gap-4 pb-5 border-b border-earth-100 mb-3">
                    {contactPerson.avatar ? (
                      <img
                        src={contactPerson.avatar}
                        alt={contactPerson.name}
                        className="w-14 h-14 rounded-full object-cover border border-earth-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-ochre-100 flex items-center justify-center border border-ochre-200 text-ochre-700 font-semibold">
                        {getInitials(contactPerson.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-ochre-600 font-semibold mb-0.5">
                        Contact
                      </p>
                      <p className="font-display text-earth-950 font-semibold">{contactPerson.name}</p>
                      <p className="text-earth-600 text-sm">{contactPerson.role}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="engage-name" className="block text-earth-950 font-medium text-sm mb-2">
                    Your name *
                  </label>
                  <input
                    id="engage-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl bg-white text-earth-950 focus:outline-none focus:border-ochre-500 focus:ring-4 focus:ring-ochre-100 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="engage-email" className="block text-earth-950 font-medium text-sm mb-2">
                    Email *
                  </label>
                  <input
                    id="engage-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl bg-white text-earth-950 focus:outline-none focus:border-ochre-500 focus:ring-4 focus:ring-ochre-100 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="engage-org" className="block text-earth-950 font-medium text-sm mb-2">
                    Organisation
                  </label>
                  <input
                    id="engage-org"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl bg-white text-earth-950 focus:outline-none focus:border-ochre-500 focus:ring-4 focus:ring-ochre-100 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="engage-msg" className="block text-earth-950 font-medium text-sm mb-2">
                    {inquiryType === "referral" ? "About the young person / situation" : "What are you enquiring about?"} *
                  </label>
                  <textarea
                    id="engage-msg"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={
                      inquiryType === "referral"
                        ? "Brief details help: age, situation, what kind of support would help."
                        : "A few sentences on what you're looking to explore."
                    }
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl bg-white text-earth-950 focus:outline-none focus:border-ochre-500 focus:ring-4 focus:ring-ochre-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : ctaLabel}
                </button>

                <p className="text-earth-500 text-xs text-center">
                  All enquiries are confidential. We respond to every message.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

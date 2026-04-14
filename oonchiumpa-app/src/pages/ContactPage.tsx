import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditableImage } from '../components/EditableImage';
import { HeroVideo } from '../components/HeroVideo';
import { ServiceProgramsRail } from '../components/ServiceProgramsRail';
import { supabase } from '../config/supabase';

type InquiryType = 'referral' | 'partnership' | 'funding' | 'media' | 'general';

const inputClassName =
  'w-full px-4 py-3.5 border border-earth-300 rounded-xl bg-white text-earth-950 focus:outline-none focus:border-ochre-500 focus:ring-4 focus:ring-ochre-100 transition-all';

const formatServiceLabel = (serviceId: string) =>
  serviceId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'general' as InquiryType,
    youngPersonAge: '',
    youngPersonGender: '',
    referralContext: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const requestedType = searchParams.get('type');
    const requestedService = searchParams.get('service');

    setFormData((prev) => {
      const next = { ...prev };

      const allowedTypes: InquiryType[] = ['referral', 'partnership', 'funding', 'media', 'general'];
      if (requestedType && allowedTypes.includes(requestedType as InquiryType)) {
        next.inquiryType = requestedType as InquiryType;
      }

      if (requestedService && !prev.message) {
        next.inquiryType = requestedType ? next.inquiryType : 'partnership';
        next.message = `I am interested in the ${formatServiceLabel(requestedService)} service and would like to discuss next steps.`;
      }

      return next;
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        organization: formData.organization || null,
        inquiry_type: formData.inquiryType,
        message:
          formData.inquiryType === 'referral'
            ? `Age: ${formData.youngPersonAge}\nGender: ${formData.youngPersonGender}\n\n${formData.referralContext}`
            : formData.message,
      });

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error('Submit error:', err);
      const subject = encodeURIComponent(`[${formData.inquiryType}] Inquiry from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nOrg: ${formData.organization}\nType: ${formData.inquiryType}\n\n${formData.message || formData.referralContext}`,
      );
      window.location.href = `mailto:admin@oonchiumpaconsultancy.com.au?subject=${subject}&body=${body}`;
      setStatus('success');
    }
  };

  const isReferral = formData.inquiryType === 'referral';

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-6 py-20">
        <div className="section-shell max-w-xl w-full p-10 text-center">
          <div className="w-16 h-16 bg-eucalyptus-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-eucalyptus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display text-earth-950 mb-4">Thank you</h1>
          <p className="text-earth-600 text-lg mb-8 leading-relaxed">
            We've received your {isReferral ? 'referral' : 'message'} and will be in touch soon.
          </p>
          <Link to="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/river-drone.mp4"
          poster="/videos/hero/river-drone.jpg"
          alt="Drone view of the Todd River bed at dawn"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/55 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14">
          <p className="eyebrow text-ochre-200 mb-4">Get in touch</p>
          <h1 className="heading-lg text-white mb-5 max-w-4xl">Contact Oonchiumpa</h1>
          <p className="text-white/85 text-lg max-w-3xl leading-relaxed">
            Make a referral, start a partnership, or ask about service delivery and collaboration opportunities.
          </p>
        </div>
      </section>

      <section className="bg-sand-50 py-12 md:py-16">
        <div className="container-custom grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 section-shell p-7 md:p-9">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-earth-950 font-semibold text-sm mb-3">What's this about?</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { value: 'referral', label: 'Referral' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'funding', label: 'Funding' },
                    { value: 'media', label: 'Media' },
                    { value: 'general', label: 'General' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          inquiryType: option.value as InquiryType,
                        }))
                      }
                      className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                        formData.inquiryType === option.value
                          ? 'border-ochre-500 bg-ochre-50 text-ochre-700'
                          : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-earth-950 font-medium text-sm mb-2">
                    Your name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-earth-950 font-medium text-sm mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-earth-950 font-medium text-sm mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-earth-950 font-medium text-sm mb-2">
                    Organisation
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className={inputClassName}
                  />
                </div>
              </div>

              {isReferral && (
                <div className="rounded-2xl border border-ochre-200 bg-ochre-50 p-6 space-y-5">
                  <p className="text-ochre-800 text-sm font-semibold">
                    Referral details (confidential)
                  </p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="youngPersonAge" className="block text-earth-950 font-medium text-sm mb-2">
                        Young person's age
                      </label>
                      <input
                        id="youngPersonAge"
                        name="youngPersonAge"
                        value={formData.youngPersonAge}
                        onChange={handleChange}
                        placeholder="e.g. 14"
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label htmlFor="youngPersonGender" className="block text-earth-950 font-medium text-sm mb-2">
                        Gender
                      </label>
                      <select
                        id="youngPersonGender"
                        name="youngPersonGender"
                        value={formData.youngPersonGender}
                        onChange={handleChange}
                        className={inputClassName}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="referralContext" className="block text-earth-950 font-medium text-sm mb-2">
                      Tell us about the situation
                    </label>
                    <textarea
                      id="referralContext"
                      name="referralContext"
                      rows={5}
                      value={formData.referralContext}
                      onChange={handleChange}
                      placeholder="What's happening? What support does this young person need?"
                      className={`${inputClassName} resize-none`}
                    />
                  </div>
                </div>
              )}

              {!isReferral && (
                <div>
                  <label htmlFor="message" className="block text-earth-950 font-medium text-sm mb-2">
                    Your message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required={!isReferral}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClassName} resize-none`}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending...' : isReferral ? 'Submit referral' : 'Send message'}
                </button>
                <p className="text-earth-500 text-sm">
                  Or email{' '}
                  <a href="mailto:admin@oonchiumpaconsultancy.com.au" className="text-ochre-700 hover:underline">
                    admin@oonchiumpaconsultancy.com.au
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="section-shell p-6">
              <p className="eyebrow mb-3">Direct contact</p>
              <h3 className="text-2xl font-display text-earth-950 mb-4">Reach the team</h3>
              <div className="space-y-4 text-earth-700 text-sm">
                <div>
                  <p className="font-semibold text-earth-950">Phone</p>
                  <a href="tel:0474702523" className="text-ochre-700 hover:text-ochre-800">
                    0474 702 523
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-earth-950">Email</p>
                  <a
                    href="mailto:admin@oonchiumpaconsultancy.com.au"
                    className="text-ochre-700 hover:text-ochre-800 break-all"
                  >
                    admin@oonchiumpaconsultancy.com.au
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-earth-950">Location</p>
                  <p>Alice Springs, Arrernte Country, NT</p>
                </div>
              </div>
            </div>

            <div className="section-shell p-6 bg-earth-950 text-white border-earth-900">
              <h3 className="text-xl font-display mb-3">Referral guidance</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                For urgent youth safety concerns, include key risks, current supports, and safe contact details.
              </p>
              <p className="text-xs text-ochre-200">
                We review referrals promptly and respond with culturally safe next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ServiceProgramsRail
        slotPrefix="contact-program"
        eyebrow="Program referrals"
        title="Choose the right support pathway"
        description="Use this overview to match your inquiry or referral to the most relevant Oonchiumpa program."
        className="bg-white"
      />
    </div>
  );
};

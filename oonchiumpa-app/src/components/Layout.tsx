import { Outlet, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const Layout = () => {
  const navigate = useNavigate();
  
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Stories', href: '/stories' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Contact', href: '/contact' },
  ];

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/about#story' },
        { label: 'Team', href: '/about#team' },
        { label: 'Careers', href: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Cultural Consulting', href: '/services#consulting' },
        { label: 'Education Programs', href: '/services#education' },
        { label: 'Community Engagement', href: '/services#community' },
        { label: 'Art & Design', href: '/services#art' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Stories', href: '/stories' },
        { label: 'Outcomes', href: '/outcomes' },
        { label: 'Gallery', href: '/stories#gallery' },
        { label: 'Videos', href: '/stories#videos' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Support', href: '/contact#support' },
        { label: 'Partnerships', href: '/contact#partnerships' },
        { label: 'Media Kit', href: '/contact#media' },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation 
        links={navLinks}
        ctaButton={{
          label: 'Get Started',
          onClick: () => navigate('/contact')
        }}
      />
      
      <main>
        <Outlet />
      </main>
      
      <Footer sections={footerSections} />
      <ScrollToTop />
    </div>
  );
};
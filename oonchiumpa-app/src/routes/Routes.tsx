import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { ServicesPage } from '../pages/ServicesPage';
import { StoriesPage } from '../pages/StoriesPage';
import { StoryDetailPage } from '../pages/StoryDetailPage';
import { OutcomesPage } from '../pages/OutcomesPage';
import { ContactPage } from '../pages/ContactPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:id" element={<StoryDetailPage />} />
        <Route path="outcomes" element={<OutcomesPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
};
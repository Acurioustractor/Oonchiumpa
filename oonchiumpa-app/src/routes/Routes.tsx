import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { ServicesPage } from "../pages/ServicesPage";
import { ServiceDetailPage } from "../pages/ServiceDetailPage";
import { StoriesPage } from "../pages/StoriesPage";
import { EnhancedStoryDetailPage } from "../pages/EnhancedStoryDetailPage";
import { OutcomesPage } from "../pages/OutcomesPage";
import { ImpactPage } from "../pages/ImpactPage";
import { ContactPage } from "../pages/ContactPage";
import ContentGeneratorPage from "../pages/ContentGeneratorPage";
import BlogPage from "../pages/BlogPage";
import BlogPostDetailPage from "../pages/BlogPostDetailPage";
import AdminPage from "../pages/AdminPage";
import StaffPortalPage from "../pages/StaffPortalPage";
import PresentationPage from "../pages/PresentationPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminSetupPage from "../pages/AdminSetupPage";
import InitialSetupPage from "../pages/InitialSetupPage";
import DemoLoginPage from "../pages/DemoLoginPage";
import EmpathyLedgerPage from "../pages/EmpathyLedgerPage";
import MediaManagerPage from "../pages/MediaManagerPage";
import ContentDashboardPage from "../pages/ContentDashboardPage";
import { GalleryUploadPage } from "../pages/GalleryUploadPage";
import DocumentsPage from "../pages/DocumentsPage";
import DocumentAnalysisPage from "../pages/DocumentAnalysisPage";
import ImpactOverviewPage from "../pages/ImpactOverviewPage";
import ServiceImpactDashboard from "../pages/ServiceImpactDashboard";
import AddOutcomePage from "../pages/AddOutcomePage";
import ImpactReportPage from "../pages/ImpactReportPage";
import EnhancedMediaManagerPage from "../pages/EnhancedMediaManagerPage";
import EmpathyLedgerManagementPage from "../pages/EmpathyLedgerManagementPage";
import EmpathyLedgerTestPage from "../pages/EmpathyLedgerTestPage";
import VideoGalleryPage from "../pages/VideoGalleryPage";
import ProtectedRoute from "../components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication routes - No layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-setup" element={<AdminSetupPage />} />
      <Route path="/setup" element={<InitialSetupPage />} />
      <Route path="/demo" element={<DemoLoginPage />} />

      {/* Staff Portal - No main layout (has its own header) */}
      <Route path="/staff-portal" element={<StaffPortalPage />} />
      <Route path="/staff-portal/documents" element={<DocumentsPage />} />
      <Route path="/staff-portal/documents/:documentId/analysis" element={<DocumentAnalysisPage />} />
      <Route path="/staff-portal/impact" element={<ImpactOverviewPage />} />
      <Route path="/staff-portal/impact/add-outcome" element={<AddOutcomePage />} />
      <Route path="/staff-portal/impact/report" element={<ImpactReportPage />} />
      <Route path="/staff-portal/impact/:serviceArea" element={<ServiceImpactDashboard />} />
      <Route path="/staff-portal/media-manager" element={<EnhancedMediaManagerPage />} />
      <Route path="/staff-portal/empathy-ledger-test" element={<EmpathyLedgerTestPage />} />
      <Route path="/staff-portal/empathy-ledger" element={<EmpathyLedgerManagementPage />} />
      <Route path="/staff" element={<StaffPortalPage />} />
      <Route path="/presentation" element={<PresentationPage />} />

      {/* Main public site with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:id" element={<EnhancedStoryDetailPage />} />
        <Route path="outcomes" element={<OutcomesPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogPostDetailPage />} />
        <Route path="videos" element={<VideoGalleryPage />} />
        <Route
          path="content-generator"
          element={
            <ProtectedRoute requiredPermission="create_content">
              <ContentGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredPermission="view_analytics">
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="empathy-ledger"
          element={
            <ProtectedRoute requireCulturalAuthority>
              <EmpathyLedgerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="media"
          element={
            <ProtectedRoute requiredPermission="manage_media">
              <MediaManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="content-dashboard"
          element={
            <ProtectedRoute requiredPermission="create_content">
              <ContentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="demo-dashboard" element={<ContentDashboardPage />} />
        <Route path="gallery-upload" element={<GalleryUploadPage />} />
      </Route>
    </Routes>
  );
};

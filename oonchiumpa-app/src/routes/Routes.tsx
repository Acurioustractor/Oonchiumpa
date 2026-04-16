import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Loading } from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";
// Home stays eager so first-paint doesn't show the Loading fallback.
import { HomePage } from "../pages/HomePage";

// Helper: lazy-load a named export (most of our pages use default, some use named).
const lazyNamed = <T extends string>(
  loader: () => Promise<Record<T, React.ComponentType>>,
  name: T,
) => lazy(() => loader().then((m) => ({ default: m[name] })));

const AboutPage = lazyNamed(() => import("../pages/AboutPage"), "AboutPage");
const ServicesPage = lazyNamed(() => import("../pages/ServicesPage"), "ServicesPage");
const ServiceDetailPage = lazyNamed(() => import("../pages/ServiceDetailPage"), "ServiceDetailPage");
const StoriesPage = lazyNamed(() => import("../pages/StoriesPage"), "StoriesPage");
const EnhancedStoryDetailPage = lazyNamed(
  () => import("../pages/EnhancedStoryDetailPage"),
  "EnhancedStoryDetailPage",
);
const OutcomesPage = lazyNamed(() => import("../pages/OutcomesPage"), "OutcomesPage");
const ImpactPage = lazyNamed(() => import("../pages/ImpactPage"), "ImpactPage");
const ContactPage = lazyNamed(() => import("../pages/ContactPage"), "ContactPage");
const GalleryUploadPage = lazyNamed(
  () => import("../pages/GalleryUploadPage"),
  "GalleryUploadPage",
);

const ContentGeneratorPage = lazy(() => import("../pages/ContentGeneratorPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));
const StaffPortalPage = lazy(() => import("../pages/StaffPortalPage"));
const PresentationPage = lazy(() => import("../pages/PresentationPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EmpathyLedgerPage = lazy(() => import("../pages/EmpathyLedgerPage"));
const MediaManagerPage = lazy(() => import("../pages/MediaManagerPage"));
const ContentDashboardPage = lazy(() => import("../pages/ContentDashboardPage"));
const DocumentsPage = lazy(() => import("../pages/DocumentsPage"));
const DocumentAnalysisPage = lazy(() => import("../pages/DocumentAnalysisPage"));
const ImpactOverviewPage = lazy(() => import("../pages/ImpactOverviewPage"));
const ServiceImpactDashboard = lazy(() => import("../pages/ServiceImpactDashboard"));
const AddOutcomePage = lazy(() => import("../pages/AddOutcomePage"));
const ImpactReportPage = lazy(() => import("../pages/ImpactReportPage"));
const EnhancedMediaManagerPage = lazy(() => import("../pages/EnhancedMediaManagerPage"));
const EmpathyLedgerManagementPage = lazy(() => import("../pages/EmpathyLedgerManagementPage"));
const EmpathyLedgerTestPage = lazy(() => import("../pages/EmpathyLedgerTestPage"));
const VideoGalleryPage = lazy(() => import("../pages/VideoGalleryPage"));
const BrandSandboxPage = lazy(() => import("../pages/BrandSandboxPage"));
const TeamPage = lazy(() => import("../pages/TeamPage"));
const OurJourneyPage = lazyNamed(() => import("../pages/OurJourneyPage"), "OurJourneyPage");
const YouthHubPage = lazy(() => import("../pages/YouthHubPage"));
const SystemTerminalPage = lazy(() => import("../pages/SystemTerminalPage"));
const ModelPage = lazy(() => import("../pages/ModelPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Authentication routes - No layout */}
        <Route path="/login" element={<LoginPage />} />
        {/* /admin-setup, /setup, /demo — dev-only, removed for production */}

        {/* Staff Portal - No main layout (has its own header) */}
        <Route
          path="/staff-portal"
          element={
            <ProtectedRoute>
              <StaffPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/documents/:documentId/analysis"
          element={
            <ProtectedRoute>
              <DocumentAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/impact"
          element={
            <ProtectedRoute>
              <ImpactOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/impact/add-outcome"
          element={
            <ProtectedRoute>
              <AddOutcomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/impact/report"
          element={
            <ProtectedRoute>
              <ImpactReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/impact/:serviceArea"
          element={
            <ProtectedRoute>
              <ServiceImpactDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/media-manager"
          element={
            <ProtectedRoute requiredPermission="manage_media">
              <EnhancedMediaManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/empathy-ledger-test"
          element={
            <ProtectedRoute requireCulturalAuthority>
              <EmpathyLedgerTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-portal/empathy-ledger"
          element={
            <ProtectedRoute requireCulturalAuthority>
              <EmpathyLedgerManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/presentation"
          element={
            <ProtectedRoute requiredPermission="view_analytics">
              <PresentationPage />
            </ProtectedRoute>
          }
        />

        {/* Standalone pages - no layout */}
        <Route path="/youth-hub" element={<YouthHubPage />} />
        <Route
          path="/system"
          element={
            <ProtectedRoute requiredRole="admin">
              <SystemTerminalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/model"
          element={
            <ProtectedRoute requiredRole="admin">
              <ModelPage />
            </ProtectedRoute>
          }
        />

        {/* Main public site with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="brand-sandbox"
            element={
              <ProtectedRoute requiredPermission="create_content">
                <BrandSandboxPage />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="our-journey" element={<OurJourneyPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="stories/:id" element={<EnhancedStoryDetailPage />} />
          <Route path="outcomes" element={<OutcomesPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<Navigate to="/stories" replace />} />
          <Route path="blog/:id" element={<Navigate to="/stories" replace />} />
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
          <Route
            path="demo-dashboard"
            element={
              <ProtectedRoute requiredPermission="create_content">
                <ContentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="gallery-upload"
            element={
              <ProtectedRoute requiredPermission="manage_media">
                <GalleryUploadPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

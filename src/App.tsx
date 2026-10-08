import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { PageBoundary } from "./components/shell/RouteFallback";
import LandingPage from "./pages/LandingPage";

// Landing stays eager: it is the entry route and the first paint.
// Everything behind the app shell is split out of the initial bundle.
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LiveInspectionPage = lazy(() => import("./pages/LiveInspectionPage"));
const AnalyzePage = lazy(() => import("./pages/AnalyzePage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const InspectionDetailPage = lazy(() => import("./pages/InspectionDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const RobotPage = lazy(() => import("./pages/RobotPage"));
const ModelPage = lazy(() => import("./pages/ModelPage"));
const SystemPage = lazy(() => import("./pages/SystemPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Suspense sits inside each page element, not around<Routes>, so
          AppShell and its sidebar stay mounted while a chunk resolves. */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<PageBoundary label="DASHBOARD"><DashboardPage /></PageBoundary>} />
        <Route path="/live-inspection" element={<PageBoundary label="LIVE INSPECTION"><LiveInspectionPage /></PageBoundary>} />
        <Route path="/analyze" element={<PageBoundary label="ANALYZE"><AnalyzePage /></PageBoundary>} />
        <Route path="/history" element={<PageBoundary label="INSPECTION ARCHIVE"><HistoryPage /></PageBoundary>} />
        <Route path="/history/:id" element={<PageBoundary label="INSPECTION RECORD"><InspectionDetailPage /></PageBoundary>} />
        <Route path="/analytics" element={<PageBoundary label="ANALYTICS"><AnalyticsPage /></PageBoundary>} />
        <Route path="/robot" element={<PageBoundary label="ROBOT CONTROL"><RobotPage /></PageBoundary>} />
        <Route path="/model" element={<PageBoundary label="MODEL RUNTIME"><ModelPage /></PageBoundary>} />
        <Route path="/system" element={<PageBoundary label="SYSTEM ARCHITECTURE"><SystemPage /></PageBoundary>} />
      </Route>

      <Route path="*" element={<PageBoundary label="NOT FOUND"><NotFoundPage /></PageBoundary>} />
    </Routes>
  );
}
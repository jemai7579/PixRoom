import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DemoLayout } from "../layouts/DemoLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { HomePage } from "../pages/public/HomePage";
import { LoginPage } from "../pages/public/LoginPage";
import { RegisterPage } from "../pages/public/RegisterPage";
import { PricingPage } from "../pages/public/PricingPage";
import { DashboardPage } from "../pages/app/DashboardPage";
import { CreateRoomPage } from "../pages/app/CreateRoomPage";
import { FriendsPage } from "../pages/app/FriendsPage";
import { RoomDetailsPage } from "../pages/app/RoomDetailsPage";
import { MarketplacePage } from "../pages/app/MarketplacePage";
import { RoomsPage } from "../pages/app/RoomsPage";
import { SettingsPage } from "../pages/app/SettingsPage";
import { DemoDashboardPage } from "../pages/demo/DemoDashboardPage";
import { DemoRoomsPage } from "../pages/demo/DemoRoomsPage";
import { DemoRoomDetailsPage } from "../pages/demo/DemoRoomDetailsPage";
import { DemoActivityPage } from "../pages/demo/DemoActivityPage";
import { DemoSubscriptionPage } from "../pages/demo/DemoSubscriptionPage";
import { DemoPhotographerPage } from "../pages/demo/DemoPhotographerPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { RoleRoute } from "./RoleRoute";
import { PhotographerDashboardPage } from "../pages/app/PhotographerDashboardPage";
import { PhotographerRequestsPage } from "../pages/app/PhotographerRequestsPage";
import { PhotographerPortfolioPage } from "../pages/app/PhotographerPortfolioPage";
import { PhotographerAvailabilityPage } from "../pages/app/PhotographerAvailabilityPage";
import { PhotographerServicesPage } from "../pages/app/PhotographerServicesPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="pricing" element={<PricingPage />} />
      </Route>

      <Route path="demo" element={<DemoLayout />}>
        <Route index element={<Navigate replace to="/demo/dashboard" />} />
        <Route path="dashboard" element={<DemoDashboardPage />} />
        <Route path="rooms" element={<DemoRoomsPage />} />
        <Route path="rooms/:roomId" element={<DemoRoomDetailsPage />} />
        <Route path="activity" element={<DemoActivityPage />} />
        <Route path="subscription" element={<DemoSubscriptionPage />} />
        <Route path="photographer" element={<DemoPhotographerPage />} />
      </Route>

      <Route element={<PublicOnlyRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="client-rooms" element={<RoomsPage />} />
          <Route path="rooms/new" element={<CreateRoomPage />} />
          <Route path="rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="profile" element={<Navigate replace state={{ settingsTab: "profile" }} to="/app/settings" />} />
          <Route path="photographers" element={<MarketplacePage />} />
          <Route path="marketplace" element={<Navigate replace to="/app/photographers" />} />
          <Route path="billing" element={<Navigate replace state={{ settingsTab: "subscription" }} to="/app/settings" />} />
          <Route path="assistant" element={<Navigate replace state={{ assistantOpen: true }} to="/app/dashboard" />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route element={<RoleRoute allowedRoles={["photographer"]} />}>
            <Route path="portfolio" element={<PhotographerPortfolioPage />} />
            <Route path="requests" element={<PhotographerRequestsPage />} />
            <Route path="availability" element={<PhotographerAvailabilityPage />} />
            <Route path="services" element={<PhotographerServicesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

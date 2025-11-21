import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import RouteLoadingFallback from "./components/common/RouteLoadingFallback";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./constants/routes";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const CreateMoviePage = lazy(() => import("./pages/CreateMoviePage"));
const EditMoviePage = lazy(() => import("./pages/EditMoviePage"));
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const UserDetailsPage = lazy(() => import("./pages/UserDetailsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ReviewDetailsPage = lazy(() => import("./pages/ReviewDetailsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ReportDetailsPage = lazy(() => import("./pages/ReportDetailsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route
                      path={ROUTES.DASHBOARD}
                      element={<DashboardPage />}
                    />
                    <Route path={ROUTES.MOVIES} element={<MoviesPage />} />
                    <Route
                      path={ROUTES.CREATE_MOVIE}
                      element={<CreateMoviePage />}
                    />
                    <Route
                      path="/movies/:id/edit"
                      element={<EditMoviePage />}
                    />
                    <Route path="/movies/:id" element={<MovieDetailsPage />} />
                    <Route path={ROUTES.USERS} element={<UsersPage />} />
                    <Route path="/users/:id" element={<UserDetailsPage />} />
                    <Route path={ROUTES.REVIEWS} element={<ReviewsPage />} />
                    <Route
                      path="/reviews/:id"
                      element={<ReviewDetailsPage />}
                    />
                    <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
                    <Route
                      path="/reports/:id"
                      element={<ReportDetailsPage />}
                    />
                    <Route
                      path={ROUTES.ANALYTICS}
                      element={<AnalyticsPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

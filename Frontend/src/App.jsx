import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { StorefrontProvider } from "./context/StorefrontContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CatalogPage from "./pages/CatalogPage";
import DetailsPage from "./pages/DetailsPage";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import SignupPage from "./pages/SignupPage";
import WatchPlayerPage from "./pages/WatchPlayerPage";

const catalogRoutes = [
  {
    path: "/movies",
    type: "movie",
    title: "Movies",
    subtitle: "Feature films, blockbusters, classics, and award season picks.",
  },
  {
    path: "/web-series",
    type: "webseries",
    title: "Web Series",
    subtitle: "Multi-episode originals with binge-ready arcs.",
  },
  {
    path: "/tv-shows",
    type: "show",
    title: "TV Shows",
    subtitle: "Reality, comedy, documentaries, kids programming, and weekly shows.",
  },
  {
    path: "/serials",
    type: "serial",
    title: "Serials",
    subtitle: "Daily drama, romance, family sagas, and long-running stories.",
  },
];

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <StorefrontProvider>
            <BrowserRouter>
              <div className="app-frame text-[var(--text)]">
                <Navbar />
                <main className="relative z-10">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    {catalogRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <CatalogPage
                            type={route.type}
                            title={route.title}
                            subtitle={route.subtitle}
                          />
                        }
                      />
                    ))}
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/details/:id" element={<DetailsPage />} />
                    <Route
                      path="/watch/:id"
                      element={
                        <ProtectedRoute>
                          <WatchPlayerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/watchlist"
                      element={
                        <ProtectedRoute>
                          <LibraryPage
                            collection="watchlist"
                            title="Watchlist"
                            subtitle="Titles you saved for later."
                          />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <LibraryPage
                            collection="favorites"
                            title="Favorites"
                            subtitle="Your highest-intent picks in one place."
                          />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </StorefrontProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

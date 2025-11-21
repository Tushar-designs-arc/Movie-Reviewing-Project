import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageMetadata from "../hooks/usePageMetadata";
import Button from "../components/common/Button";
import { ROUTES } from "../constants/routes";

const LoginPage = () => {
  usePageMetadata({
    title: "Admin Portal Sign In",
    description: "Sign in to MovieVerse Administrator Console",
  });

  const { isAuthenticated, isAdmin, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  // Redirect if already authenticated as admin
  if (isAuthenticated && isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password) {
      setErrorMessage("Please enter both email/username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // The API accepts one identifier field, which may be either an email or username.
      const payload = {
        loginId: formData.identifier.trim(),
        password: formData.password,
      };

      const user = await login(payload);

      if (user?.role !== "admin") {
        setErrorMessage(
          "Access Denied. Account does not possess administrator privileges.",
        );
        showToast("Access Denied: Admin role required.", "error");
        return;
      }

      showToast("Administrator sign-in successful.", "success");
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to sign in. Please verify your credentials.";
      setErrorMessage(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="cinema-panel rounded-3xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/15 text-red-500 shadow-inner">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-theme">Admin Sign In</h1>
          <p className="muted-copy mt-1.5 text-xs">
            Access MovieVerse System Management Portal
          </p>
          <p className="muted-copy mt-3 text-sm leading-6">
            For inspection purpose use <span className="text-red-500 font-bold">admin@gmail.com</span> & <span className="text-red-500 font-bold">admin@123</span> credentials.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl bg-red-600/15 p-4 text-xs font-semibold text-red-400 border border-red-500/30"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-bold text-theme mb-1.5"
            >
              Email or Username
            </label>
            <div className="relative">
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder="admin@movieverse.com"
                className="cinema-input py-3 pl-10 pr-4 text-sm"
                autoComplete="username"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-theme mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="cinema-input py-3 pl-10 pr-10 text-sm"
                autoComplete="current-password"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-3.5 text-muted hover:text-theme focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon={ArrowRight}
            className="w-full mt-2"
          >
            Authenticate Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

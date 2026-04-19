import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User, UserCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signup({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim() || undefined,
      });
      showToast("Account created.", "success");
      navigate("/profile");
    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="section-shell min-h-screen py-28">
      <div className="grid min-h-[680px] overflow-hidden rounded-lg border border-white/10 bg-black/[0.22] shadow-[0_28px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[460px_1fr]">
        <section className="cinema-panel flex items-center rounded-none border-0 p-6 sm:p-8">
          <form onSubmit={submit} className="w-full">
            <div className="mb-8">
              <p className="eyebrow">Signup</p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-white">
                Create your profile
              </h1>
              <p className="muted-copy mt-3 text-sm leading-6">
                Your account unlocks favorites, watchlist, and playback progress.
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-neutral-300">Name</span>
              <span className="relative mt-2 block">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="cinema-input px-3 py-3 pl-10"
                  required
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-neutral-300">Email</span>
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="cinema-input px-3 py-3 pl-10"
                  required
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-neutral-300">Password</span>
              <span className="relative mt-2 block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="cinema-input px-3 py-3 pl-10 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-neutral-400 transition hover:bg-white/10 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-neutral-300">Avatar URL</span>
              <input
                value={form.avatar}
                onChange={(event) => updateField("avatar", event.target.value)}
                placeholder="Optional"
                className="cinema-input mt-2 px-3 py-3"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="primary-action mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserCheck className="h-4 w-4" />
              {submitting ? "Creating..." : "Create Account"}
            </button>

            <p className="muted-copy mt-6 text-center text-sm">
              Already registered?{" "}
              <Link to="/login" className="font-bold text-red-300 transition hover:text-white">
                Sign in
              </Link>
            </p>
          </form>
        </section>

        <section
          className="relative hidden overflow-hidden p-8 lg:flex lg:flex-col lg:justify-end"
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(5,6,9,0.9), rgba(5,6,9,0.66), rgba(5,6,9,0.28)), url(https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-4 inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              New profile
            </p>
            <h2 className="text-6xl font-black leading-none text-white">
              Build a personal streaming shelf.
            </h2>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {["Save", "Resume", "Rate"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-black/[0.32] p-4">
                  <p className="text-xs font-black uppercase text-neutral-500">{item}</p>
                  <ArrowRight className="mt-3 h-5 w-5 text-red-400" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignupPage;

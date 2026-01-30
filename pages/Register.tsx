import React, { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard.tsx";
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.ts";
import { useApp } from "../context/AppContext.tsx";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Resend Logic
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Track intent: User explicitly wants to REGISTER
    sessionStorage.setItem("auth_intent", "register");

    try {
      const redirectTo = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      addNotification(
        "Google connection failed: " + (err.message || "Unknown error"),
        "error",
      );
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
        options: {
          emailRedirectTo: window.location.origin + "/login",
        },
      });

      if (error) throw error;
      addNotification("Verification email resent!", "success");
      setResendCooldown(60);
    } catch (err: any) {
      addNotification(err.message || "Failed to resend email", "error");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = formData.email.trim();
    const cleanName = formData.name.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin + "/login",
          data: {
            full_name: cleanName,
            phone: formData.phone,
            display_name: cleanName,
          },
        },
      });

      if (error) throw error;

      if (data.user && data.session === null) {
        setIsSuccess(true);
      } else if (data.session) {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.message.includes("User already registered")) {
        setErrorMsg("This email is already registered. Try logging in.");
      } else {
        setErrorMsg(
          err.message || "An unexpected error occurred during registration.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#f4f7f9] dark:bg-slate-950">
        <GlassCard className="w-full max-w-sm p-8 text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <Inbox size={40} className="text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              We've sent a confirmation link to{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {formData.email}
              </span>
              . Please verify your email to activate your account.
            </p>
          </div>

          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0 || resending}
            className="text-xs font-bold text-[#ff8c00] hover:text-[#e67e00] flex items-center justify-center gap-2 w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <RefreshCw size={14} />
            )}
            {resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "Resend Confirmation Email"}
          </button>

          <div className="pt-4 space-y-3">
            <Link
              to="/login"
              className="block w-full py-4 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20"
            >
              Back to Login
            </Link>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-widest font-bold">
              Didn't get the email? Check your spam folder.
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#f4f7f9] dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-sm space-y-8 animate-in slide-in-from-right duration-300 pt-10 pb-20">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-400 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Login</span>
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Join the community of 10k+ gamers
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
              {errorMsg}
            </p>
          </div>
        )}

        <GlassCard className="p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <UserIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                size={18}
              />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#ff8c00] transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                size={18}
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email Address"
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#ff8c00] transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                size={18}
              />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone Number"
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#ff8c00] transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                size={18}
              />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Create Password"
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#ff8c00] transition-colors placeholder:text-gray-400 dark:placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#ff8c00] text-white font-black hover:bg-[#e67e00] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading && formData.email ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-700" />
            <span className="text-[10px] font-bold text-gray-300 dark:text-slate-600 uppercase tracking-widest">
              Or register with
            </span>
            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-700" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-3 text-sm font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {loading && !formData.email ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
            )}
            CONTINUE WITH GOOGLE
          </button>
        </GlassCard>

        <p className="text-center text-sm text-gray-500 dark:text-slate-500">
          By registering, you agree to our{" "}
          <span className="text-[#ff8c00] dark:text-orange-400 font-bold">
            Terms of Service
          </span>
        </p>
      </div>
    </div>
  );
};

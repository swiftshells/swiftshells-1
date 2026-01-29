import React, { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard.tsx";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.ts";
import { useApp } from "../context/AppContext.tsx";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification, refreshUserData } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // For Supabase/Google "Redirect URI": This is the full path where the user lands
  const redirectUrl = window.location.origin + window.location.pathname;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("error_description")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const desc = params.get("error_description");
      if (desc) {
        addNotification(desc.replace(/\+/g, " "), "error");
      }
    }
  }, [addNotification]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Track intent: User intends to LOGIN, not create an account
    sessionStorage.setItem("auth_intent", "login");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });
      if (error) throw error;

      // Smart Redirect: Check Role immediately
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        await refreshUserData(); // Ensure context is updated

        if (profile?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err: any) {
      addNotification(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#f4f7f9] dark:bg-slate-950 transition-colors duration-300 py-12">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#ffdd00] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl overflow-hidden border-2 border-white dark:border-slate-800">
            <img
              src="https://picsum.photos/100/100?random=mango"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black leading-none mb-2">
            <span className="text-[#2c3e50] dark:text-white">SwiftShells</span>
            <span className="text-[#ff8c00]">TOPUP</span>
          </h1>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium uppercase tracking-widest">
            Gamer Marketplace
          </p>
        </div>

        <GlassCard className="p-8 relative overflow-hidden">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500"
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
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff8c00] transition-colors text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff8c00] transition-colors text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#ff8c00] text-white font-black hover:bg-[#e67e00] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading && formData.email ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "LOGIN TO ACCOUNT"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-100 dark:bg-slate-700" />
            <span className="text-[10px] font-bold text-gray-300 dark:text-slate-600 uppercase tracking-widest">
              Or login with
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

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#ff8c00] font-black hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

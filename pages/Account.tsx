import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.tsx";
import { GlassCard } from "../components/GlassCard.tsx";
import {
  ShieldCheck,
  ArrowUpRight,
  ShoppingBag,
  Crown,
  Key,
  Loader2,
  X,
  AlertTriangle,
  User as UserIcon,
  Phone,
  Save,
  LogOut,
  Shield,
} from "lucide-react";
import { supabase } from "../lib/supabase.ts";
import { useNavigate } from "react-router-dom";

export const Account: React.FC = () => {
  const { user, orders, logout, refreshUserData, addNotification } = useApp();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // Edit Profile State
  const [editFormData, setEditFormData] = useState({ name: "", phone: "" });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.app_metadata?.provider === "google") {
        setIsGoogleUser(true);
      }
    });
  }, []);

  if (!user) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPassMessage("Password must be at least 6 characters.");
      return;
    }
    setPassLoading(true);
    setPassMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setPassMessage("SUCCESS");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassMessage(null);
      }, 2000);
    } catch (err: any) {
      setPassMessage(err.message || "Failed to update password");
    } finally {
      setPassLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editFormData.name,
          phone: editFormData.phone,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Refresh local data to show changes immediately
      await refreshUserData();

      addNotification("Profile updated successfully", "success");
      setShowEditModal(false);
    } catch (err: any) {
      addNotification("Failed to update profile: " + err.message, "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const stats = [
    {
      label: "Support Pin",
      value: user.supportPin || "----",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      label: "Total Spent",
      value: `৳${orders.reduce((acc, o) => acc + o.amount, 0).toFixed(0)}`,
      icon: ArrowUpRight,
      color: "text-amber-400",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-sky-400",
    },
  ];

  return (
    <div className="space-y-6 pb-24 relative">
      <GlassCard className="p-6 bg-gradient-to-br from-violet-600/40 to-indigo-900/40 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown size={80} className="text-white" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white/20 text-white">
            {(user.name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name || "Gamer"}
              </h2>
              {user.isVerified && (
                <ShieldCheck size={16} className="text-sky-400" />
              )}
              {user.role === "admin" && (
                <span className="px-2 py-0.5 rounded bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              Vault Balance
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              ৳{(user.balance ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ADMIN PANEL SHORTCUT */}
      {user.role === "admin" && (
        <button
          onClick={() => navigate("/admin")}
          className="w-full p-4 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors animate-in slide-in-from-right duration-300"
        >
          <Shield size={20} />
          <span>Access Admin Dashboard</span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="p-4">
            <stat.icon size={20} className={`${stat.color} mb-2`} />
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-bold">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setEditFormData({ name: user.name || "", phone: user.phone || "" });
            setShowEditModal(true);
          }}
          className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-gray-700 dark:text-white"
        >
          <UserIcon size={16} />
          Edit Profile
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-gray-700 dark:text-white"
        >
          <Key size={16} />
          Change Password
        </button>
      </div>

      <button
        onClick={logout}
        className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors shadow-sm"
      >
        <LogOut size={18} />
        Log Out
      </button>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Edit Profile
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"
                  />
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30"
                  />
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={updateLoading}
                className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {updateLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
              Change Password
            </h3>
            {isGoogleUser ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="text-amber-500" size={32} />
                </div>
                <p className="text-gray-600 dark:text-white/70 text-sm">
                  Managed by Google account.
                </p>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-white/10 rounded-xl font-bold text-gray-900 dark:text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 chars)"
                  className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-violet-500"
                  autoFocus
                />
                {passMessage && (
                  <p className="text-xs text-red-500">{passMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={passLoading || !newPassword}
                  className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
                >
                  {passLoading && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  Update Password
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

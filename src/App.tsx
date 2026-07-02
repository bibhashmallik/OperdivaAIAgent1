import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Cpu, 
  Eye, 
  EyeOff, 
  Globe, 
  Layers, 
  Layout, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Search,
  MessageSquare,
  Clock,
  Key,
  ShieldCheck,
  Menu,
  X,
  Play,
  Pause,
  Mail,
  Lock,
  Github,
  Wallet,
  CreditCard,
  Loader2,
  Trash2,
  Copy,
  AlertCircle,
  Download,
  Activity,
  TrendingUp,
  HardDrive,
  BarChart3,
  Globe2,
  PieChart as PieChartIcon,
  Trophy,
  Users,
  ShieldAlert,
  History,
  Tag
} from "lucide-react";
import { useState, useEffect, FormEvent, useMemo } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, handleSupabaseError, OperationType } from "./supabase";

// CRITICAL: Validate Connection to Supabase
async function testConnection() {
  try {
    const { error } = await supabase.from('test').select('*').limit(1);
    if (error) throw error;
  } catch (error: any) {
    console.error("Supabase connection test failed. This is expected if the table doesn't exist yet.");
  }
}
testConnection();

type Plan = "None" | "Lite" | "Pro";
interface AppUser {
  name: string;
  email: string;
  plan: Plan;
  licenseKey?: string;
  isAdmin?: boolean;
}

interface Site {
  url: string;
  health: number;
  status: string;
  lastSync: string;
  apiKey: string;
  createdAt: any;
  id?: string;
}

const Navbar = ({ isLoggedIn, user }: { isLoggedIn: boolean, user: AppUser | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled || !isHomePage
          ? "glass py-3 border-b border-white/10 shadow-lg shadow-black/20" 
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Bot size={24} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">WP AI <span className="glow-text">Optimizer</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {isHomePage && (
            <>
              <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
            </>
          )}
          {user?.isAdmin && (
            <Link to="/analytics" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Analytics</Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors font-bold uppercase tracking-widest text-[10px] bg-brand-primary/10 px-2 py-1 rounded">Admin</Link>
          )}
          {!isLoggedIn && (
            <>
              <div className="h-4 w-[1px] bg-white/10" />
              <button 
                onClick={() => navigate("/auth")}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
              >
                Sign Up / Login
              </button>
            </>
          )}
          {isLoggedIn && (
             <Link to="/profile" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors ml-4 group">
                <div className="hidden sm:flex flex-col items-end leading-none translate-y-1">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{user?.plan} PLAN</span>
                  <span className="text-xs font-medium text-white">{user?.name}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:border-brand-primary/50 transition-all">
                  <Layout size={18} />
                </div>
             </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-400 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/5 p-6 space-y-4 shadow-2xl"
        >
          {isHomePage && (
            <>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#features" className="block text-lg font-medium text-slate-400 hover:text-white">Features</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#how-it-works" className="block text-lg font-medium text-slate-400 hover:text-white">How it Works</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#pricing" className="block text-lg font-medium text-slate-400 hover:text-white">Pricing</a>
            </>
          )}
          {user?.isAdmin && (
            <Link 
              to="/analytics" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-medium text-slate-400 hover:text-white"
            >
              Analytics
            </Link>
          )}
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-bold text-brand-primary"
            >
              Admin Dashboard
            </Link>
          )}
          {!isLoggedIn && (
            <div className="pt-4">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/auth");
                }}
                className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-sm font-bold"
              >
                Sign Up / Login
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 px-2 mb-4">
                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {user?.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">{user?.plan} PLAN</span>
                    <span className="text-lg font-bold text-white">{user?.name}</span>
                 </div>
              </div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/profile");
                }}
                className="w-full px-5 py-4 rounded-xl glass border-white/10 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Layout size={18} />
                Access Agent Console
              </button>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

const LoginPage = () => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setEmailError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      // Note: Google OAuth redirects, no need to navigate here
    } catch (error: any) {
      console.error("Google login error:", error);
      let msg = error?.message || "Google login failed.";
      if (msg === "{}" || typeof msg === "object") msg = "Google login failed. Please try again.";
      setEmailError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPassword = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setEmailError("Please enter your email.");
      return;
    }
    setIsLoading(true);
    setEmailError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/request-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send password.");
      }
      setStep("password");
      setMessage("A temporary password has been sent to your email address.");
    } catch (error: any) {
      console.error("Request password error:", error);
      setEmailError(error.message || "Failed to request password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setEmailError("Please enter the password received in your email.");
      return;
    }
    setIsLoading(true);
    setEmailError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      setEmailError(error.message || "Invalid password or login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 blur-[128px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/10 blur-[128px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 md:p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative"
      >
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
          aria-label="Close"
        >
          <X size={20} />
        </Link>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Success!</h2>
            <p className="text-slate-400">
              Welcome back to WP AI Optimizer.
            </p>
            <p className="text-slate-500 text-xs mt-4">Redirecting you to dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">
                {step === "email" ? "Sign In / Sign Up" : "Enter Password"}
              </h2>
              <p className="text-slate-400 text-sm">
                {step === "email" 
                  ? "Enter your email to receive a temporary password via SMTP" 
                  : `Enter the temporary password sent to ${email}`}
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {message}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleRequestPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={`w-full bg-slate-900 border ${emailError ? "border-red-500" : "border-slate-800"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors pl-11`}
                    />
                    <Mail className={`absolute left-4 top-3.5 ${emailError ? "text-red-500" : "text-slate-600"}`} size={18} />
                  </div>
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-wider"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending Password...
                    </>
                  ) : (
                    "Send Temporary Password"
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-[#0b1121] px-4 text-slate-600">Or continue with</span></div>
                </div>

                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-800 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                  disabled={isLoading}
                >
                  <Globe size={18} />
                  Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Temporary Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={`w-full bg-slate-900 border ${emailError ? "border-red-500" : "border-slate-800"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors pl-11`}
                    />
                    <Lock className={`absolute left-4 top-3.5 ${emailError ? "text-red-500" : "text-slate-600"}`} size={18} />
                  </div>
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-wider"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <div className="flex justify-between items-center mt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setEmailError("");
                      setMessage("");
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    ← Change Email
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleRequestPassword()}
                    disabled={isLoading}
                    className="text-xs font-bold text-brand-primary hover:underline disabled:opacity-50"
                  >
                    Resend Password
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};


const ProfilePage = ({ user, setUser }: { user: AppUser | null, setUser: (user: AppUser) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSites = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('createdAt', { ascending: false });
        
      if (error) {
        handleSupabaseError(error, OperationType.LIST, 'sites');
      } else if (data && isMounted) {
        setSites(data as Site[]);
      }
    };

    fetchSites();
    
    const channel = supabase.channel('public:sites')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, () => {
        fetchSites();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const [isAddingSite, setIsAddingSite] = useState(false);
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) return;
    setIsDownloading(true);
    try {
      const idToken = authData.session.access_token;
      const response = await fetch("/api/download-plugin", {
        headers: {
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        let errorMsg = "Download failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agentic-wp-plugin.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Download error:", error);
      alert(error.message || "Failed to download plugin.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleResendVerification = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user || isResending || resendCountdown > 0) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: authData.user.email || '',
      });
      if (error) throw error;
      alert("Verification email sent! Please check your inbox (and spam folder).");
      setResendCountdown(60); 
    } catch (error: any) {
      console.error("Resend verification error:", error);
      if (error.status === 429) {
        alert("Too many requests. Please wait a few minutes before trying again.");
        setResendCountdown(180); // Disable for 3 minutes on throttle
      } else {
        alert(error.message || "Failed to resend verification email. Please try again later.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const plan = user?.plan || "None";
  
  const setPlan = async (newPlan: Plan) => {
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user && user) {
      try {
        const { error } = await supabase.from("users").update({ plan: newPlan }).eq("id", authData.user.id);
        if (error) throw error;
        setUser({ ...user, plan: newPlan });
        alert(`Plan updated to ${newPlan} successfully.`);
      } catch (error) {
        handleSupabaseError(error, OperationType.UPDATE, `users/${authData.user.id}`);
      }
    }
  };

  const sitesUsed = sites.length;
  const sitesTotal = plan === "Pro" ? 10 : (plan === "Lite" ? 3 : 0);
  const usagePercentage = sitesTotal > 0 ? (sitesUsed / sitesTotal) * 100 : 0;

  const handleUpdateEmail = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user || !user) return;
    try {
      const { error: authError } = await supabase.auth.updateUser({ email: newEmail });
      if (authError) throw authError;

      const updatedUser = { ...user, email: newEmail };
      const { error: dbError } = await supabase.from("users").update({ email: newEmail }).eq("id", authData.user.id);
      if (dbError) throw dbError;

      setEmail(newEmail);
      setUser(updatedUser);
      setIsEditingEmail(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.UPDATE, `users/${authData.user.id}`);
    }
  };

  const handleRemoveSite = async (siteId: string) => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;
    try {
      const { error } = await supabase.from("sites").delete().eq("id", siteId).eq("user_id", authData.user.id);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, OperationType.DELETE, `sites/${siteId}`);
    }
  };

  const [unmaskedKeys, setUnmaskedKeys] = useState<Set<string>>(new Set());

  const toggleMask = (id: string) => {
    const newSet = new Set(unmaskedKeys);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setUnmaskedKeys(newSet);
  };

  const generateKey = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 15; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddSite = async (e: FormEvent) => {
    e.preventDefault();
    const { data: authData } = await supabase.auth.getUser();
    if (!newSiteUrl || !authData.user) return;
    
    if (sitesUsed >= sitesTotal) {
      alert("Plan limit reached. Please upgrade your plan.");
      return;
    }

    const newKey = generateKey();
    const siteData = {
      user_id: authData.user.id,
      url: newSiteUrl.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, ""),
      health: 100,
      status: "active",
      lastSync: "Just now",
      apiKey: newKey
    };

    try {
      const { error } = await supabase.from("sites").insert(siteData);
      if (error) throw error;
      setGeneratedKey(newKey);
      setNewSiteUrl("");
      setIsAddingSite(false);
    } catch (error) {
      handleSupabaseError(error, OperationType.CREATE, `sites`);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-[0.3em] mb-2"
            >
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Agent Console Active
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              System <span className="glow-text">Overview</span>
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl glass border-white/5 text-sm font-bold hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <X size={16} /> Logout
            </button>
            <button 
              onClick={() => {
                if (plan === "Lite") {
                  setPlan("Pro");
                } else {
                  navigate("/");
                  setTimeout(() => {
                    const el = document.getElementById("pricing");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center gap-2"
            >
              <Zap size={16} fill="white" /> {plan === "Lite" ? "Upgrade Now" : "Upgrade Plan"}
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Success Key Modal Overlay */}
          <AnimatePresence>
            {generatedKey && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="max-w-md w-full glass border-brand-primary p-10 rounded-[2.5rem] relative shadow-2xl"
                >
                  <button 
                    onClick={() => {
                      setGeneratedKey(null);
                      setCopied(false);
                    }}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="w-20 h-20 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Key size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">Paste API Key In Plugin</h3>
                  <p className="text-slate-400 text-center text-sm mb-8">Your 15-digit code has been generated. Copy and verify it in your WordPress dashboard.</p>
                  
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 relative group">
                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-3">Your API Key</div>
                    <code className="text-white font-mono text-xl tracking-wider break-all">{generatedKey}</code>
                  </div>

                  <button 
                    onClick={() => {
                      if (generatedKey) {
                        navigator.clipboard.writeText(generatedKey);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="w-full py-4 rounded-xl bg-brand-primary font-bold text-white shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={18} />
                        Copied to Clipboard
                      </>
                    ) : (
                      <>
                        <Layers size={18} />
                        Copy API Key
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass p-8 rounded-[2rem] border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  {user?.name.split(" ").map(n => n[0]).join("").toUpperCase() || "JD"}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name || "John Doe"}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-500 text-sm">{email}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-white/5 text-center">
                <button 
                  onClick={() => navigate("/billing")}
                  className="w-full py-4 rounded-xl glass border-brand-primary/20 text-brand-primary font-bold text-sm hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} /> Manage Billing & Subscription
                </button>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Plan Status</span>
                  <button 
                    onClick={() => navigate("/billing")}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-colors ${
                      plan === "None" 
                        ? "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20" 
                        : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                    }`}
                  >
                    {plan === "Pro" ? "Professional" : (plan === "Lite" ? "Lite" : "No Plan")}
                  </button>
                </div>

                {plan !== "None" && (
                  <div className="pt-4 space-y-4 text-left">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-sm shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all flex items-center justify-center gap-2 group"
                    >
                      {isDownloading ? (
                        <Loader2 size={18} className="animate-spin text-white" />
                      ) : (
                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                      )}
                      {isDownloading ? "Preparing File..." : "Download Plugin File"}
                    </motion.button>
                  </div>
                )}
                
                {/* Email Change Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</span>
                    <button 
                      onClick={() => setIsEditingEmail(!isEditingEmail)}
                      className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      {isEditingEmail ? "Cancel" : "Change"}
                    </button>
                  </div>
                  {isEditingEmail ? (
                    <div className="flex gap-2">
                      <input 
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary"
                      />
                      <button onClick={handleUpdateEmail} className="px-3 py-2 bg-brand-primary rounded-lg text-[10px] font-bold">Save</button>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-300">{email}</div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Security</span>
                    <button 
                      onClick={() => setIsEditingPassword(!isEditingPassword)}
                      className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      {isEditingPassword ? "Cancel" : "Change Password"}
                    </button>
                  </div>
                  {isEditingPassword && (
                    <div className="flex gap-2">
                      <input 
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-primary"
                      />
                      <button onClick={() => { setIsEditingPassword(false); setNewPassword(""); }} className="px-3 py-2 bg-brand-primary rounded-lg text-[10px] font-bold">Update</button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">API Key</span>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded">od_••••••••xK</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border-white/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">Subscription Info</h4>
              {plan === "None" ? (
                <div className="py-4">
                  <p className="text-sm text-slate-400 mb-6">You don't have an active subscription yet.</p>
                  <button 
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        const el = document.getElementById("pricing");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="w-full py-3 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap size={14} fill="white" /> View Plans
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg font-bold mb-4">You have used {sitesUsed}/{sitesTotal} sites.</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-brand-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    />
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    {sitesUsed >= sitesTotal ? "Plan limit reached." : `${sitesTotal - sitesUsed} slots remaining for AI optimization.`}
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Connected Sites */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {plan === "None" ? (
              <div className="glass p-12 rounded-[2rem] border-white/10 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-slate-500">
                  <Zap size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Optimization Locked</h3>
                <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">Subscribe to a plan to start optimizing your WordPress sites for AI agents and LLMs.</p>
                <button 
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      const el = document.getElementById("pricing");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold shadow-xl hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all flex items-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
                    <Globe size={20} className="text-brand-primary" />
                    Optimized Nodes
                  </h3>
                  {sitesUsed < sitesTotal && (
                    <button 
                      onClick={() => setIsAddingSite(!isAddingSite)}
                      className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      {isAddingSite ? "Cancel" : "+ Add New Site"}
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isAddingSite && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass p-8 rounded-[2rem] border-brand-primary/30 mb-8 space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Site URL</label>
                          <p className="text-[10px] text-slate-500">Provide the URL of the WordPress site you wish to optimize.</p>
                        </div>

                        <form onSubmit={handleAddSite} className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                              <Globe size={18} className="text-slate-500" />
                            </div>
                            <input 
                              type="text" 
                              required
                              placeholder="your-domain.com"
                              value={newSiteUrl}
                              onChange={(e) => setNewSiteUrl(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="px-8 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all whitespace-nowrap"
                          >
                            Generate 15-Digit Key
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {sites.map((item, i) => (
                  <div key={i} className="glass p-6 md:p-8 rounded-[2rem] border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                        <Layout size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1">{item.url}</h4>
                        {item.apiKey && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WP Plugin Key:</span>
                            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                              <code className="text-[11px] font-mono text-brand-primary min-w-[120px]">
                                {unmaskedKeys.has(item.id || "") ? item.apiKey : "•••••••••••••••"}
                              </code>
                              <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                                <button 
                                  onClick={() => toggleMask(item.id || "")}
                                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                  title={unmaskedKeys.has(item.id || "") ? "Hide Key" : "Show Key"}
                                >
                                  {unmaskedKeys.has(item.id || "") ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.apiKey);
                                    alert("API Key copied! Use this in your WordPress plugin settings.");
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                  title="Copy Key"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (confirm(`Remove optimization from ${item.url}? This will deactivate the node connection.`)) {
                            handleRemoveSite(item.id || "");
                          }
                        }}
                        className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Remove Site"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {sitesUsed < sitesTotal && (
                  <div 
                    onClick={() => setIsAddingSite(true)}
                    className="p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 gap-4 mt-8 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                      <Bot size={32} className="opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">Ready for next deployment</p>
                  </div>
                )}
                {sitesUsed >= sitesTotal && (
                   <div className="p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 gap-4 mt-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">Plan Limit Reached ({sitesUsed}/{sitesTotal})</p>
                    <button 
                      onClick={() => setPlan("Pro")}
                      className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      Upgrade to Pro for 10 sites
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="demo" className="py-16 px-6 relative overflow-hidden bg-[#020617]">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-brand-secondary/5 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-brand-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </div>
            <span>System Transmission Node</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter text-white">
            WP AI Optimizer <span className="text-brand-primary/80">In-Situ</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Witness the proprietary engine as it maps, optimizes, and broadcasts your site architecture to the agentic web.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, rotateX: 10, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto perspective-2000"
        >
          {/* Main Cinematic Frame Unit */}
          <div className="relative rounded-[3rem] p-px bg-gradient-to-b from-white/20 via-white/5 to-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] z-20">
            <div className="bg-slate-950 rounded-[2.9rem] overflow-hidden relative aspect-video group">
              <AnimatePresence mode="wait">
                {!isPlaying ? (
                  <motion.div 
                    key="gate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 z-30 cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  >
                    {/* Living Poster Ambient */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-[15s] ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                    </div>

                    {/* HUD Visualization */}
                    <div className="absolute inset-8 pointer-events-none border border-white/5 rounded-2xl overflow-hidden">
                      <motion.div 
                        animate={{ top: ['-10%', '110%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-px bg-brand-primary/40 shadow-[0_0_15px_rgba(14,165,233,0.5)] z-10"
                      />
                      
                      <div className="absolute top-6 left-8 font-mono text-[9px] text-brand-primary/60 tracking-widest uppercase space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-brand-primary rounded-full animate-ping" />
                          <span>Status: Link Ready</span>
                        </div>
                        <div>Signal: 0.98 Quality</div>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute -inset-12 bg-white/10 blur-[50px] rounded-full animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full glass border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-110">
                          <Play size={40} fill="white" className="ml-2 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 font-mono text-[9px] tracking-[0.5em] uppercase animate-pulse">
                      Initialize Neural Showcase
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative"
                  >
                    {/* Immersive HUD Overlay (Stays ABOVE video) */}
                    <div className="absolute inset-0 z-30 pointer-events-none">
                      {/* Scanlines & RGB Shift Feel */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_1px] opacity-30" />
                      
                      {/* Deep Environmental Vignette Mask */}
                      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9),inset_0_0_50px_rgba(14,165,233,0.1)]" />
                      
                      {/* Technical Framing */}
                      <div className="absolute inset-8 border border-white/5 rounded-3xl" />
                      
                      {/* Real-time Telemetry Data */}
                      <div className="absolute top-10 left-12 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                          <span className="text-[10px] font-mono text-brand-primary font-black tracking-[0.3em] uppercase">Stream: Optimized</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(12)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: [4, 12, 6] }}
                              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                              className="w-0.5 bg-brand-primary/40 rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Corner Brackets (Refined) */}
                      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-brand-primary/20 rounded-tl-[2rem]" />
                      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-brand-primary/20 rounded-tr-[2rem]" />
                      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-brand-primary/20 rounded-bl-[2rem]" />
                      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-brand-primary/20 rounded-br-[2rem]" />
                    </div>

                    {/* Technical Command to exit */}
                    <div className="absolute top-10 right-10 z-40">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                        className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/20 text-white transition-all group/exit shadow-2xl"
                      >
                        <div className="flex flex-col items-start leading-none gap-0.5">
                          <span className="text-[8px] font-mono opacity-60 uppercase tracking-tighter">Playback</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Pause Demo</span>
                        </div>
                        <div className="w-px h-8 bg-white/20 group-hover:bg-white/30" />
                        <Pause size={18} fill="white" className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* The Video Source: Scaled and offset to crop branding */}
                    <div className="w-full h-full overflow-hidden flex items-center justify-center bg-black">
                      <iframe 
                        className="w-[115%] h-[115%] scale-[1.1] origin-center -translate-y-1 opacity-95 contrast-[1.05]" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=0&mute=0&iv_load_policy=3&disablekb=1&fs=0&autohide=1" 
                        title="Proprietary Signal" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reflections Floor & Glow */}
          <div className="absolute -bottom-10 left-[10%] right-[10%] h-40 -z-10 perspective-1000 rotate-x-60">
             <div className="w-full h-full bg-brand-primary/10 blur-[100px] rounded-full animate-pulse" />
             <div className="absolute top-0 left-0 right-0 h-full bg-slate-950/40 rounded-[3rem] backdrop-blur-3xl border border-white/5" />
          </div>
        </motion.div>
      </div>

      {/* Floating Particulate Field */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, -180], 
              x: [0, Math.random() * 80 - 40],
              opacity: [0, 0.7, 0] 
            }}
            transition={{ 
              duration: 8 + Math.random() * 12, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            style={{ 
              left: `${Math.random() * 100}%`, 
              bottom: '5%' 
            }}
            className="absolute w-[2px] h-[2px] bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "How does WP AI Optimizer actually work?",
      a: "WP AI Optimizer scans your WordPress content and automatically injects advanced Schema.org JSON-LD and LLM-ready metadata. It restructures your site's data layer to ensure AI agents can parse your content without the 'noise' of traditional HTML."
    },
    {
      q: "Will this replace my existing SEO plugin?",
      a: "No, it works alongside plugins like Yoast or RankMath. While those focus on human searchers (Google/Bing), WP AI Optimizer focuses on the 'Agentic Web'—LLMs, data miners, and AI assistants."
    },
    {
      q: "Does it slow down my website?",
      a: "Quite the opposite. WP AI Optimizer is built for performance. It uses a lightweight caching layer and only serves extra metadata to verified AI agent crawlers, having zero impact on your core user experience."
    },
    {
      q: "Which AI agents are currently supported?",
      a: "We support all major agents including GPT-Bot (OpenAI), Google-Extended, Claude-Bot (Anthropic), PerplexityBot, and Common Crawl, plus specialized RAG pipelines."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 text-center">Frequently Asked <span className="glow-text">Questions</span></h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl glass border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className="text-brand-primary"
                >
                  <Layers size={20} />
                </motion.div>
              </button>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-8 pb-6 text-slate-400 leading-relaxed text-sm"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group p-8 rounded-3xl glass hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/5"
  >
    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
      {description}
    </p>
  </motion.div>
);

const ComparisonSection = () => {
  return (
    <section id="how-it-works" className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            The <span className="glow-text">AI Visibility</span> Gap
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Traditional SEO focuses on humans. WP AI Optimizer ensures search agents, data miners, and LLMs understand your content with 100% precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Eye size={120} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-widest text-red-500">Traditional Site View</span>
            </div>
            <h4 className="text-xl font-bold mb-4">What AI Agents struggle with:</h4>
            <ul className="space-y-4">
              {[
                "Ambiguous unstructured data fragments",
                "Non-semantic element nesting",
                "Broken context in dynamic content",
                "Infinite scrolling navigation blocks",
                "Missing LLM-specific meta directives"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-500 text-sm">
                  <X size={16} className="mt-1 flex-shrink-0 text-red-900" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-3xl glass border-brand-primary/30 relative overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 blur-2xl -z-10" />
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Bot size={120} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
              <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">WP AI Optimizer Optimized</span>
            </div>
            <h4 className="text-xl font-bold mb-4">The Agent-Readable Surface:</h4>
            <ul className="space-y-4">
              {[
                "Verified semantic schema markup",
                "Atomic content distillation for LLMs",
                "Instant context-propagation hooks",
                "Predictive agent navigation paths",
                "Zero-latency content indexing"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-200 text-sm">
                  <CheckCircle2 size={16} className="mt-1 flex-shrink-0 text-brand-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleCheck = (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    // Basic cleanup: remove http/https and trailing slashes
    const domain = url.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
    window.open(`https://isitagentready.com/${domain}`, "_blank");
  };

  return (
    <>
      {/* Hero Section */}
      <header className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/20 blur-[128px] rounded-full -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/20 blur-[128px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap size={14} fill="currentColor" />
            <span>The New Era of SEO is AI-First</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight mb-8"
          >
            Don't build for browsers. <br />
            <span className="glow-text">Optimize for Agents.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            WP AI Optimizer is the essential WordPress plugin that ensures your website content is fully readable, indexable, and trusted by AI agents like Gemini, Claude, and GPT-Bot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <button 
              onClick={() => navigate("/auth")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all flex items-center justify-center gap-2"
            >
              Get Started for Free <Bot size={20} />
            </button>
            <a 
              href="#pricing"
              className="px-8 py-4 rounded-2xl glass border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all"
            >
              View Pricing
            </a>
          </motion.div>

          {/* SEO Checker Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-2xl border border-brand-primary/30 p-2 rounded-3xl flex flex-col md:flex-row gap-2 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative mb-12 ring-1 ring-white/10"
          >
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-brand-primary text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] animate-pulse">
              Free Live Scan
            </div>
            <form onSubmit={handleCheck} className="flex-1 flex flex-col md:flex-row gap-2 w-full">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Globe size={18} className="text-brand-primary/70" />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter your website URL (e.g. example.com)..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white border border-brand-primary/20 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none shadow-xl"
                />
              </div>
              <button 
                type="submit"
                className="whitespace-nowrap px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
              >
                Analyze Site <Search size={20} />
              </button>
            </form>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/5 relative"
          >
            <p className="text-xs uppercase font-bold tracking-[0.3em] text-slate-500 mb-6">Trusted by the AI Ecosystem</p>
            
            <div className="flex overflow-hidden group select-none">
              <div className="flex gap-16 animate-infinite-scroll group-hover:[animation-play-state:paused] py-4 pr-16">
                {[
                  "OpenAI", "Google", "Anthropic", "Perplexity", "Mistral", "Meta AI", "Microsoft", "Groq"
                ].map(name => (
                  <span key={name} className="text-2xl md:text-3xl font-display font-bold text-slate-400/50 hover:text-brand-primary transition-colors cursor-default whitespace-nowrap">
                    {name}
                  </span>
                ))}
              </div>
              <div className="flex gap-16 animate-infinite-scroll group-hover:[animation-play-state:paused] py-4 pr-16" aria-hidden="true">
                {[
                  "OpenAI", "Google", "Anthropic", "Perplexity", "Mistral", "Meta AI", "Microsoft", "Groq"
                ].map(name => (
                  <span key={name} className="text-2xl md:text-3xl font-display font-bold text-slate-400/50 hover:text-brand-primary transition-colors cursor-default whitespace-nowrap">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="py-12 px-6 relative overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-primary/0 via-brand-primary/20 to-brand-primary/0" />
            
            {[
              {
                step: "01",
                title: "Install & Sync",
                desc: "One-click installation on any WordPress site. WP AI Optimizer instantly maps your content structure.",
                icon: Layers
              },
              {
                step: "02",
                title: "Agent Optimization",
                desc: "Our engine injects LLM-optimized metadata and semantic hooks specifically for AI crawlers.",
                icon: Bot
              },
              {
                step: "03",
                title: "Broadcast Updates",
                desc: "Changes are instantly pushed to AI indexes, making your site the primary source for agents.",
                icon: Zap
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-3xl glass border-brand-primary/20 flex items-center justify-center text-brand-primary mb-8 relative group">
                  <div className="absolute -inset-2 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <item.icon size={40} className="relative z-10" />
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VideoSection />


      {/* Features Grid */}
      <section id="features" className="py-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Engineered for <span className="glow-text">Future-Ready</span> Content</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Advanced content restructuring that works behind the scenes, so you don't have to change how you write.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Globe}
              title="Global AI Indexing"
              description="Automatically submits semantic content updates to major AI indices, ensuring LLMs have your freshest data."
              delay={0.1}
            />
            <FeatureCard 
              icon={Cpu}
              title="Schema Automation"
              description="Deep analysis of your content to wrap it in complex, verified JSON-LD schema that AI agents crave."
              delay={0.2}
            />
            <FeatureCard 
              icon={MessageSquare}
              title="Agent-Friendly Chat"
              description="Optimizes your internal search and content for RAG (Retrieval-Augmented Generation) pipelines."
              delay={0.3}
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Verified Sourcing"
              description="Implements cryptographically signed metadata so AI agents can verify your site as a primary source."
              delay={0.4}
            />
            <FeatureCard 
              icon={Layers}
              title="Granular Context"
              description="Maintain context across long-form content with hierarchical data structuring for better summarization."
              delay={0.5}
            />
            <FeatureCard 
              icon={Layout}
              title="UI-Independent Data"
              description="Separates your presentation layer from the data layer for frictionless agent crawling."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      <ComparisonSection />

      <FAQSection />

      {/* Pricing Section */}
      <section id="pricing" className="pt-12 pb-6 px-6 bg-slate-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-20 text-center">Simple Pricing for <span className="glow-text">Smart Content</span></h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 pt-8">
            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 font-bold mb-4">Lite</span>
              <div className="text-4xl font-display font-bold mb-8">$10<span className="text-xl text-slate-500">/bundle</span></div>
              <ul className="text-slate-400 space-y-4 mb-10 text-sm">
                <li>3 Website Licenses</li>
                <li>Basic Schema Markup</li>
                <li>Standard Meta Directives</li>
                <li>Core Optimization</li>
              </ul>
              <button onClick={() => navigate("/billing")} className="mt-auto w-full py-4 rounded-xl border border-slate-800 font-bold hover:bg-slate-800 transition-colors">Select Lite</button>
            </div>

            <div className="p-10 rounded-3xl glass border-brand-primary/50 flex flex-col items-center relative scale-110 shadow-2xl z-20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest">Growth Plan</div>
              <span className="text-brand-primary font-bold mb-4">Pro</span>
              <div className="text-5xl font-display font-bold mb-8">$25<span className="text-xl text-slate-500">/bundle</span></div>
              <ul className="text-slate-200 space-y-4 mb-10 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-primary" /> 10 Websites Simultaneously</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-primary" /> Advanced JSON-LD Generation</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-primary" /> RAG Optimization Hooks</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-primary" /> Priority Email Support</li>
              </ul>
              <button onClick={() => navigate("/billing")} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold shadow-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all">Go Professional</button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col items-center">
              <span className="text-slate-400 font-bold mb-4">Enterprise</span>
              <div className="text-4xl font-display font-bold mb-8">Custom</div>
              <ul className="text-slate-400 space-y-4 mb-10 text-sm">
                <li>Unlimited Site Licenses</li>
                <li>Custom Data Connectors</li>
                <li>White-labeled Interface</li>
                <li>SLA & Dedicated Account</li>
              </ul>
              <button onClick={() => navigate("/contact")} className="mt-auto w-full py-4 rounded-xl border border-slate-800 font-bold hover:bg-slate-800 transition-colors">Contact Sales</button>
            </div>
          </div>


        </div>
      </section>

      {/* CTA Final */}
      <section className="pt-6 pb-12 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto rounded-[3rem] glass p-12 md:p-20 text-center border-white/10 shadow-2xl">
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-8 leading-tight">Ready to join the <span className="glow-text">Agentic Web?</span></h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
            Stop worrying about human-only SEO. Make your WordPress site the primary knowledge hub for the next trillion queries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="#pricing" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-slate-950 font-bold text-xl hover:shadow-2xl transition-all text-center">Get WP AI Optimizer Today</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <span className="text-lg font-display font-bold tracking-tight">WP AI <span className="glow-text">Optimizer</span></span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                Bridging the gap between human creativity and artificial intelligence understanding. The future of the web is agent-ready.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WP Repository</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-xs">© 2026 WP AI Optimizer Systems. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-slate-500">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const BillingPage = ({ user, setUser }: { user: AppUser | null, setUser: (user: AppUser) => void }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "binance" | "wise">("paypal");
  const [selectedPlanId, setSelectedPlanId] = useState<Plan>("Lite");
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [payStep, setPayStep] = useState<"idle" | "awaiting_input" | "processing" | "verifying" | "success">("idle");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const discountInfo = useMemo(() => {
    if (discountPercent === 0) return null;
    const basePrice = selectedPlanId === "Lite" ? 10 : 25;
    const finalPrice = basePrice * (1 - discountPercent / 100);
    return { discount: discountPercent, finalPrice };
  }, [discountPercent, selectedPlanId]);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const { data: promoData, error } = await supabase.from("promos").select("*").eq("code", promoCode.toUpperCase()).single();
      
      if (error || !promoData) {
        // Fallback for demo
        const code = promoCode.toUpperCase();
          if (code === "OFF100" || code === "FREE" || code === "ADWP100" || code === "BONUS100") {
            setDiscountPercent(100);
            alert(`100% OFF Promo Applied: ${code}`);
            return;
          }
        alert("Invalid or expired promo code.");
        setDiscountPercent(0);
        return;
      }

      setDiscountPercent(promoData.discount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    const plan = selectedPlanId;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user || !user) {
      navigate("/auth");
      return;
    }

    const isFullDiscount = discountPercent === 100;

    // Supabase users without confirmed emails can't login by default if confirm_email is on.
    // If we reach here, we assume they are either verified or verification is disabled.

    // Skip orderId check if 100% discount
    if (!orderId.trim() && !isFullDiscount) {
      setPayStep("awaiting_input");
      alert("Please provide the Transaction ID or Order ID from your payment confirmation.");
      return;
    }
    
    setIsProcessing(plan);
    if (!isFullDiscount) {
      setPayStep("processing");
      setShowConfirm(true);
    }
    console.log("Starting subscription process for plan:", plan);
    
    try {
      const payload = { 
        userId: authData.user.id,
        orderId: orderId.trim() || `FREE-${plan.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`, 
        paymentMethod: isFullDiscount ? "promo_code" : paymentMethod,
        planId: plan,
        promoCode: promoCode.trim() || null
      };
      
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const verifyData = await response.json();

      if (!verifyData.success) {
        throw new Error(verifyData.message || "Activation failed");
      }
      
      setPayStep("verifying");
      
      // Update Postgres
      await supabase.from("users").update({
        plan: plan,
        licenseKey: verifyData.licenseKey
      }).eq("id", authData.user.id);
      
      // Update local state
      if (user) {
        setUser({
          ...user,
          plan: plan,
          licenseKey: verifyData.licenseKey
        });
      }
      
      if (!isFullDiscount) {
        setPayStep("success");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowConfirm(false);
      }
      
      setPayStep("idle");
      setOrderId("");
      setPromoCode("");
      setDiscountPercent(0);
      alert(`Success! Your account has been upgraded to ${plan}.`);
      navigate("/profile");
    } catch (error: any) {
      console.error("Payment error:", error);
      setPayStep("awaiting_input");
      alert(error.message || "Payment verification failed. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const PLANS = [
    {
      id: "Lite" as Plan,
      name: "Lite",
      price: "10",
      features: ["3 Website Licenses", "Standard Optimization", "Email Support"],
      highlight: false
    },
    {
      id: "Pro" as Plan,
      name: "Pro",
      price: "50",
      features: ["10 Websites Simultaneously", "RAG Optimization Hooks", "Priority Support"],
      highlight: true
    }
  ];

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -z-10" />

      {/* Confirmation & Order ID Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => (payStep === 'idle' || payStep === 'awaiting_input') ? setShowConfirm(false) : null}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 rounded-[2.5rem] border-brand-primary/20 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                  payStep === 'success' ? 'bg-green-500 text-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-brand-primary/10 text-brand-primary'
                }`}>
                  {payStep === 'success' ? <CheckCircle2 size={32} /> : <CreditCard size={32} />}
                </div>
                <h3 className="text-2xl font-bold">
                  {payStep === 'idle' && "Payment Instructions"}
                  {payStep === 'awaiting_input' && "Verify Transaction"}
                  {payStep === 'processing' && "Verifying Order..."}
                  {payStep === 'verifying' && "Finalizing License..."}
                  {payStep === 'success' && "Upgraded Successfully!"}
                </h3>
              </div>

              {(payStep === 'idle' || payStep === 'awaiting_input') && (
                <div className="space-y-4 mb-6">
                  {discountInfo?.discount === 100 ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="text-emerald-400" size={24} />
                      </div>
                      <h4 className="text-emerald-400 font-bold mb-1">100% Discount Applied!</h4>
                      <p className="text-xs text-slate-400">No payment required. Click "Activate Free Plan" below to upgrade your account immediately.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem]">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Payment Target</h4>
                        <div className="flex flex-col items-center gap-5">
                          <div className="p-4 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <QRCodeSVG 
                              value={
                                paymentMethod === 'paypal' ? 'https://www.paypal.me/agenticwp' : 
                                paymentMethod === 'binance' ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' :
                                'https://wise.com/pay/me/billing-agentic'
                              } 
                              size={120} 
                              level="H"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500 mb-1 font-bold uppercase text-[9px] tracking-[0.2em]">
                              {paymentMethod === 'paypal' ? 'Recipient Email' : paymentMethod === 'binance' ? 'Binance Wallet (BEP-20)' : 'Wise Recipient'}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-white font-mono text-sm tracking-tight">
                                {paymentMethod === 'paypal' ? 'billing@agenticwp.io' : paymentMethod === 'binance' ? '0x71C...8976F' : 'wise@agenticwp.io'}
                              </span>
                              <button 
                                onClick={() => { 
                                  const val = paymentMethod === 'paypal' ? 'billing@agenticwp.io' : paymentMethod === 'binance' ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' : 'wise@agenticwp.io';
                                  navigator.clipboard.writeText(val); 
                                  alert("Details copied to clipboard!"); 
                                }} 
                                className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 transition-all"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 leading-relaxed">
                          <p className="text-[10px] text-slate-400">
                            <span className="text-brand-primary font-bold">1. </span> Send <span className="text-white font-bold">${discountInfo ? discountInfo.finalPrice.toFixed(2) : selectedPlan?.price}</span> exactly.<br/>
                            <span className="text-brand-primary font-bold">2. </span> Paste the <span className="text-white font-bold">Transaction/Order ID</span> below to activate instantly.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Promo Code</label>
                          {discountPercent > 0 && (
                            <span className="text-[10px] text-emerald-400 font-bold">-{discountPercent}% APPLIED</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Optional Code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
                          />
                          <button 
                            onClick={applyPromoCode}
                            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Transaction ID / Order ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. TXN-987234..."
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:border-brand-primary outline-none transition-all shadow-inner"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                {payStep !== 'idle' && payStep !== 'awaiting_input' && payStep !== 'success' && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: payStep === 'verifying' ? '80%' : '40%' }}
                    className="absolute top-0 left-0 h-1 bg-brand-primary"
                  />
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Plan</span>
                  <span className="font-bold text-white">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Method</span>
                  <span className="font-bold text-white capitalize">{paymentMethod}</span>
                </div>
                {discountInfo && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Discount</span>
                    <span className="font-bold text-emerald-400">-{discountInfo.discount}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Total</span>
                  <span className="text-xl font-display font-bold text-brand-primary">
                    ${discountInfo ? discountInfo.finalPrice.toFixed(2) : selectedPlan?.price}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={payStep !== 'idle' && payStep !== 'awaiting_input'}
                  className="py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubscribe}
                  disabled={((!orderId.trim() && (!discountInfo || discountInfo.discount < 100))) || !!isProcessing || payStep === 'success'}
                  className={`py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                    payStep === 'success' ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                  }`}
                >
                  {discountInfo?.discount === 100 ? (
                    payStep === 'success' ? "Success!" : (payStep !== 'idle' && payStep !== 'awaiting_input' ? <><Loader2 size={18} className="animate-spin" /> Activating...</> : "Activate Free Plan")
                  ) : (
                    <>
                      {(payStep === 'idle' || payStep === 'awaiting_input') && "Verify Payment"}
                      {payStep !== 'idle' && payStep !== 'awaiting_input' && payStep !== 'success' && (
                        <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                      )}
                      {payStep === 'success' && "Success!"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold mb-4">Select Your <span className="glow-text">Upgrade</span></h1>
          <p className="text-slate-400">Upgrade your account using PayPal, Binance Pay, or Wise Bank Transfer.</p>
          

        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {PLANS.map((p) => (
            <button 
              key={p.id} 
              onClick={() => setSelectedPlanId(p.id)}
              className={`p-8 rounded-3xl glass border-white/5 flex flex-col text-left transition-all relative ${
                selectedPlanId === p.id 
                  ? 'ring-2 ring-brand-primary bg-brand-primary/5 scale-[1.02]' 
                  : 'hover:border-white/10 hover:bg-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              {selectedPlanId === p.id && (
                <div className="absolute top-4 right-4 text-brand-primary">
                  <CheckCircle2 size={24} />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <div className="text-3xl font-display font-bold mb-6">${p.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 mb-8 grow">
                {p.features.map(f => (
                  <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-primary" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="glass p-10 rounded-[2.5rem] border-white/5">
          <h2 className="text-2xl font-bold mb-8 text-center">Payment Method</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-10">
            <button 
              onClick={() => setPaymentMethod("paypal")}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "paypal" ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <span className="font-bold">PayPal</span>
            </button>
            <button 
              onClick={() => setPaymentMethod("binance")}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "binance" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <span className="font-bold">Binance Pay</span>
            </button>
            <button 
              onClick={() => setPaymentMethod("wise")}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                paymentMethod === "wise" ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <ArrowRight size={24} />
              </div>
              <span className="font-bold">Wise Bank</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="mb-6 space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Promo Code (Bypass Payment)</label>
                  {discountPercent > 0 && (
                    <span className="text-[10px] text-emerald-400 font-bold">-{discountPercent}% APPLIED</span>
                  )}
                </div>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Enter Code (e.g. OFF100)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none transition-all"
                  />
                  <button 
                    onClick={applyPromoCode}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Apply
                  </button>
                </div>
            </div>

            <button 
              onClick={() => {
                if (discountPercent === 100) {
                  handleSubscribe();
                } else {
                  setShowConfirm(true);
                }
              }}
              disabled={isProcessing !== null || user?.plan === selectedPlanId}
              className="w-full py-5 rounded-2xl bg-brand-primary text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isProcessing ? (
                <Loader2 size={24} className="animate-spin" />
              ) : user?.plan === selectedPlanId ? (
                "You are already on this plan"
              ) : discountPercent === 100 ? (
                <>
                  Activate {selectedPlan?.name} for Free
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                </>
              ) : (
                <>
                  Confirm & Pay ${discountInfo ? discountInfo.finalPrice.toFixed(2) : selectedPlan?.price} via {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'binance' ? 'Binance' : 'Wise'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500 uppercase tracking-widest font-bold">
            {paymentMethod === "paypal" 
              ? "Secure checkout via PayPal"
              : "Secure checkout via Binance Pay"}
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = ({ user }: { user: AppUser | null }) => {
  const [selectedSite, setSelectedSite] = useState<string>("All Sites");
  const [sites, setSites] = useState<Site[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let channel: any = null;

    const initAnalytics = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        if (isMounted) navigate("/auth");
        return;
      }

      if (user && !user.isAdmin && user.email !== "bibhashmallik@gmail.com" && user.email !== "bheshrahdhami@gmail.com") {
        if (isMounted) navigate("/");
        return;
      }

      const fetchSites = async () => {
        const { data } = await supabase.from("sites").select("*").eq("user_id", authData.user.id);
        if (data && isMounted) setSites(data as Site[]);
      };

      await fetchSites();

      channel = supabase.channel('public:analytics:sites')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, fetchSites)
        .subscribe();
    };

    initAnalytics();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [navigate, user]);

  // Mock data for analytics
  const performanceData = useMemo(() => [
    { time: "00:00", latency: 120, baseline: 450 },
    { time: "04:00", latency: 95, baseline: 440 },
    { time: "08:00", latency: 150, baseline: 480 },
    { time: "12:00", latency: 110, baseline: 460 },
    { time: "16:00", latency: 135, baseline: 470 },
    { time: "20:00", latency: 105, baseline: 450 },
    { time: "23:59", latency: 98, baseline: 440 },
  ], []);

  const requestData = useMemo(() => [
    { name: "Mon", reqs: 2400 },
    { name: "Tue", reqs: 1398 },
    { name: "Wed", reqs: 9800 },
    { name: "Thu", reqs: 3908 },
    { name: "Fri", reqs: 4800 },
    { name: "Sat", reqs: 3800 },
    { name: "Sun", reqs: 4300 },
  ], []);

  const nodeDistribution = useMemo(() => [
    { name: "US-East", value: 400 },
    { name: "EU-West", value: 300 },
    { name: "Asia-South", value: 300 },
    { name: "AU-East", value: 200 },
  ], []);

  const COLORS = ["#0ea5e9", "#6366f1", "#a855f7", "#ec4899"];

  if (sites.length === 0 && user?.plan === "None") {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
            <Activity size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">No Analytics Data</h1>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            You need an active plan and at least one optimized node to view performance analytics.
          </p>
          <button 
            onClick={() => navigate("/billing")}
            className="px-8 py-3 rounded-xl bg-brand-primary text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all"
          >
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Node <span className="glow-text">Analytics</span></h1>
            <p className="text-slate-400">Real-time performance monitoring for your optimized WordPress sites.</p>
          </div>
          <div className="flex items-center gap-4">
             <select 
               value={selectedSite}
               onChange={(e) => setSelectedSite(e.target.value)}
               className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors min-w-[200px]"
             >
               <option value="All Sites">All Global Nodes</option>
               {sites.map(s => <option key={s.id} value={s.url}>{s.url}</option>)}
             </select>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Requests Handled", value: "842.1k", icon: Globe2, color: "text-blue-400" },
            { label: "Avg. Latency", value: "112ms", icon: Activity, color: "text-emerald-400", sub: "78% faster" },
            { label: "Cache Hit Rate", value: "94.2%", icon: Zap, color: "text-yellow-400" },
            { label: "Uptime (24h)", value: "99.99%", icon: ShieldCheck, color: "text-brand-primary" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all" />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                {stat.sub && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-wider">
                    {stat.sub}
                  </span>
                )}
              </div>
              <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-primary" />
                Performance Optimization
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-400">Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary" />
                  <span className="text-xs text-slate-400">WP AI Optimizer</span>
                </div>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    unit="ms"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#475569" 
                    fill="transparent" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorLatency)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <HardDrive size={20} className="text-brand-primary" />
              Node Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nodeDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {nodeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {nodeDistribution.map((node, i) => (
                <div key={node.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm text-slate-400">{node.name}</span>
                  </div>
                  <span className="text-sm font-bold">{((node.value / 1200) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Traffic */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <BarChart3 size={20} className="text-brand-primary" />
            Weekly Request Traffic
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px" }}
                />
                <Bar 
                  dataKey="reqs" 
                  fill="#0ea5e9" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: AppUser | null }) => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalSites: 0,
    activePlans: 0
  });
  const [loading, setLoading] = useState(true);
  const [promoStats, setPromoStats] = useState<any[]>([]);
  const [allDefinedPromos, setAllDefinedPromos] = useState<any[]>([]);
  const [recentPromoLogs, setRecentPromoLogs] = useState<any[]>([]);
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", discount: 20 });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = filterPlan === "All" || u.plan === filterPlan;
      const matchesStatus = filterStatus === "All" || 
                           (filterStatus === "Active" ? u.sitesCount > 0 : u.sitesCount === 0);
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [allUsers, searchQuery, filterPlan, filterStatus]);

  const handleCreatePromo = async () => {
    if (!newPromo.code) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("promos").insert({
        code: newPromo.code.toUpperCase().trim(),
        discount: Number(newPromo.discount)
      });
      if (error) throw error;
      setShowCreatePromo(false);
      setNewPromo({ code: "", discount: 20 });
      alert("Success: Promo code '" + newPromo.code.toUpperCase() + "' created!");
    } catch (err: any) {
      console.error("Promo Creation Error:", err);
      alert("Error: " + (err.message || "Insufficient permissions to create promo."));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user || (!user.isAdmin && user.email !== "bheshrahdhami@gmail.com" && user.email !== "bibhashmallik@gmail.com")) {
      navigate("/");
      return;
    }

    let isMounted = true;
    let usersSubscription: any;
    let promosSubscription: any;
    let promoLogsSubscription: any;

    const fetchAllData = async () => {
      const { data: usersData, error } = await supabase.from("users").select("*, sites(count)");
      if (!error && usersData) {
        let revenue = 0;
        let sitesCount = 0;
        let activePlansCount = 0;

        const results = usersData.map((u: any) => {
          let userSpent = 0;
          if (u.plan === "Lite") userSpent = 10;
          if (u.plan === "Pro") userSpent = 50;
          revenue += userSpent;
          u.revenue = userSpent;
          if (u.plan && u.plan !== "None") activePlansCount++;
          
          // @ts-ignore
          u.sitesCount = u.sites?.[0]?.count || 0;
          sitesCount += u.sitesCount;
          
          u.apiGenerations = u.sitesCount > 0 ? (u.sitesCount * 5 + Math.floor(Math.random() * 10)) : 0;
          return u;
        });

        if (isMounted) {
          setAllUsers(results);
          setGlobalStats({
            totalUsers: usersData.length,
            totalRevenue: Math.round(revenue),
            totalSites: sitesCount,
            activePlans: activePlansCount
          });
          setLoading(false);
        }
      }

      const { data: promosData } = await supabase.from("promos").select("*");
      if (promosData && isMounted) setAllDefinedPromos(promosData);

      const { data: promoLogsData } = await supabase.from("promoLogs").select("*").order("timestamp", { ascending: false });
      if (promoLogsData && isMounted) {
        setRecentPromoLogs(promoLogsData.slice(0, 5));
        setPromoLogs(promoLogsData);
      }
    };

    fetchAllData();

    // Subscribe to realtime changes
    usersSubscription = supabase.channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllData).subscribe();
      
    promosSubscription = supabase.channel('public:promos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promos' }, fetchAllData).subscribe();
      
    promoLogsSubscription = supabase.channel('public:promoLogs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promoLogs' }, fetchAllData).subscribe();

    return () => {
      isMounted = false;
      if (usersSubscription) supabase.removeChannel(usersSubscription);
      if (promosSubscription) supabase.removeChannel(promosSubscription);
      if (promoLogsSubscription) supabase.removeChannel(promoLogsSubscription);
    };
  }, [user, navigate]);

  const [promoLogs, setPromoLogs] = useState<any[]>([]);

  // Compute stats by combining defined promos with logs
  useEffect(() => {
    const aggregated = promoLogs.reduce((acc: any, log: any) => {
      const code = log.code;
      if (!acc[code]) {
        acc[code] = { usage: 0, totalDiscount: 0, estimatedSavings: 0 };
      }
      acc[code].usage += 1;
      acc[code].totalDiscount += log.discountPercent;
      const base = log.plan === "Pro" ? 50 : 10;
      acc[code].estimatedSavings += (base * (log.discountPercent / 100));
      return acc;
    }, {});

    const stats = allDefinedPromos.map(p => {
      const logData = aggregated[p.code] || { usage: 0, totalDiscount: 0, estimatedSavings: 0 };
      return {
        ...p,
        ...logData
      };
    });
    
    // Sort by usage or created date
    setPromoStats(stats.sort((a, b) => b.usage - a.usage));
  }, [allDefinedPromos, promoLogs]);

  const salesData = [
    { name: "Jan", sales: 1200 },
    { name: "Feb", sales: 1900 },
    { name: "Mar", sales: 1500 },
    { name: "Apr", sales: 2800 },
    { name: "May", sales: globalStats.totalRevenue },
  ];

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-brand-primary mb-4" size={40} />
        <p className="text-slate-400 font-medium">Aggregating Global Data...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider rounded border border-brand-primary/20">Authorized Admin Access</span>
              <h1 className="text-4xl font-display font-bold">Platform <span className="glow-text">Overview</span></h1>
            </div>
            <p className="text-slate-400">Real-time management of Agentic WP users, revenue, and activations.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Status</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                   Fully Operational
                </span>
             </div>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: `$${globalStats.totalRevenue.toLocaleString()}`, icon: Wallet, color: "text-emerald-400" },
            { label: "Total Users", value: globalStats.totalUsers, icon: Globe2, color: "text-blue-400" },
            { label: "Active Plans", value: globalStats.activePlans, icon: Trophy, color: "text-brand-primary" },
            { label: "Nodes Connected", value: globalStats.totalSites, icon: Zap, color: "text-yellow-400" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="text-2xl font-display font-bold mb-1 relative z-10">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-widest relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Promo Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-white/5">
             <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
               <TrendingUp size={20} className="text-brand-primary" />
               Projected Revenue (Current Period)
             </h3>
             <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={salesData}>
                   <defs>
                     <linearGradient id="adminSales" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} unit="$" />
                   <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "12px" }} />
                   <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fillOpacity={1} fill="url(#adminSales)" strokeWidth={3} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
           
           <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Tag size={20} className="text-brand-primary" />
                 Promo Analytics
              </h3>
              <div className="space-y-4 grow max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {promoStats.length === 0 ? (
                   <p className="text-slate-500 text-sm italic">No promo codes used yet.</p>
                 ) : (
                   promoStats.map(promo => (
                     <div key={promo.code} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand-primary/30 transition-all">
                        <div>
                           <div className="font-mono text-sm font-bold text-brand-primary">{promo.code}</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-widest">{promo.usage} Redemptions • {promo.discount}% Off</div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <div className="text-sm font-bold text-emerald-400">{promo.usage > 0 ? `$${Math.round(promo.estimatedSavings)}` : "--"}</div>
                              <div className="text-[10px] text-slate-500 uppercase tracking-widest">{promo.usage > 0 ? "Saved" : "No usage"}</div>
                           </div>
                           {promo.id && (
                             <button 
                               onClick={async (e) => {
                                 e.stopPropagation();
                                 if(confirm(`Delete promo code ${promo.code}?`)) {
                                   try {
                                     await supabase.from("promos").delete().eq("id", promo.id);
                                   } catch (err) {
                                     alert("Error: Permission Denied");
                                   }
                                 }
                               }}
                               className="p-2 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/20"
                               title="Delete Promo"
                             >
                               <X size={14} />
                             </button>
                           )}
                        </div>
                     </div>
                   ))
                 )}

                 {recentPromoLogs.length > 0 && (
                   <div className="mt-6">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                         {recentPromoLogs.map(log => (
                           <div key={log.id} className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 truncate max-w-[100px]">{log.userId === 'anonymous' ? 'New User' : log.userId.substring(0, 8)}</span>
                              <span className="font-mono text-brand-primary">{log.code}</span>
                              <span className="text-slate-500">{log.plan}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 {showCreatePromo ? (
                   <div className="space-y-3 bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 shadow-inner">
                      <div className="text-left mb-2">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Promo Configuration</label>
                      </div>
                      <input 
                       type="text" 
                       placeholder="CODENAME (e.g. SUMMER50)" 
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm uppercase font-mono focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
                       value={newPromo.code}
                       onChange={(e) => setNewPromo({...newPromo, code: e.target.value})}
                     />
                     <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-2">
                       <span className="text-[10px] text-slate-500 uppercase font-bold whitespace-nowrap">Discount %</span>
                       <input 
                         type="number" 
                         min={0}
                         max={100}
                         className="w-full bg-transparent border-none text-white text-sm font-mono focus:outline-none"
                         value={newPromo.discount}
                         onChange={(e) => setNewPromo({...newPromo, discount: Number(e.target.value)})}
                       />
                     </div>
                     <div className="flex gap-3 pt-2">
                       <button 
                         onClick={handleCreatePromo} 
                         disabled={!newPromo.code || loading}
                         className="flex-1 py-3 bg-brand-primary text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-brand-primary/20"
                       >
                         {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Confirm & Create"}
                       </button>
                       <button onClick={() => setShowCreatePromo(false)} className="px-6 py-3 bg-white/5 text-white text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                     </div>
                  </div>
                ) : (
                  <button 
                   onClick={() => setShowCreatePromo(true)}
                   className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-brand-primary uppercase tracking-[0.2em] hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Tag size={14} />
                    Create New Promo Code
                  </button>
                )}
             </div>
           </div>
        </div>

        {/* User List Management - THE MAIN PART */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users size={20} className="text-brand-primary" />
              User Management & Performance
            </h3>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={14} />
                <input 
                  type="text"
                  placeholder="Search email or key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-brand-primary outline-none transition-all w-full sm:w-64"
                />
              </div>

              <select 
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-brand-primary outline-none transition-all cursor-pointer"
              >
                <option value="All">All Plans</option>
                <option value="Pro">Pro Only</option>
                <option value="Lite">Lite Only</option>
                <option value="None">Free Only</option>
              </select>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-brand-primary outline-none transition-all cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active Nodes</option>
                <option value="Inactive">No Nodes</option>
              </select>

              <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-400">
                 Results: <span className="text-white font-bold">{filteredUsers.length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">User</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">Plan</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">Sales/Revenue</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">API Gen</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4">Activations</th>
                  <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-500 italic">No users found matching your criteria</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 px-4">
                         <div className="flex flex-col">
                            <span className="font-bold text-sm text-white group-hover:text-brand-primary transition-colors">{u.email.split('@')[0]}</span>
                            <span className="text-[10px] font-mono text-slate-500">{u.email}</span>
                         </div>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                          u.plan === 'Pro' ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' : 
                          u.plan === 'Lite' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                          'bg-slate-400/10 border-slate-400/20 text-slate-400'
                        }`}>
                          {u.plan || 'Free'}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                         <span className="text-sm font-bold text-emerald-400">${u.revenue || 0}</span>
                      </td>
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-2">
                            <span className="text-xs text-white">{u.apiGenerations || 0}</span>
                            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-brand-primary" style={{ width: `${Math.min(100, (u.apiGenerations || 0) * 2)}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="py-5 px-4">
                         <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${u.sitesCount > 0 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                            <span className="text-sm font-medium">{u.sitesCount || 0} Nodes</span>
                         </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={async () => {
                               if(confirm(`Grant Pro Access to ${u.email}?`)) {
                                 await supabase.from("users").update({ plan: "Pro", licenseKey: "MANUAL-" + Math.random().toString(36).substring(7).toUpperCase() }).eq("id", u.id);
                               }
                             }}
                             className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all"
                             title="Grant Pro"
                           >
                             <ShieldAlert size={14} />
                           </button>
                           <button 
                             onClick={async () => {
                               if(confirm(`Revoke Plan for ${u.email}?`)) {
                                 await supabase.from("users").update({ plan: "None", licenseKey: null }).eq("id", u.id);
                               }
                             }}
                             className="p-2 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-all"
                             title="Revoke Plan"
                           >
                             <X size={14} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (sessionUser: any) => {
      if (sessionUser) {
        setIsLoggedIn(true);
        try {
          const { data: userData, error } = await supabase.from("users").select("*").eq("id", sessionUser.id).single();
          if (userData && !error) {
            if (sessionUser.email === "bheshrahdhami@gmail.com" || sessionUser.email === "bibhashmallik@gmail.com") {
              userData.isAdmin = true;
            }
            setUser(userData as AppUser);
          } else {
            console.warn("User auth exists but database document missing.", error);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUser(session?.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-brand-primary animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
        <Route path="/billing" element={<BillingPage user={user} setUser={setUser} />} />
        <Route path="/analytics" element={<AnalyticsPage user={user} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      </Routes>
    </div>
  );
}

const ContactPage = () => {
  const [websites, setWebsites] = useState("1-5");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websites, email, whatsapp, message })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit request.");
      }
      setIsSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden bg-[#020617]">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 blur-[128px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/10 blur-[128px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 md:p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative"
      >
        <Link to="/" className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"><X size={20} /></Link>

        {isSubmitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Message Sent!</h2>
            <p className="text-slate-400">Thank you for reaching out to WP AI Optimizer. Our team will contact you shortly via email or WhatsApp.</p>
            <Link to="/" className="inline-block mt-8 px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all">Back to Home</Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">Contact Sales</h2>
              <p className="text-slate-400 text-sm">Tell us about your project or enterprise needs, and we'll craft a custom plan for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Number of Websites</label>
                <select 
                  value={websites} 
                  onChange={(e) => setWebsites(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors text-white"
                >
                  <option value="1-5">1 - 5 Websites</option>
                  <option value="6-10">6 - 10 Websites</option>
                  <option value="11-25">11 - 25 Websites</option>
                  <option value="26-50">26 - 50 Websites</option>
                  <option value="50+">50+ Websites (Enterprise)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors text-white pl-4"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+1 (555) 000-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors text-white pl-4"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Short Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary transition-colors text-white pl-4"
                />
              </div>

              <button 
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary font-bold shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] disabled:opacity-50 transition-all mt-4 flex items-center justify-center gap-2"
              >
                {isSending ? <Loader2 size={20} className="animate-spin" /> : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[#020617] text-slate-300">
      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-white glow-text">Privacy Policy</h1>
        <p className="text-slate-400 text-xs mb-8">Last updated: July 2, 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>At WP AI Optimizer, we collect information directly from you when you register an account, purchase a license key, or contact support. This includes your name, email address, WhatsApp number (for custom plans), and website URLs connected to our plugin.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the collected data to validate licenses, monitor system health, process payments, and improve our services. We do not sell, rent, or trade your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Storage & Security</h2>
            <p>Your user profile and credentials are stored securely via Supabase Auth and database clusters. We utilize industry-standard cryptographic practices to encrypt your passwords and sensitive information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Crawlers</h2>
            <p>WP AI Optimizer serves dedicated schema content and optimized response pages directly to recognized AI crawlers (e.g. GPT-Bot, Claude-Bot, Google-Extended). Standard session cookies are used on this platform strictly for user authentication purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please reach out to us at support@wpaioptimizer.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[#020617] text-slate-300">
      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-white glow-text">Terms of Service</h1>
        <p className="text-slate-400 text-xs mb-8">Last updated: July 2, 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using WP AI Optimizer, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not download, install, or use WP AI Optimizer.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. License Key Usage</h2>
            <p>We grant you a non-exclusive, non-transferable, revocable license to use our plugin in accordance with your purchased plan (Lite: 3 websites, Pro: 10 websites). Sharing or reselling license keys is strictly prohibited and will result in immediate termination of service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Payments & Refund Policy</h2>
            <p>All sales are processed via our verified payment gateway methods. Due to the digital nature of the software, refunds are handled on a case-by-case basis within 14 days of purchase if the plugin fails to perform on your hosting server.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p>WP AI Optimizer is provided "as is". In no event shall we be liable for any damages, traffic losses, indexation issues, or compatibility problems with third-party WordPress themes or plugins.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden bg-[#020617] text-slate-300">
      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border-white/10 shadow-2xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-white glow-text">Cookie Policy</h1>
        <p className="text-slate-400 text-xs mb-8">Last updated: July 2, 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device to store data that can be recalled by a web server in the domain that placed the cookie.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Cookies</h2>
            <p>We use strictly necessary session cookies to maintain your login status, preserve your session across dashboard updates, and secure user transactions. We do not use third-party tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Managing Cookies</h2>
            <p>Most web browsers allow you to control cookies through their settings preferences. Blocking essential cookies will prevent you from logging in and managing your WP AI Optimizer dashboard.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

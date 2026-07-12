import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/v1/auth/register", formData);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0d0f11] text-[#e0dcc8]">
      {/* Left Side: Branding & Info */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 border-r border-[#1e2022]">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-full border border-[#b8894f] flex items-center justify-center relative">
              <div className="absolute inset-1 rounded-full border border-[#b8894f]/40"></div>
              <span className="font-serif text-[#d9a865] text-lg">IL</span>
            </div>
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#888]">InvoiceLoop</span>
          </div>

          <h1 className="text-5xl font-serif leading-tight mb-6">Join<br />InvoiceLoop.</h1>
          <p className="max-w-md text-lg text-[#888]">Centralized workspace to track, manage, and verify your professional billing cycles.</p>
        </div>

        <div className="border-t border-[#1e2022] pt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest uppercase text-[#888] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#79947a] shadow-[0_0_8px_#79947a]"></span> System Status
            </span>
            <span className="text-xl font-medium text-[#e0dcc8]">Operational</span>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-[#555]">ENCRYPTED GATEWAY · ACCESS GRANTED</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f4ede4]">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8 text-[#1a1a1a]">
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-2 text-[#b8894f]">Authorization</p>
            <h2 className="text-3xl font-serif">Create Account</h2>
          </div>

          {error && (
            <div className="border border-[#b85f4f]/40 bg-[#b85f4f]/10 text-[#8a3b2e] text-xs px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#8a8168]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full bg-transparent border-b border-[#c8b9a8] py-2 focus:outline-none focus:border-[#b8894f] transition-colors placeholder:text-[#a89a8a]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#8a8168]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full bg-transparent border-b border-[#c8b9a8] py-2 focus:outline-none focus:border-[#b8894f] transition-colors placeholder:text-[#a89a8a]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#8a8168]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-transparent border-b border-[#c8b9a8] py-2 pr-8 focus:outline-none focus:border-[#b8894f] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8a8168] hover:text-[#b8894f] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-[#f4ede4] py-4 text-xs font-medium tracking-[0.15em] hover:bg-[#000] hover:tracking-[0.18em] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING ACCOUNT..." : "REGISTER"}
              {!loading && <span className="transition-transform">→</span>}
            </button>

            <p className="text-center text-xs text-[#8a8168]">
              Already have an account?{" "}
              <Link to="/" className="text-[#b8894f] underline underline-offset-2">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
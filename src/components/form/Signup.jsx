import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { createUser } = use(AuthContext);

  const handleSubmit = async (e) => {
   e.preventDefault();
    try {
      // 1️⃣ Create user
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // 2️⃣ Save name
      await updateProfile(user, {
        displayName: name,
      });

      // 3️⃣ Send verification email
      await sendEmailVerification(user);

      // 4️⃣ Force logout
      await signOut(auth);

      alert(
        `Verification email sent to ${email}.
Please verify your email, then login.`
      );

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#09090b] via-[#0a0a0f] to-[#0f0f1a] px-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#121214]/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/5 relative z-10"
      >
        {/* Vault Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl tracking-tighter">V</span>
            </div>
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400">Vault</span> Account
          </h1>
          <p className="text-sm text-slate-400 mt-1">Secure your digital life</p>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-wider text-slate-400 mb-2 block font-medium"
          >
            Full Name
          </label>
          <input
            id="name"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl text-white bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-500"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-wider text-slate-400 mb-2 block font-medium"
          >
            Email Address
          </label>
          <input
            id="email"
            required
            type="email"
            placeholder="you@vault.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl text-white bg-white/5 border border-white/10 px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="text-xs uppercase tracking-wider text-slate-400 mb-2 block font-medium"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl text-white bg-white/5 border border-white/10 px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 active:scale-[0.99]"
        >
          Create Account
        </button>

        {/* Footer Links */}
        <p className="text-sm text-slate-400 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline">
            Login
          </Link>
        </p>

        {/* Security Badge */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <span>Secure • Encrypted • Protected</span>
        </div>
      </form>
    </div>
  );
}
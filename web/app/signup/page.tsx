"use client";

import { useState } from "react";
import { signUp, signIn, authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

import { Card } from "@/components/reusable/card";
import { Button } from "@/components/reusable/button";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const result = await authClient.signUp.email({
      role: "user",
      email,
      password,
      name,
    });

    if (result.error) {
      setError(result.error.message || "Sign up failed");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const returnUrl = searchParams.get("returnUrl") || "/home";
    await signIn.social({
      provider: "google",
      callbackURL: decodeURIComponent(returnUrl),
    });
  };

  return (
    <Card className="max-w-md w-full p-10 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-[#2D3748] tracking-tight">Create Account</h2>
        <p className="text-muted-foreground font-medium">
          Get started with Task Hub today
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-semibold border border-red-100 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)] border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)] border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)] border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-[#F8FAFC] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)] border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full mt-2"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-100" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Or</span>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <Button
        onClick={handleGoogleSignIn}
        variant="white"
        className="w-full border-2 border-zinc-50"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm font-medium text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

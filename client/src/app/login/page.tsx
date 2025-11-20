"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MessageCircle, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        console.log("Attempting login with:", email);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("SignIn result:", result);

            if (result?.error) {
                console.error("Login error:", result.error);
                setError("Invalid email or password");
            } else {
                console.log("Login successful, redirecting...");
                router.push("/chat");
                router.refresh();
            }
        } catch (err) {
            console.error("Login exception:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#FFF8F0] to-[#FFE5D0] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                            Converza
                        </h1>
                    </div>
                    <p className="text-[#6B6B6B]">Welcome back! Sign in to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#FFE5D0]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#FFF8F0] border border-[#FFE5D0] rounded-xl text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#FFF8F0] border border-[#FFE5D0] rounded-xl text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#6B6B6B]">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-[#FF6B1A] hover:text-[#FF8C42] transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-[#6B6B6B] mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

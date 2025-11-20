"use client";

import { motion } from "framer-motion";
import { MessageCircle, Zap, Shield, Users, ArrowRight, Sparkles, Check, Globe, Clock, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Real-time messaging with instant delivery. No delays, no waiting."
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "End-to-end encryption keeps your conversations safe and private."
        },
        {
            icon: Users,
            title: "Connect Anywhere",
            description: "Create groups, direct messages, and collaborate seamlessly."
        }
    ];

    const benefits = [
        "Unlimited conversations",
        "Group chats with up to 100 members",
        "File sharing & media support",
        "Cross-platform sync",
        "24/7 customer support",
        "No ads, ever"
    ];

    const stats = [
        { value: "10K+", label: "Active Users" },
        { value: "1M+", label: "Messages Sent" },
        { value: "99.9%", label: "Uptime" },
        { value: "< 100ms", label: "Avg Response" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFFBF7] via-white to-[#FFF8F0] overflow-hidden">
            {/* Floating Abstract Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#FF8C42]/10 to-[#FF6B1A]/5 rounded-full blur-3xl"
                    animate={{
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#FF6B1A]/10 to-[#FF8C42]/5 rounded-full blur-3xl"
                    animate={{
                        y: [0, -40, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#FFE5D0]/20 to-[#FF8C42]/10 rounded-full blur-2xl"
                    animate={{
                        x: [-100, 100, -100],
                        y: [-50, 50, -50],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Navigation */}
            <motion.nav
                className="relative z-10 px-6 py-6 md:px-12 md:py-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                            Converza
                        </span>
                    </div>
                    <Link
                        href="/login"
                        className="px-6 py-2.5 text-sm font-medium text-[#FF6B1A] hover:bg-[#FFF8F0] rounded-xl transition-all"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 pt-12 pb-20 md:pt-20 md:pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text */}
                        <div>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#FFE5D0] rounded-full mb-6 shadow-sm"
                            >
                                <Sparkles className="w-4 h-4 text-[#FF8C42]" />
                                <span className="text-sm font-medium text-[#2D2D2D]">
                                    Conversations Reimagined
                                </span>
                            </motion.div>

                            <motion.h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] mb-6 leading-tight"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                Connect with
                                <br />
                                <span className="bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                                    anyone, anywhere
                                </span>
                            </motion.h1>

                            <motion.p
                                className="text-lg md:text-xl text-[#6B6B6B] mb-8 leading-relaxed"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                Experience seamless real-time messaging with beautiful design.
                                Create groups, send direct messages, and stay connected with what matters most.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row items-start gap-4 mb-8"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <Link
                                    href="/signup"
                                    className="group px-8 py-4 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-[#FF8C42]/20 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    Start a Conversation
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="px-8 py-4 bg-white/60 backdrop-blur-sm border border-[#FFE5D0] text-[#2D2D2D] font-semibold rounded-2xl hover:bg-white hover:shadow-lg transition-all"
                                >
                                    Learn More
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center sm:text-left">
                                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-[#6B6B6B] mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>


                        {/* Right Column - Image */}
                        <motion.div
                            className="relative min-h-[300px] lg:min-h-[400px]"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FFE5D0] bg-white p-4">
                                <img
                                    src="/hero-chat.png"
                                    alt="Converza Chat Interface"
                                    className="w-full h-auto"
                                    loading="eager"
                                />
                            </div>
                            {/* Floating badge */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-[#FFE5D0]"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-xl flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#2D2D2D]">Loved by users</div>
                                        <div className="text-xs text-[#6B6B6B]">4.9/5 rating</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 px-6 py-20 md:py-32 bg-white/40 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
                            Built for modern communication
                        </h2>
                        <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
                            Everything you need to stay connected, all in one beautiful platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="group p-8 bg-white/80 backdrop-blur-sm border border-[#FFE5D0] rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-[#FF8C42]/5 hover:-translate-y-2 transition-all duration-300"
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[#6B6B6B] leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="relative z-10 px-6 py-20 md:py-32">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FFE5D0] bg-white p-4">
                                <img
                                    src="/collaboration.png"
                                    alt="Team Collaboration"
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                                Everything you need,
                                <br />
                                <span className="bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                                    nothing you don't
                                </span>
                            </h2>
                            <p className="text-lg text-[#6B6B6B] mb-8">
                                Converza is packed with features that make communication effortless and enjoyable.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ x: 20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <div className="w-6 h-6 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-[#2D2D2D] font-medium">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="relative z-10 px-6 py-20 md:py-32 bg-white/40 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#FFE5D0] rounded-full mb-6">
                                <Shield className="w-4 h-4 text-[#FF8C42]" />
                                <span className="text-sm font-medium text-[#2D2D2D]">
                                    Enterprise-grade security
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-[#2D2D2D] mb-6">
                                Your privacy is our
                                <br />
                                <span className="bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                                    top priority
                                </span>
                            </h2>
                            <p className="text-lg text-[#6B6B6B] mb-6">
                                We use end-to-end encryption to ensure your conversations stay private. Your data is yours, and yours alone.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-[#FFE5D0]">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2D2D2D] mb-1">End-to-end encryption</h4>
                                        <p className="text-sm text-[#6B6B6B]">All messages are encrypted before leaving your device</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-[#FFE5D0]">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2D2D2D] mb-1">GDPR compliant</h4>
                                        <p className="text-sm text-[#6B6B6B]">We follow strict data protection regulations</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-[#FFE5D0]">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2D2D2D] mb-1">Regular security audits</h4>
                                        <p className="text-sm text-[#6B6B6B]">Third-party audits ensure your data stays safe</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FFE5D0] bg-white p-4">
                                <img
                                    src="/security.png"
                                    alt="Security and Privacy"
                                    className="w-full h-auto"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-20 md:py-32">
                <motion.div
                    className="max-w-4xl mx-auto text-center p-12 md:p-16 bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] rounded-3xl shadow-2xl"
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of users already experiencing the future of messaging
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF6B1A] font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Create Free Account
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-[#FFE5D0]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8C42] to-[#FF6B1A] flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A] bg-clip-text text-transparent">
                                Converza
                            </span>
                        </div>
                        <div className="text-sm text-[#6B6B6B]">
                            Created by <span className="font-semibold text-[#FF6B1A]">Rahul Lotlikar</span>
                        </div>
                        <div className="flex gap-6 text-sm text-[#6B6B6B]">
                            <Link href="#" className="hover:text-[#FF6B1A] transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-[#FF6B1A] transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-[#FF6B1A] transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

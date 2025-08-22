"use client";

import React, { useEffect, useRef, useState } from "react";
import { Footer, PricingSection, Input, Button } from "@/components/index";
import { AuthAwareNavigation } from "@/components/shared/AuthAwareNavigation";
import { AuthAwareHeroButtons } from "@/components/shared/AuthAwareHeroButtons";
import { faqData, pricingPlans, pricingPlans2, pricingPlans3, testimonials } from "@/const";
import { Award, BookOpen, Star, Users, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  // Smooth scrolling for navigation links
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => anchor.addEventListener("click", handleAnchorClick));

    // Navbar scroll effect
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      if (window.scrollY > 100) {
        nav.style.backdropFilter = "blur(20px)";
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      } else {
        nav.style.backdropFilter = "blur(10px)";
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute(
            "style",
            "opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out;",
          );
        }
      });
    }, observerOptions);

    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.transform = "translateY(30px)";
      (card as HTMLElement).style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.observe(card);
    });

    // Parallax effect for hero background
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(
        ".absolute.top-20, .absolute.top-40, .absolute.bottom-20",
      );
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleParallax);

    // Cleanup
    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener("click", handleAnchorClick));
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleParallax);
      observer.disconnect();
    };
  }, []);

  // Typing effect
  useEffect(() => {
    const heroTitle = document.querySelector("h1");
    if (!heroTitle) return;
    const originalText = heroTitle.innerHTML;
    let index = 0;
    function typeWriter() {
      if (index < originalText.length) {
        heroTitle!.innerHTML = originalText.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 50);
      }
    }
    setTimeout(typeWriter, 1000);
  }, []);

  const handlePlanSelect = (planName: string) => {
    // eslint-disable-next-line no-console
    console.log(`Selected plan: ${planName}`);
    // TODO: Add plan selection logic here
  };

  return (
    <main className="overflow-x-hidden bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav ref={navRef} className="glass-morphism fixed top-0 right-0 left-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="gradient-text text-2xl font-bold">ITMS</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#about"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  About
                </a>
                <a
                  href="#features"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  Contact
                </a>

                <AuthAwareNavigation isMainLanding={true} />
              </div>
            </div>
            <div className="md:hidden">
              <button
                id="mobile-menu-button"
                className="text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          id="mobile-menu"
          className={`glass-morphism ${mobileMenuOpen ? "" : "hidden"} md:hidden`}
        >
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600"
            >
              About
            </a>
            <div className="px-3 py-2">
              <AuthAwareNavigation isMainLanding={true} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-10"></div>
        <div className="absolute inset-0">
          <div className="animate-bounce-slow absolute top-20 left-10 h-64 w-64 rounded-full bg-blue-400 opacity-30 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-bounce-slow animation-delay-200 absolute top-40 right-10 h-64 w-64 rounded-full bg-green-400 opacity-30 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-bounce-slow animation-delay-400 absolute bottom-20 left-1/2 h-64 w-64 rounded-full bg-orange-400 opacity-30 mix-blend-multiply blur-xl filter"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="animate-fade-in mb-8 text-5xl font-bold md:text-7xl">
            Modern <span className="gradient-text">Library</span>
            <br />
            <span className="text-4xl md:text-6xl">Management Made Simple</span>
          </h1>
          <p className="animate-slide-up mx-auto mb-12 max-w-3xl text-xl text-slate-600 md:text-2xl">
            Streamline student management, automate payments, and enhance learning experiences with
            our comprehensive SaaS platform designed for educational institutions.
          </p>
          <AuthAwareHeroButtons isMainLanding={true} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <svg
            className="h-6 w-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything you need to <span className="gradient-text">manage your library</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Everything you need to streamline your library operations and enhance student
              experiences. From student admissions to payment processing, we&apos;ve got every
              aspect covered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Student Management */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Student Management</h3>
              <p className="text-slate-600">
                Complete student lifecycle management with registration, profile tracking, shift
                scheduling, and locker assignments for seamless library operations.
              </p>
            </div>

            {/* Smart Admissions */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Smart Admissions</h3>
              <p className="text-slate-600">
                Streamlined multi-step admission process with real-time seat availability and
                Aadhaar validation for efficient student enrollment.
              </p>
            </div>

            {/* Book Inventory & Circulation */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 4v16M16 4v16"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Book Inventory &amp; Circulation</h3>
              <p className="text-slate-600">
                Effortlessly manage book cataloging, check-in/check-out, reservations, and overdue
                tracking with barcode and RFID support.
              </p>
              <div className="absolute top-6 right-6">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Payment Automation */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Payment Automation</h3>
              <p className="text-slate-600">
                Automated fee collection with multiple payment methods, receipt generation, and
                overdue tracking for seamless financial management.
              </p>
            </div>

            {/* Intelligent Notifications */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-5 5v-5zM4.868 19.718l8.485-8.485a2 2 0 012.829 0l1.414 1.414a2 2 0 010 2.829l-8.485 8.485A2 2 0 017.697 24H4a1 1 0 01-1-1v-3.697a2 2 0 01.586-1.414z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Intelligent Notifications</h3>
              <p className="text-slate-600">
                Automated SMS and email alerts for admissions, payments, and announcements to keep
                everyone informed and engaged.
              </p>
            </div>

            {/* Multi-Location Support */}
            <div className="feature-card relative rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
                <svg
                  className="h-8 w-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2 16.5S6 12 12 12s10 4.5 10 4.5M12 12V2"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Multi-Location Support</h3>
              <p className="text-slate-600">
                Manage multiple library branches from a single dashboard with centralized reporting
                and decentralized operations.
              </p>
              <div className="absolute top-6 right-6">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Upcoming
                </span>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Real-time Analytics</h3>
              <p className="text-slate-600">
                Comprehensive insights into student enrollment, revenue, retention rates, and
                operational metrics for data-driven decisions.
              </p>
            </div>

            {/* Secure & Compliant Feature */}
            <div className="feature-card rounded-2xl border border-red-200 bg-red-50 p-8 shadow-lg transition-all duration-300 hover:border-red-400">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
                {/* Shield icon */}
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3l8 4v5c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V7l8-4z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Secure &amp; Compliant</h3>
              <p className="text-slate-600">
                Bank-grade security with Aadhaar verification, data protection compliance, and
                encrypted payment processing.
              </p>
            </div>

            {/* Mobile-First Experience */}
            <div className="feature-card rounded-2xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Mobile-First Experience</h3>
              <p className="text-slate-600">
                Responsive design optimized for mobile devices with touch-friendly controls and
                seamless library staff workflows.
              </p>
            </div>

            {/* Cloud Infrastructure Feature */}
            <div className="feature-card rounded-2xl border border-violet-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-violet-400">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                <svg
                  className="h-8 w-8 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 3v4M8 3v4M3 11h18"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Cloud Infrastructure</h3>
              <p className="text-slate-600">
                Scalable cloud infrastructure with automatic backups, 99.9% uptime guarantee, and
                enterprise-grade performance.
              </p>
            </div>

            {/* Mobile App Upcoming Feature */}
            <div className="feature-card relative rounded-2xl border border-indigo-200 bg-white p-8 shadow-lg transition-all duration-300 hover:border-indigo-400">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="7" y="2" width="10" height="20" rx="3" strokeWidth="2" />
                  <circle cx="12" cy="18" r="1" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute top-6 right-6">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Upcoming
                </span>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Mobile App</h3>
              <p className="text-slate-600">
                Native mobile apps for iOS and Android with offline capabilities, push
                notifications, and seamless user experience.
              </p>
            </div>

            {/* AI-Powered Search */}
            <div className="feature-card rounded-2xl border border-emerald-200 bg-emerald-50 p-8 shadow-lg transition-all duration-300 hover:border-emerald-400">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">AI-Powered Search</h3>
              <p className="text-slate-600">
                Instantly find books, resources, and student records with intelligent, context-aware
                search and recommendations.
              </p>
              <div className="absolute top-6 right-6">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-lg font-semibold text-blue-600">
              <Award className="h-6 w-6" />
              <span>Trusted by 500+ Libraries Across India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        title="Simple, Transparent Pricing"
        subtitle="Choose the perfect plan for your educational institution | Choose the plan that fits your library's needs"
        plans={pricingPlans}
        onPlanSelect={handlePlanSelect}
      />
      <PricingSection
        title="Library Management Plans"
        subtitle="Choose the perfect plan for your educational institution"
        plans={pricingPlans2}
        onPlanSelect={handlePlanSelect}
      />
      <PricingSection
        title="Library Management Plans"
        subtitle="Choose the perfect plan for your educational institution"
        plans={pricingPlans3}
        onPlanSelect={handlePlanSelect}
      />
      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What library owners say about us
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful library owners across India
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-gray-600">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section  */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Transform Your Library Today</h2>
          <p className="mb-8 text-xl opacity-90">
            Join hundreds of educational institutions already modernizing their library management
            with ITMS.
          </p>
          <AuthAwareHeroButtons isMainLanding={true} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our library management system
            </p>
          </div>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
              <p className="mb-8 text-xl text-gray-600">
                Join hundreds of libraries already using StudyHub to streamline their operations and
                delight their students.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Phone, text: "+91 98765 43210" },
                  { icon: Mail, text: "hello@studyhub.in" },
                  { icon: MapPin, text: "Mumbai, Maharashtra, India" },
                ].map((contact, index) => (
                  <div key={index} className="flex items-center">
                    <contact.icon className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8 shadow-lg">
              <CardContent className="p-0">
                <h3 className="mb-6 text-2xl font-semibold text-gray-900">Get a Free Demo</h3>

                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Phone Number" />
                  <Input placeholder="Library Name" />
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Tell us about your requirements..."
                  />

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Schedule Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;

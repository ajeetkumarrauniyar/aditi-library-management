"use client";

import React, { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { pricingPlans } from "@/const/PricingPlan";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Smooth scrolling for navigation links
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
              <div className="flex-shrink-0">
                <h1 className="gradient-text text-2xl font-bold">ITMS</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
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
                  href="#about"
                  className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                >
                  About
                </a>
                <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
                  Start Free Trial
                </button>
                <button className="rounded-full bg-cyan-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-lg">
                  Login
                </button>
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
              <button className="w-full rounded-full bg-cyan-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-lg">
                Login
              </button>
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
          <div className="animate-slide-up flex flex-col justify-center gap-4 sm:flex-row">
            <button className="animate-pulse-glow rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl">
              Start Free Trial
            </button>
            <button className="rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg">
              Schedule Demo
            </button>
          </div>
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
              Comprehensive Library Management
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Everything you need to streamline your library operations and enhance student
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                Real-time alerts for payments, announcements, and system updates to keep everyone
                informed and engaged.
              </p>
            </div>

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
              <h3 className="mb-4 text-xl font-semibold">Analytics Dashboard</h3>
              <p className="text-slate-600">
                Comprehensive insights into student enrollment, revenue, retention rates, and
                operational metrics for data-driven decisions.
              </p>
            </div>

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
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        title="Library Management Plans"
        subtitle="Choose the perfect plan for your educational institution"
        plans={pricingPlans}
        onPlanSelect={handlePlanSelect}
      />

      {/* CTA Section  */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Transform Your Library Today</h2>
          <p className="mb-8 text-xl opacity-90">
            Join hundreds of educational institutions already modernizing their library management
            with ITMS.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-2xl">
              Start Your Free Trial
            </button>
            <button className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;

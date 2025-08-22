import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/index";
import { SubdomainNavigation } from "@/components/shared/SubdomainNavigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  MapPin,
  Phone,
  Wifi,
  Car,
  Coffee,
  Shield,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Award,
  Zap,
  Target,
  CheckCircle,
  AirVent,
  MessageSquare,
  Lock,
  User,
  Mail,
} from "lucide-react";
import { Tenant } from "@prisma/client";
import { getTenantBySubdomain } from "@/lib/server";

const getTenantData = (tenant: Tenant) => ({
  // Basic Info
  logo: tenant?.logo || "https://placehold.co/100x100",
  name: tenant?.name || "Study Library",
  tagline: tenant?.tagline || "Your Gateway to Academic Excellence",
  description:
    "Premium self-study library providing the perfect environment for competitive exam preparation and academic success.",

  // Location & Contact
  address: tenant?.address || "123 Education Hub, Study Lane, New Delhi - 110001",
  phone: tenant?.phone || "+91 98765 43210",
  email: tenant?.email || "info@studyhub.com",

  // Timings
  timings: {
    weekdays: "6:00 AM - 11:00 PM",
    weekends: "7:00 AM - 10:00 PM",
    holidays: "8:00 AM - 9:00 PM",
  },

  // Statistics
  stats: [
    { label: "Active Students", value: "250+", icon: Users },
    { label: "Success Rate", value: "85%", icon: Target },
    { label: "Years of Excellence", value: "8+", icon: Award },
    { label: "Study Hours Daily", value: "3,500+", icon: Clock },
  ],

  // Facilities
  facilities: [
    { name: "High-Speed WiFi", icon: Wifi, description: "100 Mbps dedicated internet" },
    { name: "24/7 Security", icon: Shield, description: "CCTV monitoring & security guards" },
    { name: "AC Environment", icon: AirVent, description: "Climate-controlled study rooms" },
    { name: "Parking Available", icon: Car, description: "Free parking for students" },
    { name: "Silent Zones", icon: BookOpen, description: "Dedicated quiet study areas" },
    { name: "Discussion Rooms", icon: Users, description: "Group study spaces available" },
    { name: "Lockers", icon: Lock, description: "Secure Lockers" },
    { name: "Pantry", icon: Coffee, description: "Pantry/Tea" },
    { icon: Zap, label: "Power Backup" },
  ],

  // Study Plans
  plans: [
    {
      name: "Full Day",
      price: "₹3,000",
      period: "/month",
      timing: "6:00 AM - 11:00 PM",
      features: [
        "All day access",
        "Dedicated seat",
        "Locker facility",
        "Free WiFi",
        "Study material",
      ],
      popular: true,
    },
    {
      name: "Half Day Morning",
      price: "₹2,000",
      period: "/month",
      timing: "6:00 AM - 2:00 PM",
      features: ["Morning slot", "Dedicated seat", "Locker facility", "Free WiFi"],
      popular: false,
    },
    {
      name: "Half Day Evening",
      price: "₹2,000",
      period: "/month",
      timing: "3:00 PM - 11:00 PM",
      features: ["Evening slot", "Dedicated seat", "Locker facility", "Free WiFi"],
      popular: false,
    },
  ],

  // Student Reviews
  reviews: [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "UPSC Aspirant",
      rating: 5,
      testimonial:
        "Amazing study environment! The silence and facilities helped me focus completely on my preparation.",
      avatar: "/avatars/admin.svg",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "CA Student",
      rating: 5,
      testimonial:
        "Best library in the area. Staff is supportive and the environment is very conducive for long study hours.",
      avatar: "/avatars/admin.svg",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "JEE Aspirant",
      rating: 5,
      testimonial:
        "Clean, well-maintained facility with excellent WiFi. Perfect for competitive exam preparation.",
      avatar: "/avatars/admin.svg",
    },
    {
      id: 4,
      name: "Priya Sharma",
      role: "UPSC Aspirant",
      rating: 5,
      testimonial:
        "The study environment here is exceptional! The 24/7 access and silent zones helped me maintain my focus during my UPSC preparation. The online payment system made fee submission so convenient.",
      avatar: "PS",
    },
    {
      id: 5,
      name: "Rahul Kumar",
      role: "Engineering Student",
      rating: 5,
      testimonial:
        "Amazing facilities with AC, WiFi, and CCTV security. The SMS notifications for seat booking saved me so much time. The analytics dashboard helped me track my study hours effectively.",
      avatar: "RK",
    },
    {
      id: 6,
      name: "Anjali Patel",
      role: "CA Student",
      rating: 5,
      testimonial:
        "The UPI payment integration is seamless! I love how I can book my seat, pay fees, and even get receipts - all online. The real-time occupancy tracking feature is incredibly useful.",
      avatar: "AP",
    },
    {
      id: 7,
      name: "Vikram Singh",
      role: "Medical Aspirant",
      rating: 5,
      testimonial:
        "This library transformed my preparation strategy. The automated notifications for important announcements and the professional management system made my study routine very efficient.",
      avatar: "VS",
    },
    {
      id: 8,
      name: "Sneha Gupta",
      role: "Banking Aspirant",
      rating: 5,
      testimonial:
        "The best investment I made for my preparation! The technology-driven approach, from online admissions to digital fee management, shows how modern libraries should operate.",
      avatar: "SG",
    },
    {
      id: 9,
      name: "Arjun Mehta",
      role: "SSC Aspirant",
      rating: 5,
      testimonial:
        "Outstanding service quality! The real-time analytics helped me understand my study patterns. The SMS reminders for fee payments and important updates are very helpful.",
      avatar: "AM",
    },
  ],

  // Gallery images (mock paths)
  gallery: [
    "/images/library-1.jpg",
    "/images/library-2.jpg",
    "/images/library-3.jpg",
    "/images/library-4.jpg",
  ],

  // Special Features
  specialFeatures: [
    {
      title: "Success-Focused Environment",
      description: "Designed specifically for competitive exam aspirants with proven results",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Premium Facilities",
      description: "Modern infrastructure with all amenities for comfortable studying",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Digital Convenience",
      description: "Online seat booking, digital payments, and mobile app access",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ],
});

const createFallbackTenant = (subdomain: string): Tenant => ({
  id: "fallback",
  slug: subdomain,
  name: `${subdomain.toUpperCase()} Study Library`,
  tagline: "Your Gateway to Academic Excellence",
  logo: null,
  address: null,
  phone: null,
  email: null,
  whatsapp: null,
  geo: null,
  openingHours: null,
  rating: null,
  totalReviews: 0,
  amenities: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const OrganizationLandingPage = async ({ params }: { params: Promise<{ subdomain: string }> }) => {
  const { subdomain } = await params;

  const tenant = await getTenantBySubdomain(subdomain);
  const effectiveTenant: Tenant = tenant ?? createFallbackTenant(subdomain);
  const libraryData = getTenantData(effectiveTenant);

  const telHref = `tel:${libraryData.phone.replace(/\s/g, "")}`;
  const waHref = libraryData.phone
    ? `https://wa.me/${libraryData.phone.replace(/[^\d]/g, "")}`
    : undefined;
  const mapsHref = libraryData.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(libraryData.address)}`
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{libraryData.name}</h1>
                <p className="text-sm text-gray-600">{libraryData.tagline}</p>
              </div>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
              <a
                href="#about"
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                About
              </a>
              <a
                href="#facilities"
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Facilities
              </a>
              <a
                href="#plans"
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Plans
              </a>
              <a
                href="#reviews"
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Reviews
              </a>
              <a href={telHref} className="text-sm text-gray-600 hover:text-gray-900">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Call
                </span>
              </a>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> WhatsApp
                  </span>
                </a>
              )}
              {mapsHref && (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Directions
                  </span>
                </a>
              )}
              <SubdomainNavigation subdomain={subdomain} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <Badge className="mb-6 border-green-200 bg-green-100 px-4 py-2 text-green-800">
                <Award className="mr-2 h-4 w-4" />
                Top Rated Library in Delhi
              </Badge>
              <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 md:text-6xl">
                Your Success{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                {libraryData.description} Join hundreds of successful students who achieved their
                dreams with us.
              </p>

              {/* Quick Info */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Open Daily</p>
                    <p className="text-sm text-gray-600">{libraryData.timings.weekdays}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Prime Location</p>
                    <p className="text-sm text-gray-600">New Delhi</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg hover:from-blue-700 hover:to-indigo-700"
                  asChild
                >
                  <Link href={`/s/${subdomain}/apply`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Seat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-200 px-8 py-4 text-lg hover:border-blue-400 hover:bg-blue-50"
                  asChild
                >
                  <Link href={`/s/${subdomain}/contact`}>
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl">
                <div className="rounded-2xl bg-white p-6">
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    {libraryData.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      Why Students Choose Us
                    </h3>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.9/5 (200+ reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {libraryData.name}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Established with a vision to provide the best study environment for competitive exam
              aspirants in Delhi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {libraryData.specialFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <CardHeader className="pb-4 text-center">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center ${feature.bgColor} mb-4 rounded-2xl`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">World-Class Facilities</h2>
            <p className="text-xl text-gray-600">
              Everything you need for productive and comfortable studying
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {libraryData.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <facility.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{facility.name}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Choose Your Study Plan</h2>
            <p className="text-xl text-gray-600">
              Flexible options to suit your preparation schedule
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {libraryData.plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${plan.popular ? "scale-105 ring-2 ring-blue-500" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform bg-blue-600 px-4 py-1 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="mb-2 text-2xl">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="text-lg font-medium text-blue-600">
                    {plan.timing}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
                    asChild
                  >
                    <Link href={`/apply`}>Select Plan</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Success Stories</h2>
            <p className="text-xl text-gray-600">What our successful students say about us</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {libraryData.reviews.map((review, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-4 flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed text-gray-600">
                    &quot;{review.testimonial}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Ready to Start Your Success Journey?
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-blue-100">
            Join {libraryData.name} today and become part of our success story. Your dream career is
            just one seat away.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link href={`/s/${subdomain}/apply`}>
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Seat Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href={`/s/${subdomain}/contact`}>
                <Phone className="mr-2 h-5 w-5" />
                Schedule a Visit
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Library Info */}
            <div>
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{libraryData.name}</h3>
                  <p className="text-sm text-gray-400">{libraryData.tagline}</p>
                </div>
              </div>
              <p className="mb-6 text-gray-400">
                Empowering students to achieve their academic dreams with world-class facilities and
                supportive environment.
              </p>
              <div className="flex space-x-4">
                {/* Twitter */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://x.com/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://linkedin.com/company/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Pinterest */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://pinterest.com/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.759-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://instagram.com/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
                  </svg>
                </a>
                {/* Youtube */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://youtube.com/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  className="flex items-center space-x-3"
                  href={`https://facebook.com/${libraryData.name}`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-6 text-lg font-semibold">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                  <span className="text-gray-400">{libraryData.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">{libraryData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400">{libraryData.email}</span>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div>
              <h4 className="mb-6 text-lg font-semibold">Library Timings</h4>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-white">Monday - Friday</div>
                  <div className="text-gray-400">{libraryData.timings.weekdays}</div>
                </div>
                <div>
                  <div className="font-medium text-white">Saturday - Sunday</div>
                  <div className="text-gray-400">{libraryData.timings.weekends}</div>
                </div>
                <div>
                  <div className="font-medium text-white">Public Holidays</div>
                  <div className="text-gray-400">{libraryData.timings.holidays}</div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-6 text-lg font-semibold">Resources</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400">Help Center</div>
                </div>
                <div>
                  <div className="text-gray-400">Training</div>
                </div>
                <div>
                  <div className="text-gray-400">Contact Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 {libraryData.name}. All rights reserved.
              <span className="ml-2 text-blue-400">
                Powered by{" "}
                <Link href="https://itmavericksolutions.in" className="text-blue-400">
                  IT Maverick Solutions
                </Link>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrganizationLandingPage;

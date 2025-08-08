import prisma from "@/lib/prisma";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface OrganizationLandingPageProps {
  params: {
    subdomain: string;
  };
}

const getTenantData = (tenant: Tenant) => ({
  // Basic Info
  name: tenant.name,
  tagline: tenant.tagline || "Your Gateway to Academic Excellence",
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
      name: "Rahul Sharma",
      exam: "UPSC CSE 2024",
      rating: 5,
      comment:
        "Amazing study environment! The silence and facilities helped me focus completely on my preparation.",
      result: "Selected for IAS",
      image: "/avatars/admin.svg",
    },
    {
      name: "Priya Patel",
      exam: "CA Final",
      rating: 5,
      comment:
        "Best library in the area. Staff is supportive and the environment is very conducive for long study hours.",
      result: "Cleared CA Final",
      image: "/avatars/admin.svg",
    },
    {
      name: "Amit Kumar",
      exam: "JEE Advanced",
      rating: 5,
      comment:
        "Clean, well-maintained facility with excellent WiFi. Perfect for competitive exam preparation.",
      result: "IIT Delhi",
      image: "/avatars/admin.svg",
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

const OrganizationLandingPage = async ({ params }: OrganizationLandingPageProps) => {
  const { subdomain } = params;
  const tenantSlug = subdomain;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <BookOpen className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-red-600">Library Not Found</h1>
          <p className="mb-8 text-gray-600">
            The library &quot;{tenantSlug}&quot; does not exist or has been moved.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  const libraryData = getTenantData(tenant || `${subdomain.toUpperCase()} Study Library`);
  
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
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                asChild
              >
                <Link href={`/apply`}>Apply Now</Link>
              </Button>
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
                  <Link href={`/apply`}>
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
                  <Link href={`/contact`}>
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
                    &quot;{review.comment}&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-600">{review.exam}</div>
                      <Badge className="mt-1 bg-green-100 text-xs text-green-800">
                        {review.result}
                      </Badge>
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
              <Link href={`/apply`}>
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
              <Link href={`/contact`}>
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

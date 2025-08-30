import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

export default function Hero() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (location) params.append("location", location);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>#1 Job Portal Platform</span>
              <Star className="h-4 w-4 text-yellow-300" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gray-900">Find Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dream Job
            </span>
            <br />
            <span className="text-gray-900">Today</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-gray-700 max-w-3xl mx-auto sm:text-xl font-medium">
             Connect with top employers and discover thousands of job opportunities. Whether you're starting your
            career or looking for your next big move, MeetJob helps you find the perfect match!
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-5 w-5" />
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  className="pl-10 border-0 focus-visible:ring-2 focus-visible:ring-blue-500 text-base h-12 bg-blue-50/50"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 h-5 w-5" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, state, or remote"
                  className="pl-10 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 text-base h-12 bg-indigo-50/50"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Jobs
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-jobs">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-600 hover:via-pink-600 hover:to-red-600 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Browse All Jobs
              </Button>
            </Link>
            <Link to="/post-jobs">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-2 border-gradient-to-r from-purple-400 to-blue-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4 lg:gap-16">
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                10,000+
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium flex items-center justify-center">
                <Briefcase className="h-4 w-4 mr-1 text-purple-500" /> Active Jobs
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-teal-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                5,000+
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium flex items-center justify-center">
                <Award className="h-4 w-4 mr-1 text-blue-500" /> Companies
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-teal-100 to-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                50,000+
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium flex items-center justify-center">
                <Users className="h-4 w-4 mr-1 text-teal-500" /> Job Seekers
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-pink-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-gray-700 mt-1 font-medium flex items-center justify-center">
                <Star className="h-4 w-4 mr-1 text-orange-500" /> Success Rate
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 opacity-70">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-600">🏆 Award Winning Platform</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-600">🔒 Secure & Trusted</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-600">⚡ Instant Matching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 opacity-40" />
        </div>
        <div className="absolute right-[calc(50%-4rem)] bottom-10 -z-10 transform-gpu blur-3xl">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100 opacity-40" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-30 animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-indigo-200 to-teal-200 rounded-full opacity-30 animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-teal-200 to-blue-200 rounded-full opacity-30 animate-pulse delay-500" />
      </div>
    </section>
  );
}

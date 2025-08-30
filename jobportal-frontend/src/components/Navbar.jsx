import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react"; // Import Sparkles for the logo
import { Button } from "./ui/button"; // Assuming Button is a UI component
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet"; // Corrected import for Sheet components
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-yellow-300 transition-colors"
        >
          <Sparkles className="h-8 w-8 text-yellow-300" />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            MeetJob
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/find-jobs"
          className="text-white hover:text-gray-200 transition-colors font-medium"
        >
          Find Jobs
        </Link>
        {user && user.role === "EMPLOYER" && (
          <Link
            to="/post-job"
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            Post Jobs
          </Link>
        )}
        {user && (
          <Link
            to="/job-history"
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            Job History
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-white font-medium">
              Welcome, {user.firstName}
            </span>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold hover:scale-105 transition"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-300 hover:bg-white/10"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>
                Access your job portal features.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/find-jobs"
                className="text-gray-800 hover:text-blue-600 font-medium"
              >
                Find Jobs
              </Link>
              {user && user.role === "EMPLOYER" && (
                <Link
                  to="/post-job"
                  className="text-gray-800 hover:text-blue-600 font-medium"
                >
                  Post Jobs
                </Link>
              )}
              {user && (
                <Link
                  to="/job-history"
                  className="text-gray-800 hover:text-blue-600 font-medium"
                >
                  Job History
                </Link>
              )}
              {user ? (
                <>
                  <span className="text-gray-800 font-medium">
                    Welcome, {user.firstName}
                  </span>
                  <Button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-800 hover:text-blue-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

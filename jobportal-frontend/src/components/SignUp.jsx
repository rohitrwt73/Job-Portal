"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../services/apiConfig";
// Password strength checker
const checkPasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (password.length >= 8) score += 1;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("One lowercase letter");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("One uppercase letter");

  if (/\d/.test(password)) score += 1;
  else feedback.push("One number");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push("One special character");

  const strength = ["Very Weak", "Weak", "Fair", "Good", "Strong"][score];
  const color = ["red", "orange", "yellow", "blue", "green"][score];

  return { score, strength, color, feedback };
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignUp({ onSignUpSuccess, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "jobseeker",
    company: "",
    jobTitle: "",
    experience: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const [validation, setValidation] = useState({
    firstName: { isValid: true, message: "" },
    lastName: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    password: { isValid: true, message: "" },
    confirmPassword: { isValid: true, message: "" },
    company: { isValid: true, message: "" },
    terms: { isValid: true, message: "" },
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    strength: "Very Weak",
    color: "red",
    feedback: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Real-time password strength checking
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when user starts typing
    if (validation[name] && !validation[name].isValid) {
      setValidation((prev) => ({
        ...prev,
        [name]: { isValid: true, message: "" },
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          return {
            isValid: false,
            message: `${
              name === "firstName" ? "First" : "Last"
            } name is required`,
          };
        }
        if (value.length < 2) {
          return {
            isValid: false,
            message: "Name must be at least 2 characters",
          };
        }
        return { isValid: true, message: "" };

      case "email":
        if (!value.trim()) {
          return { isValid: false, message: "Email is required" };
        }
        if (!validateEmail(value)) {
          return {
            isValid: false,
            message: "Please enter a valid email address",
          };
        }
        return { isValid: true, message: "" };

      case "phone":
        if (value && !/^\+?[\d\s\-()]{10,}$/.test(value)) {
          return {
            isValid: false,
            message: "Please enter a valid phone number",
          };
        }
        return { isValid: true, message: "" };

      case "password":
        if (!value) {
          return { isValid: false, message: "Password is required" };
        }
        if (passwordStrength.score < 3) {
          return { isValid: false, message: "Password is too weak" };
        }
        return { isValid: true, message: "" };

      case "confirmPassword":
        if (!value) {
          return { isValid: false, message: "Please confirm your password" };
        }
        if (value !== formData.password) {
          return { isValid: false, message: "Passwords don't match" };
        }
        return { isValid: true, message: "" };

      case "company":
        if (formData.userType === "employer" && !value.trim()) {
          return {
            isValid: false,
            message: "Company name is required for employers",
          };
        }
        return { isValid: true, message: "" };

      default:
        return { isValid: true, message: "" };
    }
  };

  const validateStep = (step) => {
    const newValidation = { ...validation };
    let isStepValid = true;

    if (step === 1) {
      const fields = ["firstName", "lastName", "email", "phone"];
      fields.forEach((field) => {
        const fieldValidation = validateField(field, formData[field]);
        newValidation[field] = fieldValidation;
        if (!fieldValidation.isValid) isStepValid = false;
      });
    } else if (step === 2) {
      const fields = ["password", "confirmPassword"];
      if (formData.userType === "employer") {
        fields.push("company");
      }
      fields.forEach((field) => {
        const fieldValidation = validateField(field, formData[field]);
        newValidation[field] = fieldValidation;
        if (!fieldValidation.isValid) isStepValid = false;
      });
    }

    setValidation(newValidation);
    return isStepValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Creating account...");
    setLoading(true);
    setError("");

    // Final validation
    if (!validateStep(1) || !validateStep(2)) {
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setValidation((prev) => ({
        ...prev,
        terms: {
          isValid: false,
          message: "Please agree to the terms and conditions",
        },
      }));
      setLoading(false);
      return;
    }

    try {
      // ✅ Send data to Spring Boot backend
      const response = await axios.post(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.userType === "employer" ? "EMPLOYER" : "USER",
        },
        {
          withCredentials: true, // ✅ important for CORS
        }
      );

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("signupComplete", "true");

      // Call success callback and navigate
      if (onSignUpSuccess) onSignUpSuccess(response.data.user);
      if (onNavigateToLogin) onNavigateToLogin();
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again or use a different email.");
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => {
    return ((currentStep - 1) / 2) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-3xl font-bold mb-6 cursor-pointer">
            <span className="text-4xl">✨</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MeetJob
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of 3
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(getStepProgress())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <span>🎉</span>
              <span>Join MeetJob Today</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Account Setup"}
            {currentStep === 3 && "Final Details"}
          </h2>

          <p className="mt-2 text-gray-600">
            {currentStep === 1 && "Let's start with your basic information"}
            {currentStep === 2 && "Create your secure account"}
            {currentStep === 3 && "Almost done! Just a few more details"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100/50 p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">❌</span>
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="jobseeker"
                        checked={formData.userType === "jobseeker"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.userType === "jobseeker"
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-3xl block mb-2">👤</span>
                          <span className="text-sm font-medium">
                            Job Seeker
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Looking for opportunities
                          </p>
                        </div>
                      </div>
                    </label>
                    <label className="relative">
                      <input
                        type="radio"
                        name="userType"
                        value="employer"
                        checked={formData.userType === "employer"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.userType === "employer"
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-3xl block mb-2">🏢</span>
                          <span className="text-sm font-medium">Employer</span>
                          <p className="text-xs text-gray-500 mt-1">
                            Hiring talent
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">
                        👤
                      </span>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-green-50/30 ${
                          validation.firstName.isValid
                            ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                            : "border-red-300 focus:ring-red-500 focus:border-red-500"
                        }`}
                        placeholder="First name"
                      />
                    </div>
                    {!validation.firstName.isValid && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">
                        👤
                      </span>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-teal-50/30 ${
                          validation.lastName.isValid
                            ? "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            : "border-red-300 focus:ring-red-500 focus:border-red-500"
                        }`}
                        placeholder="Last name"
                      />
                    </div>
                    {!validation.lastName.isValid && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email address *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                      📧
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-blue-50/30 ${
                        validation.email.isValid
                          ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {!validation.email.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone number (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                      📱
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-indigo-50/30 ${
                        validation.phone.isValid
                          ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {!validation.phone.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.phone.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Account Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Company field for employers */}
                {formData.userType === "employer" && (
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Company name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                        🏢
                      </span>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-purple-50/30 ${
                          validation.company.isValid
                            ? "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                            : "border-red-300 focus:ring-red-500 focus:border-red-500"
                        }`}
                        placeholder="Your company name"
                      />
                    </div>
                    {!validation.company.isValid && (
                      <p className="mt-1 text-sm text-red-600">
                        {validation.company.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500">
                      🔒
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-12 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-purple-50/30 ${
                        validation.password.isValid
                          ? "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          Password strength:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.color === "red"
                              ? "text-red-600"
                              : passwordStrength.color === "orange"
                              ? "text-orange-600"
                              : passwordStrength.color === "yellow"
                              ? "text-yellow-600"
                              : passwordStrength.color === "blue"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.color === "red"
                              ? "bg-red-500"
                              : passwordStrength.color === "orange"
                              ? "bg-orange-500"
                              : passwordStrength.color === "yellow"
                              ? "bg-yellow-500"
                              : passwordStrength.color === "blue"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Password should include:
                          </p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {passwordStrength.feedback.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <span className="text-red-400 mr-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!validation.password.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500">
                      🔐
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 outline-none transition-colors bg-pink-50/30 ${
                        validation.confirmPassword.isValid
                          ? "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      placeholder="Confirm your password"
                    />
                    {formData.confirmPassword &&
                      formData.password === formData.confirmPassword && (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                          ✅
                        </span>
                      )}
                  </div>
                  {!validation.confirmPassword.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      {validation.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Final Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Additional fields based on user type */}
                {formData.userType === "jobseeker" && (
                  <>
                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current/Desired job title (optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                          💼
                        </span>
                        <input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-blue-50/30"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Years of experience (optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">
                          📊
                        </span>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-green-50/30"
                        >
                          <option value="">Select experience level</option>
                          <option value="0-1">0-1 years (Entry level)</option>
                          <option value="2-5">2-5 years (Mid level)</option>
                          <option value="6-10">
                            6-10 years (Senior level)
                          </option>
                          <option value="10+">10+ years (Expert level)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                        onClick={() => window.open("/terms", "_blank")}
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                        onClick={() => window.open("/privacy", "_blank")}
                      >
                        Privacy Policy
                      </button>{" "}
                      *
                    </label>
                  </div>
                  {!validation.terms.isValid && (
                    <p className="text-sm text-red-600 ml-7">
                      {validation.terms.message}
                    </p>
                  )}

                  <div className="flex items-start">
                    <input
                      id="agreeToMarketing"
                      name="agreeToMarketing"
                      type="checkbox"
                      checked={formData.agreeToMarketing}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label
                      htmlFor="agreeToMarketing"
                      className="ml-3 block text-sm text-gray-700"
                    >
                      I would like to receive job alerts, career tips, and
                      promotional emails (optional)
                    </label>
                  </div>
                </div>

                {/* Account Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Account Summary
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Account Type:</span>{" "}
                      {formData.userType === "jobseeker"
                        ? "Job Seeker"
                        : "Employer"}
                    </p>
                    {formData.company && (
                      <p>
                        <span className="font-medium">Company:</span>{" "}
                        {formData.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  <span className="mr-2">←</span>
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Next
                  <span className="ml-2">→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">🎉</span>
                      Create Account
                    </div>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

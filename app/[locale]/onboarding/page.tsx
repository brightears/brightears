"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  UserIcon, 
  MicrophoneIcon, 
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";
import { apiFetch } from "@/lib/api";

interface RoleOption {
  value: "CUSTOMER" | "ARTIST" | "CORPORATE";
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      value: "CUSTOMER",
      label: "Customer",
      description: "I want to book entertainment for my events",
      icon: UserIcon,
      color: "bg-blue-500"
    },
    {
      value: "ARTIST",
      label: "Artist/Entertainer",
      description: "I provide entertainment services",
      icon: MicrophoneIcon,
      color: "bg-purple-500"
    },
    {
      value: "CORPORATE",
      label: "Corporate/Venue",
      description: "I manage multiple events or venues",
      icon: BuildingOfficeIcon,
      color: "bg-green-500"
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/user/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Redirect based on role
      if (selectedRole === "ARTIST") {
        router.push("/dashboard/artist/profile");
      } else if (selectedRole === "CORPORATE") {
        router.push("/dashboard/corporate");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Bright Ears, {user.firstName || "there"}!
          </h1>
          <p className="text-xl text-gray-600">
            Let's get you started. What brings you to our platform?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedRole(option.value)}
              className={`relative p-6 rounded-2xl transition-all transform hover:scale-105 ${
                selectedRole === option.value
                  ? "ring-4 ring-purple-500 ring-opacity-50 shadow-xl"
                  : "shadow-lg hover:shadow-xl"
              } bg-white`}
              disabled={isLoading}
            >
              {selectedRole === option.value && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div
                className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mb-4 mx-auto`}
              >
                <option.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.label}
              </h3>
              <p className="text-gray-600 text-sm">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              selectedRole && !isLoading
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-lg transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Setting up your account..." : "Continue"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can always change this later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
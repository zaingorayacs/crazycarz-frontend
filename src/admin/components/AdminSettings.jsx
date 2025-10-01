import React, { useState } from "react";
import {
  Settings,
  CheckCircle,
  UserPlus,
  Key,
  Globe,
  Save,
} from "lucide-react";
import Loader from "./Loader";

// A simple reusable Toggle Switch component
const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block h-8 w-14 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      ></div>
      <div
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : ""
        }`}
      ></div>
    </div>
    {label && (
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </span>
    )}
  </label>
);

// Mock settings data
const initialSettings = {
  siteTitle: "Admin Dashboard",
  enableUserRegistration: true,
  maintenanceMode: false,
  apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  maxUsers: 1000,
};

function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle changes to form inputs and toggles
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle saving the settings
  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    // Simulate an API call
    setTimeout(() => {
      console.log("Saving settings:", settings);
      setIsSaving(false);
      setSaveSuccess(true);
      // Hide the success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="flex items-center gap-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <Settings className="h-10 w-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Admin Settings
          </h1>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div
            className="flex items-center p-4 mb-6 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-green-200 dark:text-green-800 dark:border-green-800"
            role="alert"
          >
            <CheckCircle className="flex-shrink-0 inline w-5 h-5 me-3" />
            <div>
              <span className="font-medium">Success!</span> Your settings have
              been saved.
            </div>
          </div>
        )}

        {/* General Settings Section */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            <Globe size={24} /> General Settings
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 pr-4">
                <label
                  htmlFor="siteTitle"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Site Title
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This title will be displayed in the browser tab and site
                  header.
                </p>
              </div>
              <input
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleInputChange}
                className="mt-2 sm:mt-0 w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 pr-4">
                <label
                  htmlFor="maintenanceMode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Maintenance Mode
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enable this to temporarily close the site for maintenance.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    maintenanceMode: e.target.checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            <UserPlus size={24} /> User Management
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 pr-4">
                <label
                  htmlFor="enableUserRegistration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Allow New User Registration
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  When enabled, users can create new accounts.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.enableUserRegistration}
                onChange={(e) =>
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    enableUserRegistration: e.target.checked,
                  }))
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 pr-4">
                <label
                  htmlFor="maxUsers"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Max User Limit
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Set a hard limit on the total number of registered users.
                </p>
              </div>
              <input
                type="number"
                id="maxUsers"
                name="maxUsers"
                value={settings.maxUsers}
                onChange={handleInputChange}
                className="mt-2 sm:mt-0 w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* API Integrations Section */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            <Key size={24} /> API Integrations
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 pr-4">
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  API Key
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Key for external service integrations.
                </p>
              </div>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleInputChange}
                className="mt-2 sm:mt-0 w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Save size={20} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;

import React from 'react';
import { Briefcase, CheckCircle2, Users, Building2 } from 'lucide-react';

const LoadingScreen = ({ type = 'initial' }) => {
  const getLoadingContent = () => {
    switch (type) {
      case 'login':
        return {
          message: 'Setting up your workspace...',
          subtitle: 'Preparing your personalized dashboard'
        };
      case 'initial':
      default:
        return {
          message: 'Welcome to THOZHAN...',
          subtitle: 'Loading your blue-collar job portal'
        };
    }
  };

  const { message, subtitle } = getLoadingContent();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center z-50">
      {/* Background animated patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6">
        {/* Logo and brand */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <Briefcase className="w-10 h-10 text-white animate-pulse" />
              </div>
              {/* Rotating ring */}
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-wide">
            THOZHAN
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            Your Blue-Collar Job Portal
          </p>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-blue-100 text-lg font-medium animate-pulse mb-1">
            {message}
          </p>
          <p className="text-blue-200 text-sm opacity-80">
            {subtitle}
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
            <CheckCircle2 className="w-8 h-8 text-green-300 mb-2 animate-pulse" />
            <span className="text-sm font-medium">Verified Jobs</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
            <Users className="w-8 h-8 text-yellow-300 mb-2 animate-pulse" />
            <span className="text-sm font-medium">Trusted Network</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
            <Building2 className="w-8 h-8 text-purple-300 mb-2 animate-pulse" />
            <span className="text-sm font-medium">Top Companies</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 backdrop-blur-sm">
            <div className={`bg-gradient-to-r from-green-400 to-blue-300 h-2 rounded-full ${type === 'initial' ? 'animate-progress-slow' : 'animate-progress'}`}></div>
          </div>
        </div>

        {/* Version info for initial load */}
        {type === 'initial' && (
          <div className="mt-6">
            <p className="text-blue-200 text-xs opacity-60">
              Version 1.0 • Built with Modern Technologies
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen; 
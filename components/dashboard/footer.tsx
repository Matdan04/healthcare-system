'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <p>&copy; 2025 HealthCare Management System. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
} 
import React from 'react';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-red-500">Admin Command Center</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.name}</p>
        </header>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Phase 1 Foundations Active</h2>
          <p className="text-gray-400">
            Role validation, separate route tree, and audit logging foundations are installed.
          </p>
        </div>
      </div>
    </div>
  );
}

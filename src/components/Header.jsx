import React from 'react';
import { Database, Wand2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-200/50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">SQL Optimizer</h1>
            <p className="text-xs text-slate-500">Guidance for faster, safer database queries</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md">
          <Wand2 className="w-4 h-4" />
          <span className="text-sm font-medium">Best Practices Assistant</span>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { LinkForm } from '@/components/LinkForm';
import { LinksTable } from '@/components/LinksTable';

interface Link {
  id: number;
  code: string;
  target_url: string;
  clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/links');
      
      if (!response.ok) {
        throw new Error('Failed to fetch links');
      }
      
      const data = await response.json();
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Failed to load links. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      await fetchLinks();
    } catch (err) {
      alert('Failed to delete link. Please try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-teal-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-teal-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                TinyLink
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Shorten URLs and track performance
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-10">
          {/* Link Creation Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
            <LinkForm onSuccess={fetchLinks} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Links Section */}
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Your Links
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {links.length} {links.length === 1 ? 'link' : 'links'}
              </span>
            </div>
            
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200/60 py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
                    <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent absolute top-0 left-0 animate-spin"></div>
                  </div>
                  <p className="text-sm text-slate-600">Loading your links...</p>
                </div>
              </div>
            ) : (
              <LinksTable links={links} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-slate-500">
            TinyLink © 2025 · Simple URL shortening
          </p>
        </div>
      </footer>
    </div>
  );
}
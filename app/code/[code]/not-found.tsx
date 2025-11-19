import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Link Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The link you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
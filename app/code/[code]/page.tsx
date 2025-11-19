import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CopyButton } from '@/components/ui/CopyButton';

interface PageProps {
  params: Promise<{ code: string }>;
}

async function getLinkStats(code: string) {
  const link = await prisma.link.findFirst({
    where: {
      code,
      deleted_at: null,
    },
  });

  return link;
}

export default async function StatsPage({ params }: PageProps) {
    const { code } = await params;
  const link = await getLinkStats(code);

  // If link not found, show 404
  if (!link) {
    notFound();
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${link.code}`;

  return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="text-teal-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Link Statistics
        </h1>
      </div>
    </header>

    {/* Main Content */}
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Short Code */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Short Code
              </h2>
              <CopyButton text={link.code} />
            </div>
            <code className="text-2xl font-bold text-teal-600">{link.code}</code>
          </div>

          {/* Short URL */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Short URL
              </h2>
              <CopyButton text={shortUrl} />
            </div>
            <a
              href={`/${link.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline text-base break-all"
            >
              {shortUrl}
            </a>
          </div>

          {/* Target URL */}
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Target URL
            </h2>
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline break-all text-base"
            >
              {link.target_url}
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
          {/* Total Clicks */}
          <div className="bg-linear-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
            <h6 className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
              Total Clicks
            </h6>
            <p className="text-4xl font-bold text-teal-900 mt-3">{link.clicks}</p>
          </div>

          {/* Created At */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <h6 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Created
            </h6>
            <p className="text-lg font-bold text-blue-900 mt-2">
              {new Date(link.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {new Date(link.created_at).toLocaleTimeString()}
            </p>
          </div>

          {/* Last Clicked */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <h6 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
              Last Clicked
            </h6>
            {link.last_clicked_at ? (
              <>
                <p className="text-lg font-bold text-purple-900 mt-2">
                  {new Date(link.last_clicked_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {new Date(link.last_clicked_at).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-lg font-semibold text-purple-600 mt-2">Never</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t">
          <a
            href={`/${link.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Test Redirect →
          </a>
        </div>
      </div>
    </main>
  </div>
);

}
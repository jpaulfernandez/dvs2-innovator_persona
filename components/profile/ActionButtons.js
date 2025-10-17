import Link from 'next/link';

export default function ActionButtons({ onDownload }) {
  return (
    <div className="max-w-4xl mx-auto mt-8 text-center space-y-4 md:space-y-0 md:space-x-4">
      <button
        onClick={onDownload}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
      >
        🔮 Download Your Profile Card
      </button>
      <Link href="/summary"
        className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
      >
        🌍 Back to Cohort Map
      </Link>
    </div>
  );
}
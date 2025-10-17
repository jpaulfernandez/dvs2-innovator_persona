// components/profile/WorkStyleInsights.js

import { getWorkStyleDetails } from './profileHelpers';

export default function WorkStyleInsights({ userData }) {
  const { howIWork, whatMotivatesMe, growthTip } = getWorkStyleDetails(userData);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-md text-gray-800 mb-2">🛠️ How I Work</h3>
          <p className="text-sm text-gray-600">{howIWork}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-md text-gray-800 mb-2">💡 What Keeps Me Motivated</h3>
          <p className="text-sm text-gray-600">{whatMotivatesMe}</p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
        <h4 className="font-semibold text-blue-800">Your Growth Tip</h4>
        <p className="text-sm text-blue-700 mt-1 italic">&#34;{growthTip}&#34;</p>
      </div>
    </div>
  );
}
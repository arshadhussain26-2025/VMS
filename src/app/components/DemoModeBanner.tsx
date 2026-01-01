import { Info, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface DemoModeBannerProps {
  projectId: string;
}

export function DemoModeBanner({ projectId }: DemoModeBannerProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Info className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-bold text-blue-900 mb-2">
            ℹ️ Demo Mode Active - Test All Features Now!
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            The app is fully functional with simulated data. All features work perfectly for testing and demonstration.
          </p>
          
          <div className="bg-white border border-blue-200 rounded-md p-3 mb-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">✅ What Works in Demo Mode:</p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Check in/out visitors with badge numbers</li>
              <li>Create and manage appointments</li>
              <li>View visitor lists and statistics</li>
              <li>All data persists in your browser</li>
            </ul>
          </div>

          <div className="bg-white border border-blue-200 rounded-md p-3 mb-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">🚀 Want Real Database? (Optional - 3 minutes):</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Click button below to open Supabase Dashboard</li>
              <li>Deploy the <code className="bg-gray-100 px-1 rounded">make-server-c8ca2e45</code> function</li>
              <li>Copy code from <code className="bg-gray-100 px-1 rounded">/supabase/functions/server/index.tsx</code></li>
              <li>Set 2 environment variables</li>
              <li>Refresh page - done!</li>
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/functions`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Deploy Backend (Optional)
              <ExternalLink className="h-4 w-4" />
            </a>
            
            <span className="text-sm text-blue-700">
              Or continue using demo mode - it works great! ✨
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600 flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              Demo mode is perfect for testing, training, and demonstrations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface DeploymentWarningProps {
  projectId: string;
}

export function DeploymentWarning({ projectId }: DeploymentWarningProps) {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkHealth();
  }, [projectId]);

  const checkHealth = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/health`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setHealthStatus('healthy');
          return;
        }
      }
      setHealthStatus('unhealthy');
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('unhealthy');
    }
  };

  if (healthStatus === 'healthy' || dismissed) {
    return null;
  }

  if (healthStatus === 'checking') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
          <p className="text-sm text-yellow-700">Checking system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-red-800 mb-2">
            🚨 Edge Function Not Deployed
          </h3>
          <p className="text-sm text-red-700 mb-3">
            The backend Edge Function is not responding. You need to deploy it to Supabase for the system to work.
          </p>
          
          <div className="bg-white border border-red-200 rounded-md p-3 mb-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">Quick Fix (3 minutes):</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Open the Supabase Dashboard</li>
              <li>Deploy the <code className="bg-gray-100 px-1 rounded">make-server-c8ca2e45</code> function</li>
              <li>Set environment variables</li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://supabase.com/dashboard/project/${projectId}/functions`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Open Supabase Dashboard
              <ExternalLink className="h-4 w-4" />
            </a>
            
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Recheck Status
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-red-700 hover:bg-red-100 ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-xs text-red-600">
              📖 For detailed instructions, see: <code className="bg-red-100 px-1 rounded">START_HERE.md</code> or <code className="bg-red-100 px-1 rounded">DEPLOY_NOW.md</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
